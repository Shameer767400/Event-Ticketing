#!/bin/bash

# Deployment Pre-flight Checklist Script
# Run this before deploying to catch common issues

echo "🚀 Event Ticketing App - Deployment Pre-flight Check"
echo "=================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((CHECKS_FAILED++))
    fi
}

# 1. Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 16 ]; then
    check "Node.js version is v$NODE_VERSION (>= 16 required)"
else
    false
    check "Node.js version check (v16+ required, found v$NODE_VERSION)"
fi

# 2. Check if git is initialized
echo "Checking Git repository..."
if [ -d .git ]; then
    check "Git repository initialized"
else
    false
    check "Git repository initialized (run: git init)"
fi

# 3. Check for .gitignore
echo "Checking .gitignore..."
if [ -f .gitignore ]; then
    check ".gitignore file exists"
else
    false
    check ".gitignore file exists"
fi

# 4. Check backend dependencies
echo "Checking backend dependencies..."
if [ -f backend/package.json ]; then
    cd backend
    if [ -d node_modules ]; then
        check "Backend dependencies installed"
    else
        echo -e "${YELLOW}⚠${NC} Backend dependencies not installed (run: cd backend && npm install)"
    fi
    cd ..
else
    false
    check "Backend package.json exists"
fi

# 5. Check frontend dependencies
echo "Checking frontend dependencies..."
if [ -f frontend/package.json ]; then
    cd frontend
    if [ -d node_modules ]; then
        check "Frontend dependencies installed"
    else
        echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed (run: cd frontend && npm install)"
    fi
    cd ..
else
    false
    check "Frontend package.json exists"
fi

# 6. Check for .env files in git
echo "Checking for sensitive files..."
if git ls-files | grep -q "\.env$"; then
    false
    check ".env files NOT in git (found .env in git - remove it!)"
else
    check ".env files NOT in git"
fi

# 7. Check for example env files
echo "Checking environment templates..."
if [ -f backend/.env.example ]; then
    check "Backend .env.example exists"
else
    false
    check "Backend .env.example exists"
fi

if [ -f frontend/.env.example ]; then
    check "Frontend .env.example exists"
else
    false
    check "Frontend .env.example exists"
fi

# 8. Check deployment config files
echo "Checking deployment configurations..."
if [ -f render.yaml ]; then
    check "render.yaml exists"
else
    false
    check "render.yaml exists"
fi

if [ -f frontend/vercel.json ]; then
    check "vercel.json exists"
else
    false
    check "vercel.json exists"
fi

# 9. Check for DEPLOYMENT.md
echo "Checking documentation..."
if [ -f DEPLOYMENT.md ]; then
    check "DEPLOYMENT.md exists"
else
    false
    check "DEPLOYMENT.md exists"
fi

# 10. Check if code compiles
echo "Checking if backend code is valid..."
cd backend
if node -c server.js 2>/dev/null; then
    check "Backend server.js syntax is valid"
else
    false
    check "Backend server.js syntax is valid"
fi
cd ..

echo ""
echo "=================================================="
echo -e "Checks passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Checks failed: ${RED}$CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Commit your changes: git add . && git commit -m 'Ready for deployment'"
    echo "2. Push to GitHub: git push"
    echo "3. Follow DEPLOYMENT.md for platform-specific instructions"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please fix the issues above before deploying.${NC}"
    exit 1
fi
