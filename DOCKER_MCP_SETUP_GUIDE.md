# Docker MCP Server Setup Guide for Cursor

## Overview
Your Docker MCP server is now working with Cursor! This guide explains how to use it effectively.

## What's Configured

### 1. Docker MCP Server Configuration
The MCP server is configured in `~/.cursor/mcp.json` with these servers:

- **brx-platform-docker**: Your custom Docker MCP server with 1Password integration
- **brx-platform-local**: Local version for faster development
- **filesystem**: Standard filesystem access
- **git**: Git operations
- **docker-system**: Generic Docker tools

### 2. Available Tools in Your Custom MCP Server
Your BRX MCP server provides these tools:
- `get_project_info` - Get BRX platform project information
- `analyze_codebase` - Analyze code patterns and components  
- `get_development_context` - Get current development context
- `op_list_vaults` - List 1Password vaults
- `op_list_vault_items` - List items in 1Password vaults
- `op_get_item_structure` - Get 1Password item structure
- `op_generate_env_template` - Generate environment templates
- `op_discover_project_vars` - Discover project environment variables
- `op_create_env_mapping` - Map project vars to 1Password items
- `op_check_session` - Check 1Password session status

## How to Use

### 1. Restart Cursor
After making MCP configuration changes, restart Cursor to load the new servers.

### 2. Access MCP Tools
In Cursor, you can now:
- Open the Command Palette (Cmd/Ctrl+Shift+P)
- Type "MCP" to see available MCP commands
- Use the AI chat with MCP tool access

### 3. Test the Connection
You can test the MCP server using:
```bash
cd /workspace/mcp-server
node test-mcp-connection.js
```

## Docker Commands

### Build the Image
```bash
cd /workspace/mcp-server
sudo docker compose build
```

### Test the Docker Server
```bash
# Test with initialization
echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}' | sudo docker run --rm -i brx-mcp-server:latest
```

### Run Development Server
```bash
# For development, you can use the local version:
cd /workspace/mcp-server
node src/index.js
```

## Troubleshooting

### 1. Docker Issues
If Docker containers don't start:
```bash
sudo systemctl start docker  # If using systemd
# OR
sudo dockerd &  # Manual start
```

### 2. MCP Server Not Responding
1. Check if the Docker image exists:
   ```bash
   sudo docker images | grep brx-mcp-server
   ```

2. Test the server manually:
   ```bash
   cd /workspace/mcp-server
   node test-mcp-connection.js
   ```

### 3. Cursor Not Seeing MCP Servers
1. Verify configuration file exists:
   ```bash
   cat ~/.cursor/mcp.json
   ```

2. Restart Cursor completely
3. Check Cursor logs for MCP connection errors

### 4. 1Password Integration Issues
The Docker container includes 1Password CLI but needs:
- Valid 1Password session
- Proper vault access
- Environment variables for credentials

## Configuration Files

### MCP Configuration (~/.cursor/mcp.json)
```json
{
  "mcpServers": {
    "brx-platform-docker": {
      "command": "sudo",
      "args": [
        "docker", "compose", "-f", 
        "/workspace/mcp-server/docker-compose.yml",
        "run", "--rm", "-i", "brx-mcp-server"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

### Docker Compose (mcp-server/docker-compose.yml)
- Builds custom MCP server with 1Password CLI
- Mounts workspace for project access
- Configures proper stdio communication

## Development Workflow

### 1. Making Changes
1. Edit MCP server code in `mcp-server/src/`
2. Rebuild Docker image: `sudo docker compose build`
3. Test changes: `node test-mcp-connection.js`
4. Restart Cursor to pick up changes

### 2. Adding New Tools
1. Add tool definitions in `mcp-server/src/index.js`
2. Implement tool handlers
3. Rebuild and test
4. Update this documentation

## Security Notes

- The Docker MCP server runs with elevated privileges (sudo) for Docker access
- 1Password integration requires careful secret management
- Workspace is mounted read-only in Docker for security
- All MCP communication happens over stdio, not network

## Performance Tips

- Use local version (`brx-platform-local`) for faster development
- Use Docker version (`brx-platform-docker`) for production-like environment
- Docker containers are ephemeral - they start fresh each time

## Success Indicators

✅ Docker image builds without errors
✅ MCP server responds to initialize requests  
✅ Tools list returns expected tools
✅ Cursor can connect to MCP servers
✅ 1Password integration works (if configured)

Your Docker MCP server is now ready to use with Cursor!