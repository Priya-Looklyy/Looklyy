#!/bin/bash

# Tailwind Health Check Script for Next.js Frontend
# This script ensures Tailwind CSS is working correctly before deployment

set -e  # Exit on any error

echo "🎨 Starting Tailwind Health Check..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Clean and build the application
print_status "Step 1: Building Next.js application..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed! Exiting..."
    exit 1
fi

# Step 2: Start the application in background
print_status "Step 2: Starting Next.js server..."
PORT=3001
npm start -- -p $PORT &
SERVER_PID=$!

# Wait for server to start
print_status "Waiting for server to start..."
sleep 10

# Check if server is running
if ! curl -s http://localhost:$PORT > /dev/null; then
    print_error "Server failed to start on port $PORT"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

print_success "Server started successfully on port $PORT"

# Step 3: Fetch the homepage
print_status "Step 3: Fetching homepage..."
HOMEPAGE_CONTENT=$(curl -s http://localhost:$PORT)

if [ -z "$HOMEPAGE_CONTENT" ]; then
    print_error "Failed to fetch homepage content"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

print_success "Homepage fetched successfully"

# Step 4: Check for Tailwind classes
print_status "Step 4: Checking for Tailwind CSS classes..."

# Define Tailwind class patterns to check for
TAILWIND_PATTERNS=(
    "bg-"
    "text-"
    "border-"
    "rounded-"
    "shadow-"
    "flex"
    "grid"
    "p-"
    "m-"
    "w-"
    "h-"
    "min-h-"
    "max-w-"
    "transition-"
    "hover:"
    "focus:"
    "transform"
    "scale-"
    "translate-"
)

# Check for each pattern
MISSING_CLASSES=()
FOUND_CLASSES=()

for pattern in "${TAILWIND_PATTERNS[@]}"; do
    if echo "$HOMEPAGE_CONTENT" | grep -q "$pattern"; then
        FOUND_CLASSES+=("$pattern")
    else
        MISSING_CLASSES+=("$pattern")
    fi
done

# Step 5: Check for custom CSS classes (our AuthForm classes)
print_status "Step 5: Checking for custom CSS classes..."
CUSTOM_CLASSES=(
    "auth-container"
    "auth-box"
    "auth-form"
    "auth-content"
    "form-group"
    "auth-button"
    "auth-overlay"
    "overlay-panel"
    "logo-section"
    "logo"
    "tagline"
)

for class in "${CUSTOM_CLASSES[@]}"; do
    if echo "$HOMEPAGE_CONTENT" | grep -q "class.*$class"; then
        FOUND_CLASSES+=("$class")
    else
        MISSING_CLASSES+=("$class")
    fi
done

# Step 6: Check for CSS file inclusion
print_status "Step 6: Checking for CSS file inclusion..."
if echo "$HOMEPAGE_CONTENT" | grep -q "\.css\|stylesheet"; then
    print_success "CSS files are being included"
else
    print_warning "No CSS file inclusion detected"
fi

# Step 7: Report results
echo ""
echo "📊 Tailwind Health Check Results:"
echo "=================================="

if [ ${#FOUND_CLASSES[@]} -gt 0 ]; then
    print_success "Found ${#FOUND_CLASSES[@]} class patterns:"
    for class in "${FOUND_CLASSES[@]}"; do
        echo "  ✅ $class"
    done
fi

if [ ${#MISSING_CLASSES[@]} -gt 0 ]; then
    print_warning "Missing ${#MISSING_CLASSES[@]} class patterns:"
    for class in "${MISSING_CLASSES[@]}"; do
        echo "  ⚠️  $class"
    done
fi

# Step 8: Check for critical styling indicators
print_status "Step 7: Checking for critical styling indicators..."

CRITICAL_ISSUES=0

# Check if page looks unstyled (basic HTML)
if echo "$HOMEPAGE_CONTENT" | grep -q "<input.*type="; then
    if ! echo "$HOMEPAGE_CONTENT" | grep -q "class.*bg-\|class.*text-\|class.*border-"; then
        print_error "Input fields found but no Tailwind classes detected - page may be unstyled!"
        CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
    fi
fi

# Check for basic form elements without styling
if echo "$HOMEPAGE_CONTENT" | grep -q "<button"; then
    if ! echo "$HOMEPAGE_CONTENT" | grep -q "class.*bg-\|class.*text-"; then
        print_error "Buttons found but no Tailwind classes detected - page may be unstyled!"
        CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
    fi
fi

# Check for our custom classes
if ! echo "$HOMEPAGE_CONTENT" | grep -q "auth-container"; then
    print_error "Custom auth-container class not found - AuthForm may not be rendering!"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
fi

# Step 9: Final assessment
echo ""
if [ $CRITICAL_ISSUES -eq 0 ]; then
    print_success "🎉 Tailwind Health Check PASSED!"
    print_success "Your styles are working correctly!"
    EXIT_CODE=0
else
    print_error "❌ Tailwind Health Check FAILED!"
    print_error "Found $CRITICAL_ISSUES critical issues"
    print_error "Please fix styling issues before deployment"
    EXIT_CODE=1
fi

# Cleanup
print_status "Cleaning up..."
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "🏁 Health check completed with exit code: $EXIT_CODE"
exit $EXIT_CODE
