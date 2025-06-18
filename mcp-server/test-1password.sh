#!/bin/bash

# Test script for 1Password MCP integration

echo "🧪 Testing 1Password MCP Integration"
echo "===================================="

# Check if 1Password CLI is installed
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI not installed"
    echo "   Run: brew install 1password-cli"
    exit 1
fi

# Check if signed in
echo ""
echo "1️⃣ Checking 1Password authentication..."
if op account list &> /dev/null 2>&1; then
    echo "✅ Signed in to 1Password"
    ACCOUNT=$(op account list --format json | jq -r '.[0].email' 2>/dev/null || echo "unknown")
    echo "   Account: $ACCOUNT"
else
    echo "❌ Not signed in to 1Password"
    echo "   Run: eval \$(op signin)"
    exit 1
fi

# Check Docker
echo ""
echo "2️⃣ Checking Docker..."
if docker info &> /dev/null; then
    echo "✅ Docker is running"
else
    echo "❌ Docker is not running"
    echo "   Start Docker Desktop"
    exit 1
fi

# Check MCP server image
echo ""
echo "3️⃣ Checking MCP server image..."
if docker images | grep -q "brx-mcp-server"; then
    echo "✅ MCP server image exists"
else
    echo "⚠️  MCP server image not found"
    echo "   Building image..."
    docker build -t brx-mcp-server . || exit 1
fi

# Test 1Password in container
echo ""
echo "4️⃣ Testing 1Password in container..."
SESSION_VAR=$(env | grep "^OP_SESSION_" | head -1)
if [ -n "$SESSION_VAR" ]; then
    echo "✅ Found session: ${SESSION_VAR%%=*}"
    
    # Test op command in container
    docker run --rm -e $SESSION_VAR brx-mcp-server sh -c "op --version" &> /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ 1Password CLI works in container"
    else
        echo "⚠️  1Password CLI in container needs setup"
    fi
else
    echo "⚠️  No active session found"
fi

echo ""
echo "5️⃣ Test Results:"
echo "=================="
echo "✅ Host 1Password: Working"
echo "✅ Docker: Running"
echo "✅ MCP Image: Built"
if [ -n "$SESSION_VAR" ]; then
    echo "✅ Session: Available"
    echo ""
    echo "🎉 Ready to use 1Password MCP!"
    echo ""
    echo "Next steps:"
    echo "1. Update Claude Desktop config (see CLAUDE_DESKTOP_INTEGRATION.md)"
    echo "2. Restart Claude Desktop"
    echo "3. Test by asking: 'Search my 1Password for API keys'"
else
    echo "⚠️  Session: Not available"
    echo ""
    echo "To complete setup:"
    echo "1. Run: eval \$(op signin)"
    echo "2. Run this test again"
fi