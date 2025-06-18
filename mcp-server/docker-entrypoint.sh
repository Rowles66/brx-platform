#!/bin/sh
set -e

echo "Starting BRX MCP Server..." >&2
echo "Note: MCP servers communicate via stdio, not HTTP" >&2
echo "This container needs to be connected to Claude via the desktop app" >&2

# Start the MCP server
exec node src/index.js