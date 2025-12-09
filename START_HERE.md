# 🚀 START HERE - EcoCode Setup Instructions

Welcome to EcoCode! Follow these steps to get your application running in minutes.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Python 3.9 or higher installed
- [ ] Node.js 16 or higher installed
- [ ] A Supabase account (free at supabase.com)
- [ ] A Google Gemini API key (free at makersuite.google.com)
- [ ] Git installed (optional, for version control)

## ⚡ Super Quick Start (5 Commands)

Open PowerShell and run:

```powershell
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment file (then edit it with your keys)
cp .env.example .env
notepad .env

# 5. Start backend
uvicorn main:app --reload
```

Open a **NEW** PowerShell window:

```powershell
# Navigate to frontend
cd frontend

# Start frontend
npx serve .
```

Open browser: **http://localhost:3000** 🎉

## 🔑 Getting Your API Keys (5 minutes)

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (free)
3. Create new project:
   - Name: `ecocode`
   - Password: (generate strong password)
   - Region: (closest to you)
4. Wait ~2 minutes for setup
5. Go to **Settings** → **API**
6. Copy:
   - **URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJxxx...`
7. Go to **SQL Editor**
8. Copy content from `database/schema.sql`
9. Paste and click **Run**

### 2. Google Gemini API Key

1. Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Click **Create API Key**
3. Select or create a Google Cloud project
4. Copy the API key (starts with `AIza...`)

### 3. GitHub Token (Optional - for higher rate limits)

1. Go to GitHub Settings → Developer settings
2. Personal access tokens → Generate new token
3. Select scope: `public_repo`
4. Copy token

## ⚙️ Configuration

### Backend Configuration

Edit `backend/.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Configuration

Edit `frontend/js/config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:8000',
    SUPABASE_URL: 'https://xxxxx.supabase.co',
    SUPABASE_ANON_KEY: 'your_supabase_anon_key',
    // ... rest stays the same
};
```

## 🎯 Test Your Setup

### 1. Test Backend (while backend is running)

Open a new PowerShell window:

```powershell
# Test health endpoint
curl http://localhost:8000/health

# You should see: {"status": "healthy", ...}
```

### 2. Test Frontend

Open browser to: http://localhost:3000

You should see:
- ✅ Beautiful landing page with purple gradient
- ✅ Navigation bar with EcoCode logo
- ✅ Hero section with statistics
- ✅ Code editor section

### 3. Test Code Analysis

1. Scroll to "Code Carbon Analyzer" section
2. The Monaco editor should have sample Python code
3. Click **"Analyze Code"** button
4. You should see:
   - Green score circle animation
   - Metrics cards (loops, API calls, etc.)
   - CO₂ estimate
   - Chart visualization

### 4. Test GitHub Analysis

1. Scroll to "GitHub Repository Analyzer"
2. Enter: `https://github.com/octocat/Hello-World`
3. Click **"Analyze Repository"**
4. You should see:
   - Repository information
   - Stars/forks/size
   - Language distribution chart
   - CO₂ impact metrics

### 5. Test Hosting Calculator

1. Scroll to "Hosting Impact Estimator"
2. Select: AWS, US East, Standard, 100000 requests
3. Click **"Calculate Impact"**
4. You should see:
   - Monthly CO₂ estimate
   - Cost estimate
   - Environmental comparisons

## 🐛 Common Issues & Solutions

### Issue: "Python not found"
**Solution:**
```powershell
# Check Python installation
python --version

# If not installed, download from python.org
```

### Issue: "Module not found"
**Solution:**
```powershell
# Make sure venv is activated (you should see (venv) in prompt)
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "Port 8000 already in use"
**Solution:**
```powershell
# Kill process on port 8000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force

# Or use different port
uvicorn main:app --reload --port 8001
```

### Issue: "CORS error in browser"
**Solution:**
1. Check `frontend/js/config.js` has correct backend URL
2. Check backend is running
3. Check `.env` has correct ALLOWED_ORIGINS

### Issue: "Supabase connection failed"
**Solution:**
1. Verify URL and key in `.env`
2. Check project is not paused in Supabase
3. Verify schema was imported correctly

### Issue: "Monaco Editor not loading"
**Solution:**
1. Check internet connection (Monaco loads from CDN)
2. Clear browser cache (Ctrl+Shift+R)
3. Check browser console for errors

### Issue: "npx: command not found"
**Solution:**
```powershell
# Install Node.js from nodejs.org
# Then restart PowerShell
```

## 📂 Project Structure Quick Reference

```
Your Folder/
├── backend/
│   ├── main.py          ← FastAPI backend
│   ├── .env             ← Your API keys (edit this!)
│   └── requirements.txt
│
├── frontend/
│   ├── index.html       ← Main page
│   ├── css/style.css    ← Styles
│   └── js/
│       ├── config.js    ← Frontend config (edit this!)
│       └── *.js         ← Other JS modules
│
└── database/
    └── schema.sql       ← Database schema (run in Supabase)
```

## 🎓 Next Steps

After you have everything running:

1. **Read the Documentation:**
   - `README.md` - Full project overview
   - `docs/API.md` - API documentation
   - `docs/DEPLOYMENT.md` - Deploy to production

2. **Customize:**
   - Edit `frontend/css/style.css` for styling
   - Add your branding/logo
   - Modify color scheme

3. **Deploy:**
   - Follow `docs/DEPLOYMENT.md`
   - Deploy backend to Render.com
   - Deploy frontend to Vercel
   - Add custom domain

## 💡 Pro Tips

1. **Keep Both Terminals Open:**
   - One for backend
   - One for frontend
   - Don't close them while testing

2. **Check Browser Console:**
   - Press F12 to open DevTools
   - Check Console tab for errors
   - Check Network tab for API calls

3. **Use Sample Code:**
   - Editor pre-loads sample code for testing
   - Try different languages from dropdown
   - Test with your own code

4. **Save Your Work:**
   - Sign up for an account (optional)
   - Your analyses will be saved
   - View history in Dashboard

## 📞 Need Help?

1. **Check Documentation:**
   - `docs/QUICKSTART.md` - Detailed setup
   - `docs/API.md` - API reference
   - `PROJECT_SUMMARY.md` - Complete overview

2. **Common Solutions:**
   - Restart backend/frontend
   - Clear browser cache
   - Check API keys in .env
   - Verify Supabase schema imported

3. **Still Stuck?**
   - Check GitHub Issues
   - Review backend logs
   - Check browser console

## ✅ Success Checklist

You're ready when:

- [ ] Backend shows: `Uvicorn running on http://0.0.0.0:8000`
- [ ] Frontend accessible at `http://localhost:3000`
- [ ] Landing page loads with purple gradient
- [ ] Monaco editor shows sample code
- [ ] Code analysis works and shows green score
- [ ] GitHub analysis works
- [ ] Hosting calculator works
- [ ] Charts render correctly

## 🎉 You're All Set!

If you see the beautiful EcoCode interface and can analyze code, you're ready to go!

**Next:**
- Try analyzing different code samples
- Test the GitHub analyzer with various repos
- Calculate hosting impact for different scenarios
- Get AI optimization suggestions
- Deploy to production when ready

---

**Enjoy building sustainable software! 💚**

**Questions? Check the docs/ folder for detailed guides!**
