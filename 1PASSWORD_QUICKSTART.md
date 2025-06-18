# 1Password Quick Start Guide

Get up and running with 1Password credential management in 5 minutes.

## 🚀 Quick Setup

### 1. Install 1Password CLI

**macOS:**
```bash
brew install 1password-cli
```

**Linux/WSL:**
```bash
./scripts/1password-setup.sh
# Follow the installation prompts
```

### 2. Run Setup
```bash
# Initialize 1Password for BRX Platform
./scripts/1password-setup.sh

# Sign in when prompted
eval $(op signin)
```

### 3. Add Your Credentials

Open 1Password desktop app and fill in the credentials in the "BRX Platform" vault:
- BRX API Credentials
- Firecrawl API
- Supabase Credentials
- Other services as needed

## 🎯 Common Commands

### Development
```bash
# Start dev server with credentials
./scripts/op-wrapper.sh dev

# Or directly:
op run -- npm run dev
```

### Testing
```bash
# Run E2E tests
./scripts/op-wrapper.sh test:e2e

# Run all tests
./scripts/op-wrapper.sh test
```

### Database
```bash
# Run migrations
./scripts/op-wrapper.sh db:migrate

# Open Prisma Studio
./scripts/op-wrapper.sh db:studio
```

### FireCrawl
```bash
# Run extraction
./scripts/op-wrapper.sh firecrawl

# Scrape specific URL
./scripts/op-wrapper.sh scrape https://example.com
```

## 📋 Verify Setup

```bash
# Check all credentials are loaded
source scripts/load-credentials.sh
scripts/verify-credentials.sh
```

## 🔧 Cursor Development

```bash
cd brx-app
./launch-cursor.sh
```

This launches Cursor with all credentials pre-loaded.

## ⚡ Pro Tips

1. **Use op-wrapper for everything:**
   ```bash
   ./scripts/op-wrapper.sh run <any-command>
   ```

2. **Generate .env.local when needed:**
   ```bash
   ./scripts/op-wrapper.sh env
   ```

3. **Keep credentials in 1Password only** - never in code or .env files

## 🆘 Troubleshooting

**"Not signed in to 1Password"**
```bash
eval $(op signin)
```

**"Command not found: op"**
- Install 1Password CLI (see step 1)

**"Credential not found"**
- Add the missing credential in 1Password desktop app
- Make sure it's in the "BRX Platform" vault

## 📚 Full Documentation

See [1PASSWORD_INTEGRATION.md](1PASSWORD_INTEGRATION.md) for complete details.