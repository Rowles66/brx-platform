#!/bin/bash

# E2E Test Setup Script
# This script helps set up the environment for running Playwright E2E tests

set -e

echo "🎭 Setting up Playwright E2E Tests..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from the project root directory"
    exit 1
fi

# Check if Playwright is installed
if ! npm list @playwright/test >/dev/null 2>&1; then
    echo "📦 Installing Playwright..."
    npm install --save-dev @playwright/test
fi

# Install Playwright browsers if not already installed
echo "🌐 Installing Playwright browsers..."
npx playwright install

# Create test directories if they don't exist
echo "📁 Creating test directories..."
mkdir -p tests/e2e/utils
mkdir -p test-results/screenshots
mkdir -p playwright-report

# Check if .env.local exists and warn about environment variables
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. You may need to set up environment variables."
    echo "   Required variables:"
    echo "   - DATABASE_URL"
    echo "   - Any API keys needed for your application"
fi

# Check if the database is accessible
echo "🗄️  Checking database connection..."
if npm run db:generate >/dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Warning: Database connection failed. Make sure DATABASE_URL is set correctly."
fi

# Build the application
echo "🏗️  Building application..."
if npm run build; then
    echo "✅ Application built successfully"
else
    echo "❌ Error: Application build failed"
    exit 1
fi

echo ""
echo "🎉 E2E test setup complete!"
echo ""
echo "Available commands:"
echo "  npm run test:e2e          # Run all E2E tests"
echo "  npm run test:e2e:ui       # Run tests with UI mode"
echo "  npm run test:e2e:headed   # Run tests with browser visible"
echo "  npm run test:e2e:debug    # Debug tests"
echo "  npm run test:e2e:report   # View test report"
echo ""
echo "To run tests with 1Password (for CI-like environment):"
echo "  op run -- npm run test:e2e"
echo ""
echo "For more information, see tests/README.md"

