#!/bin/bash

# Start MCP server with 1Password integration
# Handles session management and Docker integration

set -e

echo "🚀 Starting BRX MCP Server with 1Password Integration"
echo "====================================================="

# Check prerequisites
echo "Checking prerequisites..."

# Check if 1Password CLI is available
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI not found"
    echo "   Please install: brew install --cask 1password-cli"
    echo "   Or visit: https://developer.1password.com/docs/cli/get-started/"
    exit 1
fi

echo "✅ 1Password CLI found: $(op --version)"

# Check if signed in (optional - will work without signin but with limited functionality)
if op account list &> /dev/null; then
    echo "✅ Signed in to 1Password"
    export OP_SESSION_STATUS="active"
else
    echo "⚠️  Not signed in to 1Password (some features will be limited)"
    echo "   To enable full functionality, run: op signin"
    export OP_SESSION_STATUS="inactive"
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18 or later."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies ready"
echo ""

# Choose run mode
echo "Choose how to run the MCP server:"
echo "1) Local (recommended for development)"
echo "2) Docker (consistent environment)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🏃 Starting MCP server locally..."
        echo "Press Ctrl+C to stop"
        echo ""
        echo "To connect to Claude Desktop, add this to your configuration:"
        echo ""
        echo "{"
        echo "  \"mcpServers\": {"
        echo "    \"brx-platform\": {"
        echo "      \"command\": \"node\","
        echo "      \"args\": [\"$(pwd)/src/index.js\"],"
        echo "      \"env\": {"
        echo "        \"NODE_ENV\": \"development\""
        echo "      }"
        echo "    }"
        echo "  }"
        echo "}"
        echo ""
        echo "Starting server..."
        node src/index.js
        ;;
    2)
        echo ""
        echo "🐳 Starting MCP server in Docker..."
        
        # Export current 1Password session if available
        if [ "$OP_SESSION_STATUS" = "active" ]; then
            export OP_SESSION=$(op signin --raw 2>/dev/null || echo "")
        fi
        
        echo "Building Docker image..."
        docker-compose build
        
        echo "Starting container..."
        echo "Press Ctrl+C to stop"
        echo ""
        echo "To connect to Claude Desktop, add this to your configuration:"
        echo ""
        echo "{"
        echo "  \"mcpServers\": {"
        echo "    \"brx-platform\": {"
        echo "      \"command\": \"docker\","
        echo "      \"args\": ["
        echo "        \"compose\","
        echo "        \"-f\","
        echo "        \"$(pwd)/docker-compose.yml\","
        echo "        \"run\","
        echo "        \"--rm\","
        echo "        \"-i\","
        echo "        \"brx-mcp-server\""
        echo "      ],"
        echo "      \"env\": {"
        echo "        \"NODE_ENV\": \"development\""
        echo "      }"
        echo "    }"
        echo "  }"
        echo "}"
        echo ""
        docker-compose up brx-mcp-server
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac