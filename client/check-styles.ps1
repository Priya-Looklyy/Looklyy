# Tailwind Health Check Script for Next.js Frontend (PowerShell)
# This script ensures Tailwind CSS is working correctly before deployment

param(
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

Write-Host "🎨 Starting Tailwind Health Check..." -ForegroundColor Cyan

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Step 1: Clean and build the application
Write-Status "Step 1: Building Next.js application..."
try {
    npm run build
    Write-Success "Build completed successfully"
} catch {
    Write-Error "Build failed! Exiting..."
    exit 1
}

# Step 2: Start the application in background
Write-Status "Step 2: Starting Next.js server..."
$PORT = 3001

# Start the server process
$serverProcess = Start-Process -FilePath "npm" -ArgumentList "start", "--", "-p", $PORT -PassThru -WindowStyle Hidden

# Wait for server to start
Write-Status "Waiting for server to start..."
Start-Sleep -Seconds 10

# Check if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:$PORT" -UseBasicParsing -TimeoutSec 5
    Write-Success "Server started successfully on port $PORT"
} catch {
    Write-Error "Server failed to start on port $PORT"
    if ($serverProcess) { Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue }
    exit 1
}

# Step 3: Fetch the homepage
Write-Status "Step 3: Fetching homepage..."
try {
    $homepageContent = Invoke-WebRequest -Uri "http://localhost:$PORT" -UseBasicParsing | Select-Object -ExpandProperty Content
    Write-Success "Homepage fetched successfully"
} catch {
    Write-Error "Failed to fetch homepage content"
    if ($serverProcess) { Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue }
    exit 1
}

# Step 4: Check for Tailwind classes
Write-Status "Step 4: Checking for Tailwind CSS classes..."

$tailwindPatterns = @(
    "bg-",
    "text-",
    "border-",
    "rounded-",
    "shadow-",
    "flex",
    "grid",
    "p-",
    "m-",
    "w-",
    "h-",
    "min-h-",
    "max-w-",
    "transition-",
    "hover:",
    "focus:",
    "transform",
    "scale-",
    "translate-"
)

$foundClasses = @()
$missingClasses = @()

foreach ($pattern in $tailwindPatterns) {
    if ($homepageContent -match $pattern) {
        $foundClasses += $pattern
    } else {
        $missingClasses += $pattern
    }
}

# Step 5: Check for custom CSS classes
Write-Status "Step 5: Checking for custom CSS classes..."
$customClasses = @(
    "auth-container",
    "auth-box",
    "auth-form",
    "auth-content",
    "form-group",
    "auth-button",
    "auth-overlay",
    "overlay-panel",
    "logo-section",
    "logo",
    "tagline"
)

foreach ($class in $customClasses) {
    if ($homepageContent -match "class.*$class") {
        $foundClasses += $class
    } else {
        $missingClasses += $class
    }
}

# Step 6: Check for CSS file inclusion
Write-Status "Step 6: Checking for CSS file inclusion..."
if ($homepageContent -match "\.css|stylesheet") {
    Write-Success "CSS files are being included"
} else {
    Write-Warning "No CSS file inclusion detected"
}

# Step 7: Report results
Write-Host ""
Write-Host "📊 Tailwind Health Check Results:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

if ($foundClasses.Count -gt 0) {
    Write-Success "Found $($foundClasses.Count) class patterns:"
    foreach ($class in $foundClasses) {
        Write-Host "  ✅ $class" -ForegroundColor Green
    }
}

if ($missingClasses.Count -gt 0) {
    Write-Warning "Missing $($missingClasses.Count) class patterns:"
    foreach ($class in $missingClasses) {
        Write-Host "  ⚠️  $class" -ForegroundColor Yellow
    }
}

# Step 8: Check for critical styling indicators
Write-Status "Step 7: Checking for critical styling indicators..."

$criticalIssues = 0

# Check if page looks unstyled (basic HTML)
if ($homepageContent -match "<input.*type=") {
    if ($homepageContent -notmatch "class.*bg-|class.*text-|class.*border-") {
        Write-Error "Input fields found but no Tailwind classes detected - page may be unstyled!"
        $criticalIssues++
    }
}

# Check for basic form elements without styling
if ($homepageContent -match "<button") {
    if ($homepageContent -notmatch "class.*bg-|class.*text-") {
        Write-Error "Buttons found but no Tailwind classes detected - page may be unstyled!"
        $criticalIssues++
    }
}

# Check for our custom classes
if ($homepageContent -notmatch "auth-container") {
    Write-Error "Custom auth-container class not found - AuthForm may not be rendering!"
    $criticalIssues++
}

# Step 9: Final assessment
Write-Host ""
if ($criticalIssues -eq 0) {
    Write-Success "🎉 Tailwind Health Check PASSED!"
    Write-Success "Your styles are working correctly!"
    $exitCode = 0
} else {
    Write-Error "❌ Tailwind Health Check FAILED!"
    Write-Error "Found $criticalIssues critical issues"
    Write-Error "Please fix styling issues before deployment"
    $exitCode = 1
}

# Cleanup
Write-Status "Cleaning up..."
if ($serverProcess) {
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "🏁 Health check completed with exit code: $exitCode" -ForegroundColor Cyan
exit $exitCode
