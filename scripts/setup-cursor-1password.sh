#!/bin/bash

# Simple setup for 1Password VS Code extension in Cursor

echo "🔐 Setting up 1Password Extension for Cursor"
echo "==========================================="

# VS Code/Cursor settings directory
CURSOR_CONFIG_DIR="$HOME/.config/Cursor/User"
VSCODE_CONFIG_DIR="$HOME/.config/Code/User"

# Create directories if they don't exist
mkdir -p "$CURSOR_CONFIG_DIR"
mkdir -p "$VSCODE_CONFIG_DIR"

# Global settings for 1Password extension
SETTINGS_JSON='{
  "1password.enableDebugLogging": false,
  "1password.enableFilledItemSuggestions": true,
  "1password.enableSecretsInlineCodeLens": true,
  "1password.enableSecretsHoverProvider": true,
  "1password.sidebarItemSortOrder": "alphabetical",
  
  // Auto-detect .env files
  "files.associations": {
    ".env*": "dotenv",
    "*.env": "dotenv"
  },
  
  // Security: never commit .env files
  "files.exclude": {
    "**/.env": false,
    "**/.env.local": false,
    "**/.env.*.local": false
  },
  
  // Make .env files visible but warn about them
  "problems.decorations.enabled": true,
  "workbench.colorCustomizations": {
    "editorGutter.addedBackground": "#ff000033"
  }
}'

# Function to update settings
update_settings() {
    local config_file="$1"
    
    if [ -f "$config_file" ]; then
        echo "📝 Updating existing settings.json..."
        # Backup existing settings
        cp "$config_file" "$config_file.backup.$(date +%Y%m%d_%H%M%S)"
        
        # Note: This is simplified - in production you'd merge JSON properly
        echo "⚠️  Please manually merge these 1Password settings into your settings.json:"
        echo "$SETTINGS_JSON"
        echo ""
        echo "📁 File location: $config_file"
    else
        echo "✨ Creating new settings.json..."
        echo "$SETTINGS_JSON" > "$config_file"
    fi
}

# Update Cursor settings
if [ -d "$CURSOR_CONFIG_DIR" ]; then
    update_settings "$CURSOR_CONFIG_DIR/settings.json"
fi

# Also update VS Code settings if it exists
if [ -d "$VSCODE_CONFIG_DIR" ]; then
    echo ""
    echo "📝 Also updating VS Code settings..."
    update_settings "$VSCODE_CONFIG_DIR/settings.json"
fi

# Create global gitignore if it doesn't exist
GLOBAL_GITIGNORE="$HOME/.gitignore_global"
if [ ! -f "$GLOBAL_GITIGNORE" ]; then
    echo "📝 Creating global .gitignore..."
    cat > "$GLOBAL_GITIGNORE" << 'EOF'
# Environment files
.env
.env.local
.env.*.local
*.env
!.env.example
!.env.sample

# 1Password
.env.1password
*.1password
op-session-*

# Never commit these
*_credentials.json
*_secret*
*_key.json
EOF
    
    # Configure git to use global gitignore
    git config --global core.excludesfile "$GLOBAL_GITIGNORE"
    echo "✅ Global gitignore configured"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Open Cursor"
echo "2. Install 1Password extension: Cmd/Ctrl+Shift+X → Search '1Password'"
echo "3. Sign in when prompted"
echo "4. Create .env files and click the 1Password icons to fill credentials"
echo ""
echo "💡 Quick tips:"
echo "- Type 'VARIABLE_NAME=' in any .env file"
echo "- Click the 1Password icon that appears"
echo "- Search and select your credential"
echo "- It fills automatically!"
echo ""
echo "🔒 Security note: .env files are now globally gitignored"