# 1Password Integration for BRX Platform

This directory contains configuration and documentation for the 1Password integration with the BRX Platform development workflow.

## Overview

The BRX Platform uses 1Password to securely manage all development credentials and API keys. This integration allows AI agents (like Claude) to see what credentials a project needs without exposing actual secrets.

## Components

### MCP Server Integration
- **Location**: `mcp-server/src/1password-tools.js`
- **Purpose**: Provides secure 1Password tools via Model Context Protocol (MCP)
- **Features**: 
  - List vaults and items (without exposing secrets)
  - Generate environment templates with 1Password references
  - Map project variables to vault items
  - Check session status

### Docker Support
- **Dockerfile**: Updated to include 1Password CLI
- **docker-compose.yml**: Configured for session management
- **Benefits**: Consistent environment across different machines

### Helper Scripts
- `test-1password.sh`: Test all 1Password MCP tools
- `verify-mcp.sh`: Verify complete MCP server functionality  
- `start-with-1password.sh`: Start server with proper 1Password setup
- `docker-bridge.sh`: Bridge Docker stdio to Claude Desktop

## Setup Instructions (macOS)

### 1. Install 1Password CLI

```bash
# Using Homebrew (recommended)
brew install --cask 1password-cli

# Or download directly from
# https://developer.1password.com/docs/cli/get-started/
```

### 2. Sign in to 1Password

```bash
# Sign in to your account
op signin

# Verify it worked
op account list
```

### 3. Set up your vaults

Create these vaults in 1Password (or rename existing ones):

- **Development Credentials**: For development environment secrets
- **Staging Credentials**: For staging environment secrets  
- **Production Credentials**: For production environment secrets

### 4. Configure Claude Desktop

Add this to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  \"mcpServers\": {
    \"brx-platform\": {
      \"command\": \"node\",
      \"args\": [\"/Users/joshrowles/github/brx-platform/mcp-server/src/index.js\"],
      \"env\": {
        \"NODE_ENV\": \"development\"
      }
    }
  }
}
```

### 5. Test the integration

```bash
cd /Users/joshrowles/github/brx-platform/mcp-server
./test-1password.sh
```

## Available MCP Tools

### Core 1Password Tools

- **`op_check_session`**: Check if 1Password CLI session is active
- **`op_list_vaults`**: List all accessible vaults
- **`op_list_vault_items`**: List items in a specific vault
- **`op_get_item_structure`**: Get item structure (fields, but not values)
- **`op_generate_env_template`**: Generate `.env` template with 1Password references
- **`op_discover_project_vars`**: Find environment variables used in the project
- **`op_create_env_mapping`**: Map project variables to vault items

### Project Analysis Tools

- **`get_project_info`**: Get BRX platform architecture information
- **`analyze_codebase`**: Analyze components, APIs, tests, etc.
- **`get_development_context`**: Get current development status

## Vault Structure

### Development Credentials Vault

Recommended items and their purposes:

#### Database & Infrastructure
- **BRX Database**: Connection strings and credentials
- **Redis Connection**: Cache server credentials
- **Supabase**: Database and auth service credentials

#### AI & ML Services
- **OPENAI_API_KEY**: OpenAI API access
- **Anthropic API**: Claude API access
- **Pinecone**: Vector database credentials

#### External APIs
- **FIRECRAWL_API_KEY**: Web scraping service
- **BRX API Credentials**: BRX Performance platform access
- **BRX Admin Credentials**: Administrative access

#### Authentication & Security
- **NextAuth**: Authentication service secrets
- **JWT Secrets**: Token signing keys
- **Encryption Keys**: Data encryption keys

## Environment Variable Templates

### Development Template (`.env.local`)

```bash
# Auto-generated from 1Password - DO NOT EDIT MANUALLY

# Database & Infrastructure
DATABASE_URL=\"op://Development Credentials/BRX Database/connection_string\"
REDIS_URL=\"op://Development Credentials/Redis Connection/url\"
SUPABASE_URL=\"op://Development Credentials/Supabase/url\"
SUPABASE_ANON_KEY=\"op://Development Credentials/Supabase/anon_key\"
SUPABASE_SERVICE_ROLE_KEY=\"op://Development Credentials/Supabase/service_role_key\"

# AI & ML Services
OPENAI_API_KEY=\"op://Development Credentials/OPENAI_API_KEY/credential\"
ANTHROPIC_API_KEY=\"op://Development Credentials/Anthropic API/api_key\"
PINECONE_API_KEY=\"op://Development Credentials/Pinecone/api_key\"
PINECONE_ENVIRONMENT=\"op://Development Credentials/Pinecone/environment\"

