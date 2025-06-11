#!/bin/bash
# Bridge script to connect Docker MCP server to Claude Desktop

# Build the image if needed
if ! docker images | grep -q "mcp-server-mcp-server"; then
    echo "Building Docker image..." >&2
    docker-compose build
fi

# Run the MCP server in Docker with stdio connected
docker run -i --rm \
    -v "$(dirname "$(pwd)"):/workspace:ro" \
    -e NODE_ENV=development \
    mcp-server-mcp-server