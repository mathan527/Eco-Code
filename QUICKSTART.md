# 🚀 Quick Start Guide - EcoCode

Get EcoCode up and running in under 10 minutes!

## 📦 What You'll Build

A complete carbon footprint analyzer that can:
- ✅ Analyze code for environmental impact
- ✅ Scan GitHub repositories
- ✅ Calculate hosting carbon footprint
- ✅ Get AI-powered optimization suggestions

## ⚡ Prerequisites (5 minutes)

1. **Install Python 3.9+**
   - Windows: Download from [python.org](https://python.org)
   - macOS: `brew install python@3.9`
   - Linux: `sudo apt install python3.9`

2. **Install Node.js** (for development server)
   - Download from [nodejs.org](https://nodejs.org)

3. **Get Free API Keys:**
   - Supabase: [supabase.com](https://supabase.com) → Create project (2 min)
   - Gemini AI: [makersuite.google.com](https://makersuite.google.com/app/apikey) → Get key (1 min)

## 🎯 Installation (3 minutes)

### Step 1: Clone & Setup Backend

```powershell
# Clone the repository (or navigate to your folder)
cd "C:\Users\Mathan\OneDrive\Desktop\WEBSITES\New folder"

# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure Environment

```powershell
# Copy the example env file
cp .env.example .env

# Open .env and add your keys
notepad .env
```

**Add these values in .env:**
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_key
```

### Step 3: Setup Database

1. Open [app.supabase.com](https://app.supabase.com)
2. Go to SQL Editor
3. Copy-paste content from `../database/schema.sql`
4. Click "Run"
5. Done! ✅

### Step 4: Configure Frontend

```powershell
# Navigate to frontend
cd ..\frontend

# Edit config
notepad js\config.js
```

**Update these lines:**
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:8000',
    SUPABASE_URL: 'https://xxxxx.supabase.co',
    SUPABASE_ANON_KEY: 'your_anon_key',
    // ...
};
```

## 🚀 Run the App (1 minute)

### Terminal 1 - Start Backend:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

✅ Backend running at: http://localhost:8000

### Terminal 2 - Start Frontend:
```powershell
cd frontend
npx serve .
```

✅ Frontend running at: http://localhost:3000

## 🎉 Test It Out!

1. **Open browser:** http://localhost:3000
2. **Try Code Analysis:**
   - Paste some code in the Monaco editor
   - Click "Analyze Code"
   - See your Green Score!

3. **Try GitHub Analysis:**
   - Scroll to GitHub section
   - Enter: `https://github.com/octocat/Hello-World`
   - Click "Analyze Repository"

4. **Try Hosting Calculator:**
   - Scroll to Hosting section
   - Select AWS, US-East, Standard
   - Enter 100000 requests
   - Click "Calculate Impact"

## 🐛 Troubleshooting

### "Module not found" error
```powershell
# Make sure you're in the venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### "CORS error" in browser
- Check that API_BASE_URL in frontend config.js is correct
- Verify backend is running on port 8000

### "Supabase connection failed"
- Double-check your SUPABASE_URL and SUPABASE_KEY
- Make sure database schema is imported
- Check project is not paused in Supabase dashboard

### Monaco Editor not loading
- Check internet connection (Monaco loads from CDN)
- Clear browser cache
- Try a different browser

## 📝 Sample Code to Test

### Python (Inefficient - Low Green Score)
```python
# This code will score poorly
for i in range(1000):
    for j in range(1000):
        response = requests.get('https://api.example.com')
        with open(f'file_{i}_{j}.txt', 'w') as f:
            f.write(str(response.text))
```

### Python (Efficient - High Green Score)
```python
# This code will score well
def calculate_sum(numbers):
    return sum(numbers)

result = calculate_sum([1, 2, 3, 4, 5])
print(result)
```

## 🎓 Next Steps

1. **Customize the UI:**
   - Edit `frontend/css/style.css`
   - Modify colors, fonts, layouts

2. **Add Features:**
   - Check `backend/main.py` for API routes
   - Add new analysis patterns
   - Integrate additional AI models

3. **Deploy to Production:**
   - Follow `docs/DEPLOYMENT.md`
   - Deploy backend to Render
   - Deploy frontend to Vercel

## 📚 Learn More

- **API Documentation:** `docs/API.md`
- **Full README:** `README.md`
- **Deployment Guide:** `docs/DEPLOYMENT.md`

## 💡 Pro Tips

1. **Use Sample Code:** The editor pre-loads sample code for each language
2. **Save Often:** If logged in, analyses are saved to your history
3. **AI Optimization:** Click "AI Optimization" after analysis for suggestions
4. **Download Reports:** Click "Download Report" to save analysis as text file

## 🆘 Need Help?

- **GitHub Issues:** [Report a bug](https://github.com/yourusername/ecocode/issues)
- **Email:** support@ecocode.app
- **Discord:** [Join our community](https://discord.gg/ecocode)

## ✅ Quick Check

Everything working if you see:
- ✅ Backend: `{"service": "EcoCode Carbon Footprint Analyzer API"}`
- ✅ Frontend: Beautiful landing page with hero section
- ✅ Analysis: Green score appears after analyzing code
- ✅ Charts: Chart.js visualizations render properly

## 🎉 You're Done!

You now have a fully functional carbon footprint analyzer!

Start analyzing your code and making it more environmentally friendly! 🌿

---

**Happy coding sustainably! 💚**
