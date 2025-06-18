#!/bin/bash

# 1Password CLI Setup and Configuration Script
# This script helps set up 1Password CLI for secure credential management
# across the BRX Platform project

set -e

echo "🔐 1Password CLI Setup for BRX Platform"
echo "======================================="

# Check if 1Password CLI is installed
check_op_cli() {
    if ! command -v op &> /dev/null; then
        echo "❌ 1Password CLI is not installed."
        echo ""
        echo "Please install it using one of these methods:"
        echo ""
        echo "macOS (Homebrew):"
        echo "  brew install 1password-cli"
        echo ""
        echo "Linux/WSL:"
        echo "  curl -sS https://downloads.1password.com/linux/keys/1password.asc | sudo gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg"
        echo "  echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/amd64 stable main' | sudo tee /etc/apt/sources.list.d/1password.list"
        echo "  sudo apt update && sudo apt install 1password-cli"
        echo ""
        echo "Visit: https://developer.1password.com/docs/cli/get-started"
        exit 1
    fi
    echo "✅ 1Password CLI is installed (version: $(op --version))"
}

# Sign in to 1Password
setup_op_account() {
    echo ""
    echo "📝 Signing in to 1Password..."
    
    # Check if already signed in
    if op account list &> /dev/null; then
        echo "✅ Already signed in to 1Password"
        ACCOUNT=$(op account list --format json | jq -r '.[0].url')
        echo "   Account: $ACCOUNT"
    else
        echo ""
        echo "Please sign in to your 1Password account:"
        echo "If you have a 1password.com account, run:"
        echo "  op account add"
        echo ""
        echo "Then sign in with:"
        echo "  eval \$(op signin)"
        exit 1
    fi
}

# Create vault for BRX Platform credentials
setup_vault() {
    echo ""
    echo "🗂️  Setting up BRX Platform vault..."
    
    VAULT_NAME="BRX Platform"
    
    # Check if vault exists
    if op vault get "$VAULT_NAME" &> /dev/null; then
        echo "✅ Vault '$VAULT_NAME' already exists"
    else
        echo "Creating new vault: $VAULT_NAME"
        op vault create "$VAULT_NAME"
        echo "✅ Vault created successfully"
    fi
}

