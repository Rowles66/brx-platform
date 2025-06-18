#!/bin/bash
# Quick verification script for 1Password MCP integration

echo "🔍 Checking 1Password MCP Integration..."
echo "======================================="

CHECKS_PASSED=0
TOTAL_CHECKS=4

# 1. Check CLI
echo -n "1Password CLI: "
if command -v op &>/dev/null; then
    echo "✅ Installed ($(op --version))"
    ((CHECKS_PASSED++))
else
    echo "❌ Not installed - Run: brew install 1password-cli"
fi

# 2. Check session
echo -n "1Password Auth: "
if op account list &>/dev/null 2>&1; then
    ACCOUNT=$(op account list --format json | jq -r '.[0].email' 2>/dev/null || echo "account")
    echo "✅ Signed in ($ACCOUNT)"
    ((CHECKS_PASSED++))
else
    echo "❌ Not signed in - Run: eval \$(op signin)"
fi

# 3. Check Docker image
echo -n "Docker Image: "
if docker images | grep -q brx-mcp-server; then
    echo "✅ Built"
    ((CHECKS_PASSED++))
else
    echo "❌ Not built - Run: docker build -t brx-mcp-server ."
fi

# 4. Check Claude config
echo -n "Claude Config: "
CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ -f "$CONFIG_FILE" ] && grep -q "brx-1password" "$CONFIG_FILE" 2>/dev/null; then
    echo "✅ Updated"
    ((CHECKS_PASSED++))
else
    echo "❌ Not updated - See TEST_1PASSWORD_INTEGRATION.md"
fi

# Summary
echo ""
echo "======================================="
echo "Result: $CHECKS_PASSED/$TOTAL_CHECKS checks passed"
echo ""

if [ $CHECKS_PASSED -eq $TOTAL_CHECKS ]; then
    echo "🎉 All checks passed! Your 1Password MCP is ready."
    echo ""
    echo "Test in Claude Desktop by asking:"
    echo "  'Search my 1Password for API keys'"
else
    echo "⚠️  Some checks failed. Fix the issues above and run again."
fi