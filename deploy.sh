#!/bin/bash

echo "🚀 Lookly Deployment Script"
echo "=========================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if changes need to be committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Prepare for deployment - Update for PostgreSQL and production config"
    git push
    echo "✅ Changes pushed to GitHub"
else
    echo "✅ No changes to commit"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. 🚂 Deploy Backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Sign up with GitHub"
echo "   - Create new project"
echo "   - Deploy from GitHub repo"
echo "   - Set root directory to 'server'"
echo "   - Add PostgreSQL database"
echo "   - Set environment variables:"
echo "     * JWT_SECRET=your-super-secret-jwt-key-here"
echo "     * NODE_ENV=production"
echo ""
echo "2. 🌐 Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Sign up with GitHub"
echo "   - Import your repository"
echo "   - Set root directory to 'client'"
echo "   - Add environment variable:"
echo "     * NEXT_PUBLIC_API_URL=https://your-railway-app-url.railway.app"
echo ""
echo "3. 🔧 Final Configuration:"
echo "   - Update CORS settings in server/src/app.js"
echo "   - Test your deployment"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎉 Your Lookly app will be live at: https://your-vercel-domain.vercel.app"
