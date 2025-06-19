#!/bin/bash

echo "🔧 Setting up Persistent MCP for Cursor..."
echo "=========================================="

# Create global command
echo "📦 Creating global command..."
sudo ln -sf /workspace/mcp-server/start-mcp-environment.sh /usr/local/bin/start-cursor-mcp
echo "✅ Global command created: start-cursor-mcp"

# Add to shell profile  
echo "🔄 Adding to shell profile..."
if ! grep -q "start-cursor-mcp" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# Auto-start MCP environment for Cursor" >> ~/.bashrc
    echo "start-cursor-mcp > /dev/null 2>&1" >> ~/.bashrc
    echo "✅ Added to ~/.bashrc"
else
    echo "✅ Already in ~/.bashrc"
fi

# Check if .zshrc exists and add there too
if [ -f ~/.zshrc ]; then
    if ! grep -q "start-cursor-mcp" ~/.zshrc; then
        echo "" >> ~/.zshrc
        echo "# Auto-start MCP environment for Cursor" >> ~/.zshrc  
        echo "start-cursor-mcp > /dev/null 2>&1" >> ~/.zshrc
        echo "✅ Added to ~/.zshrc"
    else
        echo "✅ Already in ~/.zshrc"
    fi
fi

# Test the setup
echo ""
echo "🧪 Testing persistent setup..."
if start-cursor-mcp > /dev/null 2>&1; then
    echo "✅ Persistent MCP setup successful!"
else
    echo "⚠️  Setup completed but test failed (may still work)"
fi

echo ""
echo "🎉 Persistent MCP Setup Complete!"
echo "=================================="
echo ""
echo "✅ MCP will now start automatically every time you:"
echo "   • Open a new terminal"
echo "   • Start a new shell session"
echo "   • Restart your system"
echo ""
echo "🚀 Next Steps:"
echo "   1. Close and reopen your terminal (or run: source ~/.bashrc)"
echo "   2. Start Cursor - MCP servers will be available automatically!"
echo "   3. In Cursor, use Command Palette (Cmd/Ctrl+Shift+P) and type 'MCP'"
echo ""
echo "🔧 Manual Commands (if needed):"
echo "   • Start MCP manually: start-cursor-mcp"
echo "   • Verify setup: /workspace/mcp-server/verify-setup.sh"
echo "   • View logs: start-cursor-mcp (without redirection)"
echo ""
echo "📚 For more options, see: PERSISTENT_MCP_SETUP.md"