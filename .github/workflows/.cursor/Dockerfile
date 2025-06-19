{
  "servers": {
    "fetch": {
      "command": "node fetch-server.js",
      "env": {
        // Optional: Set custom headers for fetch requests, e.g. 'Authorization' or 'User-Agent'
        "FETCH_CUSTOM_HEADERS": "{\"Authorization\":\"Bearer token\", \"User-Agent\":\"CustomAgent/1.0\"}",
        // Optional: Configure proxy settings for fetch requests, e.g. 'http://proxy.example.com:8080'
        "FETCH_PROXY": "http://proxy.example.com:8080"
      },
      "description": "Fetch server with support for custom headers and proxy settings via environment variables"
    },
    "mcp-playwright": {
      "command": "npx playwright test",
      // Optional: Specify the root directory for Playwright tests
      // "root": "./tests/playwright",
      "env": {
        // Recommended environment variables for CI and debugging
        "CI": "1",
        "PWDEBUG": "1"
      },
      "description": "Playwright test server with environment variables for CI and debugging"
    }
  }
}
