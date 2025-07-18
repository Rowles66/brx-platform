# BRX Platform MCP Server

This is a Model Context Protocol (MCP) server that provides Claude Code with enhanced capabilities for working with the BRX Platform codebase.

## Features

The MCP server provides the following tools:

- **get_project_info**: Get information about the BRX platform project structure and status
- **analyze_codebase**: Analyze the codebase for patterns, components, or specific functionality  
- **get_development_context**: Get current development context including project status

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. For development with auto-reload:
   ```bash
   npm run dev
   ```

## Claude Code Integration

To connect this MCP server with Claude Code, add the following to your Claude configuration:

```json
{
  "mcpServers": {
    "brx-platform": {
      "command": "node",
      "args": ["/Users/joshrowles/github/brx-platform/mcp-server/src/index.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Available Tools

### get_project_info
Get information about the BRX platform architecture and structure.

Parameters:
- `section` (optional): Specific section to get info about (architecture, dependencies, scripts, status, all)

### analyze_codebase
Analyze the codebase for specific patterns or functionality.

Parameters:
- `type` (required): Type of analysis (components, apis, tests, patterns, dependencies)
- `pattern` (optional): Optional pattern to search for

### get_development_context
Get current development context and project status.

## Docker Setup

### Building and Running with Docker

```bash
# Build the Docker image
docker-compose build

# Run the MCP server
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the server
docker-compose down
```

### Important Notes about MCP Servers

MCP servers communicate via stdio (standard input/output), not HTTP. This means:

1. **You cannot directly connect to the Docker container via HTTP**
2. **The server needs to be connected through Claude Desktop app**
3. **Docker is useful for consistent environments but requires special configuration**

### Connecting Docker MCP Server to Claude

Since MCP servers use stdio, connecting a Dockerized MCP server to Claude Desktop requires a bridge. Here are the options:

1. **Run locally instead** (Recommended): The simplest approach
   ```bash
   npm install
   npm start
   ```

2. **Use Docker with a stdio bridge**: Create a local script that bridges Docker stdio
   ```bash
   #!/bin/bash
   docker run -i --rm -v $(pwd)/../:/workspace:ro brx-mcp-server
   ```

3. **Use the native setup**: Configure in Claude Desktop's settings with the local path

## Testing

You can test the MCP server by running it and sending JSON-RPC requests via stdio:

```bash
# Test the server directly
echo '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}' | node src/index.js
```

Or by connecting it through Claude Code with the provided configuration.