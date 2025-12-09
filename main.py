"""
EcoCode Carbon Footprint Analyzer - FastAPI Backend
Production-ready backend with all analysis endpoints
"""

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl, validator
from typing import Optional, List, Dict, Any
import re
import os
import httpx
import hashlib
from datetime import datetime
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import google.generativeai as genai
from supabase import create_client, Client
import json

# Initialize FastAPI app
app = FastAPI(
    title="EcoCode API",
    description="Carbon Footprint Analyzer for Code",
    version="1.0.0"
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Initialize Gemini AI
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')


# ==================== Pydantic Models ====================

class CodeAnalysisRequest(BaseModel):
    code: str
    language: str
    user_id: Optional[str] = None
    
    @validator('code')
    def validate_code(cls, v):
        if len(v) > 50000:  # 50KB limit
            raise ValueError('Code exceeds maximum size')
        # Sanitize dangerous patterns
        dangerous_patterns = [r'eval\(', r'exec\(', r'__import__']
        for pattern in dangerous_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError('Code contains potentially dangerous patterns')
        return v
    
    @validator('language')
    def validate_language(cls, v):
        allowed = ['python', 'javascript', 'typescript', 'java', 'cpp']
        if v.lower() not in allowed:
            raise ValueError(f'Language must be one of {allowed}')
        return v.lower()


class GitHubAnalysisRequest(BaseModel):
    repo_url: str
    user_id: Optional[str] = None
    
    @validator('repo_url')
    def validate_repo_url(cls, v):
        pattern = r'^https://github\.com/[\w\-]+/[\w\-\.]+/?$'
        if not re.match(pattern, v):
            raise ValueError('Invalid GitHub repository URL')
        return v


class AIOptimizeRequest(BaseModel):
    code: str
    language: str
    analysis_results: Dict[str, Any]
    user_id: Optional[str] = None


class HostingImpactRequest(BaseModel):
    provider: str
    region: str
    tier: str
    monthly_requests: int = 100000
    
    @validator('provider')
    def validate_provider(cls, v):
        allowed = ['aws', 'gcp', 'azure', 'vercel', 'netlify', 'digitalocean']
        if v.lower() not in allowed:
            raise ValueError(f'Provider must be one of {allowed}')
        return v.lower()


# ==================== Helper Functions ====================

def sanitize_input(text: str) -> str:
    """Sanitize user input to prevent injection attacks"""
    # Remove or escape dangerous characters
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    return text[:10000]  # Limit length


def calculate_code_metrics(code: str, language: str) -> Dict[str, Any]:
    """
    Analyze code and calculate carbon footprint metrics
    """
    lines = code.split('\n')
    
    # Pattern matching based on language
    patterns = {
        'python': {
            'loops': [r'\bfor\b', r'\bwhile\b'],
            'nested_loops': r'(for|while).*:\s*\n.*\s+(for|while)',
            'api_calls': [r'requests\.', r'urllib\.', r'httpx\.', r'fetch\('],
            'file_io': [r'open\(', r'\.read\(', r'\.write\('],
            'recursion': r'def\s+\w+',
            'db_queries': [r'\.execute\(', r'\.query\(', r'SELECT', r'INSERT', r'UPDATE'],
        },
        'javascript': {
            'loops': [r'\bfor\b', r'\bwhile\b', r'\.forEach\(', r'\.map\('],
            'nested_loops': r'(for|while).*{[^}]+(for|while)',
            'api_calls': [r'fetch\(', r'axios\.', r'\$\.ajax', r'\.get\(', r'\.post\('],
            'file_io': [r'fs\.', r'readFile', r'writeFile'],
            'recursion': r'function\s+\w+',
            'db_queries': [r'\.query\(', r'\.find\(', r'\.findOne\(', r'\.save\('],
        }
    }
    
    lang_patterns = patterns.get(language, patterns['python'])
    
    # Count metrics
    loop_count = 0
    nested_loop_count = 0
    api_call_count = 0
    file_io_count = 0
    recursion_count = 0
    db_query_count = 0
    
    code_lower = code.lower()
    
    # Count loops
    for pattern in lang_patterns['loops']:
        loop_count += len(re.findall(pattern, code, re.IGNORECASE))
    
    # Count nested loops
    nested_loop_count = len(re.findall(lang_patterns['nested_loops'], code, re.MULTILINE | re.IGNORECASE))
    
    # Count API calls
    for pattern in lang_patterns['api_calls']:
        api_call_count += len(re.findall(pattern, code, re.IGNORECASE))
    
    # Count file I/O
    for pattern in lang_patterns['file_io']:
        file_io_count += len(re.findall(pattern, code, re.IGNORECASE))
    
    # Count recursion
    recursion_count = len(re.findall(lang_patterns['recursion'], code, re.MULTILINE | re.IGNORECASE))
    
    # Count database queries
    for pattern in lang_patterns['db_queries']:
        db_query_count += len(re.findall(pattern, code, re.IGNORECASE))
    
    # Calculate scores (0-100 scale, lower is better)
    cpu_score = min(100, (loop_count * 2) + (nested_loop_count * 5) + (recursion_count * 3))
    network_score = min(100, (api_call_count * 10) + (db_query_count * 5))
    memory_score = min(100, (len(lines) * 0.1) + (file_io_count * 8))
    
    # Calculate CO2 estimate (in grams)
    # Formula: (CPU × 0.000002) + (Network × 0.0004) + (Memory × 0.0001)
    co2_estimate = (cpu_score * 0.000002) + (network_score * 0.0004) + (memory_score * 0.0001)
    co2_estimate = round(co2_estimate * 1000, 4)  # Convert to grams
    
    # Calculate Green Score (0-100, higher is better)
    total_impact = cpu_score + network_score + memory_score
    green_score = max(0, 100 - (total_impact / 3))
    green_score = round(green_score, 2)
    
    # Determine rating
    if green_score >= 80:
        rating = "Excellent"
        color = "green"
    elif green_score >= 60:
        rating = "Good"
        color = "lightgreen"
    elif green_score >= 40:
        rating = "Fair"
        color = "orange"
    else:
        rating = "Needs Improvement"
        color = "red"
    
    return {
        "metrics": {
            "lines_of_code": len(lines),
            "loops": loop_count,
            "nested_loops": nested_loop_count,
            "api_calls": api_call_count,
            "file_io_operations": file_io_count,
            "recursion_count": recursion_count,
            "db_queries": db_query_count
        },
        "scores": {
            "cpu_score": round(cpu_score, 2),
            "network_score": round(network_score, 2),
            "memory_score": round(memory_score, 2)
        },
        "co2_estimate_grams": co2_estimate,
        "green_score": green_score,
        "rating": rating,
        "color": color,
        "timestamp": datetime.utcnow().isoformat()
    }


async def analyze_github_repo(repo_url: str) -> Dict[str, Any]:
    """
    Fetch and analyze a GitHub repository
    """
    # Extract owner and repo name
    match = re.match(r'https://github\.com/([\w\-]+)/([\w\-\.]+)/?', repo_url)
    if not match:
        raise ValueError("Invalid GitHub URL")
    
    owner, repo = match.groups()
    repo = repo.rstrip('.git')
    
    headers = {}
    if GITHUB_TOKEN:
        headers['Authorization'] = f'token {GITHUB_TOKEN}'
    
    async with httpx.AsyncClient() as client:
        # Get repository info
        repo_response = await client.get(
            f'https://api.github.com/repos/{owner}/{repo}',
            headers=headers,
            timeout=30.0
        )
        
        if repo_response.status_code != 200:
            raise HTTPException(status_code=404, detail="Repository not found")
        
        repo_data = repo_response.json()
        
        # Get languages
        languages_response = await client.get(
            f'https://api.github.com/repos/{owner}/{repo}/languages',
            headers=headers,
            timeout=30.0
        )
        languages = languages_response.json() if languages_response.status_code == 200 else {}
        
        # Calculate estimates
        total_bytes = sum(languages.values())
        size_kb = repo_data.get('size', 0)
        
        # Estimate compute impact based on repo size and activity
        stars = repo_data.get('stargazers_count', 0)
        forks = repo_data.get('forks_count', 0)
        
        # Simple heuristic for backend compute
        compute_score = min(100, (size_kb / 100) + (stars * 0.1) + (forks * 0.5))
        
        # Estimate CI/CD runs (rough estimate)
        estimated_cicd_runs = max(10, forks * 2 + stars * 0.1)
        
        # CO2 estimate: Size + compute + CI/CD
        co2_from_storage = size_kb * 0.0001  # grams
        co2_from_compute = compute_score * 0.5  # grams
        co2_from_cicd = estimated_cicd_runs * 0.02  # grams per run
        
        total_co2 = co2_from_storage + co2_from_compute + co2_from_cicd
        
        return {
            "repo_info": {
                "name": repo_data.get('name'),
                "owner": owner,
                "description": repo_data.get('description'),
                "stars": stars,
                "forks": forks,
                "size_kb": size_kb,
                "language": repo_data.get('language'),
                "created_at": repo_data.get('created_at'),
                "updated_at": repo_data.get('updated_at')
            },
            "languages": languages,
            "impact_estimate": {
                "compute_score": round(compute_score, 2),
                "estimated_cicd_runs_monthly": round(estimated_cicd_runs, 0),
                "co2_storage_grams": round(co2_from_storage, 4),
                "co2_compute_grams": round(co2_from_compute, 4),
                "co2_cicd_grams": round(co2_from_cicd, 4),
                "total_co2_monthly_grams": round(total_co2, 4)
            },
            "timestamp": datetime.utcnow().isoformat()
        }


def calculate_hosting_impact(provider: str, region: str, tier: str, monthly_requests: int) -> Dict[str, Any]:
    """
    Calculate hosting carbon footprint based on provider and usage
    """
    # Carbon intensity by region (grams CO2 per kWh)
    carbon_intensity = {
        'us-east': 415,
        'us-west': 320,
        'eu-west': 280,
        'eu-north': 45,
        'asia-east': 550,
        'asia-south': 630,
        'australia': 720,
        'south-america': 180,
    }
    
    # Energy per request (kWh) - varies by tier
    energy_per_request = {
        'serverless': 0.0000001,
        'basic': 0.0000005,
        'standard': 0.000001,
        'premium': 0.000002,
    }
    
    # Provider efficiency multiplier
    provider_efficiency = {
        'aws': 1.0,
        'gcp': 0.85,  # More renewable energy
        'azure': 0.90,
        'vercel': 0.88,
        'netlify': 0.90,
        'digitalocean': 1.05
    }
    
    intensity = carbon_intensity.get(region, 400)
    energy = energy_per_request.get(tier, 0.000001)
    efficiency = provider_efficiency.get(provider, 1.0)
    
    # Calculate monthly CO2
    monthly_energy_kwh = monthly_requests * energy
    monthly_co2_grams = monthly_energy_kwh * intensity * efficiency
    
    # Calculate costs (rough estimates)
    cost_per_request = {
        'serverless': 0.0000002,
        'basic': 0.000001,
        'standard': 0.000003,
        'premium': 0.000008,
    }
    
    monthly_cost = monthly_requests * cost_per_request.get(tier, 0.000001)
    
    return {
        "provider": provider,
        "region": region,
        "tier": tier,
        "monthly_requests": monthly_requests,
        "monthly_energy_kwh": round(monthly_energy_kwh, 6),
        "monthly_co2_grams": round(monthly_co2_grams, 2),
        "monthly_co2_kg": round(monthly_co2_grams / 1000, 4),
        "yearly_co2_kg": round((monthly_co2_grams * 12) / 1000, 2),
        "estimated_monthly_cost_usd": round(monthly_cost, 2),
        "carbon_intensity_region": intensity,
        "provider_efficiency_score": efficiency,
        "timestamp": datetime.utcnow().isoformat()
    }


async def generate_ai_optimization(code: str, language: str, analysis: Dict) -> Dict[str, Any]:
    """
    Use AI to generate optimization suggestions
    """
    if not GEMINI_API_KEY:
        return {
            "suggestions": [
                "AI optimization is not configured. Please add GEMINI_API_KEY to enable AI-powered suggestions."
            ],
            "optimized_code": None
        }
    
    try:
        prompt = f"""
You are an expert code optimizer focused on reducing carbon footprint and improving efficiency.

Analyze this {language} code and provide:
1. 3-5 specific inefficiencies found
2. Concrete suggestions to reduce CPU, network, and memory usage
3. An optimized version of the code
4. Explanation of each optimization in simple English

Code Analysis Results:
- CPU Score: {analysis['scores']['cpu_score']}
- Network Score: {analysis['scores']['network_score']}
- Memory Score: {analysis['scores']['memory_score']}
- Loops: {analysis['metrics']['loops']}
- API Calls: {analysis['metrics']['api_calls']}

Code:
```{language}
{code[:2000]}
```

Provide response in JSON format:
{{
  "inefficiencies": ["issue1", "issue2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "optimized_code": "optimized version",
  "explanations": ["explanation1", "explanation2", ...]
}}
"""
        
        response = model.generate_content(prompt)
        result_text = response.text
        
        # Try to parse JSON from response
        try:
            # Extract JSON from markdown code blocks if present
            json_match = re.search(r'```json\s*(.*?)\s*```', result_text, re.DOTALL)
            if json_match:
                result_text = json_match.group(1)
            
            result = json.loads(result_text)
        except:
            # Fallback if not JSON
            result = {
                "inefficiencies": ["See full analysis below"],
                "suggestions": [result_text[:500]],
                "optimized_code": None,
                "explanations": ["See suggestions for details"]
            }
        
        return {
            "ai_analysis": result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        return {
            "error": f"AI optimization failed: {str(e)}",
            "suggestions": ["Unable to generate AI suggestions at this time"],
            "timestamp": datetime.utcnow().isoformat()
        }


def save_to_supabase(table: str, data: Dict[str, Any]):
    """Save analysis results to Supabase"""
    if not supabase:
        return {"error": "Supabase not configured"}
    
    try:
        result = supabase.table(table).insert(data).execute()
        return {"success": True, "id": result.data[0]['id'] if result.data else None}
    except Exception as e:
        return {"error": str(e)}


# ==================== API Routes ====================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "EcoCode Carbon Footprint Analyzer API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": [
            "/analyze-code",
            "/analyze-github",
            "/ai-optimize",
            "/hosting-impact",
            "/history/{user_id}"
        ]
    }


