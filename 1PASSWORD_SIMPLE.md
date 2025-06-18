# Using Your Existing 1Password Credentials

No new vaults. No complex setup. Just use what you already have.

## Quick Start (2 minutes)

### 1. Install 1Password CLI
```bash
brew install 1password-cli
```

### 2. Sign In
```bash
eval $(op signin)
```

### 3. Find Your Items
```bash
./scripts/1password-connect.sh
```
This shows all your existing 1Password items.

### 4. Create Your Mapping
```bash
cp .env.1password.example .env.1password
```

Edit `.env.1password` to point to YOUR items:
```bash
# Your actual 1Password items
FIRECRAWL_API_KEY="op://Private/Firecrawl/api_key"
DATABASE_URL="op://Work/Supabase/database_url"
# etc...
```

### 5. Run Commands
```bash
# Use the simple wrapper
./scripts/op.sh npm run dev
./scripts/op.sh npm test

# Or directly
op run --env-file=.env.1password -- npm run dev
```

## That's It!

No new vaults. No credential creation. Just references to your existing 1Password items.

## Examples

### Next.js Development
```bash
cd brx-app
../scripts/op.sh npm run dev
```

### Run Tests
```bash
./scripts/op.sh npm test
```

### Python Scripts
```bash
./scripts/op.sh python scripts/extract_with_firecrawl.py
```

### Any Command
```bash
./scripts/op.sh <any command that needs credentials>
```

## Finding Item Paths

The format is: `op://VaultName/ItemName/FieldName`

To find the exact path:
1. Run `./scripts/1password-connect.sh` to see your items
2. Or in 1Password app: Right-click item → Copy Secret Reference

## Tips

- Keep `.env.1password` in .gitignore (already done)
- You can have multiple env files: `.env.1password.dev`, `.env.1password.prod`
- Use `op run --env-file=.env.1password.dev -- command` for different environments