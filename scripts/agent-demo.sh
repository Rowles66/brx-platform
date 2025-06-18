#!/bin/bash

# Demo: How Cursor Agent can automatically manage 1Password credentials
# This shows what happens when you ask the agent to set up credentials

echo "🤖 Cursor Agent 1Password Demo"
echo "=============================="
echo ""

# Step 1: Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI not installed"
    echo "   Please run: brew install 1password-cli"
    exit 1
fi

if ! op account list &> /dev/null 2>&1; then
    echo "❌ Not signed in to 1Password"
    echo "   Please run: eval \$(op signin)"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "❌ jq not installed"
    echo "   Please run: brew install jq"
    exit 1
fi

echo "✅ All prerequisites met!"
echo ""

# Step 2: Analyze project
echo "🔍 Agent analyzing project for required credentials..."
echo "Running: ./scripts/1password-agent-tools.sh search_project_credentials brx-app"
echo ""
./scripts/1password-agent-tools.sh search_project_credentials brx-app
echo ""

# Step 3: Search for common credentials
echo "🔎 Agent searching for common credentials..."
SEARCH_TERMS=("openai" "database" "supabase" "github" "vercel")

for term in "${SEARCH_TERMS[@]}"; do
    echo "Searching for: $term"
    ./scripts/1password-agent-tools.sh search_1password "$term" | head -3
    echo ""
done

# Step 4: Generate .env file
echo "📝 Agent generating .env.1password file..."
./scripts/1password-agent-tools.sh generate_env_file .env.1password.demo
echo ""

# Step 5: Show the result
echo "📄 Generated file contents:"
echo "----------------------------"
head -20 .env.1password.demo
echo "..."
echo "----------------------------"
echo ""

# Step 6: Example of getting specific reference
echo "🔗 Agent getting specific reference example:"
echo "Looking for OpenAI API key..."
OPENAI_REF=$(./scripts/1password-agent-tools.sh search_1password "openai" | head -1)
if [ -n "$OPENAI_REF" ]; then
    ITEM_NAME=$(echo "$OPENAI_REF" | sed 's/.*\/\(.*\) \[.*/\1/')
    echo "Found: $ITEM_NAME"
    ./scripts/1password-agent-tools.sh get_secret_reference "$ITEM_NAME" "api_key"
fi
echo ""

echo "✅ Demo complete!"
echo ""
echo "This is how the agent can automatically:"
echo "1. Analyze your project for needed credentials"
echo "2. Search your 1Password vault"
echo "3. Generate .env files with proper references"
echo "4. Get specific credential references"
echo ""
echo "Try asking the agent:"
echo '  "Set up my environment variables from 1Password"'
echo '  "Find my OpenAI API key in 1Password"'
echo '  "Create a .env file with all my credentials"'