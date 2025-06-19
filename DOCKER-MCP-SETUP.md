# Docker MCP Setup - Optimized Configuration

## Overview

This document describes the optimized Docker MCP setup for the BRX platform project.

## Current Configuration

### 1. Docker MCP Gateway

- **Purpose**: Provides access to 102+ MCP tools through Docker Desktop
- **Access**: Via `docker-mcp-gateway` in Cursor's MCP configuration
- **Available Servers**:
  - curl
  - desktop-commander
  - docker
  - fetch
  - filesystem
  - git
  - github-official
  - memory
  - node-code-sandbox
  - openapi-schema
  - osp_marketing_tools
  - puppeteer
  - sequentialthinking
  - youtube_transcript

### 2. BRX Platform Docker Server

- **Purpose**: Project-specific MCP server for BRX platform
- **Access**: Via `brx-platform-docker` in Cursor's MCP configuration
- **Features**:
  - Runs in Docker container
  - Read-only access to project workspace
  - Optional 1Password integration

## Cursor MCP Configuration

Location: `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "docker-mcp-gateway": {
      "command": "docker",
      "args": ["mcp", "gateway", "run"]
    },
    "brx-platform-docker": {
      "command": "docker",
      "args": [
        "compose",
        "-f",
        "/Users/joshrowles/github/brx-platform/mcp-server/docker-compose.yml",
        "run",
        "--rm",
        "-i",
        "brx-mcp-server"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## What Was Cleaned Up

1. **Removed old MCP Docker setup** (`~/mcp-docker-setup/`)

   - This was attempting to run MCP servers as HTTP services
   - MCP servers communicate via stdio, not HTTP

2. **Consolidated duplicate MCP server entries**

   - Removed individual NPX-based server entries
   - All functionality now available through Docker MCP Gateway

3. **Updated docker-compose.yml**
   - Removed obsolete `version` attribute
   - Cleaned up configuration

## Usage

### Using Docker MCP Gateway Tools

The Docker MCP Gateway provides access to all tools. To see available tools:

```bash
docker mcp tools list
```

### Building BRX MCP Server

If you need to rebuild the BRX MCP server:

```bash
cd /Users/joshrowles/github/brx-platform/mcp-server
docker build -t brx-mcp-server:latest .
```

### Verification

To verify the setup is working:

```bash
# Check available tools
docker mcp tools count

# List available servers
docker mcp server list
```

## Benefits of This Setup

1. **Simplified Configuration**: Only two MCP servers instead of 10+
2. **Better Performance**: Docker MCP Gateway manages servers efficiently
3. **Proper MCP Protocol**: Uses stdio communication as designed
4. **Easy Maintenance**: Single point of management through Docker Desktop

## Troubleshooting

If you encounter issues:

1. Ensure Docker Desktop is running
2. Restart Cursor to reload MCP configuration
3. Check Docker MCP Gateway status: `docker mcp gateway status`
4. Verify servers are available: `docker mcp server list`

---

Last Updated: June 2025
