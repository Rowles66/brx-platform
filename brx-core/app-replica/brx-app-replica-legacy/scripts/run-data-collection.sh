#!/bin/bash

# BRX Performance Data Collection Runner
# This script sets up the environment and runs data collection

echo "🚀 Starting BRX Performance Data Collection"

# Load environment variables from 1Password
echo "📋 Loading credentials from 1Password..."
export BRX_API_TOKEN=$(op item get 'pawtdmw4ulnrtsyxiqzb6tstte' --fields 'API_TOKEN' --reveal)
export BRX_BEARER_TOKEN=$(op item get 'pawtdmw4ulnrtsyxiqzb6tstte' --fields 'BEARER_TOKEN' --reveal)
export BRX_USERNAME=$(op item get 'pawtdmw4ulnrtsyxiqzb6tstte' --fields 'username' --reveal)
export BRX_PASSWORD=$(op item get 'pawtdmw4ulnrtsyxiqzb6tstte' --fields 'BRX_API_SIGN_IN_PASSWORD' --reveal)

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install requests beautifulsoup4 playwright

# Run the collection script
echo "🔍 Starting data collection..."
python3 ./scripts/collect-brx-data.py

echo "✅ Data collection complete!"
echo "📁 Check the generated data_collection_* directory for results"

