# Environment Files & 1Password Setup Audit Report

Generated: June 18, 2025

## Current Status

### 1Password CLI Installation
- **Status**: ❌ Not installed
- **Action Required**: Install with `brew install 1password-cli` (macOS) or follow Linux instructions

### Environment Files Found
- **Total .env files**: 0 (Good! No hardcoded secrets found)
- **Example files**: 1 (`.env.1password.example`)
- **Active .env.1password**: ❌ Not created yet

### Scripts Available
- ✅ `scripts/1password-connect.sh` - Lists your existing 1Password items
- ✅ `scripts/op.sh` - Simple wrapper to run commands with 1Password
- ✅ `scripts/setup-cursor-1password.sh` - Sets up VS Code/Cursor integration

## Environment Variables Actually Used in Code

Based on code analysis, these environment variables are referenced:

### Core API Credentials
- `FIRECRAWL_API_KEY` ✅ (in example) - Used in multiple scrapers
- `BRX_APP_USERNAME` / `BRX_USERNAME` ✅ (in example) - BRX Performance login
- `BRX_APP_PASSWORD` / `BRX_PASSWORD` ✅ (in example) - BRX Performance password
- `BRX_API_TOKEN` ✅ (in example) - API authentication
- `BRX_BEARER_TOKEN` - Bearer token for API calls
- `EXERCISE_COM_API_TOKEN` ❌ (missing) - TODO in multiple routers

### AI/ML Services  
- `OPENAI_API_KEY` ❌ (missing) - Used in Pinecone scripts and AI auditor
- `PINECONE_API_KEY` ❌ (missing) - Vector database for conversations

### Database
- `DATABASE_URL` ✅ (in example) - PostgreSQL connection

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` ✅ (in example)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ (in example)
- `SUPABASE_SERVICE_ROLE_KEY` ✅ (in example)

### Authentication & Deployment
- `NEXTAUTH_SECRET` ✅ (in example)
- `NEXTAUTH_URL` ✅ (in example)
- `GITHUB_TOKEN` ✅ (in example)
- `VERCEL_TOKEN` ✅ (in example)

### Testing & CI
- `BASE_URL` - Used in Playwright tests (default: http://localhost:3000)
- `CI` - Detected by test configs
- `NODE_ENV` - Development/production mode

## Missing from Example

Add these to your `.env.1password`:

```bash
# AI Services
OPENAI_API_KEY="op://Private/OpenAI/api_key"
PINECONE_API_KEY="op://Private/Pinecone/api_key"

# Legacy API
EXERCISE_COM_API_TOKEN="op://Private/Exercise.com/api_token"
BRX_BEARER_TOKEN="op://Private/BRX Performance/bearer_token"
```

## Files Using Environment Variables

### Python Scripts
- `query-pinecone.py` - Needs OPENAI_API_KEY, PINECONE_API_KEY
- `upload-conversation.py` - Needs OPENAI_API_KEY, PINECONE_API_KEY
- `scripts/extract_with_firecrawl.py` - Needs FIRECRAWL_API_KEY
- `scrapers/client_list.py` - Needs BRX credentials
- Various scripts in `brx-core/app-replica/`

### TypeScript/JavaScript
- `src/server/api/routers/*.ts` - Need EXERCISE_COM_API_TOKEN
- `playwright.config.ts` - Uses CI, BASE_URL
- `scripts/ai-audit/ai-visual-auditor.js` - Needs OPENAI_API_KEY, BRX credentials

## Setup Checklist

- [ ] Install 1Password CLI
- [ ] Sign in: `eval $(op signin)`
- [ ] Run `./scripts/1password-connect.sh` to see your existing items
- [ ] Copy `.env.1password.example` to `.env.1password`
- [ ] Update paths in `.env.1password` to match YOUR 1Password items
- [ ] Add missing variables (OPENAI_API_KEY, PINECONE_API_KEY, etc.)
- [ ] Test with: `./scripts/op.sh npm run dev`
- [ ] Install 1Password VS Code extension in Cursor (optional but recommended)

## Security Status

✅ **Good practices found:**
- No `.env` files with hardcoded secrets in repository
- `.gitignore` properly configured to exclude environment files
- Example file uses 1Password references instead of actual values
- Scripts check for environment variables before using them

⚠️ **Action Items:**
1. Several TODO comments indicate missing EXERCISE_COM_API_TOKEN
2. AI scripts need OPENAI_API_KEY and PINECONE_API_KEY
3. Some scripts use different naming (BRX_APP_* vs BRX_*)

## Quick Start Commands

```bash
# 1. Install 1Password CLI (macOS)
brew install 1password-cli

# 2. Sign in
eval $(op signin)

# 3. See your items
./scripts/1password-connect.sh

# 4. Create your mapping
cp .env.1password.example .env.1password
# Edit .env.1password with your actual item paths

# 5. Test it works
./scripts/op.sh npm run dev

# For Python scripts
./scripts/op.sh python query-pinecone.py
```

## Migration Path from .env Files

Based on [1Password's migration guide](https://blog.1password.com/env-file-migration-secure-programming-best-practices/):

1. **Install VS Code Extension** for easiest migration
2. **Use "Save in 1Password" button** that appears next to secrets
3. **Replace values with references** like `op://Vault/Item/Field`
4. **Run with op** instead of sourcing .env files

## Notes

- The project follows [1Password's best practices](https://developer.1password.com/docs/cli/secrets-environment-variables/) for environment variable management
- No existing `.env` files were found, which is excellent for security
- Multiple scripts are already prepared to use environment variables
- Consider standardizing variable names (BRX_APP_* vs BRX_*)