# Create credential items
create_credential_items() {
    echo ""
    echo "🔑 Setting up credential items..."
    
    VAULT_NAME="BRX Platform"
    
    # Define credentials structure
    declare -A CREDENTIALS=(
        ["BRX API Credentials"]="API credentials for BRX Performance platform"
        ["Firecrawl API"]="Firecrawl API key for web scraping"
        ["Supabase Credentials"]="Supabase project credentials"
        ["Upstash Redis"]="Upstash Redis credentials"
        ["GitHub Tokens"]="GitHub personal access tokens and secrets"
        ["Google Cloud Platform"]="GCP service account and BigQuery credentials"
        ["Vercel Deploy"]="Vercel deployment tokens"
        ["NextAuth Secrets"]="NextAuth.js secret keys"
    )
    
    for item_name in "${!CREDENTIALS[@]}"; do
        description="${CREDENTIALS[$item_name]}"
        
        # Check if item exists
        if op item get "$item_name" --vault "$VAULT_NAME" &> /dev/null 2>&1; then
            echo "✅ '$item_name' already exists"
        else
            echo "📝 Creating '$item_name'..."
            
            # Create item based on type
            case "$item_name" in
                "BRX API Credentials")
                    op item create \
                        --category login \
                        --title "$item_name" \
                        --vault "$VAULT_NAME" \
                        --notes "$description" \
                        username="BRX_USERNAME" \
                        password="BRX_PASSWORD" \
                        "API_TOKEN[password]"="" \
                        "BEARER_TOKEN[password]"="" \
                        "API_ENDPOINT[text]"="https://online.brxperformance.com"
                    ;;
                "Firecrawl API")
                    op item create \
                        --category password \
                        --title "$item_name" \
                        --vault "$VAULT_NAME" \
                        --notes "$description" \
                        "FIRECRAWL_API_KEY[password]"=""
                    ;;
                "Supabase Credentials")
                    op item create \
                        --category database \
                        --title "$item_name" \
                        --vault "$VAULT_NAME" \
                        --notes "$description" \
                        "NEXT_PUBLIC_SUPABASE_URL[text]"="" \
                        "NEXT_PUBLIC_SUPABASE_ANON_KEY[password]"="" \
                        "SUPABASE_SERVICE_ROLE_KEY[password]"="" \
                        "DATABASE_URL[password]"=""
                    ;;
                "Upstash Redis")
                    op item create \
                        --category password \
                        --title "$item_name" \
                        --vault "$VAULT_NAME" \
                        --notes "$description" \
                        "UPSTASH_REDIS_REST_URL[text]"="" \
                        "UPSTASH_REDIS_REST_TOKEN[password]"=""
                    ;;
                "GitHub Tokens")
                    op item create \
                        --category password \
                        --title "$item_name" \
                        --vault "$VAULT_NAME" \
                        --notes "$description" \
                        "GITHUB_TOKEN[password]"="" \
                        "GH_PAT[password]"=""
                    ;;
                "Google Cloud Platform")
                    op item create \
                        --category password \
                        --title "$item_name" \
                        --vault "$VAULT_NAME" \
                        --notes "$description" \
                        "GCP_PROJECT_ID[text]"="" \
                        "GCP_SERVICE_ACCOUNT_KEY[password]"="" \
                        "BIGQUERY_DATASET[text]"=""
                    ;;
                "Vercel Deploy")
                    op item create \
                        --category password \
                        --title "$item_name" \
                        --vault "$VAULT_NAME" \
                        --notes "$description" \
                        "VERCEL_TOKEN[password]"="" \
                        "VERCEL_ORG_ID[text]"="" \
                        "VERCEL_PROJECT_ID[text]"=""
                    ;;
                "NextAuth Secrets")
                    op item create \
                        --category password \
                        --title "$item_name" \
                        --vault "$VAULT_NAME" \
                        --notes "$description" \
                        "NEXTAUTH_SECRET[password]"="" \
                        "NEXTAUTH_URL[text]"="http://localhost:3000"
                    ;;
            esac
            echo "✅ Created '$item_name'"
        fi
    done
}

