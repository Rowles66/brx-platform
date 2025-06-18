# Using 1Password Extensions (The Easy Way)

Forget the CLI complexity. Here are the simpler options:

## Option 1: 1Password for VS Code/Cursor

Since Cursor is based on VS Code, you can use the 1Password VS Code extension directly.

### Install
1. Open Cursor
2. Go to Extensions (⌘⇧X / Ctrl+Shift+X)
3. Search for "1Password"
4. Install the official 1Password extension

### Use
- **Inline suggestions**: The extension shows 1Password icons next to environment variables
- **Quick fill**: Click the icon to fill credentials directly from 1Password
- **Hover preview**: Hover over credentials to see which 1Password item they reference
- **Direct edit**: Edit `.env` files and get autocomplete from your 1Password vault

### Example
```env
# Just type and the extension suggests from your vault
DATABASE_URL=  # <- 1Password icon appears here
API_KEY=       # <- Click icon to search/fill from 1Password
```

## Option 2: Browser Extension + Copy/Paste

The simplest approach:

1. Install 1Password browser extension
2. When you need a credential:
   - Click 1Password icon in browser
   - Search for the credential
   - Copy it
   - Paste in your `.env` file or terminal

## Option 3: 1Password 8 Developer Features

1Password 8 has built-in developer features:

1. **Quick Access** (⌘⇧Space / Ctrl+Shift+Space):
   - Search any credential
   - Copy as environment variable format
   - Copy field references

2. **Developer items**:
   - Create items with type "API Credential"
   - Stores in proper format for development

## Comparison

| Method | Pros | Cons |
|--------|------|------|
| VS Code Extension | • Integrated in editor<br>• No terminal needed<br>• Visual indicators | • Only works in VS Code/Cursor |
| Browser Extension | • Dead simple<br>• Works everywhere<br>• No setup | • Manual copy/paste |
| CLI | • Scriptable<br>• CI/CD friendly<br>• Automated workflows | • More complex setup |

## Quick Setup for VS Code Extension

1. **Install extension** in Cursor
2. **Sign in** when prompted
3. **Create `.env`** file:
   ```env
   # Start typing and use autocomplete
   OPENAI_API_KEY=
   DATABASE_URL=
   ```
4. **Click 1Password icons** that appear to fill values

## For CI/CD

If you need automation (GitHub Actions, etc.), you'll still need CLI:
```yaml
- name: Load secrets
  env:
    OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
  run: op run --env-file=.env.1password -- npm test
```

But for local development? Just use the extension.

## Tips

1. **Store everything as "API Credential"** type in 1Password for better organization
2. **Use descriptive names** like "OpenAI Dev API Key" not just "API Key"
3. **Tag items** with project names for easy filtering
4. **Use shared vaults** for team credentials

## The Simplest Workflow

1. Install 1Password browser extension
2. Install 1Password VS Code extension in Cursor
3. Create `.env` files with the extension's help
4. Never worry about the CLI unless you need automation