#!/bin/bash

# Simple 1Password CLI wrapper for BRX Platform
# Provides convenient shortcuts for common 1Password operations

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Default vault
DEFAULT_VAULT="Development Credentials"

# Help function
show_help() {
    cat << EOF
🔐 BRX Platform 1Password CLI Wrapper

USAGE:
    ./scripts/op.sh <command> [options]

COMMANDS:
    signin                   Sign in to 1Password
    status                   Check signin status and list accounts
    vaults                   List all available vaults
    items [vault]           List items in vault (default: Development Credentials)
    show <item> [vault]     Show item structure (no secrets)
    env [vault]             Generate environment template
    session                 Show current session info

EXAMPLES:
    ./scripts/op.sh signin
    ./scripts/op.sh items
    ./scripts/op.sh show "BRX API Credentials"
    ./scripts/op.sh env "Development Credentials"

VAULT SHORTCUTS:
    dev     = Development Credentials
    staging = Staging Credentials  
    prod    = Production Credentials

EOF
}

# Resolve vault shortcuts
resolve_vault() {
    case "$1" in
        "dev"|"development") echo "Development Credentials" ;;
        "staging"|"stage") echo "Staging Credentials" ;;
        "prod"|"production") echo "Production Credentials" ;;
        "") echo "$DEFAULT_VAULT" ;;
        *) echo "$1" ;;
    esac
}

# Check if 1Password CLI is available
check_op_cli() {
    if ! command -v op &> /dev/null; then
        echo -e "${RED}❌ 1Password CLI not found${NC}"
        echo "Install with: brew install --cask 1password-cli"
        exit 1
    fi
}

# Check if signed in
check_signin() {
    if ! op account list &> /dev/null; then
        echo -e "${RED}❌ Not signed in to 1Password${NC}"
        echo "Run: ./scripts/op.sh signin"
        exit 1
    fi
}

# Main command handling
case "${1:-help}" in
    "signin")
        check_op_cli
        echo -e "${BLUE}🔑 Signing in to 1Password...${NC}"
        op signin
        echo -e "${GREEN}✅ Signed in successfully${NC}"
        ;;
        
    "status")
        check_op_cli
        echo -e "${BLUE}📊 1Password Status${NC}"
        echo "==================="
        
        if op account list &> /dev/null; then
            echo -e "${GREEN}✅ Signed in${NC}"
            echo ""
            echo "Accounts:"
            op account list
        else
            echo -e "${RED}❌ Not signed in${NC}"
            echo "Run: ./scripts/op.sh signin"
        fi
        ;;
        
    "vaults")
        check_op_cli
        check_signin
        echo -e "${BLUE}📁 Available Vaults${NC}"
        echo "=================="
        op vault list
        ;;
        
    "items")
        check_op_cli
        check_signin
        vault=$(resolve_vault "$2")
        echo -e "${BLUE}📄 Items in vault: $vault${NC}"
        echo "=================================="
        op item list --vault="$vault"
        ;;
        
    "show")
        check_op_cli
        check_signin
        
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Item name required${NC}"
            echo "Usage: ./scripts/op.sh show <item-name> [vault]"
            exit 1
        fi
        
        item="$2"
        vault=$(resolve_vault "$3")
        
        echo -e "${BLUE}🔍 Item Structure: $item${NC}"
        echo "================================="
        echo -e "${YELLOW}Vault:${NC} $vault"
        echo ""
        
        # Get item structure without revealing secrets
        op item get "$item" --vault="$vault" --format=json | jq '{
            title: .title,
            category: .category,
            vault: .vault.name,
            fields: [.fields[] | {
                label: .label,
                type: .type,
                purpose: .purpose,
                reference: "op://\(.vault.name)/\(.title)/\(.label // .id)"
            }]
        }'
        ;;
        
    "env")
        check_op_cli
        check_signin
        vault=$(resolve_vault "$2")
        
        echo -e "${BLUE}📝 Environment Template for: $vault${NC}"
        echo "================================================"
        echo "# Generated from 1Password vault: $vault"
        echo "# $(date)"
        echo ""
        
        # List items and generate env vars
        op item list --vault="$vault" --format=json | jq -r '.[] | select(.category == "LOGIN" or .category == "PASSWORD" or .category == "API_CREDENTIAL") | .title' | while read -r item; do
            # Get item fields
            echo "# $item"
            op item get "$item" --vault="$vault" --format=json | jq -r '.fields[] | select(.type == "CONCEALED" or .purpose == "PASSWORD" or (.label // .id | test("key|token|secret"; "i"))) | "\(.label // .id | ascii_upcase | gsub("[^A-Z0-9_]"; "_"))=\"op://\(.vault.name)/\(.title)/\(.label // .id)\""' 2>/dev/null || true
            echo ""
        done
        ;;
        
    "session")
        check_op_cli
        echo -e "${BLUE}🔐 Session Information${NC}"
        echo "====================="
        
        if op account list &> /dev/null; then
            echo -e "${GREEN}✅ Active session${NC}"
            op account get --format=json | jq '{
                account: .email,
                domain: .domain,
                user_uuid: .user_uuid,
                account_uuid: .account_uuid
            }'
        else
            echo -e "${RED}❌ No active session${NC}"
        fi
        ;;
        
    "help"|"--help"|"-h")
        show_help
        ;;
        
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac