# Quick Start: BRX FireCrawl Scraper

## 🚀 Get Started in 3 Steps

### Step 1: Set Environment Variables
```bash
export FIRECRAWL_API_KEY="your-firecrawl-api-key"
export BRX_APP_USERNAME="api-docs"
export BRX_APP_PASSWORD="your-brx-password"
```

### Step 2: Run the Scraper
```bash
./run_brx_scraper_env.sh
```

### Step 3: Check Results
```bash
ls brx_api_docs_output/
# Should contain: api_docs.md, api_docs.html, full_result.json
```

---

## 📋 Prerequisites Check

- [ ] FireCrawl API key ([Get one here](https://www.firecrawl.dev/app))
- [ ] BRX Performance `api-docs` account password
- [ ] Python 3.9+ with `firecrawl-py` installed

---

## 🔧 If Something Goes Wrong

### Check Environment Variables
```bash
echo "FIRECRAWL_API_KEY: ${FIRECRAWL_API_KEY:0:10}..."
echo "BRX_APP_USERNAME: $BRX_APP_USERNAME"
echo "BRX_APP_PASSWORD: ${BRX_APP_PASSWORD:0:3}..."
```

### Check Python Dependencies
```bash
python3 -c "import firecrawl; print('✅ FireCrawl installed')"
```

### Test FireCrawl API Key
```bash
# Set your API key and test
export FIRECRAWL_API_KEY="fc-your-key-here"
python3 -c "from firecrawl import FirecrawlApp; app = FirecrawlApp(api_key='$FIRECRAWL_API_KEY'); print('✅ API key works')"
```

---

## 📁 File Structure

```
.
├── firecrawl_brx_scraper.py       # Main scraper script
├── run_brx_scraper_env.sh         # Environment variable runner
├── run_brx_scraper.sh             # Legacy 1Password runner (deprecated)
├── setup_1password_items.sh       # Legacy credential setup (deprecated)
├── README.md                      # Full documentation
├── FIRECRAWL_AUTH_SUMMARY.md      # Authentication analysis
└── brx_api_docs_output/           # Results (created after run)
    ├── api_docs.md
    ├── api_docs.html
    └── full_result.json
```

---

## 🎯 What This Does

1. **Securely authenticates** to BRX Performance using:
   - Email: `api-docs`
   - Password: From environment variable

2. **Navigates and scrapes** the protected API documentation:
   - Login form automation
   - Session-based authentication
   - Swagger YAML extraction

3. **Saves results** in multiple formats:
   - Markdown for readability
   - HTML for web viewing  
   - JSON for programmatic use

That's it! You now have automated, secure access to your BRX Performance API documentation.

