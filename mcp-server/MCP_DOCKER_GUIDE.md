# MCP Server Docker Guide

## Understanding MCP Servers

MCP (Model Context Protocol) servers are specialized tools that communicate with AI assistants like Claude through standard input/output (stdio) rather than HTTP. This makes them different from typical web services.

## Why MCP Servers Don't Show in Docker Desktop Like Web Apps

1. **No Network Ports**: MCP servers use stdio, not HTTP ports
2. **No Web UI**: They don't expose :3000, :8080, etc.
3. **Temporary Containers**: Claude creates fresh containers for each session

## How It Works

When you use the BRX MCP server in Claude:

1. Claude Desktop reads the configuration from `claude_desktop_config.json`
2. It runs: `docker compose run --rm -i brx-mcp-server`
3. This creates a temporary container that communicates via stdio
4. When you close Claude or the session ends, the container is removed

## Verifying Your MCP Server

### Check if the image exists:

```bash
docker images | grep brx-mcp-server
```

### Test the MCP server manually:

```bash
echo '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}' | \
  docker compose run --rm -i brx-mcp-server 2>/dev/null | jq .
```

### View available tools:

The BRX MCP server provides:

- Project analysis tools
- Development context tools
- 1Password integration tools

## Common Issues

### MCP Server Not Appearing in Claude

1. Restart Claude Desktop after configuration changes
2. Check Docker is running: `docker info`
3. Verify the image exists: `docker images | grep brx-mcp`

### Container Not Visible in Docker Desktop

This is normal! MCP containers are temporary and only exist during Claude sessions.

### Environment Variables Warning

The warnings about missing SUPABASE_URL, etc. are expected if you haven't set up a `.env` file. The MCP server will still work for code analysis.

## Configuration Location

Your Claude Desktop configuration is at:

```
~/Library/Application Support/Claude/claude_desktop_config.json
```

The MCP server is configured as:

```json
"brx-platform": {
  "command": "docker",
  "args": [
    "compose",
    "-f",
    "/Users/joshrowles/github/brx-platform/docker-compose.yml",
    "run",
    "--rm",
    "-i",
    "brx-mcp-server"
  ]
}
```
