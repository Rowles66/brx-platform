# 1Password MCP Server Quick Start

Your MCP server now has 1Password integration! Here's how to use it:

## Step 1: Rebuild the Docker Image

```bash
cd mcp-server
docker build -t brx-mcp-server .
```

## Step 2: Sign in to 1Password

```bash
# On your host machine (not in Docker)
eval $(op signin)
```

## Step 3: Start the MCP Server with 1Password

```bash
# Get the session variable name
./op-connect.sh

# This will show you the command to run, something like:
# OP_SESSION_my_1password docker-compose up
```

## Step 4: Test in Claude Desktop

The MCP server is already configured in your Claude Desktop. Now you can use these new tools:

### Search your 1Password vault:
> "Search my 1Password for OpenAI"

### Analyze project for needed credentials:
> "Analyze the BRX app for required environment variables"

### Generate .env file automatically:
> "Create a .env.1password file with all needed credentials for the BRX app"

### Convert existing .env files:
> "Convert setup-env.sh placeholders to use my 1Password credentials"

## Available MCP Tools

Your MCP server now provides these 1Password tools:

1. **search_1password** - Search for items in your vault
2. **get_1password_reference** - Get the op:// reference for an item
3. **analyze_env_requirements** - Find what env vars the project needs
4. **generate_env_from_1password** - Auto-create .env with 1Password refs
5. **convert_env_to_1password** - Convert existing .env to use 1Password

## Example Requests in Claude

- "Find all my API keys in 1Password"
- "What environment variables does the BRX app need?"
- "Create a .env file for brx-app using my 1Password credentials"
- "Convert the example env file to use my actual 1Password items"

## Quick Test

Ask Claude to run this:
> "Use the MCP server to search my 1Password for 'github' and show me what's found"

Claude will use the `search_1password` tool and show you matching items from your vault!

## Troubleshooting

If 1Password tools aren't working:

1. Make sure you're signed in: `op account list`
2. Restart the MCP server with the session: `OP_SESSION_xxx docker-compose up`
3. Check logs: `docker logs brx-mcp-server`

## Production Setup (Optional)

For permanent setup, create a 1Password service account:

1. Go to: https://my.1password.com/integrations/service-accounts
2. Create a service account with read access
3. Add to `docker-compose.yml`:

```yaml
environment:
  - OP_SERVICE_ACCOUNT_TOKEN=ops_xxx_your_token_here
```

Then you won't need to pass session tokens!