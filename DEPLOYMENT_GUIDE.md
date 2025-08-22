# 🚀 Lookly Backend Deployment Guide

## ✅ Clean Setup - This Will Work!

### Step 1: Update GitHub Repository
1. **Go to your GitHub repository:** `https://github.com/Priya-Looklyy/Looklyy`
2. **Add these files to the root:**
   - `index.js` (simple Express server)
   - `package.json` (simplified dependencies)
3. **Commit the changes**

### Step 2: Update Render Settings
1. **Go to Render Dashboard**
2. **Click on your "Looklyy" service**
3. **Go to "Settings" tab**
4. **Update these settings:**

**Root Directory:** `.` (empty)
**Build Command:** `npm install`
**Start Command:** `npm start`

### Step 3: Deploy
1. **Save settings**
2. **Click "Manual Deploy"**
3. **Choose "Deploy latest commit"**

## 🎯 What This Does
- Simple Express server at root level
- No complex folder structures
- Basic health check endpoint
- Will definitely deploy successfully

## 🌐 After Deployment
- Your backend will be live at: `https://looklyy.onrender.com`
- Test: `https://looklyy.onrender.com/api/health`
- You should see: `{"status":"ok","message":"Lookly server is running!"}`

## 🔄 Next Steps
Once this basic deployment works, we can add back your full features (authentication, database, etc.) step by step.
