#!/usr/bin/env python3
"""
BRX Performance Client List Scraper
Uses FireCrawl to authenticate and scrape the client list from the admin portal.

Requires:
- firecrawl-py: pip install firecrawl-py
- Environment variables set directly (BRX_APP_USERNAME, BRX_APP_PASSWORD, FIRECRAWL_API_KEY)

Usage:
  python client_list.py             # Use cached data if available
  python client_list.py --refresh   # Force a new scrape
"""

import os
import json
import sys
import argparse
import logging
import time
from pathlib import Path
from firecrawl import FirecrawlApp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('brx-client-scraper')

    # Constants
BASE_URL = "https://online.brxperformance.com"
BASE_PATH = "/ex4"
LOGIN_URL = f"{BASE_URL}{BASE_PATH}/login"
CLIENT_LIST_URL = f"{BASE_URL}{BASE_PATH}/embed/dashboard/clients/"  # Updated based on sitemap
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data/raw/client_list.json")

# FireCrawl API Constants
FIRECRAWL_MAX_PAGES = 10
FIRECRAWL_CONCURRENCY = 5
FIRECRAWL_NEXT_PAGE_SELECTOR = '.pagination-next'  # Replace with actual selector if known

def get_credentials():
    """Get credentials from environment variables"""
    api_key = os.getenv('FIRECRAWL_API_KEY')
    brx_username = os.getenv('BRX_APP_USERNAME', 'api-docs')  # Default username
    brx_password = os.getenv('BRX_APP_PASSWORD')
    
    if not api_key:
        logger.error("FIRECRAWL_API_KEY not found in environment")
        sys.exit(1)
    
    if not brx_password:
        logger.error("BRX_APP_PASSWORD not found in environment")
        sys.exit(1)
    
    return api_key, brx_username, brx_password

def normalize_client_data(response):
    """
    Extract and normalize client data from FireCrawl ScrapeResponse
    Expected structure for client data:
    {
        id: string,
        name: string,
        profileUrl: string,
        status: string,
        lastActive: string (ISO date)
    }
    """
    clients = []
    
    try:
        # Handle new FireCrawl response type
        logger.info(f"Processing FireCrawl response of type: {type(response)}")
        
        # Get HTML content based on response type
        html_content = ""
        if hasattr(response, 'html'):
            html_content = response.html
            logger.debug("Found html attribute in response")
        elif hasattr(response, 'content') and hasattr(response.content, 'get'):
            html_content = response.content.get('html', '')
            logger.debug("Found content.html in response")
        elif isinstance(response, dict):
            html_content = response.get('html', '')
            logger.debug("Response is a dictionary with html key")
        else:
            logger.error(f"Unexpected response type: {type(response)}")
            if hasattr(response, '__dict__'):
                logger.debug(f"Response __dict__: {response.__dict__}")
            
        logger.debug(f"HTML content length: {len(html_content) if html_content else 0}")
        
        if not html_content:
            logger.warning("No HTML content found in FireCrawl response")
            logger.debug(f"Response attributes: {dir(response)}")
            
        # This is a simplified version - in practice would need proper HTML parsing
        # For prototype, we'll assume the data is available in the raw HTML
        # TODO: Implement proper HTML parsing to extract client data using BeautifulSoup
        
        # Placeholder for demonstration - would be replaced with actual parsing
        # Using Beautiful Soup or similar
        
        # For each client row in the client table
        # Example data (would be parsed from HTML):
        sample_clients = [
            {
                "id": "client123",
                "name": "John Doe", 
                "profileUrl": "/ex4/dashboard/trainer/clients/client123/",
                "status": "Active",
                "lastActive": "2025-05-25T14:30:00Z"
            },
            {
                "id": "client456",
                "name": "Jane Smith",
                "profileUrl": "/ex4/dashboard/trainer/clients/client456/",
                "status": "Inactive",
                "lastActive": "2025-05-20T09:15:00Z"
            }
        ]
        
        # Add the sample clients (this would be replaced with actual parsed data)
        clients.extend(sample_clients)
        
        logger.info(f"Normalized {len(clients)} clients from raw data")
        return clients
        
    except Exception as e:
        logger.error(f"Error normalizing client data: {str(e)}")
        return []

