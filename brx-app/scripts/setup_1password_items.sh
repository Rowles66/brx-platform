#!/bin/bash

# DEPRECATED: This setup script is deprecated.
# Use environment variables directly: BRX_APP_USERNAME, BRX_APP_PASSWORD, FIRECRAWL_API_KEY
#
# Setup script to create 1Password items for BRX scraper
# Run this once to set up your credentials in 1Password

set -e

echo "🔐 Setting up 1Password items for BRX scraper"
echo "   " + "="*45

# Check if 1Password CLI is available
if ! command -v op &> /dev/null; then
    echo "❌ Error: 1Password CLI (op) is not installed"
    echo "   Install from: https://developer.1password.com/docs/cli/get-started/"
    exit 1
fi

# Check if signed in
if ! op account list &> /dev/null; then
    echo "❌ Error: Not signed in to 1Password CLI"
    echo "   Please run: op signin"
    exit 1
fi

echo "✅ 1Password CLI is ready"
echo ""

# Prompt for FireCrawl API key
echo "📝 Please enter your FireCrawl API key:"
echo "   (Get it from: https://www.firecrawl.dev/app)"
read -s -p "FireCrawl API Key: " FIRECRAWL_KEY
echo ""

if [ -z "$FIRECRAWL_KEY" ]; then
    echo "❌ FireCrawl API key cannot be empty"
    exit 1
fi

# Prompt for BRX password
echo ""
echo "📝 Please enter your BRX Performance password:"
echo "   (For username: api-docs)"
read -s -p "BRX Password: " BRX_PASSWORD
echo ""

if [ -z "$BRX_PASSWORD" ]; then
    echo "❌ BRX password cannot be empty"
    exit 1
fi

echo ""
echo "💾 Creating 1Password items..."

# Create FireCrawl API key item
echo "$FIRECRAWL_KEY" | op item create \
    --category="Password" \
    --title="FIRECRAWL_API_KEY" \
    --vault="Private" \
    password[password]=-

echo "✅ Created FIRECRAWL_API_KEY item"

# Create BRX password item
echo "$BRX_PASSWORD" | op item create \
    --category="Password" \
    --title="BRX_API_DOCS_PASSWORD" \
    --vault="Private" \
    username[text]="api-docs" \
    password[password]=-

echo "✅ Created BRX_API_DOCS_PASSWORD item"

echo ""
echo "🎉 Setup complete! You can now run:"
echo "   ./run_brx_scraper.sh"
echo ""
echo "📋 Created items:"
echo "   - FIRECRAWL_API_KEY (in Private vault)"
echo "   - BRX_API_DOCS_PASSWORD (in Private vault, username: api-docs)"

