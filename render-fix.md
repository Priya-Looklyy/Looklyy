# Render Deployment Fix

## The Problem
Render is looking for files at the wrong path: `/opt/render/project/src/server/src/index.js`

## The Solution
Update Render settings to use the correct paths:

### Step 1: Update Render Settings
1. Go to Render Dashboard
2. Click on your "Looklyy" service
3. Go to "Settings" tab
4. Update these fields:

**Root Directory:** `.` (empty or just a dot)
**Build Command:** `npm install && cd server && npm install`
**Start Command:** `npm start`

### Step 2: Alternative Settings (if above doesn't work)
**Root Directory:** `.` (empty)
**Build Command:** `npm install`
**Start Command:** `node server/src/index.js`

### Step 3: Deploy
1. Save settings
2. Click "Manual Deploy"
3. Choose "Deploy latest commit"

## Why This Works
- Root directory `.` tells Render to look at the repository root
- The start script `node server/src/index.js` points to the correct file
- Build command installs dependencies in both root and server folders