# Generate environment loader script
generate_env_loader() {
    echo ""
    echo "📄 Generating environment loader script..."
    
    cat > scripts/load-credentials.sh << 'EOF'
#!/bin/bash

# Load credentials from 1Password into environment variables
# Usage: source scripts/load-credentials.sh

echo "🔑 Loading credentials from 1Password..."

# Check if 1Password CLI is available
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI is not installed. Run scripts/1password-setup.sh first."
    return 1
fi

# Check if signed in
if ! op account list &> /dev/null; then
    echo "❌ Not signed in to 1Password. Please run:"
    echo "   eval \$(op signin)"
    return 1
fi

VAULT_NAME="BRX Platform"

# Load BRX API Credentials
echo "Loading BRX API credentials..."
export BRX_USERNAME=$(op item get "BRX API Credentials" --vault "$VAULT_NAME" --fields username 2>/dev/null || echo "")
export BRX_PASSWORD=$(op item get "BRX API Credentials" --vault "$VAULT_NAME" --fields password 2>/dev/null || echo "")
export BRX_API_TOKEN=$(op item get "BRX API Credentials" --vault "$VAULT_NAME" --fields "API_TOKEN" 2>/dev/null || echo "")
export BRX_BEARER_TOKEN=$(op item get "BRX API Credentials" --vault "$VAULT_NAME" --fields "BEARER_TOKEN" 2>/dev/null || echo "")
export BRX_API_ENDPOINT=$(op item get "BRX API Credentials" --vault "$VAULT_NAME" --fields "API_ENDPOINT" 2>/dev/null || echo "")

# Load Firecrawl API
echo "Loading Firecrawl API key..."
export FIRECRAWL_API_KEY=$(op item get "Firecrawl API" --vault "$VAULT_NAME" --fields "FIRECRAWL_API_KEY" 2>/dev/null || echo "")

# Load Supabase Credentials
echo "Loading Supabase credentials..."
export NEXT_PUBLIC_SUPABASE_URL=$(op item get "Supabase Credentials" --vault "$VAULT_NAME" --fields "NEXT_PUBLIC_SUPABASE_URL" 2>/dev/null || echo "")
export NEXT_PUBLIC_SUPABASE_ANON_KEY=$(op item get "Supabase Credentials" --vault "$VAULT_NAME" --fields "NEXT_PUBLIC_SUPABASE_ANON_KEY" 2>/dev/null || echo "")
export SUPABASE_SERVICE_ROLE_KEY=$(op item get "Supabase Credentials" --vault "$VAULT_NAME" --fields "SUPABASE_SERVICE_ROLE_KEY" 2>/dev/null || echo "")
export DATABASE_URL=$(op item get "Supabase Credentials" --vault "$VAULT_NAME" --fields "DATABASE_URL" 2>/dev/null || echo "")

# Load Upstash Redis
echo "Loading Upstash Redis credentials..."
export UPSTASH_REDIS_REST_URL=$(op item get "Upstash Redis" --vault "$VAULT_NAME" --fields "UPSTASH_REDIS_REST_URL" 2>/dev/null || echo "")
export UPSTASH_REDIS_REST_TOKEN=$(op item get "Upstash Redis" --vault "$VAULT_NAME" --fields "UPSTASH_REDIS_REST_TOKEN" 2>/dev/null || echo "")

# Load GitHub Tokens
echo "Loading GitHub tokens..."
export GITHUB_TOKEN=$(op item get "GitHub Tokens" --vault "$VAULT_NAME" --fields "GITHUB_TOKEN" 2>/dev/null || echo "")
export GH_PAT=$(op item get "GitHub Tokens" --vault "$VAULT_NAME" --fields "GH_PAT" 2>/dev/null || echo "")

# Load GCP Credentials
echo "Loading GCP credentials..."
export GCP_PROJECT_ID=$(op item get "Google Cloud Platform" --vault "$VAULT_NAME" --fields "GCP_PROJECT_ID" 2>/dev/null || echo "")
export GCP_SERVICE_ACCOUNT_KEY=$(op item get "Google Cloud Platform" --vault "$VAULT_NAME" --fields "GCP_SERVICE_ACCOUNT_KEY" 2>/dev/null || echo "")
export BIGQUERY_DATASET=$(op item get "Google Cloud Platform" --vault "$VAULT_NAME" --fields "BIGQUERY_DATASET" 2>/dev/null || echo "")

# Load Vercel Deploy Tokens
echo "Loading Vercel deployment tokens..."
export VERCEL_TOKEN=$(op item get "Vercel Deploy" --vault "$VAULT_NAME" --fields "VERCEL_TOKEN" 2>/dev/null || echo "")
export VERCEL_ORG_ID=$(op item get "Vercel Deploy" --vault "$VAULT_NAME" --fields "VERCEL_ORG_ID" 2>/dev/null || echo "")
export VERCEL_PROJECT_ID=$(op item get "Vercel Deploy" --vault "$VAULT_NAME" --fields "VERCEL_PROJECT_ID" 2>/dev/null || echo "")

# Load NextAuth Secrets
echo "Loading NextAuth secrets..."
export NEXTAUTH_SECRET=$(op item get "NextAuth Secrets" --vault "$VAULT_NAME" --fields "NEXTAUTH_SECRET" 2>/dev/null || echo "")
export NEXTAUTH_URL=$(op item get "NextAuth Secrets" --vault "$VAULT_NAME" --fields "NEXTAUTH_URL" 2>/dev/null || echo "")

echo "✅ Credentials loaded successfully!"
echo ""
echo "To verify loaded credentials, run:"
echo "  scripts/verify-credentials.sh"
EOF

    chmod +x scripts/load-credentials.sh
    echo "✅ Created scripts/load-credentials.sh"
}

# Generate verification script
generate_verification_script() {
    echo ""
    echo "📄 Generating credential verification script..."
    
    cat > scripts/verify-credentials.sh << 'EOF'
#!/bin/bash

# Verify that credentials are properly loaded from 1Password
# Usage: scripts/verify-credentials.sh

echo "🔍 Verifying loaded credentials..."
echo "================================="

# Function to check if variable is set
check_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo "❌ $var_name is not set"
        return 1
    else
        # Show first 4 chars and mask the rest
        local masked=$(echo "$var_value" | sed 's/./*/g' | sed 's/^\(....\).*/\1.../')
        echo "✅ $var_name is set (${masked})"
        return 0
    fi
}

