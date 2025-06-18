#!/bin/bash

# Cleanup script to remove redundant 1Password files
# Run this to clean up after the audit

echo "🧹 Cleaning up redundant 1Password files..."
echo "=========================================="

# Files to remove (redundant/deprecated)
FILES_TO_REMOVE=(
    "scripts/1password-agent-tools.sh"
    "scripts/install-global-1password.sh"
    "scripts/setup-cursor-1password.sh"
    "scripts/1password-connect.sh"
    "scripts/agent-demo.sh"
    "CURSOR_AGENT_1PASSWORD_GUIDE.md"
)

# Remove each file
for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "$file" ]; then
        echo "Removing: $file"
        rm "$file"
    else
        echo "Already gone: $file"
    fi
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Kept the following (these are useful):"
echo "  - mcp-server/* (MCP integration)"
echo "  - scripts/op.sh (simple CLI wrapper)"
echo "  - .env.1password.complete (reference template)"
echo "  - 1PASSWORD_GUIDE.md (VS Code extension guide)"
echo ""
echo "Next steps:"
echo "1. Choose either MCP server OR VS Code extension (not both)"
echo "2. Test your chosen approach"
echo "3. Delete any other 1Password files you don't need"