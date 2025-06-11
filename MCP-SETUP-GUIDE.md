# MCP (Model Context Protocol) Setup Guide

## Overview
This guide documents how we configured Docker MCP Toolkit with Claude Desktop for the BRX Platform development.

## Setup Steps Completed

### 1. Initial Configuration
- Created `claude_desktop_config.json` with Docker MCP gateway configuration
- Encountered and resolved Docker path issues

### 2. Docker Path Resolution
- Initial error: `spawn docker ENOENT`
- Found broken symlink at `/usr/local/bin/docker`
- Updated configuration to use: `/Applications/Docker.app/Contents/Resources/bin/docker`
- Fixed broken symlink for future use

### 3. MCP Server Management
- Removed servers requiring unconfigured API keys:
  - firecrawl
  - github-chat
  - stripe
- Kept functional servers that don't require API keys

## Available MCP Servers

### Currently Active
- **filesystem** - File operations (restricted to `/Users/joshrowles/github`)
- **fetch** - HTTP requests
- **memory** - Persistent storage across conversations
- **docker** - Docker container management
- **curl** - Execute curl commands
- **youtube_transcript** - Fetch YouTube transcripts
- **node-code-sandbox** - Execute Node.js code
- **openapi-schema** - Work with OpenAPI schemas

### Configuration File
Location: `/Users/joshrowles/Library/Application Support/Claude/claude_desktop_config.json`

Current content:
```json
{"mcpServers":{"MCP_DOCKER":{"command":"/Applications/Docker.app/Contents/Resources/bin/docker","args":["mcp","gateway","run"]}}}
```

## Security Notes
- Filesystem access is restricted to `/Users/joshrowles/github` for security
- Secrets are managed through Docker's secure credential store
- Each MCP server runs in an isolated container

## Adding New Servers
1. Open Docker Desktop
2. Navigate to MCP Toolkit extension
3. Browse the Catalog tab
4. Click the Plus icon to add servers
5. Configure any required API keys via `docker mcp secret set`

## Troubleshooting
- Always restart Claude Desktop after configuration changes
- Check logs at: `/Users/joshrowles/Library/Logs/Claude/mcp-server-MCP_DOCKER.log`
- Ensure Docker Desktop is running before starting Claude

## Next Steps
- Configure GitHub MCP server with personal access token if needed
- Explore additional MCP servers from the Docker catalog
- Set up any project-specific MCP servers for BRX development