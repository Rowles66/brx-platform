#!/bin/bash
# Bridge script to connect Docker MCP server to Claude Desktop

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Check if Docker image exists
if ! docker images | grep -q "brx-mcp-server"; then
    echo "Building BRX MCP Server image..." >&2
    docker build -t brx-mcp-server . >&2
fi

# Get 1Password session from host environment
SESSION_VAR=$(env | grep "^OP_SESSION_" | head -1)

if [ -n "$SESSION_VAR" ]; then
    echo "Running MCP server with 1Password access..." >&2
    # Run with 1Password session
    docker run -i --rm \
        -v $(pwd)/../:/workspace:ro \
        -e NODE_ENV=development \
        -e $SESSION_VAR \
        brx-mcp-server
else
    echo "Running MCP server without 1Password (limited functionality)..." >&2
    # Run without 1Password - only BRX tools will work
    docker run -i --rm \
        -v $(pwd)/../:/workspace:ro \
        -e NODE_ENV=development \
        brx-mcp-server
fi