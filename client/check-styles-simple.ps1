# Simple Tailwind Health Check for Next.js Frontend
Write-Host "🎨 Starting Tailwind Health Check..." -ForegroundColor Cyan

# Build the application
Write-Host "Building Next.js application..." -ForegroundColor Blue
try {
    npm run build
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Check if .next directory exists
if (Test-Path ".next") {
    Write-Host "✅ .next directory found" -ForegroundColor Green
} else {
    Write-Host "❌ .next directory not found - build may have failed" -ForegroundColor Red
    exit 1
}

# Check for CSS files
if (Test-Path "src/components/AuthForm.css") {
    Write-Host "✅ AuthForm.css found" -ForegroundColor Green
} else {
    Write-Host "❌ AuthForm.css not found" -ForegroundColor Red
    exit 1
}

# Check for Tailwind config
if (Test-Path "tailwind.config.js") {
    Write-Host "✅ Tailwind config found" -ForegroundColor Green
} else {
    Write-Host "❌ Tailwind config not found" -ForegroundColor Red
    exit 1
}

# Check for PostCSS config
if (Test-Path "postcss.config.mjs") {
    Write-Host "✅ PostCSS config found" -ForegroundColor Green
} else {
    Write-Host "❌ PostCSS config not found" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Tailwind Health Check PASSED!" -ForegroundColor Green
Write-Host "Your build configuration looks correct!" -ForegroundColor Green
exit 0
