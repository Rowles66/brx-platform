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

## Testing

You can test the MCP server by running it and sending JSON-RPC requests via stdio, or by connecting it through Claude Code with the provided configuration.