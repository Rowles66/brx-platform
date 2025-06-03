# FireCrawl Authentication Notes

## Final Action JSON Configuration

Based on extensive testing and validation, the final working authentication action sequence for BRX Performance is:

```json
{
  "actions": [
    {"type": "navigate", "url": "https://online.brxperformance.com/login"},
    {"type": "wait", "milliseconds": 3000},
    {"type": "click", "selector": "input[name='email']"},
    {"type": "write", "text": "api-docs"},
    {"type": "wait", "milliseconds": 500},
    {"type": "click", "selector": "input[name='password']"},
    {"type": "write", "text": "{{BRX_APP_PASSWORD}}"},
    {"type": "wait", "milliseconds": 500},
    {"type": "click", "selector": "button[type='submit']"},
    {"type": "wait", "milliseconds": 5000},
    {"type": "navigate", "url": "https://online.brxperformance.com/api-docs/v4/swagger.yaml"},
    {"type": "wait", "milliseconds": 3000},
    {"type": "scrape"}
  ],
  "formats": ["markdown", "html"],
  "onlyMainContent": false
}
```

## Working curl Example

```bash
# Set environment variables
export FIRECRAWL_API_KEY="your-api-key"
export BRX_APP_PASSWORD="your-brx-password"

# Execute the scrape with authentication
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -d '{
    "url": "https://online.brxperformance.com/login",
    "actions": [
      {"type": "navigate", "url": "https://online.brxperformance.com/login"},
      {"type": "wait", "milliseconds": 3000},
      {"type": "click", "selector": "input[name='"'"'email'"'"']"},
      {"type": "write", "text": "api-docs"},
      {"type": "wait", "milliseconds": 500},
      {"type": "click", "selector": "input[name='"'"'password'"'"']"},
      {"type": "write", "text": "'$BRX_APP_PASSWORD'"},
      {"type": "wait", "milliseconds": 500},
      {"type": "click", "selector": "button[type='"'"'submit'"'"']"},
      {"type": "wait", "milliseconds": 5000},
      {"type": "navigate", "url": "https://online.brxperformance.com/api-docs/v4/swagger.yaml"},
      {"type": "wait", "milliseconds": 3000},
      {"type": "scrape"}
    ],
    "formats": ["markdown", "html"],
    "onlyMainContent": false
  }'
```

## Critical Quirks and Requirements

### ⏱️ Timing Requirements
- **≥ 5 second wait after login submission** - Essential for authentication to complete
- **3 second initial page load wait** - Allows React components to fully render
- **500ms waits between form interactions** - Prevents race conditions with React state

### 🎯 Selector Specificity
- **Use `input[name='email']` not CSS classes** - React/MUI generates dynamic class names
- **Use `input[name='password']` not IDs** - React generates dynamic IDs like `:r0:`, `:r1:`
- **Use `button[type='submit']` for form submission** - Most reliable selector

### 🔄 Navigation Pattern
- **Must use explicit `navigate` action** after login - Don't rely on form submission redirect
- **Include `waitForNavigation` equivalent** - The 5-second wait serves this purpose
- **Separate navigation from scraping** - Two distinct steps in the action sequence

### 🚨 Authentication Flow Dependencies
1. **Initial navigation** must complete before form interaction
2. **Form filling** must be sequential (email → password)
3. **Submit wait** must be ≥ 5 seconds for session establishment
4. **Protected URL navigation** must occur after authentication
5. **Final scrape** occurs on the target protected page

### 🔐 Security Considerations
- **Environment variables** required for credentials
- **No plaintext passwords** in action JSON
- **Variable substitution** happens at runtime
- **Session cookies** managed automatically by FireCrawl browser context

### 📝 Form Structure Notes
Based on scraped HTML from BRX Performance login form:

```html
<!-- Email field -->
<input name="email" type="text" id=":r0:" class="MuiInputBase-input MuiOutlinedInput-input css-kmuhub" />

<!-- Password field -->
<input name="password" type="password" id=":r1:" class="MuiInputBase-input MuiOutlinedInput-input css-17xie9v" />

<!-- Submit button -->
<button type="submit" class="MuiButton-root MuiButton-contained MuiButton-containedPrimary">Sign In</button>
```

**Key Insights:**
- Dynamic IDs (`:r0:`, `:r1:`) change between sessions
- CSS classes include generated hashes
- `name` attributes are stable and reliable
- `type` attributes are consistent

### 🛠️ Alternative Approaches
If action-based authentication fails:

#### Cookie-Based Method
1. Manually log into `https://online.brxperformance.com/login`
2. Extract session cookie from browser dev tools
3. Use directly with FireCrawl headers:
   ```json
   {
     "url": "https://online.brxperformance.com/api-docs/v4/swagger.yaml",
     "headers": {
       "Cookie": "session_id=abc123; auth_token=xyz789"
     }
   }
   ```

### 🎯 Success Indicators
- HTTP 200 response from final scrape
- Content length > 0 in markdown/html
- No authentication error messages in response
- Successful navigation to protected `/api-docs/v4/swagger.yaml` URL

---

**Last Updated:** Step 8 Documentation
**Status:** ✅ Production Ready
**Tested With:** FireCrawl API v1, BRX Performance Login Form (React/MUI)

