#!/bin/bash

# Launch Cursor with 1Password credentials

echo "🔐 Launching Cursor with 1Password credentials..."

# Check for .env.1password
if [ -f "../.env.1password" ]; then
    ENV_FILE="../.env.1password"
elif [ -f ".env.1password" ]; then
    ENV_FILE=".env.1password"
else
    echo "⚠️  No .env.1password file found"
    echo "Create one with: cp .env.1password.example .env.1password"
    echo "Then edit it to point to your 1Password items"
    echo ""
    echo "Launching Cursor anyway..."
    cursor .
    exit 0
fi

# Launch with 1Password
echo "Using credentials from: $ENV_FILE"
op run --env-file="$ENV_FILE" -- cursor .

