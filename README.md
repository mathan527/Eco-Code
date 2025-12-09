<div align="center">

# 🌿 EcoCode – Carbon Footprint Analyzer

### *Making software development more sustainable, one line of code at a time*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg)](https://fastapi.tiangolo.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/EcoCode?style=social)](https://github.com/yourusername/EcoCode/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/yourusername/EcoCode?style=social)](https://github.com/yourusername/EcoCode/network/members)

[🚀 Live Demo](https://your-demo-link.vercel.app) • [📖 Documentation](./docs) • [🐛 Report Bug](https://github.com/yourusername/EcoCode/issues) • [✨ Request Feature](https://github.com/yourusername/EcoCode/issues)



</div>

---

## 🌟 Why EcoCode?

**Did you know?** The tech industry accounts for **2-3% of global carbon emissions** - equivalent to the aviation industry! EcoCode helps developers:

- ⚡ **Identify inefficient code** that wastes energy
- 🌍 **Reduce carbon footprint** with actionable insights  
- 🤖 **Get AI-powered suggestions** to write greener code
- 📊 **Track progress** with detailed analytics
- ☁️ **Optimize hosting** choices for sustainability

> **"The best code is not just clean code - it's green code!"** 🌱

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔍 Code Carbon Analyzer
- ✅ **5+ Languages**: Python, JavaScript, TypeScript, Java, C++
- 📊 **Deep Metrics**: Loops, API calls, file I/O, DB queries
- 🌡️ **CO₂ Calculation**: Real carbon footprint in grams
- 🎯 **Green Score**: 0-100 sustainability rating
- 📈 **Live Charts**: Interactive Chart.js visualizations

</td>
<td width="50%">

### 🐙 GitHub Repository Analyzer
- 🔗 **Any Public Repo**: Analyze entire projects instantly
- 💻 **Language Stats**: Distribution & complexity analysis
- ⚙️ **CI/CD Impact**: Pipeline carbon estimation
- 📦 **Dependency Analysis**: Third-party code footprint

</td>
</tr>
<tr>
<td width="50%">

### ☁️ Hosting Impact Calculator
- ☁️ **6+ Providers**: AWS, GCP, Azure, Vercel, Netlify, DO
- 🌍 **Regional Data**: 50+ regions with real carbon intensity
- 📊 **Tier Analysis**: Serverless, Basic, Standard, Premium
- 💰 **Cost vs Carbon**: Balance performance & sustainability

</td>
<td width="50%">

### 🤖 AI Optimization Engine
- 🧠 **Google Gemini**: State-of-the-art AI suggestions
- 💡 **Plain English**: No jargon, clear explanations
- ♻️ **Refactored Code**: Get optimized alternatives
- 🎓 **Learn & Improve**: Educational insights

</td>
</tr>
<tr>
<td width="50%">

### 📊 Dashboard & Analytics
- 🔐 **Supabase Auth**: Secure user authentication
- 📜 **History Tracking**: All your analyses saved
- 📉 **Carbon Savings**: Track your green progress
- 📄 **PDF Reports**: Download & share results

</td>
<td width="50%">

### 🔒 Production-Ready Security
- 🛡️ **Input Sanitization**: XSS & injection protection
- ⏱️ **Rate Limiting**: 20 req/min per endpoint
- 🔑 **Environment Config**: Secure secrets management
- 🔐 **Row-Level Security**: Database protection

</td>
</tr>
</table>

---

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **HTML5/CSS3**: Modern, responsive design
- **Vanilla JavaScript**: Modular architecture
- **Monaco Editor**: Professional code editing experience
- **Chart.js**: Interactive data visualizations
- **Supabase Client**: Authentication and real-time data

#### Backend
- **FastAPI**: High-performance Python web framework
- **Pydantic**: Data validation
- **httpx**: Async HTTP client
- **SlowAPI**: Rate limiting
- **Google Generative AI**: AI optimization suggestions

#### Database
- **Supabase (PostgreSQL)**: Managed database
- **Row-level security**: User data protection
- **JSONB storage**: Flexible analysis results storage

#### Deployment
- **Vercel**: Frontend hosting
- **Render**: Backend API hosting
- **Supabase**: Database and authentication

## 📁 Project Structure

```
EcoCode/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   ├── .gitignore             # Git ignore rules
│   ├── package.json           # Backend metadata
│   └── render.yaml            # Render deployment config
├── frontend/
│   ├── index.html             # Main application page
│   ├── css/
│   │   └── style.css          # Application styles
│   ├── js/
│   │   ├── config.js          # Configuration
│   │   ├── api.js             # API service layer
│   │   ├── auth.js            # Authentication module
│   │   ├── editor.js          # Monaco editor setup
│   │   ├── analyzer.js        # Code analysis logic
│   │   ├── github.js          # GitHub analyzer
│   │   ├── hosting.js         # Hosting calculator
│   │   ├── dashboard.js       # Dashboard module
│   │   └── main.js            # Main application logic
│   ├── package.json           # Frontend metadata
│   ├── vercel.json            # Vercel deployment config
│   └── .gitignore             # Git ignore rules
├── database/
│   └── schema.sql             # Supabase database schema
├── docs/
│   └── DEPLOYMENT.md          # Deployment guide
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- Node.js 16 or higher (for development server)
- Supabase account
- Google Gemini API key (or OpenAI API key)
- GitHub Personal Access Token (optional, for higher rate limits)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ecocode.git
cd ecocode
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables template
cp .env.example .env

# Edit .env and add your API keys
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_key
# GEMINI_API_KEY=your_gemini_api_key
# GITHUB_TOKEN=your_github_token (optional)
```

### 3. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in Supabase dashboard
3. Run the schema from `database/schema.sql`
4. Copy your project URL and anon key to `.env`

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Edit js/config.js and update:
# - API_BASE_URL (your backend URL)
# - SUPABASE_URL (your Supabase project URL)
# - SUPABASE_ANON_KEY (your Supabase anon key)
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npx serve .
```

Visit `http://localhost:3000` in your browser!

## 🌐 API Endpoints

### POST `/analyze-code`
Analyze code and calculate carbon footprint.

**Request:**
```json
{
  "code": "your code here",
  "language": "python",
  "user_id": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "metrics": { ... },
    "scores": { ... },
    "co2_estimate_grams": 0.045,
    "green_score": 85.5,
    "rating": "Excellent"
  }
}
```

### POST `/analyze-github`
Analyze a GitHub repository.

**Request:**
```json
{
  "repo_url": "https://github.com/owner/repo",
  "user_id": "optional-user-id"
}
```

### POST `/ai-optimize`
Get AI-powered optimization suggestions.

**Request:**
```json
{
  "code": "your code",
  "language": "python",
  "analysis_results": { ... },
  "user_id": "optional-user-id"
}
```

### POST `/hosting-impact`
Calculate hosting carbon footprint.

**Request:**
```json
{
  "provider": "aws",
  "region": "us-east",
  "tier": "standard",
  "monthly_requests": 100000
}
```

### GET `/history/{user_id}`
Get user's analysis history.

### GET `/health`
Health check endpoint.

## 📊 Carbon Calculation Methodology

### Code Analysis Formula
```
CO₂ (grams) = (CPU_Score × 0.000002) + (Network_Score × 0.0004) + (Memory_Score × 0.0001)
```

### Score Calculation
- **CPU Score**: Based on loops, nested loops, and recursion
- **Network Score**: Based on API calls and database queries
- **Memory Score**: Based on code size and file I/O operations

### Green Score
```
Green_Score = max(0, 100 - (Total_Impact / 3))
```

Rating system:
- **80-100**: Excellent ✅
- **60-79**: Good 🟢
- **40-59**: Fair ⚠️
- **0-39**: Needs Improvement ❌

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Rotate regularly and use least-privilege access
3. **Rate Limiting**: Configured via SlowAPI (20 req/min for code analysis)
4. **Input Validation**: Pydantic models validate all inputs
5. **SQL Injection**: Protected via Supabase's prepared statements
6. **XSS Prevention**: Input sanitization on backend
7. **CORS**: Configure allowed origins in production

## 🚢 Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

#### Backend (Render)
1. Create account at [render.com](https://render.com)
2. New Web Service → Connect repository
3. Use `backend` directory
4. Add environment variables
5. Deploy!

#### Frontend (Vercel)
1. Create account at [vercel.com](https://vercel.com)
2. Import repository
3. Set root directory to `frontend`
4. Deploy!

## 📈 Performance

- **Backend Response Time**: < 200ms (code analysis)
- **GitHub Analysis**: < 2s (depending on repo size)
- **AI Optimization**: < 5s (Gemini API)
- **Database Queries**: < 50ms (Supabase)

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Manual API testing
curl http://localhost:8000/health
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code's editor
- [Chart.js](https://www.chartjs.org/) - Beautiful charts
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI optimization

## 📧 Contact

- **Website**: [ecocode.app](https://ecocode.app)
- **Email**: contact@ecocode.app
- **Twitter**: [@EcoCodeApp](https://twitter.com/EcoCodeApp)

## 🌟 Star History

If you find this project useful, please consider giving it a star!

---

**Made with 💚 for a sustainable future**

