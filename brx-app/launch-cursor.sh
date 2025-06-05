#!/bin/bash

# Launch Cursor with environment variables for BRX Platform development
# This script exports necessary environment variables before launching Cursor

echo "Setting up BRX Platform environment variables..."

# Export database URL (replace with your actual credentials)
export DATABASE_URL="postgresql://user:password@localhost:5432/brx_local"

# Export development environment
export NODE_ENV="development"

# If you're not using 1Password, uncomment and set these:
# export FIRECRAWL_API_KEY="your-firecrawl-api-key"
# export BRX_API_TOKEN="your-brx-api-token"
# export BRX_BEARER_TOKEN="your-brx-bearer-token"

echo "Environment variables set. Launching Cursor..."

# Launch Cursor in the current directory
cursor .

echo "Cursor launched with BRX Platform environment."