@app.post("/analyze-code")
@limiter.limit("20/minute")
async def analyze_code(request: Request, payload: CodeAnalysisRequest):
    """
    Analyze code and calculate carbon footprint
    """
    try:
        # Sanitize input
        sanitized_code = sanitize_input(payload.code)
        
        # Calculate metrics
        analysis = calculate_code_metrics(sanitized_code, payload.language)
        
        # Save to database if user_id provided
        if payload.user_id and supabase:
            save_data = {
                "user_id": payload.user_id,
                "language": payload.language,
                "code_hash": hashlib.sha256(sanitized_code.encode()).hexdigest()[:16],
                "analysis_results": analysis,
                "created_at": datetime.utcnow().isoformat()
            }
            save_to_supabase("code_analyses", save_data)
        
        return {
            "success": True,
            "analysis": analysis,
            "language": payload.language
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-github")
@limiter.limit("10/minute")
async def analyze_github(request: Request, payload: GitHubAnalysisRequest):
    """
    Analyze a GitHub repository
    """
    try:
        analysis = await analyze_github_repo(payload.repo_url)
        
        # Save to database if user_id provided
        if payload.user_id and supabase:
            save_data = {
                "user_id": payload.user_id,
                "repo_url": payload.repo_url,
                "analysis_results": analysis,
                "created_at": datetime.utcnow().isoformat()
            }
            save_to_supabase("github_analyses", save_data)
        
        return {
            "success": True,
            "analysis": analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai-optimize")
@limiter.limit("5/minute")
async def ai_optimize(request: Request, payload: AIOptimizeRequest):
    """
    Get AI-powered optimization suggestions
    """
    try:
        sanitized_code = sanitize_input(payload.code)
        
        optimization = await generate_ai_optimization(
            sanitized_code,
            payload.language,
            payload.analysis_results
        )
        
        return {
            "success": True,
            "optimization": optimization
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/hosting-impact")
@limiter.limit("30/minute")
async def hosting_impact(request: Request, payload: HostingImpactRequest):
    """
    Calculate hosting carbon footprint
    """
    try:
        impact = calculate_hosting_impact(
            payload.provider,
            payload.region,
            payload.tier,
            payload.monthly_requests
        )
        
        return {
            "success": True,
            "impact": impact
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history/{user_id}")
@limiter.limit("30/minute")
async def get_history(request: Request, user_id: str):
    """
    Get analysis history for a user
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not configured")
    
    try:
        # Get code analyses
        code_analyses = supabase.table("code_analyses")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .limit(20)\
            .execute()
        
        # Get GitHub analyses
        github_analyses = supabase.table("github_analyses")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .limit(20)\
            .execute()
        
        return {
            "success": True,
            "code_analyses": code_analyses.data,
            "github_analyses": github_analyses.data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "supabase": "configured" if supabase else "not configured",
        "gemini": "configured" if GEMINI_API_KEY else "not configured",
        "github": "configured" if GITHUB_TOKEN else "not configured",
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
