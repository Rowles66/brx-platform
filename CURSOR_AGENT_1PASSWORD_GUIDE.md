# Cursor Agent 1Password Automation Guide

This guide shows how Cursor's AI agent can automatically search for and update .env files with your 1Password credentials.

## Available Commands for the Agent

The agent can run these commands to manage credentials:

### 1. Search for Credentials

```bash
# Search for specific credentials
./scripts/1password-agent-tools.sh search_1password "openai"
./scripts/1password-agent-tools.sh search_1password "database"
./scripts/1password-agent-tools.sh search_1password "api key"

# List all available credentials
./scripts/1password-agent-tools.sh list_all_credentials
```

### 2. Analyze Project Requirements

```bash
# Find what credentials the project needs
./scripts/1password-agent-tools.sh search_project_credentials brx-app

# This will:
# - Scan code for environment variables
# - Search 1Password for matching credentials
# - Show possible matches
```

### 3. Generate .env Files Automatically

```bash
# Auto-generate .env file with all detected credentials
./scripts/1password-agent-tools.sh generate_env_file .env.1password

# This creates a file with 1Password references based on:
# - Common credential patterns
# - Items found in your 1Password vault
```

### 4. Convert Existing .env Files

```bash
# Convert an existing .env file to use 1Password references
./scripts/1password-agent-tools.sh update_env_with_1password .env

# This will:
# - Backup the original file
# - Search for matching 1Password items
# - Create .env.1password with references
```

### 5. Get Specific References

```bash
# Get reference for a specific item
./scripts/1password-agent-tools.sh get_secret_reference "OpenAI"
# Output: op://Private/OpenAI/api_key

# Get all fields for an item
./scripts/1password-agent-tools.sh get_item_fields "Supabase"
```

## Example Agent Workflow

When you ask the agent to "set up my environment variables from 1Password":

1. **Agent analyzes the project:**
   ```bash
   ./scripts/1password-agent-tools.sh search_project_credentials .
   ```

2. **Agent searches for specific credentials:**
   ```bash
   ./scripts/1password-agent-tools.sh search_1password "openai"
   ./scripts/1password-agent-tools.sh search_1password "supabase"
   ```

3. **Agent generates .env file:**
   ```bash
   ./scripts/1password-agent-tools.sh generate_env_file .env.1password
   ```

4. **Agent shows you the result:**
   ```bash
   cat .env.1password
   ```

## How to Use in Cursor

### Ask the Agent:

> "Can you search my 1Password for OpenAI credentials and create an .env file?"

The agent will run:
```bash
./scripts/1password-agent-tools.sh search_1password "openai"
./scripts/1password-agent-tools.sh get_secret_reference "OpenAI" "api_key"
```

### Or ask:

> "Analyze this project and create a .env file with all needed credentials from 1Password"

The agent will run:
```bash
./scripts/1password-agent-tools.sh search_project_credentials .
./scripts/1password-agent-tools.sh generate_env_file .env.1password
```

### Or with existing .env:

> "Convert my .env file to use 1Password references"

The agent will run:
```bash
./scripts/1password-agent-tools.sh update_env_with_1password .env
```

## Advanced Usage

### Custom Field Names

If your 1Password items have custom fields:
```bash
# Get all fields for an item to see available options
./scripts/1password-agent-tools.sh get_item_fields "My API Service"

# Then get specific field reference
./scripts/1password-agent-tools.sh get_secret_reference "My API Service" "custom_field_name"
```

### Pattern-Based Search

The agent can search by patterns:
```bash
# Find all API keys
./scripts/1password-agent-tools.sh search_1password "api.*key"

# Find all database credentials
./scripts/1password-agent-tools.sh search_1password "database|postgres|mysql"
```

## Prerequisites

Before the agent can use these tools:

1. **1Password CLI must be installed:**
   ```bash
   brew install 1password-cli
   ```

2. **You must be signed in:**
   ```bash
   eval $(op signin)
   ```

3. **jq must be installed** (for JSON parsing):
   ```bash
   brew install jq
   ```

## Security Notes

- The agent never sees actual credential values
- Only 1Password references are written to files
- Original .env files are always backed up
- All operations require your 1Password authentication

## Common Agent Tasks

### "Set up a new Next.js project with credentials"
```bash
./scripts/1password-agent-tools.sh generate_env_file .env.local
```

### "Find database credentials for this project"
```bash
./scripts/1password-agent-tools.sh search_1password "database"
./scripts/1password-agent-tools.sh search_1password "postgres"
./scripts/1password-agent-tools.sh search_1password "supabase"
```

### "Create environment file for production"
```bash
./scripts/1password-agent-tools.sh generate_env_file .env.production
```

## Troubleshooting

If the agent encounters errors:

1. **"op: command not found"** - Install 1Password CLI
2. **"not signed in"** - Run `eval $(op signin)`
3. **"no items found"** - Check item names in 1Password
4. **"jq: command not found"** - Install jq with `brew install jq`

The agent can check the status with:
```bash
which op && echo "✅ 1Password CLI installed" || echo "❌ 1Password CLI not found"
op account list &>/dev/null && echo "✅ Signed in" || echo "❌ Not signed in"
```