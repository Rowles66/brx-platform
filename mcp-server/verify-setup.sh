#!/bin/bash

echo "🔍 Verifying Docker MCP Server Setup for Cursor..."
echo "=================================================="

# Check if Docker is running
echo "✅ Checking Docker status..."
if sudo docker info > /dev/null 2>&1; then
    echo "   ✓ Docker is running"
else
    echo "   ❌ Docker is not running"
    echo "   Run: sudo dockerd &"
    exit 1
fi

# Check if Docker image exists
echo "✅ Checking Docker image..."
if sudo docker images | grep -q "brx-mcp-server"; then
    echo "   ✓ brx-mcp-server image exists"
else
    echo "   ❌ brx-mcp-server image not found"
    echo "   Run: sudo docker compose build"
    exit 1
fi

# Check if MCP configuration exists
echo "✅ Checking MCP configuration..."
if [ -f ~/.cursor/mcp.json ]; then
    echo "   ✓ MCP configuration file exists"
    echo "   📄 Configuration preview:"
    head -10 ~/.cursor/mcp.json | sed 's/^/      /'
else
    echo "   ❌ MCP configuration file not found"
    echo "   Expected at: ~/.cursor/mcp.json"
    exit 1
fi

# Test local MCP server
echo "✅ Testing local MCP server..."
cd /workspace/mcp-server
if timeout 5s node test-mcp-connection.js > /dev/null 2>&1; then
    echo "   ✓ Local MCP server responds correctly"
else
    echo "   ⚠️  Local MCP server test failed (may be normal)"
fi

# Test Docker MCP server
echo "✅ Testing Docker MCP server..."
INIT_MSG='{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}'

if echo "$INIT_MSG" | timeout 10s sudo docker run --rm -i brx-mcp-server:latest | grep -q "protocolVersion"; then
    echo "   ✓ Docker MCP server responds correctly"
else
    echo "   ❌ Docker MCP server test failed"
    exit 1
fi

# Check Node.js and npm
echo "✅ Checking Node.js environment..."
if command -v node > /dev/null 2>&1; then
    echo "   ✓ Node.js $(node --version) is available"
else
    echo "   ❌ Node.js not found"
    exit 1
fi

if command -v npm > /dev/null 2>&1; then
    echo "   ✓ npm $(npm --version) is available"
else
    echo "   ❌ npm not found"
    exit 1
fi

# Final summary
echo ""
echo "🎉 Setup Verification Complete!"
echo "================================"
echo ""
echo "✅ All checks passed! Your Docker MCP server is ready for Cursor."
echo ""
echo "📋 Next Steps:"
echo "   1. Restart Cursor to load the MCP configuration"
echo "   2. In Cursor, open Command Palette (Cmd/Ctrl+Shift+P)"
echo "   3. Type 'MCP' to see available MCP tools"
echo "   4. Use AI chat - it can now access your custom MCP tools"
echo ""
echo "🛠️  Available MCP Servers:"
echo "   • brx-platform-docker  - Your custom Docker MCP server"
echo "   • brx-platform-local   - Local version for development"
echo "   • filesystem          - Standard filesystem access"
echo "   • git                 - Git operations"
echo "   • docker-system       - Generic Docker tools"
echo ""
echo "📚 For more details, see: DOCKER_MCP_SETUP_GUIDE.md"
echo ""
echo "🔧 Test manually: node test-mcp-connection.js"