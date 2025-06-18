#!/bin/bash

# 1Password Connection Script for Docker MCP Server
# This script helps pass 1Password authentication from host to container

# Check if we're running in Docker
if [ -f /.dockerenv ]; then
    echo "[1Password] Running in Docker container" >&2
    
    # Check if OP_SERVICE_ACCOUNT_TOKEN is set for service account auth
    if [ -n "$OP_SERVICE_ACCOUNT_TOKEN" ]; then
        echo "[1Password] Using service account authentication" >&2
        export OP_SERVICE_ACCOUNT_TOKEN
    # Check if session token was passed
    elif [ -n "$OP_SESSION" ]; then
        echo "[1Password] Using session token from host" >&2
        export OP_SESSION
    else
        echo "[1Password] No authentication available. Options:" >&2
        echo "  1. Set OP_SERVICE_ACCOUNT_TOKEN for service account" >&2
        echo "  2. Pass OP_SESSION from host" >&2
        echo "  3. Mount 1Password config directory" >&2
    fi
else
    # Running on host - help set up Docker connection
    echo "Setting up 1Password connection for Docker MCP server..."
    
    # Check if signed in
    if ! op account list &> /dev/null; then
        echo "❌ Not signed in to 1Password"
        echo "Please run: eval \$(op signin)"
        exit 1
    fi
    
    # Get current session
    SESSION_VAR=$(env | grep "^OP_SESSION_" | head -1)
    if [ -z "$SESSION_VAR" ]; then
        echo "❌ No active 1Password session found"
        echo "Please run: eval \$(op signin)"
        exit 1
    fi
    
    echo "✅ Found 1Password session"
    echo ""
    echo "To run the MCP server with 1Password access, use:"
    echo "  $SESSION_VAR docker-compose up"
fi