#!/bin/bash

# BRX Performance API Documentation Scraper Runner (Environment Variables)
# Uses direct environment variables instead of 1Password

set -e  # Exit on any error

echo "🔥 BRX Performance API Documentation Scraper"
echo "   Using Environment Variables"
echo "   " + "="*50

# Check if required environment variables are set
if [ -z "$FIRECRAWL_API_KEY" ]; then
    echo "❌ Error: FIRECRAWL_API_KEY environment variable is not set"
    echo "   Please set it with: export FIRECRAWL_API_KEY=your_api_key"
    exit 1
fi

if [ -z "$BRX_APP_PASSWORD" ]; then
    echo "❌ Error: BRX_APP_PASSWORD environment variable is not set"
    echo "   Please set it with: export BRX_APP_PASSWORD=your_password"
    exit 1
fi

# Set default username if not provided
if [ -z "$BRX_APP_USERNAME" ]; then
    export BRX_APP_USERNAME="api-docs"
fi

echo "✅ Required environment variables are set"
echo "   - FIRECRAWL_API_KEY: [REDACTED]"
echo "   - BRX_APP_USERNAME: $BRX_APP_USERNAME"
echo "   - BRX_APP_PASSWORD: [REDACTED]"
echo ""
echo "🚀 Starting scraper..."
echo ""

# Run the Python script
python3 firecrawl_brx_scraper.py

echo ""
echo "🎉 Scraper execution completed!"

