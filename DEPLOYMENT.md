# 🚀 Lookly Deployment Guide

## Overview
This guide will help you deploy Lookly to production using Vercel (Frontend) + Railway (Backend + Database).

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available)

## Step 1: Prepare Your Repository

### 1.1 Update Environment Variables
Create `.env.local` in the client directory:
```bash
NEXT_PUBLIC_API_URL=https://your-railway-app-url.railway.app
```

### 1.2 Update Database Configuration
Update `server/prisma/schema.prisma` for production:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### 2.2 Deploy Backend
1. **Connect Repository:**
   - Click "Deploy from GitHub repo"
   - Select your Lookly repository
   - Set root directory to `server`

2. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL` environment variable

3. **Configure Environment Variables:**
   - Go to Variables tab
   - Add `JWT_SECRET=your-super-secret-jwt-key-here`
   - Add `NODE_ENV=production`

4. **Deploy:**
   - Railway will automatically build and deploy
   - Note the generated URL (e.g., `https://lookly-backend-production.up.railway.app`)

### 2.3 Run Database Migrations
1. Go to your Railway project
2. Click on the deployed service
3. Go to "Settings" → "Custom Domains"
4. Add your custom domain (optional)

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### 3.2 Configure Vercel
1. **Project Settings:**
   - Framework Preset: Next.js
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `.next`

2. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
   - Example: `https://lookly-backend-production.up.railway.app`

3. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your app

### 3.3 Custom Domain (Optional)
1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## Step 4: Final Configuration

### 4.1 Update CORS Settings
In `server/src/app.js`, update CORS configuration:
```javascript
app.use(cors({ 
  origin: [
    'https://your-vercel-domain.vercel.app',
    'https://your-custom-domain.com',
    'http://localhost:3000' // for local development
  ], 
  credentials: true 
}));
```

### 4.2 Test Your Deployment
1. Visit your Vercel frontend URL
2. Try creating a new account
3. Test the profile setup flow
4. Verify all features work

## Step 5: Monitoring & Maintenance

### 5.1 Railway Monitoring
- Check Railway dashboard for logs
- Monitor database usage
- Set up alerts for errors

### 5.2 Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Monitor page views and user behavior

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure CORS origins include your Vercel domain
   - Check that API URL is correct

2. **Database Connection:**
   - Verify `DATABASE_URL` is set correctly
   - Run `npx prisma db push` in Railway console

3. **Build Errors:**
   - Check Vercel build logs
   - Ensure all dependencies are in package.json

### Support:
- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)

## Cost Estimation

### Free Tier (Recommended for testing):
- **Vercel:** Free (100GB bandwidth/month)
- **Railway:** Free ($5 credit/month)
- **Total:** ~$0-5/month

### Production Tier:
- **Vercel:** $20/month (Pro plan)
- **Railway:** $5-20/month (depending on usage)
- **Total:** ~$25-40/month

## Next Steps

1. **Set up monitoring** with Railway and Vercel analytics
2. **Configure backups** for your database
3. **Set up CI/CD** for automatic deployments
4. **Add SSL certificates** (automatic with Vercel/Railway)
5. **Implement rate limiting** for API endpoints
6. **Add error tracking** (Sentry, LogRocket, etc.)

---

**Your Lookly app will be live at:** `https://your-vercel-domain.vercel.app`

**API endpoint:** `https://your-railway-app-url.railway.app`
