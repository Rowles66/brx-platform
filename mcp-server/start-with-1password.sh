#!/bin/bash

# Start MCP Server with 1Password Integration

echo "🔐 Starting BRX MCP Server with 1Password..."
echo "==========================================="

# Check if 1Password CLI is installed
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI not installed on host"
    echo "Please install: brew install 1password-cli"
    exit 1
fi

# Check if signed in
if ! op account list &> /dev/null 2>&1; then
    echo "❌ Not signed in to 1Password"
    echo "Please run: eval \$(op signin)"
    exit 1
fi

# Get session info
SESSION_VAR=$(env | grep "^OP_SESSION_" | head -1)
if [ -z "$SESSION_VAR" ]; then
    echo "❌ No active 1Password session"
    echo "Please run: eval \$(op signin)"
    exit 1
fi

# Extract account name from session variable
ACCOUNT_NAME=$(echo "$SESSION_VAR" | cut -d'=' -f1 | sed 's/OP_SESSION_//')
echo "✅ Found 1Password session for account: $ACCOUNT_NAME"

# Build the image if needed
echo ""
echo "📦 Building Docker image..."
docker build -t brx-mcp-server . || {
    echo "❌ Failed to build Docker image"
    exit 1
}

# Start the server with 1Password session
echo ""
echo "🚀 Starting MCP server with 1Password access..."
echo "Session will be passed to container automatically"
echo ""

# Export the session and account for docker-compose
export $SESSION_VAR
export OP_ACCOUNT=$ACCOUNT_NAME

# Run docker-compose
docker-compose up

echo ""
echo "MCP server stopped."