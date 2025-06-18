# Testing 1Password MCP Integration

Follow these steps to verify your 1Password MCP integration is working correctly.

## Prerequisites Check

### 1. Install 1Password CLI (if not already installed)
```bash
# macOS
brew install 1password-cli

# Verify installation
op --version
# Should show: 2.x.x
```

### 2. Sign in to 1Password
```bash
# Sign in
eval $(op signin)

# Verify you're signed in
op account list
# Should show your account details
```

### 3. Test 1Password Access
```bash
# List some items to verify access
op item list --limit 5
# Should show some of your 1Password items
```

## Test the MCP Server Locally

### 1. Build the Docker Image
```bash
cd mcp-server
docker build -t brx-mcp-server .
```

### 2. Run the Automated Test
```bash
./test-1password.sh
```

You should see:
```
✅ Signed in to 1Password
✅ Docker is running
✅ MCP server image exists
✅ 1Password CLI works in container
🎉 Ready to use 1Password MCP!
```

### 3. Test 1Password Tools Directly
```bash
# Start the server with 1Password
./start-with-1password.sh
```

In another terminal:
```bash
# Test searching 1Password
docker exec -it brx-mcp-server node -e "
const { execSync } = require('child_process');
try {
  const result = execSync('op item list --limit 3 --format json');
  console.log('✅ 1Password working in container');
} catch (e) {
  console.log('❌ 1Password not working:', e.message);
}"
```

## Configure Claude Desktop

### 1. Update Claude Config

Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "/Applications/Docker.app/Contents/Resources/bin/docker",
      "args": ["mcp", "gateway", "run"]
    },
    "brx-1password": {
      "command": "/Users/joshrowles/github/brx-platform/mcp-server/docker-bridge.sh",
      "args": []
    }
  }
}
```

### 2. Make Sure You're Signed In
```bash
# This must be active when Claude starts
eval $(op signin)
```

### 3. Restart Claude Desktop
- Quit Claude Desktop completely (Cmd+Q)
- Start Claude Desktop again

## Test in Claude Desktop

### Test 1: List Available Tools
Ask Claude:
> "What MCP tools are available?"

You should see these 1Password tools in the list:
- search_1password
- get_1password_reference
- analyze_env_requirements
- generate_env_from_1password
- convert_env_to_1password

### Test 2: Search 1Password
Ask Claude:
> "Use the MCP server to search my 1Password for 'github'"

Expected: Claude uses the `search_1password` tool and shows matching items.

### Test 3: Analyze Project
Ask Claude:
> "Use the MCP server to analyze what environment variables the BRX app needs"

Expected: Claude uses `analyze_env_requirements` and lists required env vars.

### Test 4: Generate .env File
Ask Claude:
> "Use the MCP server to generate a .env.1password file for the BRX app"

Expected: Claude creates a file with 1Password references.

## Troubleshooting

### "1Password tools not available"
1. Check Claude config is correct
2. Ensure you're signed in: `op account list`
3. Restart Claude Desktop

### "1Password CLI not found"
1. Install: `brew install 1password-cli`
2. Rebuild Docker image: `docker build -t brx-mcp-server .`

### "No session found"
1. Sign in: `eval $(op signin)`
2. The session must be active when Claude starts

### Check Logs
```bash
# Claude MCP logs
tail -f ~/Library/Logs/Claude/mcp-server-brx-1password.log

# Docker logs
docker logs brx-mcp-server
```

## Quick Verification Script

```bash
#!/bin/bash
# Save as verify-mcp.sh

echo "Checking 1Password MCP Integration..."

# 1. Check CLI
if command -v op &>/dev/null; then
    echo "✅ 1Password CLI installed"
else
    echo "❌ Missing 1Password CLI"
fi

# 2. Check session
if op account list &>/dev/null; then
    echo "✅ Signed in to 1Password"
else
    echo "❌ Not signed in"
fi

# 3. Check Docker image
if docker images | grep -q brx-mcp-server; then
    echo "✅ Docker image exists"
else
    echo "❌ Docker image missing"
fi

# 4. Check Claude config
if grep -q "brx-1password" ~/Library/Application\ Support/Claude/claude_desktop_config.json 2>/dev/null; then
    echo "✅ Claude config updated"
else
    echo "❌ Claude config needs update"
fi
```

## Success Indicators

When everything is working, you should be able to:

1. ✅ See 1Password tools in Claude's tool list
2. ✅ Search your 1Password vault from Claude
3. ✅ Analyze projects for required credentials
4. ✅ Generate .env files with 1Password references
5. ✅ Convert existing .env files to use 1Password

## Next Steps

Once verified, you can:
- Ask Claude to create environment files for any project
- Search for specific credentials without leaving Claude
- Automatically analyze what credentials a project needs
- Keep all secrets in 1Password, never in code