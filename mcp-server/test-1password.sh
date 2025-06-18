#!/bin/bash

# Test script for 1Password MCP integration
# Tests all 1Password tools in the MCP server

set -e

echo "🔐 Testing 1Password MCP Integration"
echo "===================================="

# Function to test MCP tool
test_mcp_tool() {
    local tool_name="$1"
    local args="$2"
    echo "Testing: $tool_name"
    
    local request="{\"jsonrpc\": \"2.0\", \"method\": \"tools/call\", \"params\": {\"name\": \"$tool_name\", \"arguments\": $args}, \"id\": 1}"
    echo "$request" | node src/index.js | jq '.' || echo "❌ Failed to call $tool_name"
    echo ""
}

# Check if 1Password CLI is available
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI not found. Please install it first."
    echo "   macOS: brew install --cask 1password-cli"
    echo "   https://developer.1password.com/docs/cli/get-started/"
    exit 1
fi

# Check if signed in
if ! op account list &> /dev/null; then
    echo "❌ Not signed in to 1Password. Please run: op signin"
    exit 1
fi

echo "✅ 1Password CLI is available and signed in"
echo ""

# Test 1: Check session
echo "1. Testing session check..."
test_mcp_tool "op_check_session" "{}"

# Test 2: List vaults
echo "2. Testing vault listing..."
test_mcp_tool "op_list_vaults" "{}"

# Test 3: List items in Development Credentials vault
echo "3. Testing vault items listing..."
test_mcp_tool "op_list_vault_items" "{\"vault\": \"Development Credentials\"}"

# Test 4: Generate environment template
echo "4. Testing environment template generation..."
test_mcp_tool "op_generate_env_template" "{\"vault\": \"Development Credentials\"}"

# Test 5: Discover project variables
echo "5. Testing project variable discovery..."
test_mcp_tool "op_discover_project_vars" "{}"

# Test 6: Create environment mapping
echo "6. Testing environment mapping creation..."
test_mcp_tool "op_create_env_mapping" "{\"vault\": \"Development Credentials\"}"

echo "🎉 1Password MCP integration tests completed!"
echo ""
echo "Next steps:"
echo "1. Add this MCP server to Claude Desktop configuration"
echo "2. Test the integration with Claude"
echo "3. Use the tools to manage your development environment"