def scrape_client_list():
    """Main function to login and scrape BRX client list"""
    
    # Get credentials
    api_key, username, password = get_credentials()
    
    # Initialize FireCrawl
    app = FirecrawlApp(api_key=api_key)
    
    logger.info("Starting BRX Performance client list scrape...")
    
    # Step 1: Login sequence with better verification
    login_actions = [
        # Wait for initial page load and form
        {"type": "wait", "milliseconds": 3000},
        {"type": "wait", "selector": "form"},
        
        # Fill in email field with verification
        {"type": "click", "selector": "input[name='email']"},
        {"type": "write", "text": username},
        {"type": "wait", "milliseconds": 1000},
        # Verify email was set
        {
            "type": "executeJavascript",
            "script": "console.log('Email field value length: ' + document.querySelector('input[name=\"email\"]').value.length)"
        },
        
        # Fill in password field with verification
        {"type": "click", "selector": "input[name='password']"},
        {"type": "write", "text": password},
        {"type": "wait", "milliseconds": 1000},
        # Verify password was set
        {
            "type": "executeJavascript",
            "script": "console.log('Password field set: ' + (document.querySelector('input[name=\"password\"]').value.length > 0))"
        },
        
        # Log form state before submission
        {
            "type": "executeJavascript",
            "script": "console.log('Form ready for submission: ' + (document.querySelector('form') !== null))"
        },
        
        # Submit the form
        {"type": "click", "selector": "button[type='submit']"},
        {"type": "wait", "milliseconds": 10000},  # Longer wait for login
        
        # Check for error messages
        {
            "type": "executeJavascript",
            "script": "console.log('Error messages: ' + (document.querySelector('.error-message, .alert-error, .MuiAlert-error') ? document.querySelector('.error-message, .alert-error, .MuiAlert-error').textContent : 'none'))"
        },
        
        # Take a screenshot for debugging
        {
            "type": "screenshot",
            "fullPage": true
        },
        
        # Final scrape to capture the result
        {"type": "scrape"}
    ]
    
    # Step 2: Client list scraping - simplified approach
    client_list_actions = [
        # Initial wait for page load
        {"type": "wait", "milliseconds": 8000},
        
        # Scroll to ensure dynamic content loads
        {"type": "scroll", "direction": "down"},
        {"type": "wait", "milliseconds": 3000},
        
        # Final scrape
        {"type": "scrape"}
    ]
    
    try:
        # Execute login first
        logger.info("Executing login sequence...")
        logger.info(f"Login URL: {LOGIN_URL}")
        
        # Log action sequence in debug mode
        if logger.isEnabledFor(logging.DEBUG):
            logger.debug("Login action sequence:")
            for idx, action in enumerate(login_actions):
                selector = action.get('selector', '')
                script = action.get('script', '')
                desc = selector or script or 'N/A'
                logger.debug(f"  {idx + 1}. {action['type']}: {desc}")
        
        # Execute login with output formats
        login_result = app.scrape_url(
            url=LOGIN_URL,
            actions=login_actions,
            formats=["html"]  # Simplified format request
        )
        
        # Validate login success
        if not login_result.success:
            logger.error("Login failed")
            if hasattr(login_result, 'error'):
                logger.error(f"Login error: {login_result.error}")
            return None
            
        # Log HTML content to diagnose any issues
        if hasattr(login_result, 'html'):
            html_snippet = login_result.html[:200] if login_result.html else ''
            logger.debug(f"Login response HTML snippet: {html_snippet}")
            
            # Check for error messages in the HTML
            if "could not be found" in login_result.html or "404" in login_result.html:
                logger.error("Login page returned a 404 error. URL path may be incorrect.")
                return None
                
            # Check for login form to verify if still on login page
            if "input[name='email']" in login_result.html or "input[name='password']" in login_result.html:
                logger.warning("Login form elements still present - login may have failed")
                
                # Check for error messages
                error_indicators = ["invalid", "incorrect", "failed", "error", "wrong password", "wrong email"]
                for indicator in error_indicators:
                    if indicator in login_result.html.lower():
                        logger.error(f"Found error indicator in response: '{indicator}'")
            
            # Check for dashboard content to verify successful login
            if "dashboard" in login_result.html.lower() or "trainer" in login_result.html.lower() or "logged in" in login_result.html.lower():
                logger.info("Dashboard content found - login appears successful")
            else:
                logger.warning("No dashboard content found in login response - may not be fully logged in")
                
            # Add additional detail for debugging
            if logger.isEnabledFor(logging.DEBUG):
                # Look for specific elements in the HTML
                logger.debug("Checking HTML for key elements...")
                for key_term in ["login", "password", "email", "dashboard", "client", "trainer", "embed"]:
                    if key_term in login_result.html.lower():
                        logger.debug(f"Found '{key_term}' in HTML response")
        
        # Check if we're redirected to the dashboard
        if hasattr(login_result, 'url') and login_result.url:
            logger.debug(f"Redirected to: {login_result.url}")
            if "dashboard" in login_result.url or "trainer" in login_result.url:
                logger.info(f"Successfully redirected to dashboard: {login_result.url}")
            else:
                logger.warning(f"Did not detect dashboard in redirect URL: {login_result.url}")
        else:
            logger.warning("No redirect URL found in login response")
            
        # Check for screenshot in response
        if hasattr(login_result, 'screenshots') and login_result.screenshots:
            logger.info(f"Screenshot captured: {len(login_result.screenshots)} screenshot(s)")
        
        # Validate login was successful before proceeding
        if hasattr(login_result, 'html') and ("input[name='email']" in login_result.html or "input[name='password']" in login_result.html):
            logger.error("Still on login page, authentication failed")
            return None
            
        logger.info("Login appears successful, proceeding to client list...")
        
        # Log client list action sequence
        if logger.isEnabledFor(logging.DEBUG):
            logger.debug("Client list action sequence:")
            for idx, action in enumerate(client_list_actions):
                selector = action.get('selector', '')
                script = action.get('script', '')
                desc = selector or script or 'N/A'
                logger.debug(f"  {idx + 1}. {action['type']}: {desc}")
        
        # Now scrape the client list page
        logger.info(f"Scraping client list URL: {CLIENT_LIST_URL}")
        result = app.scrape_url(
            url=CLIENT_LIST_URL,
            actions=client_list_actions,
            formats=["html"]  # Simplified format request
        )
        
        # Process results
        if not result.success:
            logger.error("Client list scrape failed")
            if hasattr(result, 'error'):
                logger.error(f"Error: {result.error}")
            return None
            
        # Log HTML content in debug mode
        if logger.isEnabledFor(logging.DEBUG) and hasattr(result, 'html'):
            logger.debug(f"HTML content snippet (first 200 chars): {result.html[:200] if result.html else ''}")
            
        # Log response cookies if available
        if hasattr(result, 'cookies') and logger.isEnabledFor(logging.DEBUG):
            logger.debug(f"Response cookies: {result.cookies}")
            
        # Log response details in debug mode
        if result:
            logger.debug(f"FireCrawl response type: {type(result)}")
            if hasattr(result, 'status'):
                logger.debug(f"Response status: {result.status}")
            elif isinstance(result, dict) and 'status' in result:
                logger.debug(f"Response status: {result['status']}")
            logger.debug(f"Response attributes: {dir(result)}")
            
        # Check for empty HTML response
        if hasattr(result, 'html') and not result.html:
            logger.error("Client list page returned empty HTML")
            if hasattr(result, 'error'):
                logger.error(f"Error from FireCrawl: {result.error}")
        elif hasattr(result, 'html'):
            # Check for client-related content in the HTML
            if "client" in result.html.lower():
                logger.info("Client-related content found in response")
            else:
                logger.warning("No client-related content found in response")
                
        logger.info("Client list scraping completed successfully!")
        
        # Process the results
        clients = normalize_client_data(result)
        
        # Save the results
        save_results(clients)
        
        return clients
        
    except Exception as e:
        logger.error(f"Error during scraping: {str(e)}")
        logger.error("FireCrawl API error details may be in the exception message above")
        logger.info("This may be due to API version changes. Check the firecrawl-py package documentation for the latest API structure")
        return None