# Check all credentials
echo ""
echo "BRX API Credentials:"
check_var "BRX_USERNAME"
check_var "BRX_PASSWORD"
check_var "BRX_API_TOKEN"
check_var "BRX_BEARER_TOKEN"
check_var "BRX_API_ENDPOINT"

echo ""
echo "Firecrawl API:"
check_var "FIRECRAWL_API_KEY"

echo ""
echo "Supabase Credentials:"
check_var "NEXT_PUBLIC_SUPABASE_URL"
check_var "NEXT_PUBLIC_SUPABASE_ANON_KEY"
check_var "SUPABASE_SERVICE_ROLE_KEY"
check_var "DATABASE_URL"

echo ""
echo "Upstash Redis:"
check_var "UPSTASH_REDIS_REST_URL"
check_var "UPSTASH_REDIS_REST_TOKEN"

echo ""
echo "GitHub Tokens:"
check_var "GITHUB_TOKEN"
check_var "GH_PAT"

echo ""
echo "GCP Credentials:"
check_var "GCP_PROJECT_ID"
check_var "GCP_SERVICE_ACCOUNT_KEY"
check_var "BIGQUERY_DATASET"

echo ""
echo "Vercel Deploy:"
check_var "VERCEL_TOKEN"
check_var "VERCEL_ORG_ID"
check_var "VERCEL_PROJECT_ID"

echo ""
echo "NextAuth:"
check_var "NEXTAUTH_SECRET"
check_var "NEXTAUTH_URL"

echo ""
echo "================================="
echo "Verification complete!"
EOF

    chmod +x scripts/verify-credentials.sh
    echo "✅ Created scripts/verify-credentials.sh"
}

# Generate .env template with 1Password references
generate_env_template() {
    echo ""
    echo "📄 Generating .env template files..."
    
    # Create .env.1password.template
    cat > .env.1password.template << 'EOF'
# BRX Platform Environment Variables Template
# This file shows how to reference 1Password secrets in .env files
# Copy this to .env.local and use with: op run -- <command>

# BRX API Credentials
BRX_USERNAME="op://BRX Platform/BRX API Credentials/username"
BRX_PASSWORD="op://BRX Platform/BRX API Credentials/password"
BRX_API_TOKEN="op://BRX Platform/BRX API Credentials/API_TOKEN"
BRX_BEARER_TOKEN="op://BRX Platform/BRX API Credentials/BEARER_TOKEN"
BRX_API_ENDPOINT="op://BRX Platform/BRX API Credentials/API_ENDPOINT"

# Firecrawl API
FIRECRAWL_API_KEY="op://BRX Platform/Firecrawl API/FIRECRAWL_API_KEY"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="op://BRX Platform/Supabase Credentials/NEXT_PUBLIC_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="op://BRX Platform/Supabase Credentials/NEXT_PUBLIC_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="op://BRX Platform/Supabase Credentials/SUPABASE_SERVICE_ROLE_KEY"
DATABASE_URL="op://BRX Platform/Supabase Credentials/DATABASE_URL"

# Upstash Redis
UPSTASH_REDIS_REST_URL="op://BRX Platform/Upstash Redis/UPSTASH_REDIS_REST_URL"
UPSTASH_REDIS_REST_TOKEN="op://BRX Platform/Upstash Redis/UPSTASH_REDIS_REST_TOKEN"

# GitHub
GITHUB_TOKEN="op://BRX Platform/GitHub Tokens/GITHUB_TOKEN"
GH_PAT="op://BRX Platform/GitHub Tokens/GH_PAT"

# Google Cloud Platform
GCP_PROJECT_ID="op://BRX Platform/Google Cloud Platform/GCP_PROJECT_ID"
GCP_SERVICE_ACCOUNT_KEY="op://BRX Platform/Google Cloud Platform/GCP_SERVICE_ACCOUNT_KEY"
BIGQUERY_DATASET="op://BRX Platform/Google Cloud Platform/BIGQUERY_DATASET"

# Vercel
VERCEL_TOKEN="op://BRX Platform/Vercel Deploy/VERCEL_TOKEN"
VERCEL_ORG_ID="op://BRX Platform/Vercel Deploy/VERCEL_ORG_ID"
VERCEL_PROJECT_ID="op://BRX Platform/Vercel Deploy/VERCEL_PROJECT_ID"

# NextAuth
NEXTAUTH_SECRET="op://BRX Platform/NextAuth Secrets/NEXTAUTH_SECRET"
NEXTAUTH_URL="op://BRX Platform/NextAuth Secrets/NEXTAUTH_URL"
EOF

    echo "✅ Created .env.1password.template"
    
    # Create brx-app specific template
    cat > brx-app/.env.1password.template << 'EOF'
# BRX App Environment Variables with 1Password References
# Use with: op run -- npm run dev

# Database
DATABASE_URL="op://BRX Platform/Supabase Credentials/DATABASE_URL"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="op://BRX Platform/Supabase Credentials/NEXT_PUBLIC_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="op://BRX Platform/Supabase Credentials/NEXT_PUBLIC_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="op://BRX Platform/Supabase Credentials/SUPABASE_SERVICE_ROLE_KEY"

# NextAuth
NEXTAUTH_URL="op://BRX Platform/NextAuth Secrets/NEXTAUTH_URL"
NEXTAUTH_SECRET="op://BRX Platform/NextAuth Secrets/NEXTAUTH_SECRET"

# API Integration
FIRECRAWL_API_KEY="op://BRX Platform/Firecrawl API/FIRECRAWL_API_KEY"
BRX_API_TOKEN="op://BRX Platform/BRX API Credentials/API_TOKEN"
BRX_BEARER_TOKEN="op://BRX Platform/BRX API Credentials/BEARER_TOKEN"
EOF

    echo "✅ Created brx-app/.env.1password.template"
}

