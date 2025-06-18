# 1Password Integration for BRX Platform

This guide provides comprehensive instructions for integrating 1Password with the BRX Platform project to securely manage authentication variables and credentials.

## Overview

The BRX Platform uses 1Password CLI to manage all sensitive credentials including:
- API keys and tokens
- Database connection strings
- Service account credentials
- Authentication secrets
- Third-party service integrations

## Prerequisites

1. **1Password Account**: You need an active 1Password account (personal or team)
2. **1Password Desktop App**: Install from [1password.com](https://1password.com/downloads)
3. **1Password CLI**: Required for command-line integration

## Installation

### 1. Install 1Password CLI

#### macOS (Homebrew)
```bash
brew install 1password-cli
```

#### Linux/WSL
```bash
curl -sS https://downloads.1password.com/linux/keys/1password.asc | \
  sudo gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg

echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/amd64 stable main' | \
  sudo tee /etc/apt/sources.list.d/1password.list

sudo apt update && sudo apt install 1password-cli
```

### 2. Run Setup Script

```bash
./scripts/1password-setup.sh
```

This script will:
- Verify 1Password CLI installation
- Help you sign in to your 1Password account
- Create a "BRX Platform" vault
- Set up credential items for all services
- Generate helper scripts

### 3. Sign In to 1Password

If not already signed in:
```bash
# Add your account
op account add

# Sign in
eval $(op signin)
```

## Credential Structure

The setup creates the following credential items in your "BRX Platform" vault:

### BRX API Credentials
- `BRX_USERNAME` - BRX Performance username
- `BRX_PASSWORD` - BRX Performance password
- `BRX_API_TOKEN` - API authentication token
- `BRX_BEARER_TOKEN` - Bearer token for API requests
- `BRX_API_ENDPOINT` - API base URL

### Firecrawl API
- `FIRECRAWL_API_KEY` - Firecrawl service API key

### Supabase Credentials
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `DATABASE_URL` - PostgreSQL connection string

### Upstash Redis
- `UPSTASH_REDIS_REST_URL` - Redis REST API URL
- `UPSTASH_REDIS_REST_TOKEN` - Redis authentication token

### GitHub Tokens
- `GITHUB_TOKEN` - GitHub personal access token
- `GH_PAT` - Alternative GitHub PAT

### Google Cloud Platform
- `GCP_PROJECT_ID` - GCP project identifier
- `GCP_SERVICE_ACCOUNT_KEY` - Service account JSON key
- `BIGQUERY_DATASET` - BigQuery dataset name

### Vercel Deploy
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Organization ID
- `VERCEL_PROJECT_ID` - Project ID

### NextAuth Secrets
- `NEXTAUTH_SECRET` - NextAuth.js encryption secret
- `NEXTAUTH_URL` - Application URL

## Usage Methods

### Method 1: Load Credentials into Shell

```bash
# Load all credentials as environment variables
source scripts/load-credentials.sh

# Verify loaded credentials
scripts/verify-credentials.sh

# Now run commands normally
npm run dev
python scripts/some-script.py
```

### Method 2: Use op run (Recommended)

```bash
# Run commands with 1Password injection
op run -- npm run dev
op run -- npm test
op run -- python scripts/extract_with_firecrawl.py
```

### Method 3: Use .env Files with 1Password References

1. Copy the template:
```bash
cp .env.1password.template .env.local
```

2. Run with op:
```bash
op run --env-file=.env.local -- npm run dev
```

## Development with Cursor

### Launch Cursor with Credentials

```bash
cd brx-app
./launch-cursor.sh
```

This will:
1. Load all credentials from 1Password
2. Set environment variables
3. Launch Cursor with the loaded environment

### Working in Cursor

When working in Cursor, you have access to all loaded credentials. To run commands:

```bash
# Option 1: If launched with launch-cursor.sh
npm run dev  # Credentials are already in environment

# Option 2: Use op run for specific commands
op run -- npm run dev
```

## CI/CD Integration

### GitHub Actions

1. Create a 1Password Service Account
2. Add the service account token to GitHub Secrets as `OP_SERVICE_ACCOUNT_TOKEN`
3. Use in workflows:

```yaml
- name: Load secrets from 1Password
  env:
    OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
  run: |
    op run -- npm test
```

## Security Best Practices

1. **Never commit credentials**: All `.env` files are gitignored
2. **Use op run**: Prefer `op run` over loading credentials into shell
3. **Rotate regularly**: Update credentials in 1Password periodically
4. **Limit scope**: Use minimal permissions for API keys
5. **Audit access**: Review 1Password access logs regularly

## Troubleshooting

### "1Password CLI is not installed"
- Follow installation instructions above
- Verify with: `op --version`

### "Not signed in to 1Password"
```bash
eval $(op signin)
```

### "Credential not found"
1. Check item exists: `op item list --vault "BRX Platform"`
2. Verify field name: `op item get "Item Name" --vault "BRX Platform"`
3. Fill in missing values in 1Password app

### "Permission denied"
- Ensure scripts are executable: `chmod +x scripts/*.sh`
- Check 1Password vault permissions

## Adding New Credentials

1. Create in 1Password:
```bash
op item create \
  --category password \
  --title "New Service" \
  --vault "BRX Platform" \
  "API_KEY[password]"="your-key-here"
```

2. Update `scripts/load-credentials.sh` to include:
```bash
export NEW_SERVICE_API_KEY=$(op item get "New Service" --vault "$VAULT_NAME" --fields "API_KEY" 2>/dev/null || echo "")
```

3. Add to verification script if needed

## Project-Specific Scripts

### FireCrawl Extraction
```bash
op run -- python brx-app/scripts/extract_with_firecrawl.py
```

### E2E Testing
```bash
op run -- npm run test:e2e
```

### Database Migrations
```bash
op run -- npx prisma migrate dev
```

## Environment Files

### Templates Provided
- `.env.1password.template` - Root project template
- `brx-app/.env.1password.template` - BRX app specific template
- `v0-recreate-visual-design/.env.1password.template` - V0 project template

### Using Templates
1. Copy template to `.env.local`
2. Templates contain 1Password references like: `op://BRX Platform/Item/field`
3. Use with: `op run --env-file=.env.local -- command`

## Maintenance

### Update Credentials
```bash
# View current items
op item list --vault "BRX Platform"

# Edit in 1Password app or CLI
op item edit "Item Name" --vault "BRX Platform"
```

### Backup Vault
```bash
# Export vault (be careful with this!)
op vault export "BRX Platform" --output-file brx-vault-backup.1pif
```

## Support

For issues or questions:
1. Check 1Password CLI docs: https://developer.1password.com/docs/cli
2. Review this guide and troubleshooting section
3. Check script outputs for specific error messages