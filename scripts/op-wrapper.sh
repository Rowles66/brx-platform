#!/bin/bash

# 1Password Wrapper Script for BRX Platform
# This script provides easy shortcuts for running common commands with 1Password credentials

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if 1Password CLI is available
if ! command -v op &> /dev/null; then
    echo -e "${RED}❌ 1Password CLI is not installed${NC}"
    echo "Please run: ./scripts/1password-setup.sh"
    exit 1
fi

# Check if signed in
if ! op account list &> /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Not signed in to 1Password${NC}"
    echo "Please run: eval \$(op signin)"
    exit 1
fi

# Function to display usage
usage() {
    echo "Usage: $0 <command> [args...]"
    echo ""
    echo "Commands:"
    echo "  dev              - Run Next.js development server"
    echo "  build            - Build Next.js project"
    echo "  test             - Run all tests"
    echo "  test:e2e         - Run E2E tests"
    echo "  db:migrate       - Run database migrations"
    echo "  db:push          - Push schema to database"
    echo "  db:studio        - Open Prisma Studio"
    echo "  firecrawl        - Run FireCrawl extraction"
    echo "  scrape <url>     - Scrape a specific URL with FireCrawl"
    echo "  verify           - Verify all credentials are set"
    echo "  env              - Generate .env.local from 1Password"
    echo "  run <cmd>        - Run any command with credentials"
    echo ""
    echo "Examples:"
    echo "  $0 dev"
    echo "  $0 test:e2e"
    echo "  $0 run npm run custom-script"
    exit 1
}

# Check if no arguments provided
if [ $# -eq 0 ]; then
    usage
fi

# Get the command
COMMAND=$1
shift

# Function to change to brx-app directory if needed
cd_to_brx_app() {
    if [ -d "brx-app" ]; then
        cd brx-app
    elif [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Not in a Node.js project directory${NC}"
        exit 1
    fi
}

# Execute based on command
case $COMMAND in
    "dev")
        cd_to_brx_app
        echo -e "${GREEN}🚀 Starting development server with 1Password...${NC}"
        op run -- npm run dev
        ;;
    
    "build")
        cd_to_brx_app
        echo -e "${GREEN}🔨 Building project with 1Password...${NC}"
        op run -- npm run build
        ;;
    
    "test")
        cd_to_brx_app
        echo -e "${GREEN}🧪 Running tests with 1Password...${NC}"
        op run -- npm test
        ;;
    
    "test:e2e")
        cd_to_brx_app
        echo -e "${GREEN}🎭 Running E2E tests with 1Password...${NC}"
        op run -- npm run test:e2e
        ;;
    
    "db:migrate")
        cd_to_brx_app
        echo -e "${GREEN}🗄️  Running database migrations with 1Password...${NC}"
        op run -- npx prisma migrate dev
        ;;
    
    "db:push")
        cd_to_brx_app
        echo -e "${GREEN}🗄️  Pushing database schema with 1Password...${NC}"
        op run -- npx prisma db push
        ;;
    
    "db:studio")
        cd_to_brx_app
        echo -e "${GREEN}🎨 Opening Prisma Studio with 1Password...${NC}"
        op run -- npx prisma studio
        ;;
    
    "firecrawl")
        echo -e "${GREEN}🔥 Running FireCrawl extraction with 1Password...${NC}"
        if [ -f "brx-app/scripts/extract_with_firecrawl.py" ]; then
            op run -- python brx-app/scripts/extract_with_firecrawl.py
        elif [ -f "scripts/extract_with_firecrawl.py" ]; then
            op run -- python scripts/extract_with_firecrawl.py
        else
            echo -e "${RED}❌ FireCrawl script not found${NC}"
            exit 1
        fi
        ;;
    
    "scrape")
        if [ -z "$1" ]; then
            echo -e "${RED}❌ Please provide a URL to scrape${NC}"
            exit 1
        fi
        echo -e "${GREEN}🔍 Scraping $1 with FireCrawl...${NC}"
        op run -- python -c "
import os
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv('FIRECRAWL_API_KEY'))
result = app.scrape_url('$1')
print(result)
"
        ;;
    
    "verify")
        echo -e "${GREEN}✅ Verifying 1Password credentials...${NC}"
        ./scripts/verify-credentials.sh
        ;;
    
    "env")
        echo -e "${GREEN}📄 Generating .env.local from 1Password...${NC}"
        cd_to_brx_app
        
        # Generate .env.local with actual values
        echo "# Generated from 1Password - DO NOT COMMIT" > .env.local
        echo "# Generated on: $(date)" >> .env.local
        echo "" >> .env.local
        
        # Load and export each credential
        source ../scripts/load-credentials.sh
        
        # Write to .env.local
        {
            echo "# Database"
            echo "DATABASE_URL=$DATABASE_URL"
            echo ""
            echo "# Supabase"
            echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"
            echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY"
            echo "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY"
            echo ""
            echo "# NextAuth"
            echo "NEXTAUTH_URL=$NEXTAUTH_URL"
            echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
            echo ""
            echo "# APIs"
            echo "FIRECRAWL_API_KEY=$FIRECRAWL_API_KEY"
            echo "BRX_API_TOKEN=$BRX_API_TOKEN"
            echo "BRX_BEARER_TOKEN=$BRX_BEARER_TOKEN"
        } >> .env.local
        
        echo -e "${GREEN}✅ Generated .env.local successfully${NC}"
        ;;
    
    "run")
        if [ $# -eq 0 ]; then
            echo -e "${RED}❌ Please provide a command to run${NC}"
            exit 1
        fi
        echo -e "${GREEN}🏃 Running command with 1Password: $*${NC}"
        op run -- "$@"
        ;;
    
    *)
        echo -e "${RED}❌ Unknown command: $COMMAND${NC}"
        usage
        ;;
esac