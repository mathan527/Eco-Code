# API Documentation - EcoCode

## Base URL
```
Development: http://localhost:8000
Production: https://api.ecocode.app
```

## Authentication
Most endpoints don't require authentication, but passing a `user_id` will save results to the user's history.

## Rate Limits
- Code Analysis: 20 requests/minute
- GitHub Analysis: 10 requests/minute
- AI Optimization: 5 requests/minute
- Hosting Impact: 30 requests/minute
- History: 30 requests/minute

## Endpoints

### Health Check

#### GET `/`
Get API status and available endpoints.

**Response:**
```json
{
  "service": "EcoCode Carbon Footprint Analyzer API",
  "version": "1.0.0",
  "status": "operational",
  "endpoints": [...]
}
```

#### GET `/health`
Detailed health check with service status.

**Response:**
```json
{
  "status": "healthy",
  "supabase": "configured",
  "gemini": "configured",
  "github": "configured",
  "timestamp": "2025-12-09T10:30:00Z"
}
```

---

### Code Analysis

#### POST `/analyze-code`
Analyze code and calculate carbon footprint.

**Request Body:**
```json
{
  "code": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
  "language": "python",
  "user_id": "optional-uuid"
}
```

**Parameters:**
- `code` (string, required): The code to analyze (max 50,000 characters)
- `language` (string, required): One of: `python`, `javascript`, `typescript`, `java`, `cpp`
- `user_id` (string, optional): User UUID for saving to history

**Response:**
```json
{
  "success": true,
  "analysis": {
    "metrics": {
      "lines_of_code": 4,
      "loops": 0,
      "nested_loops": 0,
      "api_calls": 0,
      "file_io_operations": 0,
      "recursion_count": 1,
      "db_queries": 0
    },
    "scores": {
      "cpu_score": 3.0,
      "network_score": 0.0,
      "memory_score": 0.4
    },
    "co2_estimate_grams": 0.00004,
    "green_score": 98.87,
    "rating": "Excellent",
    "color": "green",
    "timestamp": "2025-12-09T10:30:00Z"
  },
  "language": "python"
}
```

**Error Responses:**
- `400`: Invalid input (code too long, invalid language)
- `422`: Validation error
- `429`: Rate limit exceeded
- `500`: Server error

---

### GitHub Analysis

#### POST `/analyze-github`
Analyze a public GitHub repository.

**Request Body:**
```json
{
  "repo_url": "https://github.com/octocat/Hello-World",
  "user_id": "optional-uuid"
}
```

**Parameters:**
- `repo_url` (string, required): Valid GitHub repository URL
- `user_id` (string, optional): User UUID for saving to history

**Response:**
```json
{
  "success": true,
  "analysis": {
    "repo_info": {
      "name": "Hello-World",
      "owner": "octocat",
      "description": "My first repository on GitHub!",
      "stars": 1500,
      "forks": 850,
      "size_kb": 180,
      "language": "JavaScript",
      "created_at": "2011-01-26T19:01:12Z",
      "updated_at": "2025-12-01T15:30:00Z"
    },
    "languages": {
      "JavaScript": 52000,
      "HTML": 15000,
      "CSS": 8000
    },
    "impact_estimate": {
      "compute_score": 16.8,
      "estimated_cicd_runs_monthly": 1710,
      "co2_storage_grams": 0.018,
      "co2_compute_grams": 8.4,
      "co2_cicd_grams": 34.2,
      "total_co2_monthly_grams": 42.618
    },
    "timestamp": "2025-12-09T10:30:00Z"
  }
}
```

**Error Responses:**
- `400`: Invalid GitHub URL
- `404`: Repository not found
- `429`: Rate limit exceeded
- `500`: Server error

---

### AI Optimization

#### POST `/ai-optimize`
Get AI-powered code optimization suggestions.

**Request Body:**
```json
{
  "code": "for i in range(1000):\n    for j in range(1000):\n        print(i * j)",
  "language": "python",
  "analysis_results": {
    "scores": {
      "cpu_score": 10.0,
      "network_score": 0.0,
      "memory_score": 0.3
    },
    "metrics": {
      "loops": 2,
      "api_calls": 0
    }
  },
  "user_id": "optional-uuid"
}
```

**Parameters:**
- `code` (string, required): The code to optimize
- `language` (string, required): Programming language
- `analysis_results` (object, required): Results from code analysis
- `user_id` (string, optional): User UUID

**Response:**
```json
{
  "success": true,
  "optimization": {
    "ai_analysis": {
      "inefficiencies": [
        "Nested loops creating O(n²) complexity",
        "Excessive print operations causing I/O bottleneck",
        "No result caching or memoization"
      ],
      "suggestions": [
        "Use numpy for vectorized operations",
        "Store results in array and print once",
        "Consider generator expressions for large datasets"
      ],
      "optimized_code": "import numpy as np\n\ni = np.arange(1000)\nj = np.arange(1000)\nresults = np.outer(i, j)\nprint(results)",
      "explanations": [
        "Vectorized operations reduce CPU time by ~100x",
        "Single print operation reduces I/O overhead",
        "Memory usage is optimized through numpy arrays"
      ]
    },
    "timestamp": "2025-12-09T10:30:00Z"
  }
}
```

**Error Responses:**
- `400`: Invalid input
- `429`: Rate limit exceeded (5 requests/minute)
- `500`: AI service error

---

### Hosting Impact

#### POST `/hosting-impact`
Calculate hosting carbon footprint.

**Request Body:**
```json
{
  "provider": "aws",
  "region": "us-east",
  "tier": "standard",
  "monthly_requests": 1000000
}
```

**Parameters:**
- `provider` (string, required): One of: `aws`, `gcp`, `azure`, `vercel`, `netlify`, `digitalocean`
- `region` (string, required): One of: `us-east`, `us-west`, `eu-west`, `eu-north`, `asia-east`, `asia-south`, `australia`, `south-america`
- `tier` (string, required): One of: `serverless`, `basic`, `standard`, `premium`
- `monthly_requests` (integer, required): Monthly request count (min: 1000)

**Response:**
```json
{
  "success": true,
  "impact": {
    "provider": "aws",
    "region": "us-east",
    "tier": "standard",
    "monthly_requests": 1000000,
    "monthly_energy_kwh": 1.0,
    "monthly_co2_grams": 415.0,
    "monthly_co2_kg": 0.415,
    "yearly_co2_kg": 4.98,
    "estimated_monthly_cost_usd": 3.0,
    "carbon_intensity_region": 415,
    "provider_efficiency_score": 1.0,
    "timestamp": "2025-12-09T10:30:00Z"
  }
}
```

**Error Responses:**
- `400`: Invalid parameters
- `429`: Rate limit exceeded
- `500`: Server error

---

### User History

#### GET `/history/{user_id}`
Get user's analysis history.

**Parameters:**
- `user_id` (string, required): User UUID (path parameter)

**Response:**
```json
{
  "success": true,
  "code_analyses": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "language": "python",
      "code_hash": "abc123...",
      "analysis_results": {...},
      "created_at": "2025-12-09T10:30:00Z"
    }
  ],
  "github_analyses": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "repo_url": "https://github.com/...",
      "analysis_results": {...},
      "created_at": "2025-12-09T10:30:00Z"
    }
  ]
}
```

**Error Responses:**
- `404`: User not found
- `429`: Rate limit exceeded
- `500`: Database error
- `503`: Database not configured

---

## Error Response Format

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

## Rate Limiting

When rate limit is exceeded, you'll receive:

**Status:** `429 Too Many Requests`

**Response:**
```json
{
  "detail": "Rate limit exceeded: 20 per 1 minute"
}
```

**Headers:**
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1234567890
```

## Examples

### cURL Examples

**Analyze Code:**
```bash
curl -X POST http://localhost:8000/analyze-code \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello World\")",
    "language": "python"
  }'
```

**Analyze GitHub:**
```bash
curl -X POST http://localhost:8000/analyze-github \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/octocat/Hello-World"
  }'
```

**Calculate Hosting Impact:**
```bash
curl -X POST http://localhost:8000/hosting-impact \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws",
    "region": "us-east",
    "tier": "standard",
    "monthly_requests": 100000
  }'
```

### JavaScript Examples

**Using Fetch:**
```javascript
// Analyze Code
const analyzeCode = async (code, language) => {
  const response = await fetch('http://localhost:8000/analyze-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language })
  });
  return await response.json();
};

// Get History
const getHistory = async (userId) => {
  const response = await fetch(`http://localhost:8000/history/${userId}`);
  return await response.json();
};
```

### Python Examples

**Using httpx:**
```python
import httpx

# Analyze Code
async def analyze_code(code: str, language: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'http://localhost:8000/analyze-code',
            json={'code': code, 'language': language}
        )
        return response.json()

# Analyze GitHub
async def analyze_github(repo_url: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'http://localhost:8000/analyze-github',
            json={'repo_url': repo_url}
        )
        return response.json()
```

## WebSocket Support

Currently not implemented. Future versions may include:
- Real-time analysis progress
- Live collaboration features
- Streaming AI responses

## Versioning

API version is included in responses:
```json
{
  "version": "1.0.0"
}
```

Future versions will use URL versioning:
- `/v1/analyze-code`
- `/v2/analyze-code`

## Support

For API questions or issues:
- GitHub Issues: https://github.com/yourusername/ecocode/issues
- Email: api@ecocode.app
- Documentation: https://docs.ecocode.app
