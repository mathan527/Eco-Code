# 🚀 Quick Setup Script for EcoCode

Write-Host "🌿 EcoCode - Setup Wizard" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Green

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Cyan

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.9+ from https://python.org" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ Node.js not found. Install from https://nodejs.org (optional for development)" -ForegroundColor Yellow
}

Write-Host "`n📦 Setting up backend..." -ForegroundColor Cyan

# Create virtual environment
Set-Location backend
if (!(Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install --upgrade pip
pip install -r requirements.txt

# Setup .env file
if (!(Test-Path ".env")) {
    Write-Host "`n🔑 Setting up environment variables..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    
    Write-Host "`n⚠ IMPORTANT: Edit backend/.env with your API keys!" -ForegroundColor Yellow
    Write-Host "You need:" -ForegroundColor Yellow
    Write-Host "  1. Supabase URL and Key (https://supabase.com)" -ForegroundColor White
    Write-Host "  2. Google Gemini API Key (https://makersuite.google.com/app/apikey)" -ForegroundColor White
    Write-Host "  3. Optional: GitHub Token (https://github.com/settings/tokens)`n" -ForegroundColor White
    
    $continue = Read-Host "Press Enter when you've added your API keys to backend/.env"
}

Set-Location ..

Write-Host "`n🎨 Setting up frontend..." -ForegroundColor Cyan

# Update frontend config
Write-Host "⚠ Don't forget to update frontend/js/config.js with your:" -ForegroundColor Yellow
Write-Host "  - Backend URL (after deployment)" -ForegroundColor White
Write-Host "  - Supabase URL and Anon Key" -ForegroundColor White

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`n🚀 To start the application:" -ForegroundColor Cyan
Write-Host "  1. Terminal 1: cd backend && venv\Scripts\activate && uvicorn main:app --reload" -ForegroundColor White
Write-Host "  2. Terminal 2: cd frontend && npx serve ." -ForegroundColor White
Write-Host "  3. Open: http://localhost:3000" -ForegroundColor White

Write-Host "`n📚 Next steps:" -ForegroundColor Cyan
Write-Host "  - Set up Supabase database: Run database/schema.sql in SQL Editor" -ForegroundColor White
Write-Host "  - Read DEPLOYMENT.md for production deployment" -ForegroundColor White
Write-Host "  - Check GITHUB_CHECKLIST.md before uploading to GitHub" -ForegroundColor White

Write-Host "`n💚 Happy green coding!" -ForegroundColor Green
