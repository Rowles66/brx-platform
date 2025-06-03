#!/usr/bin/env python3
"""
BRX Performance API Documentation Scraper
Uses FireCrawl to authenticate and scrape protected API documentation.

Requires:
- firecrawl-py: pip install firecrawl-py
- Environment variables set directly (BRX_APP_USERNAME, BRX_APP_PASSWORD, FIRECRAWL_API_KEY)
"""

import os
import json
import sys
from firecrawl import FirecrawlApp

def get_credentials():
    """Get credentials from environment variables"""
    api_key = os.getenv('FIRECRAWL_API_KEY')
    brx_username = os.getenv('BRX_APP_USERNAME', 'api-docs')  # Default username
    brx_password = os.getenv('BRX_APP_PASSWORD')
    
    if not api_key:
        print("Error: FIRECRAWL_API_KEY not found in environment")
        sys.exit(1)
    
    if not brx_password:
        print("Error: BRX_APP_PASSWORD not found in environment")
        sys.exit(1)
    
    return api_key, brx_username, brx_password

def scrape_brx_api_docs():
    """Main function to login and scrape BRX API documentation"""
    
    # Get credentials
    api_key, username, password = get_credentials()
    
    # Initialize FireCrawl
    app = FirecrawlApp(api_key=api_key)
    
    print("Starting BRX Performance API documentation scrape...")
    
    # Define the action sequence for login and scraping
    actions = [
        # Navigate to login page
        {"type": "navigate", "url": "https://online.brxperformance.com/login"},
        {"type": "wait", "milliseconds": 3000},
        
        # Fill in email field (using the ID from the HTML)
        {"type": "click", "selector": "input[name='email']"},
        {"type": "write", "text": username},
        {"type": "wait", "milliseconds": 500},
        
        # Fill in password field
        {"type": "click", "selector": "input[name='password']"},
        {"type": "write", "text": password},
        {"type": "wait", "milliseconds": 500},
        
        # Submit the form
        {"type": "click", "selector": "button[type='submit']"},
        {"type": "wait", "milliseconds": 5000},  # Wait for login to complete
        
        # Navigate to API docs
        {"type": "navigate", "url": "https://online.brxperformance.com/api-docs/v4/swagger.yaml"},
        {"type": "wait", "milliseconds": 3000},
        
        # Scrape the content
        {"type": "scrape"}
    ]
    
    try:
        # Execute the scraping with authentication actions
        result = app.scrape_url(
            url="https://online.brxperformance.com/login",
            params={
                'formats': ['markdown', 'html'],
                'actions': actions,
                'onlyMainContent': False
            }
        )
        
        print("\n=== Scraping completed successfully! ===")
        
        # Save the results
        save_results(result)
        
        return result
        
    except Exception as e:
        print(f"Error during scraping: {str(e)}")
        return None

def save_results(result):
    """Save scraping results to files"""
    
    # Create output directory
    output_dir = "brx_api_docs_output"
    os.makedirs(output_dir, exist_ok=True)
    
    # Save full JSON result
    with open(f"{output_dir}/full_result.json", 'w') as f:
        json.dump(result, f, indent=2)
    
    # Save markdown content if available
    if 'markdown' in result:
        with open(f"{output_dir}/api_docs.md", 'w') as f:
            f.write(result['markdown'])
        print(f"✅ Markdown saved to {output_dir}/api_docs.md")
    
    # Save HTML content if available
    if 'html' in result:
        with open(f"{output_dir}/api_docs.html", 'w') as f:
            f.write(result['html'])
        print(f"✅ HTML saved to {output_dir}/api_docs.html")
    
    # Save screenshot if available
    if 'screenshot' in result:
        print(f"✅ Screenshot available: {result['screenshot']}")
    
    print(f"\n📁 All results saved to {output_dir}/")
    
    # Print summary
    print("\n=== Summary ===")
    print(f"URL: {result.get('url', 'N/A')}")
    print(f"Status: {'Success' if result.get('success', False) else 'Failed'}")
    print(f"Content length: {len(result.get('markdown', ''))} characters")

def alternative_approach():
    """Alternative approach using cookie-based authentication"""
    print("\n=== Alternative: Cookie-based approach ===")
    print("If the action-based login doesn't work, you can:")
    print("1. Manually log into https://online.brxperformance.com/login")
    print("2. Open browser dev tools > Network tab")
    print("3. Refresh the page")
    print("4. Copy the 'Cookie' header from the first request")
    print("5. Use the cookie with FireCrawl directly:")
    print("")
    print("   app.scrape_url(")
    print("       url='https://online.brxperformance.com/api-docs/v4/swagger.yaml',")
    print("       params={")
    print("           'headers': {")
    print("               'Cookie': 'YOUR_COOKIE_HERE'")
    print("           }")
    print("       }")
    print("   )")

if __name__ == "__main__":
    print("🔥 BRX Performance API Documentation Scraper")
    print("   Using FireCrawl with environment variables")
    print("   " + "="*50)
    
    # Run the main scraping function
    result = scrape_brx_api_docs()
    
    if result:
        print("\n✅ Scraping completed successfully!")
        
        # Show authentication sections if found
        content = result.get('markdown', '')
        if 'authentication' in content.lower() or 'auth' in content.lower():
            print("\n🔍 Authentication information found in scraped content!")
        
        if 'action' in content.lower() and 'type' in content.lower():
            print("🔍 Action type information found in scraped content!")
            
    else:
        print("\n❌ Scraping failed. Showing alternative approach...")
        alternative_approach()
    
    print("\n" + "="*60)

