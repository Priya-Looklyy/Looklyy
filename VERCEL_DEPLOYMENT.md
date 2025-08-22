# 🚀 Vercel Deployment Guide for Lookly Frontend

## ✅ Quick Fix for Environment Variable Error

### Step 1: Deploy Without Environment Variable (Temporary)
1. **Remove the environment variable** from Vercel deployment page
2. **Click "Deploy"** - this will work because we have a fallback URL
3. **Your frontend will deploy successfully**

### Step 2: Add Environment Variable After Deployment
1. **Go to your Vercel project dashboard**
2. **Click "Settings" tab**
3. **Click "Environment Variables"**
4. **Add new variable:**
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://looklyy.onrender.com`
   - **Environment:** Production, Preview, Development
5. **Click "Save"**
6. **Redeploy** (Vercel will automatically redeploy)

## 🔧 Required Environment Variables

### For Production:
```
NEXT_PUBLIC_API_URL=https://looklyy.onrender.com
```

### For Local Development:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📁 Project Structure
```
client/
├── src/
│   ├── utils/
│   │   └── api.js          # API configuration
│   ├── components/
│   └── app/
├── env.example             # Environment variables template
└── package.json
```

## 🎯 What This Fixes
- ✅ Removes the "Secret" reference error
- ✅ Provides fallback API URL
- ✅ Documents required environment variables
- ✅ Ensures proper deployment

## 🌐 Final URLs
- **Frontend:** `https://looklyy.vercel.app` (or your custom domain)
- **Backend:** `https://looklyy.onrender.com`
- **Health Check:** `https://looklyy.onrender.com/api/health`

## 🚀 Next Steps
1. Deploy without environment variable
2. Add environment variable in Vercel dashboard
3. Configure custom domain (looklyy.com)
4. Test the full application