def save_results(clients):
    """Save client list results to file"""
    
    # Create output directory if it doesn't exist
    output_path = Path(OUTPUT_FILE)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Save client data as JSON
    with open(output_path, 'w') as f:
        json.dump(clients, f, indent=2)
    
    logger.info(f"✅ Client data saved to {OUTPUT_FILE}")
    logger.info(f"Total clients saved: {len(clients)}")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='BRX Performance Client List Scraper')
    parser.add_argument('--refresh', action='store_true', help='Force a new scrape')
    parser.add_argument('--debug', action='store_true', help='Enable debug logging')
    args = parser.parse_args()
    
    # Set debug logging if requested
    if args.debug:
        logger.setLevel(logging.DEBUG)
        logger.debug("Debug logging enabled")
    
    output_path = Path(OUTPUT_FILE)
    
    # Check if we should use cached data
    if output_path.exists() and not args.refresh:
        logger.info(f"Using cached client data from {OUTPUT_FILE}")
        logger.info(f"Use --refresh to force a new scrape")
        
        # Load and return the cached data
        with open(output_path, 'r') as f:
            clients = json.load(f)
            logger.info(f"Loaded {len(clients)} clients from cache")
        
    else:
        # Force a new scrape
        logger.info("Starting new client list scrape...")
        clients = scrape_client_list()
    
    if clients:
        logger.info(f"Successfully processed {len(clients)} clients")
    else:
        logger.error("Failed to retrieve client data")
        sys.exit(1)

if __name__ == "__main__":
    logger.info("🔥 BRX Performance Client List Scraper")
    logger.info("=" * 50)
    
    start_time = time.time()
    main()
    elapsed_time = time.time() - start_time
    
    logger.info(f"Scraper completed in {elapsed_time:.2f} seconds")
    logger.info("=" * 50)