# External APIs
FIRECRAWL_API_KEY=\"op://Development Credentials/FIRECRAWL_API_KEY/credential\"
BRX_API_TOKEN=\"op://Development Credentials/BRX API Credentials/API_TOKEN\"
BRX_BEARER_TOKEN=\"op://Development Credentials/BRX API Credentials/BEARER_TOKEN\"
BRX_API_DOCS_USERNAME=\"op://Development Credentials/BRX API Credentials/BRX_API_DOCS_USERNAME\"
BRX_API_DOCS_PASSWORD=\"op://Development Credentials/BRX API Credentials/BRX_API_DOCS_PASSWORD\"
BRX_API_BASE_URL=\"op://Development Credentials/BRX API Credentials/baseUrl\"
BRX_USERNAME=\"op://Development Credentials/BRX Admin Credentials/username\"
BRX_PASSWORD=\"op://Development Credentials/BRX Admin Credentials/password\"

# Authentication & Security
NEXTAUTH_SECRET=\"op://Development Credentials/NextAuth/secret\"
NEXTAUTH_URL=\"op://Development Credentials/NextAuth/url\"
JWT_SECRET=\"op://Development Credentials/JWT Secrets/secret\"
ENCRYPTION_KEY=\"op://Development Credentials/Encryption Keys/primary_key\"

# Development Settings
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
VERCEL_ENV=development
```

## Usage with Claude

Once configured, you can ask Claude to:

1. **Check your credentials**: \"Check my 1Password session status\"
2. **Generate environment files**: \"Generate an environment template from my Development Credentials vault\"
3. **Map project variables**: \"Map the environment variables used in this project to my 1Password items\"
4. **Analyze vault structure**: \"Show me the structure of my BRX API Credentials item\"

## Security Features

### What's Secure
- ✅ Actual secret values are never exposed to Claude or the MCP server
- ✅ Only item structure and field names are visible
- ✅ 1Password references are used instead of hardcoded values
- ✅ Session management is handled automatically
- ✅ All operations are logged for audit

### What Claude Can See
- Vault names and item titles
- Field labels and types (but not values)
- Whether fields have values or are empty
- 1Password reference paths (`op://vault/item/field`)

### What Claude Cannot See
- Actual passwords, API keys, or secrets
- Private notes or secure fields
- Vault permissions or sharing settings

## Troubleshooting

### Common Issues

1. **\"Not signed in to 1Password\"**
   ```bash
   op signin
   ```

2. **\"1Password CLI not found\"**
   ```bash
   brew install --cask 1password-cli
   ```

3. **MCP server not connecting to Claude**
   - Check Claude Desktop configuration
   - Verify file paths are absolute
   - Restart Claude Desktop application

4. **Docker session issues**
   ```bash
   export OP_SESSION=$(op signin --raw)
   docker-compose up brx-mcp-server
   ```

### Debug Commands

```bash
# Test 1Password CLI directly
op account list
op vault list
op item list --vault=\"Development Credentials\"

# Test MCP server
cd mcp-server
./verify-mcp.sh

# Test 1Password integration specifically  
./test-1password.sh
```

## Development Workflow

### For AI Agents

1. **Session Check**: Always verify 1Password session is active
2. **Credential Discovery**: Use MCP tools to discover what credentials are available
3. **Environment Setup**: Generate environment files with proper references
4. **Validation**: Verify all required variables are mapped to vault items

### For Developers

1. **Initial Setup**: Run setup scripts to configure 1Password and Claude
2. **Daily Use**: 1Password session management is automatic
3. **New Credentials**: Add to appropriate vault, regenerate environment templates
4. **Team Collaboration**: Share vault access, not actual secrets

## Advanced Configuration

### Service Account (CI/CD)

For automated environments, use 1Password service accounts:

```bash
# Set up service account token
export OP_SERVICE_ACCOUNT_TOKEN=\"your-service-account-token\"

# No signin required with service accounts
op vault list
```

### Multiple Environments

Configure different vaults for different environments:

```json
{
  \"environments\": {
    \"development\": \"Development Credentials\",
    \"staging\": \"Staging Credentials\", 
    \"production\": \"Production Credentials\"
  }
}
```

### Custom Vault Mapping

Override default vault names in your local configuration:

```bash
export BRX_1PASSWORD_DEV_VAULT=\"My Dev Vault\"
export BRX_1PASSWORD_PROD_VAULT=\"My Prod Vault\"
```

## Integration with Other Tools

### npm scripts
All npm scripts in the BRX platform automatically use 1Password via `op run`:

```bash
npm run dev    # Uses: op run --env-file=.env.local -- next dev
npm run build  # Uses: op run --env-file=.env.local -- next build
```

### CI/CD Pipelines
GitHub Actions workflow includes 1Password service account integration for secure deployment.

### Development Scripts
All development scripts support 1Password integration for maximum security and convenience.

---

For more information, see:
- [1Password CLI Documentation](https://developer.1password.com/docs/cli/)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [BRX Platform Documentation](../README.md)