#!/bin/bash

# Simple 1Password connector - uses your EXISTING credentials
# No new vaults, no bullshit - just connects to what you already have

# Check if 1Password CLI is installed
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI not installed"
    echo "Install it with: brew install 1password-cli"
    exit 1
fi

# Check if signed in
if ! op account list &> /dev/null 2>&1; then
    echo "📝 Sign in to 1Password:"
    eval $(op signin)
fi

# Show available items
echo "🔍 Your existing 1Password items:"
echo ""
op item list --format json | jq -r '.[] | "\(.title) (\(.vault.name))"' | sort
echo ""
echo "✅ Connected to 1Password"
echo ""
echo "To use credentials, create a .env.1password file mapping your variables to items:"
echo "Example:"
echo "  FIRECRAWL_API_KEY=\"op://Private/Firecrawl/api_key\""
echo "  DATABASE_URL=\"op://Dev/Supabase/url\""
echo ""
echo "Then run commands with: op run --env-file=.env.1password -- <command>"