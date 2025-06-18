# 1Password Integration

## Quick Start

### Option 1: MCP Server (For Claude Desktop)
```bash
# 1. Install 1Password CLI
brew install 1password-cli

# 2. Sign in
eval $(op signin)

# 3. Build & test
cd mcp-server
./test-1password.sh

# 4. Add to Claude Desktop config:
# ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "brx-1password": {
      "command": "/path/to/brx-platform/mcp-server/docker-bridge.sh"
    }
  }
}
```

### Option 2: VS Code Extension (Simplest)
1. Install "1Password" extension in VS Code/Cursor
2. Click 1Password icons in .env files to fill credentials

### Option 3: CLI (For scripts)
```bash
op run --env-file=.env.1password -- npm run dev
```

## Environment Variables

Create `.env.1password` with references (safe to commit):
```bash
# Copy template
cp .env.1password.complete .env.1password

# Edit to match your 1Password items
# Format: VARIABLE="op://VaultName/ItemName/FieldName"
OPENAI_API_KEY="op://Private/OpenAI/api_key"
DATABASE_URL="op://Private/Supabase/database_url"
```

## Why References Are Safe

- `.env.1password` contains **references**, not secrets
- Like `op://Private/OpenAI/api_key` - useless without 1Password access
- Safe to commit so AI agents know what credentials are needed

## Testing

```bash
# Quick check
cd mcp-server && ./verify-mcp.sh

# Full test
./test-1password.sh
```

## All Environment Variables Used

See `.env.1password.complete` for the complete list of variables this project uses.