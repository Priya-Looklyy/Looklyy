# 🌐 Deploying Lookly to looklyy.com Domain

## Overview
This guide will help you deploy Lookly to your custom `looklyy.com` domain using Vercel (Frontend) + Railway (Backend).

## Domain Structure
- **Frontend:** `https://looklyy.com` (or `https://www.looklyy.com`)
- **Backend:** `https://api.looklyy.com`
- **Database:** PostgreSQL on Railway

## Step 1: Domain DNS Configuration

### 1.1 Configure DNS Records
In your domain registrar's DNS settings, add these records:

```
# For Frontend (Vercel)
Type: CNAME
Name: @ (or www)
Value: cname.vercel-dns.com

# For Backend API (Railway)
Type: CNAME  
Name: api
Value: your-railway-app-url.railway.app
```

### 1.2 Alternative DNS Setup
If you prefer different subdomains:
```
# Option A: Main domain for frontend
looklyy.com → Frontend
api.looklyy.com → Backend

# Option B: Subdomain for frontend  
www.looklyy.com → Frontend
api.looklyy.com → Backend
```

## Step 2: Deploy Backend to Railway

### 2.1 Deploy Backend
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub repo
4. Set root directory to `server`
5. Add PostgreSQL database

### 2.2 Configure Environment Variables
```
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### 2.3 Set Custom Domain
1. Go to Railway project settings
2. Click "Custom Domains"
3. Add `api.looklyy.com`
4. Update DNS records as instructed

## Step 3: Deploy Frontend to Vercel

### 3.1 Deploy Frontend
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `client`
4. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3.2 Set Environment Variables
```
NEXT_PUBLIC_API_URL=https://api.looklyy.com
```

### 3.3 Connect Custom Domain
1. Go to Vercel project settings
2. Click "Domains"
3. Add `looklyy.com` (and `www.looklyy.com` if desired)
4. Update DNS records as instructed

## Step 4: Update CORS Settings

Update `server/src/app.js`:
```javascript
app.use(cors({ 
  origin: [
    'https://looklyy.com',
    'https://www.looklyy.com',
    'http://localhost:3000' // for local development
  ], 
  credentials: true 
}));
```

## Step 5: SSL Certificates
- **Vercel:** Automatic SSL for custom domains
- **Railway:** Automatic SSL for custom domains
- **DNS:** May take 24-48 hours to propagate

## Step 6: Test Your Deployment

### 6.1 Test URLs
- **Frontend:** `https://looklyy.com`
- **Backend Health:** `https://api.looklyy.com/api/health`
- **API Endpoint:** `https://api.looklyy.com/api/auth/login`

### 6.2 Test Features
1. Visit `https://looklyy.com`
2. Create a new account
3. Test profile setup flow
4. Verify all API calls work

## Cost Breakdown

### Free Tier (Recommended for testing):
- **Vercel:** Free (100GB bandwidth/month)
- **Railway:** Free ($5 credit/month)
- **Domain:** ~$10-15/year
- **Total:** ~$10-15/year

### Production Tier:
- **Vercel:** $20/month (Pro plan)
- **Railway:** $5-20/month
- **Domain:** ~$10-15/year
- **Total:** ~$35-55/year

## Troubleshooting

### Common Issues:

1. **DNS Propagation:**
   - Can take 24-48 hours
   - Use tools like `nslookup` or `dig` to check

2. **SSL Certificate:**
   - Automatic with Vercel/Railway
   - May take a few hours to activate

3. **CORS Errors:**
   - Ensure CORS origins include your domain
   - Check that API URL is correct

4. **Domain Not Found:**
   - Verify DNS records are correct
   - Wait for DNS propagation

## Next Steps

1. **Set up monitoring** with Vercel Analytics
2. **Configure backups** for your database
3. **Set up CI/CD** for automatic deployments
4. **Add error tracking** (Sentry, LogRocket)
5. **Set up email notifications** for user signups

---

**🎉 Your Lookly app will be live at: `https://looklyy.com`**

**API endpoint: `https://api.looklyy.com`**
