#!/bin/bash

# Repository Cleanup Script
# Removes build artifacts and temporary files

echo "🧹 Cleaning repository..."

# Next.js build outputs
echo "Removing Next.js build files..."
rm -rf brx-app/.next
rm -rf brx-app/dist
rm -rf brx-app/out

# Node modules (will be reinstalled)
echo "Removing node_modules..."
rm -rf node_modules
rm -rf brx-app/node_modules
rm -rf */node_modules

# Cache directories
echo "Removing cache directories..."
rm -rf brx-app/.next/cache
rm -rf .cache
rm -rf */.cache

# Python virtual environments
echo "Removing Python venvs..."
rm -rf brx-app/venv
rm -rf brx-app/dev_tools/ai_workflow/.venv
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# macOS system files
echo "Removing .DS_Store files..."
find . -name ".DS_Store" -type f -delete

# IDE files
echo "Removing IDE temp files..."
rm -rf .idea/workspace.xml
rm -rf brx-app/.idea/workspace.xml

# Logs (keep useful ones)
echo "Removing noisy log files..."
rm -f logs/ai-agent-monitor.log
rm -f logs/monitor.out
rm -f logs/monitor.err

# Vercel build outputs
echo "Removing Vercel build outputs..."
rm -rf .vercel/output
rm -rf brx-app/.vercel/output

echo "✅ Repository cleaned!"
echo "💡 Run 'npm install' to restore dependencies"