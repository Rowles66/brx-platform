# Adding 1Password MCP Server to Claude Desktop

You have two options for integrating 1Password with your existing Docker MCP setup:

## Option 1: Add to Your Existing Docker MCP Gateway (Recommended)

Since you're already using Docker MCP Toolkit, you can add our custom BRX MCP server (with 1Password) alongside your other servers.

### Step 1: Update Claude Desktop Config

Edit your Claude Desktop config file:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

Add the BRX MCP server alongside your existing Docker gateway:

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

### Step 2: Update the Docker Bridge Script

Edit `mcp-server/docker-bridge.sh` to pass 1Password session:

```bash
#!/bin/bash
# Bridge script to connect Docker MCP server to Claude Desktop

# Get 1Password session from host
SESSION_VAR=$(env | grep "^OP_SESSION_" | head -1)

if [ -n "$SESSION_VAR" ]; then
    # Run with 1Password session
    docker run -i --rm \
        -v $(pwd)/../:/workspace:ro \
        -e NODE_ENV=development \
        -e $SESSION_VAR \
        brx-mcp-server
else
    # Run without 1Password (limited functionality)
    docker run -i --rm \
        -v $(pwd)/../:/workspace:ro \
        -e NODE_ENV=development \
        brx-mcp-server
fi
```

### Step 3: Build and Start

```bash
cd mcp-server
chmod +x docker-bridge.sh
chmod +x start-with-1password.sh

# Sign in to 1Password
eval $(op signin)

# Build the image
docker build -t brx-mcp-server .

# Restart Claude Desktop
```

## Option 2: Run Standalone with Docker Compose

If you prefer to keep it separate from Docker MCP Toolkit:

```bash
cd mcp-server
./start-with-1password.sh
```

This runs the MCP server independently, but you'd need to add it to Claude's config as shown above.

## Testing in Claude Desktop

Once configured, you can test by asking Claude:

1. "List all available MCP tools" - Should show the new 1Password tools
2. "Search my 1Password for github" - Should search your vault
3. "Analyze the BRX app for required environment variables" - Should scan the code

## How It Works

- Your existing Docker MCP Gateway continues to work normally
- The BRX MCP server runs as a separate service with 1Password access
- Claude Desktop can use both simultaneously
- 1Password session is passed from your host to the Docker container

## Advantages of This Setup

✅ **No disruption** - Your existing MCP servers keep working  
✅ **1Password integrated** - Access your vault from Claude  
✅ **Project-specific** - BRX tools + 1Password in one server  
✅ **Secure** - Session tokens expire, no permanent credentials  

## Quick Start Commands

```bash
# 1. Sign in to 1Password
eval $(op signin)

# 2. Make scripts executable
cd mcp-server
chmod +x *.sh

# 3. Build the Docker image
docker build -t brx-mcp-server .

# 4. Update Claude config (see above)

# 5. Restart Claude Desktop
```

Then you can use both your existing Docker MCP tools AND the new 1Password tools!