#!/bin/bash

# Test script to validate FireCrawl setup
# This script checks if all required components are properly configured

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() {
    echo -e "${GREEN}✓${NC} $1"
}

fail() {
    echo -e "${RED}✗${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "Testing FireCrawl Setup..."
echo "========================="

# Check if scripts exist and are executable
echo "\nChecking scripts:"
if [ -f "$SCRIPT_DIR/extract_with_firecrawl.py" ] && [ -x "$SCRIPT_DIR/extract_with_firecrawl.py" ]; then
    pass "extract_with_firecrawl.py exists and is executable"
else
    fail "extract_with_firecrawl.py missing or not executable"
fi

if [ -f "$SCRIPT_DIR/run-nightly-firecrawl.sh" ] && [ -x "$SCRIPT_DIR/run-nightly-firecrawl.sh" ]; then
    pass "run-nightly-firecrawl.sh exists and is executable"
else
    fail "run-nightly-firecrawl.sh missing or not executable"
fi

if [ -f "$SCRIPT_DIR/requirements.txt" ]; then
    pass "requirements.txt exists"
else
    fail "requirements.txt missing"
fi

# Check Python environment
echo "\nChecking Python environment:"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    pass "Python 3 available: $PYTHON_VERSION"
else
    fail "Python 3 not found"
fi

# Check for required Python packages
echo "\nChecking Python dependencies:"
if python3 -c "import requests" 2>/dev/null; then
    pass "requests package available"
else
    warn "requests package not found - install with: pip install requests"
fi

if python3 -c "import json" 2>/dev/null; then
    pass "json package available (built-in)"
else
    fail "json package not available"
fi

# Check 1Password CLI
echo "\nChecking 1Password CLI:"
if command -v op &> /dev/null; then
    OP_VERSION=$(op --version 2>&1)
    pass "1Password CLI available: $OP_VERSION"
    
    # Check authentication
    if op account list &> /dev/null; then
        pass "1Password CLI authenticated"
    else
        warn "1Password CLI not authenticated - run: op signin"
    fi
else
    fail "1Password CLI not found - install from: https://1password.com/downloads/command-line/"
fi

# Check Git repository
echo "\nChecking Git repository:"
cd "$PROJECT_ROOT"
if git rev-parse --git-dir > /dev/null 2>&1; then
    pass "Git repository detected"
    
    if git remote get-url origin &> /dev/null; then
        ORIGIN_URL=$(git remote get-url origin)
        pass "Git remote origin configured: $ORIGIN_URL"
    else
        warn "Git remote origin not configured"
    fi
else
    fail "Not in a Git repository"
fi

# Check directory structure
echo "\nChecking directory structure:"
if [ -d "$PROJECT_ROOT/frontend_sources" ]; then
    pass "frontend_sources directory exists"
else
    warn "frontend_sources directory missing - will be created automatically"
fi

if [ -d "$PROJECT_ROOT/frontend_sources/firecrawl" ]; then
    pass "frontend_sources/firecrawl directory exists"
else
    warn "frontend_sources/firecrawl directory missing - will be created automatically"
fi

# Check GitHub Actions workflow
echo "\nChecking GitHub Actions:"
if [ -f "$PROJECT_ROOT/.github/workflows/nightly-firecrawl.yml" ]; then
    pass "GitHub Actions workflow exists"
else
    fail "GitHub Actions workflow missing"
fi

if [ -d "$PROJECT_ROOT/.github/workflows" ]; then
    WORKFLOW_COUNT=$(find "$PROJECT_ROOT/.github/workflows" -name "*.yml" -o -name "*.yaml" | wc -l)
    pass "Found $WORKFLOW_COUNT workflow files"
else
    warn ".github/workflows directory missing"
fi

# Test script syntax
echo "\nTesting script syntax:"
if bash -n "$SCRIPT_DIR/run-nightly-firecrawl.sh"; then
    pass "run-nightly-firecrawl.sh syntax is valid"
else
    fail "run-nightly-firecrawl.sh has syntax errors"
fi

if python3 -m py_compile "$SCRIPT_DIR/extract_with_firecrawl.py"; then
    pass "extract_with_firecrawl.py syntax is valid"
else
    fail "extract_with_firecrawl.py has syntax errors"
fi

echo "\n========================="
echo "Setup validation complete!"
echo "\nNext steps:"
echo "1. Configure FIRECRAWL_API_KEY in 1Password"
echo "2. Set up OP_SERVICE_ACCOUNT_TOKEN in GitHub Secrets"
echo "3. (Optional) Set up SLACK_WEBHOOK_URL in GitHub Variables"
echo "4. Test the workflow manually in GitHub Actions"
echo "\nTo run the script manually:"
echo "  ./scripts/run-nightly-firecrawl.sh"
echo "\nTo test with a specific date:"
echo "  ./scripts/run-nightly-firecrawl.sh --date 2024-01-15"

