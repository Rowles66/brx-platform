#!/bin/bash

# Install 1Password integration globally for all Cursor projects

echo "🌍 Installing Global 1Password Integration"
echo "=========================================="

# Determine shell config file
if [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
    SHELL_NAME="zsh"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
    SHELL_NAME="bash"
else
    echo "⚠️  Unknown shell. Add configuration manually to your shell config."
    exit 1
fi

echo "📝 Detected shell: $SHELL_NAME"
echo "📝 Config file: $SHELL_CONFIG"

# Create global 1Password directory
GLOBAL_1P_DIR="$HOME/.config/1password-dev"
mkdir -p "$GLOBAL_1P_DIR"

# Create global op wrapper script
cat > "$GLOBAL_1P_DIR/op-run" << 'EOF'
#!/bin/bash
# Global 1Password runner

# Look for .env.1password in current dir, parent dirs, or global
find_env_file() {
    local dir="$PWD"
    while [ "$dir" != "/" ]; do
        if [ -f "$dir/.env.1password" ]; then
            echo "$dir/.env.1password"
            return 0
        fi
        dir=$(dirname "$dir")
    done
    
    # Check global location
    if [ -f "$HOME/.config/1password-dev/global.env.1password" ]; then
        echo "$HOME/.config/1password-dev/global.env.1password"
        return 0
    fi
    
    return 1
}

# Find env file
ENV_FILE=$(find_env_file)

if [ -z "$ENV_FILE" ]; then
    echo "❌ No .env.1password found in current/parent directories or globally"
    echo "Create one of these:"
    echo "  - ./.env.1password (project-specific)"
    echo "  - ~/.config/1password-dev/global.env.1password (global)"
    exit 1
fi

# Run with 1Password
op run --env-file="$ENV_FILE" -- "$@"
EOF

chmod +x "$GLOBAL_1P_DIR/op-run"

# Create global environment template
cat > "$GLOBAL_1P_DIR/global.env.1password.example" << 'EOF'
# Global 1Password environment mappings
# Copy to: ~/.config/1password-dev/global.env.1password
# These will be available in ALL projects

# Common development credentials
OPENAI_API_KEY="op://Private/OpenAI/api_key"
ANTHROPIC_API_KEY="op://Private/Anthropic/api_key"
GITHUB_TOKEN="op://Private/GitHub/personal_access_token"
VERCEL_TOKEN="op://Private/Vercel/token"

# Database URLs
DATABASE_URL="op://Private/Supabase/database_url"
POSTGRES_URL="op://Private/PostgreSQL/url"
REDIS_URL="op://Private/Redis/url"

# Add your other common credentials here...
EOF

# Add shell functions and aliases
cat >> "$SHELL_CONFIG" << 'EOF'

# ===== 1Password Developer Integration =====

# Quick alias for running commands with 1Password
alias opr='~/.config/1password-dev/op-run'

# Launch Cursor with 1Password credentials
cursor1p() {
    echo "🔐 Launching Cursor with 1Password credentials..."
    ~/.config/1password-dev/op-run cursor "$@"
}

# Quick function to edit global 1Password mappings
1pedit() {
    ${EDITOR:-nano} ~/.config/1password-dev/global.env.1password
}

# List available 1Password items
1plist() {
    op item list --format json | jq -r '.[] | "\(.title) (\(.vault.name))"' | sort
}

# Create project-specific .env.1password
1pinit() {
    if [ -f ".env.1password" ]; then
        echo "⚠️  .env.1password already exists"
        return 1
    fi
    
    cat > .env.1password << 'INIT_EOF'
# Project-specific 1Password mappings
# These override global mappings

# Example:
# API_KEY="op://Private/MyService/api_key"
INIT_EOF
    
    echo "✅ Created .env.1password"
    echo "Edit it to add project-specific credentials"
}

# Show which env file would be used
1pwhich() {
    local dir="$PWD"
    while [ "$dir" != "/" ]; do
        if [ -f "$dir/.env.1password" ]; then
            echo "📁 Using: $dir/.env.1password"
            return 0
        fi
        dir=$(dirname "$dir")
    done
    
    if [ -f "$HOME/.config/1password-dev/global.env.1password" ]; then
        echo "🌍 Using: ~/.config/1password-dev/global.env.1password"
        return 0
    fi
    
    echo "❌ No .env.1password found"
    return 1
}

# ===== End 1Password Integration =====
EOF

# Create initial global env file if it doesn't exist
if [ ! -f "$GLOBAL_1P_DIR/global.env.1password" ]; then
    cp "$GLOBAL_1P_DIR/global.env.1password.example" "$GLOBAL_1P_DIR/global.env.1password"
    echo "📄 Created global config: $GLOBAL_1P_DIR/global.env.1password"
    echo "   Edit this file to add your common credentials"
fi

echo ""
echo "✅ Global 1Password integration installed!"
echo ""
echo "🔄 Reload your shell:"
echo "   source $SHELL_CONFIG"
echo ""
echo "📚 Available commands:"
echo "   opr <command>     - Run any command with 1Password"
echo "   cursor1p          - Launch Cursor with credentials"
echo "   1pedit            - Edit global credentials"
echo "   1plist            - List your 1Password items"
echo "   1pinit            - Create project-specific .env.1password"
echo "   1pwhich           - Show which env file would be used"
echo ""
echo "📝 Edit your global credentials:"
echo "   1pedit"
echo ""
echo "🚀 Examples:"
echo "   opr npm run dev"
echo "   opr python script.py"
echo "   cursor1p ."