#!/bin/bash

# Verification script for MCP server functionality
# Tests both project tools and 1Password integration

set -e

echo "🔍 Verifying MCP Server Functionality"
echo "====================================="

# Function to send JSON-RPC request
send_request() {
    local method="$1"
    local params="$2"
    local request="{\"jsonrpc\": \"2.0\", \"method\": \"$method\", \"params\": $params, \"id\": 1}"
    echo "$request" | node src/index.js
}

# Test 1: List all available tools
echo "1. Listing all available tools..."
echo "================================"
send_request "tools/list" "{}" | jq '.result.tools[] | {name: .name, description: .description}' 2>/dev/null || {
    echo "❌ Failed to list tools"
    exit 1
}
echo ""

# Test 2: Test project info tool
echo "2. Testing project info tool..."
echo "==============================="
send_request "tools/call" "{\"name\": \"get_project_info\", \"arguments\": {\"section\": \"architecture\"}}" | jq '.result' 2>/dev/null || {
    echo "❌ Failed to get project info"
    exit 1
}
echo ""

# Test 3: Test codebase analysis
echo "3. Testing codebase analysis..."
echo "==============================="
send_request "tools/call" "{\"name\": \"analyze_codebase\", \"arguments\": {\"type\": \"components\"}}" | jq '.result' 2>/dev/null || {
    echo "❌ Failed to analyze codebase"
    exit 1
}
echo ""

# Test 4: Test development context
echo "4. Testing development context..."
echo "================================="
send_request "tools/call" "{\"name\": \"get_development_context\", \"arguments\": {}}" | jq '.result' 2>/dev/null || {
    echo "❌ Failed to get development context"
    exit 1
}
echo ""

# Test 5: Check if 1Password tools are available
echo "5. Checking 1Password tools availability..."
echo "==========================================="
tools_list=$(send_request "tools/list" "{}" | jq -r '.result.tools[] | select(.name | startswith("op_")) | .name' 2>/dev/null)

if [ -z "$tools_list" ]; then
    echo "❌ No 1Password tools found"
    exit 1
else
    echo "✅ Found 1Password tools:"
    echo "$tools_list" | while read -r tool; do
        echo "  - $tool"
    done
fi
echo ""

# Test 6: Test 1Password session check (if available)
echo "6. Testing 1Password session..."
echo "==============================="
if command -v op &> /dev/null; then
    send_request "tools/call" "{\"name\": \"op_check_session\", \"arguments\": {}}" | jq '.result' 2>/dev/null || {
        echo "⚠️  1Password session check failed (expected if not signed in)"
    }
else
    echo "⚠️  1Password CLI not available (expected in some environments)"
fi
echo ""

echo "✅ MCP Server verification completed successfully!"
echo ""
echo "Server capabilities:"
echo "  ✅ Project analysis tools"
echo "  ✅ Codebase exploration"  
echo "  ✅ Development context"
echo "  ✅ 1Password integration"
echo ""
echo "Ready for Claude Desktop integration!"