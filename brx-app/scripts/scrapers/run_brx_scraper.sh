#!/bin/bash

# DEPRECATED: This script uses 1Password CLI and is deprecated.
# Use run_brx_scraper_env.sh with environment variables instead.
#
# BRX Performance API Documentation Scraper Runner
# Uses 1Password CLI to securely manage credentials

set -e  # Exit on any error

echo "🔥 BRX Performance API Documentation Scraper"
echo "   Using 1Password + FireCrawl integration"
echo "   " + "="*50

# Check if 1Password CLI is available
if ! command -v op &> /dev/null; then
    echo "❌ Error: 1Password CLI (op) is not installed or not in PATH"
    echo "   Please install it: https://developer.1password.com/docs/cli/get-started/"
    exit 1
fi

# Check if user is signed in to 1Password
if ! op account list &> /dev/null; then
    echo "❌ Error: Not signed in to 1Password CLI"
    echo "   Please run: op signin"
    exit 1
fi

echo "✅ 1Password CLI is ready"

# Check if FireCrawl API key is available
if ! op item get "FIRECRAWL_API_KEY" --fields password &> /dev/null; then
    echo "❌ Error: FIRECRAWL_API_KEY not found in 1Password"
    echo "   Please create an item in 1Password with:"
    echo "   - Title: FIRECRAWL_API_KEY"
    echo "   - Password field containing your FireCrawl API key"
    exit 1
fi

# Check if BRX password is available  
if ! op item get "BRX_API_DOCS_PASSWORD" --fields password &> /dev/null; then
    echo "❌ Error: BRX_API_DOCS_PASSWORD not found in 1Password"
    echo "   Please create an item in 1Password with:"
    echo "   - Title: BRX_API_DOCS_PASSWORD"
    echo "   - Password field containing your BRX password"
    exit 1
fi

echo "✅ Required credentials found in 1Password"
echo ""
echo "🚀 Starting scraper with secured credentials..."
echo ""

# Run the Python script with environment variables from 1Password
op run --no-masking -- env \
    FIRECRAWL_API_KEY="op://Private/FIRECRAWL_API_KEY/password" \
    BRX_USERNAME="api-docs" \
    BRX_API_DOCS_PASSWORD="op://Private/BRX_API_DOCS_PASSWORD/password" \
    python3 firecrawl_brx_scraper.py

echo ""
echo "🎉 Scraper execution completed!"

