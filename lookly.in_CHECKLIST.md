# ✅ looklyy.com Deployment Checklist

## Pre-Deployment ✅
- [x] Database schema updated for PostgreSQL
- [x] Controllers updated for production
- [x] Environment variables configured
- [x] CORS settings updated for lookly.in
- [x] Vercel and Railway configs created

## Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for looklyy.com deployment"
git push
```

## Step 2: Deploy Backend (Railway)
- [ ] Go to [railway.app](https://railway.app)
- [ ] Sign up with GitHub
- [ ] Create new project
- [ ] Deploy from GitHub repo
- [ ] Set root directory to `server`
- [ ] Add PostgreSQL database
- [ ] Set environment variables:
  - [ ] `JWT_SECRET=your-super-secret-jwt-key-here`
  - [ ] `NODE_ENV=production`
- [ ] Note Railway URL (e.g., `https://lookly-backend-production.up.railway.app`)

## Step 3: Configure Domain DNS
- [ ] Go to your domain registrar (where you bought looklyy.com)
- [ ] Access DNS settings
- [ ] Add CNAME record for API:
  - [ ] Name: `api`
  - [ ] Value: `your-railway-app-url.railway.app`
- [ ] Wait for DNS propagation (24-48 hours)

## Step 4: Set Railway Custom Domain
- [ ] Go to Railway project settings
- [ ] Click "Custom Domains"
- [ ] Add `api.looklyy.com`
- [ ] Update DNS records as instructed

## Step 5: Deploy Frontend (Vercel)
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Import your repository
- [ ] Set root directory to `client`
- [ ] Set environment variable:
  - [ ] `NEXT_PUBLIC_API_URL=https://api.looklyy.com`
- [ ] Deploy

## Step 6: Configure Vercel Custom Domain
- [ ] Go to Vercel project settings
- [ ] Click "Domains"
- [ ] Add `looklyy.com`
- [ ] Add `www.looklyy.com` (optional)
- [ ] Update DNS records as instructed

## Step 7: Test Your Deployment
- [ ] Test frontend: `https://looklyy.com`
- [ ] Test backend health: `https://api.looklyy.com/api/health`
- [ ] Create a new user account
- [ ] Test profile setup flow
- [ ] Verify all features work

## Final URLs
- **Frontend:** `https://looklyy.com`
- **Backend:** `https://api.looklyy.com`
- **Health Check:** `https://api.looklyy.com/api/health`

## Cost Summary
- **Vercel:** Free tier (100GB/month)
- **Railway:** Free tier ($5 credit/month)
- **Domain:** ~$10-15/year
- **Total:** ~$10-15/year

---

**🎉 Your Lookly app will be live at: `https://looklyy.com`**

**Share with friends: "Check out my new fashion app at looklyy.com!"**
