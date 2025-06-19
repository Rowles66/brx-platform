#!/bin/bash

echo "Testing Hyperbrowser through Docker MCP..."
echo ""

# Test 1: Check if Docker credentials are working
echo "1. Testing Docker credentials..."
if docker pull hello-world > /dev/null 2>&1; then
    echo "✅ Docker credentials working"
else
    echo "❌ Docker credentials not working"
    echo "   Run: ./scripts/fix-docker-credentials.sh"
    exit 1
fi

# Test 2: Test Hyperbrowser navigation
echo ""
echo "2. Testing Hyperbrowser navigation..."
echo "Attempting to navigate to BRX site..."

# This will use the MCP Docker tools if available in Claude
echo "Ready to test Hyperbrowser in Claude Desktop!"
echo ""
echo "Try these commands in Claude:"
echo "1. Navigate to https://online.brxperformance.com"
echo "2. Take a screenshot of the login page"
echo "3. Extract the page structure"
echo ""
echo "If Hyperbrowser works, you'll be able to:"
echo "- See the full Rails app structure"
echo "- Identify all API endpoints"
echo "- Extract form fields and authentication flow"
echo "- Discover hidden JavaScript configurations" 