# Update launch scripts
update_launch_scripts() {
    echo ""
    echo "📄 Updating launch scripts..."
    
    # Update brx-app/launch-cursor.sh
    cat > brx-app/launch-cursor.sh << 'EOF'
#!/bin/bash

# Launch Cursor with environment variables from 1Password
# This script loads credentials and launches Cursor for BRX Platform development

echo "🔐 BRX Platform Development Environment Setup"
echo "==========================================="

# Check if 1Password CLI is available
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI is not installed. Please run:"
    echo "   ./scripts/1password-setup.sh"
    exit 1
fi

# Check if signed in to 1Password
if ! op account list &> /dev/null; then
    echo "❌ Not signed in to 1Password. Please run:"
    echo "   eval \$(op signin)"
    exit 1
fi

# Source the credential loader
echo "Loading credentials from 1Password..."
source scripts/load-credentials.sh

# Verify critical credentials
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Warning: DATABASE_URL not set. Some features may not work."
fi

echo ""
echo "✅ Environment ready. Launching Cursor..."
echo ""

# Launch Cursor in the current directory
cursor .

echo ""
echo "Cursor launched with BRX Platform environment."
echo ""
echo "To run commands with 1Password secrets:"
echo "  op run -- npm run dev"
echo "  op run -- npm test"
echo "  op run -- python scripts/extract_with_firecrawl.py"
EOF

    chmod +x brx-app/launch-cursor.sh
    echo "✅ Updated brx-app/launch-cursor.sh"
}

# Main execution
main() {
    echo ""
    check_op_cli
    setup_op_account
    setup_vault
    create_credential_items
    generate_env_loader
    generate_verification_script
    generate_env_template
    update_launch_scripts
    
    echo ""
    echo "🎉 1Password setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Fill in your credentials in 1Password:"
    echo "   op item list --vault 'BRX Platform'"
    echo ""
    echo "2. Load credentials into your shell:"
    echo "   source scripts/load-credentials.sh"
    echo ""
    echo "3. Verify credentials are loaded:"
    echo "   scripts/verify-credentials.sh"
    echo ""
    echo "4. Run commands with 1Password injection:"
    echo "   op run -- npm run dev"
    echo "   op run -- python scripts/some-script.py"
    echo ""
    echo "5. For Cursor development:"
    echo "   cd brx-app && ./launch-cursor.sh"
    echo ""
    echo "📚 Documentation created in: 1PASSWORD_INTEGRATION.md"
}

# Run main
main