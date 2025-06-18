#!/bin/bash

# Dead simple 1Password wrapper - uses YOUR existing credentials
# No setup required, just works with what you have

# Quick check
if ! command -v op &> /dev/null; then
    echo "Install 1Password CLI: brew install 1password-cli"
    exit 1
fi

# Make sure signed in
if ! op account list &> /dev/null 2>&1; then
    echo "Sign in first: eval \$(op signin)"
    exit 1
fi

# Check for .env.1password file
if [ ! -f ".env.1password" ]; then
    echo "❌ No .env.1password file found"
    echo ""
    echo "Create one by copying the example:"
    echo "  cp .env.1password.example .env.1password"
    echo ""
    echo "Then edit it to point to YOUR 1Password items"
    exit 1
fi

# Just run the command with 1Password
echo "🔐 Running with 1Password credentials..."
op run --env-file=.env.1password -- "$@"