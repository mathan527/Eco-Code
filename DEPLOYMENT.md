# 🚀 Deployment Guide - EcoCode

This guide will walk you through deploying the EcoCode application to production.

## 📋 Prerequisites

Before deploying, make sure you have:

- [ ] Supabase account and project
- [ ] Google Gemini API key (or OpenAI API key)
- [ ] GitHub account
- [ ] Render account (for backend)
- [ ] Vercel account (for frontend)
- [ ] Domain name (optional)

## 🗄️ Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if you don't have one)
4. Create a new project:
   - **Name**: ecocode-production
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Wait for project to be provisioned (~2 minutes)

### 1.2 Set Up Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy the entire contents of `database/schema.sql`
4. Paste and click **Run**
5. Verify tables are created:
   - Go to **Table Editor**
   - You should see: `users`, `code_analyses`, `github_analyses`, `hosting_calculations`, `api_usage`

### 1.3 Configure Authentication

1. Go to **Authentication** → **Settings**
2. Enable **Email Authentication**
3. Configure email templates (optional)
4. Set **Site URL** (will update after frontend deployment)
5. Add **Redirect URLs** (will update after frontend deployment)

### 1.4 Get API Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key**
3. Save these for later

## 🔑 Step 2: Get API Keys

### 2.1 Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Create API Key**
3. Select or create a Google Cloud project
4. Copy the API key
5. Save securely

**Alternative: OpenAI API Key**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys**
3. Create new secret key
4. Copy and save securely

### 2.2 GitHub Personal Access Token (Optional)

This is optional but recommended for higher API rate limits.

1. Go to GitHub **Settings** → **Developer settings**
2. Click **Personal access tokens** → **Tokens (classic)**
3. Click **Generate new token** → **Generate new token (classic)**
4. Give it a name: "EcoCode API"
5. Select scopes:
   - ✅ `public_repo`
6. Click **Generate token**
7. Copy token (you won't see it again!)

## 🖥️ Step 3: Deploy Backend (Render)

### 3.1 Prepare Repository

1. Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3.2 Create Render Web Service

1. Go to [render.com](https://render.com)
2. Sign up or log in
3. Click **New** → **Web Service**
4. Connect your GitHub repository
5. Configure the service:

**Basic Settings:**
- **Name**: `ecocode-backend`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Instance Type:**
- Select **Free** (for testing) or **Starter** (for production)

### 3.3 Add Environment Variables

Click **Advanced** → **Add Environment Variable** and add:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### 3.4 Deploy

1. Click **Create Web Service**
2. Wait for deployment (~5 minutes)
3. Once deployed, copy your backend URL:
   - Example: `https://ecocode-backend.onrender.com`
4. Test health endpoint:
   ```bash
   curl https://ecocode-backend.onrender.com/health
   ```

## 🌐 Step 4: Deploy Frontend (Vercel)

### 4.1 Update Frontend Configuration

1. Edit `frontend/js/config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'https://ecocode-backend.onrender.com', // Your Render URL
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your_supabase_anon_key',
    // ... rest of config
};
```

2. Commit changes:
```bash
git add frontend/js/config.js
git commit -m "Update production config"
git push origin main
```

### 4.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Configure project:

**Framework Preset:** Other
**Root Directory:** `frontend`
**Build Command:** (leave empty)
**Output Directory:** (leave empty)

6. Click **Deploy**
7. Wait for deployment (~2 minutes)
8. Get your frontend URL:
   - Example: `https://ecocode.vercel.app`

### 4.3 Update CORS Settings

1. Go back to Render dashboard
2. Edit your backend service
3. Update `ALLOWED_ORIGINS` environment variable:
   ```
   ALLOWED_ORIGINS=https://ecocode.vercel.app,https://www.ecocode.app
   ```
4. Save and redeploy

### 4.4 Update Supabase Redirect URLs

1. Go to Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Update:
   - **Site URL**: `https://ecocode.vercel.app`
   - **Redirect URLs**: Add `https://ecocode.vercel.app/**`

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend

```bash
# Health check
curl https://ecocode-backend.onrender.com/health

# Test code analysis
curl -X POST https://ecocode-backend.onrender.com/analyze-code \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"hello\")",
    "language": "python"
  }'
```

### 5.2 Test Frontend

1. Visit your Vercel URL
2. Test each feature:
   - ✅ Code analysis
   - ✅ GitHub repository analysis
   - ✅ Hosting impact calculator
   - ✅ User authentication
   - ✅ AI optimization

## 🔧 Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain to Vercel

1. Go to Vercel dashboard → Your project
2. Click **Settings** → **Domains**
3. Add your domain: `ecocode.app`
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

### 6.2 Add Custom Domain to Render

1. Go to Render dashboard → Your backend service
2. Click **Settings** → **Custom Domains**
3. Add your API subdomain: `api.ecocode.app`
4. Configure DNS with CNAME record
5. Wait for SSL certificate

### 6.3 Update Configurations

**Frontend config.js:**
```javascript
API_BASE_URL: 'https://api.ecocode.app'
```

**Backend environment:**
```
ALLOWED_ORIGINS=https://ecocode.app,https://www.ecocode.app
```

**Supabase:**
- Update Site URL and Redirect URLs to use custom domain

## 📊 Step 7: Monitoring & Maintenance

### 7.1 Set Up Monitoring

**Render:**
1. Enable **Auto-Deploy** for main branch
2. Set up **Slack/Email notifications**
3. Monitor **Metrics** tab for performance

**Vercel:**
1. Enable **Production Protection**
2. Set up **Preview Deployments**
3. Monitor **Analytics** (if on Pro plan)

**Supabase:**
1. Monitor **Database** → **Reports**
2. Check **API** usage
3. Review **Auth** logs

### 7.2 Backup Strategy

**Database Backups:**
- Supabase automatically backs up daily
- Manual backup: Go to **Database** → **Backups**

**Code Backups:**
- Keep Git repository as source of truth
- Tag releases: `git tag v1.0.0`

### 7.3 Security Checklist

- [ ] Environment variables are not in code
- [ ] CORS is properly configured
- [ ] API rate limiting is enabled
- [ ] Database RLS policies are active
- [ ] HTTPS is enforced
- [ ] API keys are rotated regularly
- [ ] Error messages don't expose sensitive data

## 🔄 Step 8: Continuous Deployment

### 8.1 Automatic Deployments

Both Render and Vercel support automatic deployments:

**When you push to GitHub:**
1. Render automatically rebuilds backend
2. Vercel automatically rebuilds frontend
3. Changes are live in ~5 minutes

### 8.2 Rollback Strategy

**Render:**
1. Go to **Deploys** tab
2. Click **Rollback** on any previous deployment

**Vercel:**
1. Go to **Deployments**
2. Select previous deployment
3. Click **Promote to Production**

## 🐛 Troubleshooting

### Backend Issues

**Issue: 502 Bad Gateway**
- Solution: Check logs in Render dashboard
- Verify environment variables are set
- Check if service is running

**Issue: CORS errors**
- Solution: Verify ALLOWED_ORIGINS in backend
- Check if frontend URL is correct
- Ensure no trailing slashes

**Issue: Database connection failed**
- Solution: Verify Supabase credentials
- Check if project is active
- Test connection from Render logs

### Frontend Issues

**Issue: API calls failing**
- Solution: Check API_BASE_URL in config.js
- Verify backend is running
- Check browser console for errors

**Issue: Authentication not working**
- Solution: Verify Supabase keys
- Check redirect URLs
- Clear browser cache/cookies

**Issue: Monaco Editor not loading**
- Solution: Check CDN links in index.html
- Verify internet connection
- Check browser console

## 📈 Scaling Considerations

### When to Scale

**Backend:**
- Response time > 2 seconds
- Error rate > 1%
- CPU usage > 80%

**Database:**
- Connection pool exhausted
- Query time > 100ms
- Storage > 80% capacity

### Scaling Options

**Render:**
- Upgrade to Standard or Pro plan
- Add more instances (horizontal scaling)
- Upgrade instance type (vertical scaling)

**Supabase:**
- Upgrade to Pro plan for better performance
- Enable connection pooling
- Add read replicas

**Vercel:**
- Pro plan for better DDoS protection
- Enterprise for dedicated support

## 📞 Support

If you encounter issues:

1. Check [GitHub Issues](https://github.com/yourusername/ecocode/issues)
2. Review application logs
3. Contact support:
   - Render: support@render.com
   - Vercel: vercel.com/support
   - Supabase: support@supabase.io

## ✅ Deployment Checklist

Final checklist before going live:

- [ ] Database schema is deployed
- [ ] All environment variables are set
- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] Authentication works
- [ ] All features tested
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team notified

---

**Congratulations! 🎉 Your EcoCode application is now live!**
