#!/usr/bin/env python3
"""
BRX Authenticated Frontend Extraction Tool

Extracts HTML, CSS, JavaScript, and UX components from authenticated pages
of online.brxperformance.com using credentials from 1Password
"""

import os
import json
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
import time
from urllib.parse import urljoin
from bs4 import BeautifulSoup

class BRXAuthenticatedExtractor:
    def __init__(self):
        self.base_url = "https://online.brxperformance.com"
        self.output_dir = "../extracted_frontend_auth"
        self.timestamp = time.strftime("%Y%m%d_%H%M%S")
        self.username = os.environ.get('BRX_APP_USERNAME')
        self.password = os.environ.get('BRX_APP_PASSWORD')
        
        # Create directory structure
        self.dirs = {
            'html': os.path.join(self.output_dir, 'html'),
            'css': os.path.join(self.output_dir, 'css'),
            'js': os.path.join(self.output_dir, 'js'),
            'screenshots': os.path.join(self.output_dir, 'screenshots'),
            'api_calls': os.path.join(self.output_dir, 'api_calls'),
            'components': os.path.join(self.output_dir, 'components'),
            'raw_pages': os.path.join(self.output_dir, 'raw_pages')
        }
        
        for dir_path in self.dirs.values():
            os.makedirs(dir_path, exist_ok=True)
    
    def login_and_extract(self):
        """Login and extract authenticated pages"""
        print("🔐 Starting authenticated extraction...")
        
        if not self.username or not self.password:
            print("❌ No credentials provided. Set BRX_APP_USERNAME and BRX_APP_PASSWORD environment variables.")
            return None
        
        with sync_playwright() as p:
            # Launch browser with debugging capabilities
            browser = p.chromium.launch(
                headless=False,  # Set to False for debugging
                slow_mo=1000,    # Slow down for observation
                devtools=True    # Open DevTools
            )
            
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
                viewport={'width': 1920, 'height': 1080}
            )
            
            page = context.new_page()
            
            # Capture all network traffic
            network_requests = []
            api_responses = []
            
            def handle_request(request):
                network_requests.append({
                    'url': request.url,
                    'method': request.method,
                    'resource_type': request.resource_type,
                    'headers': dict(request.headers)
                })
            
            def handle_response(response):
                if 'api' in response.url.lower():
                    try:
                        api_responses.append({
                            'url': response.url,
                            'status': response.status,
                            'headers': dict(response.headers),
                            'body': response.text() if response.status == 200 else None
                        })
                    except:
                        pass
            
            page.on('request', handle_request)
            page.on('response', handle_response)
            
            try:
                # Step 1: Navigate to login page
                print(f"  🌐 Navigating to {self.base_url}...")
                page.goto(self.base_url, wait_until='networkidle', timeout=30000)
                
                # Take initial screenshot
                page.screenshot(path=os.path.join(self.dirs['screenshots'], '01_initial_page.png'))
                
                # Step 2: Find and fill login form
                print("  📝 Attempting to fill login form...")
                
                # Wait for login form to be visible
                page.wait_for_selector('input[name="email"], input[type="email"]', timeout=10000)
                
                # Fill login credentials
                email_selector = 'input[name="email"], input[type="email"]'
                password_selector = 'input[name="password"], input[type="password"]'
                submit_selector = 'button[type="submit"], input[type="submit"]'
                
                if page.query_selector(email_selector):
                    page.fill(email_selector, self.username)
                    print("    ✅ Filled email field")
                
                if page.query_selector(password_selector):
                    page.fill(password_selector, self.password)
                    print("    ✅ Filled password field")
                
                # Take screenshot before submission
                page.screenshot(path=os.path.join(self.dirs['screenshots'], '02_before_login.png'))
                
                # Submit login form
                if page.query_selector(submit_selector):
                    page.click(submit_selector)
                    print("    ✅ Clicked login button")
                
                # Wait for navigation after login
                page.wait_for_load_state('networkidle', timeout=30000)
                
                # Take screenshot after login
                page.screenshot(path=os.path.join(self.dirs['screenshots'], '03_after_login.png'))
                
                # Check if login was successful
                current_url = page.url
                if 'login' in current_url.lower() or 'signin' in current_url.lower():
                    print(f"    ❌ Login may have failed. Current URL: {current_url}")
                    input("Press Enter to continue anyway or Ctrl+C to abort...")
                else:
                    print(f"    ✅ Login successful! Current URL: {current_url}")
                
                # Step 3: Extract main application pages
                app_pages = {
                    'dashboard': '/dashboard',
                    'workouts': '/workouts',
                    'exercises': '/exercises',
                    'clients': '/clients',
                    'programs': '/programs',
                    'analytics': '/analytics',
                    'settings': '/settings',
                    'profile': '/profile'
                }
                
                extracted_pages = {}
                
                for page_name, page_path in app_pages.items():
                    try:
                        print(f"  📄 Extracting {page_name} page...")
                        
                        # Navigate to the page
                        target_url = urljoin(self.base_url, page_path)
                        page.goto(target_url, wait_until='networkidle', timeout=20000)
                        
                        # Wait for content to load
                        time.sleep(3)
                        
                        # Take screenshot
                        screenshot_path = os.path.join(self.dirs['screenshots'], f'{page_name}.png')
                        page.screenshot(path=screenshot_path, full_page=True)
                        
                        # Extract HTML source
                        html_content = page.content()
                        html_file = os.path.join(self.dirs['html'], f'{page_name}.html')
                        with open(html_file, 'w', encoding='utf-8') as f:
                            f.write(html_content)
                        
                        # Extract and save raw page data
                        raw_file = os.path.join(self.dirs['raw_pages'], f'{page_name}_raw.html')
                        with open(raw_file, 'w', encoding='utf-8') as f:
                            f.write(page.content())
                        
                        # Analyze page components
                        soup = BeautifulSoup(html_content, 'html.parser')
                        components = self._analyze_page_components(soup)
                        
                        # Extract JavaScript state/data
                        js_data = page.evaluate("""
                            () => {
                                const data = {};
                                // Try to extract common app state patterns
                                if (window.__INITIAL_STATE__) data.initialState = window.__INITIAL_STATE__;
                                if (window.APP_CONFIG) data.appConfig = window.APP_CONFIG;
                                if (window.userData) data.userData = window.userData;
                                if (window.appData) data.appData = window.appData;
                                
                                // Extract React/Vue component data if available
                                data.domElements = {
                                    forms: document.querySelectorAll('form').length,
                                    buttons: document.querySelectorAll('button').length,
                                    inputs: document.querySelectorAll('input').length,
                                    tables: document.querySelectorAll('table').length,
                                    modals: document.querySelectorAll('[role="dialog"], .modal').length
                                };
                                
                                return data;
                            }
                        """)
                        
                        extracted_pages[page_name] = {
                            'url': page.url,
                            'title': page.title(),
                            'screenshot': screenshot_path,
                            'html_file': html_file,
                            'components': components,
                            'js_data': js_data,
                            'status': 'success'
                        }
                        
                        print(f"    ✅ Successfully extracted {page_name}")
                        
                    except PlaywrightTimeoutError:
                        print(f"    ⚠️ Timeout extracting {page_name}")
                        extracted_pages[page_name] = {'status': 'timeout'}
                    except Exception as e:
                        print(f"    ❌ Error extracting {page_name}: {e}")
                        extracted_pages[page_name] = {'status': f'error: {e}'}
                
                # Save network traffic and API responses
                with open(os.path.join(self.dirs['api_calls'], 'all_network_requests.json'), 'w') as f:
                    json.dump(network_requests, f, indent=2)
                
                with open(os.path.join(self.dirs['api_calls'], 'api_responses.json'), 'w') as f:
                    json.dump(api_responses, f, indent=2)
                
                # Generate extraction report
                report = {
                    'extraction_timestamp': self.timestamp,
                    'base_url': self.base_url,
                    'login_successful': True,
                    'pages_extracted': len([p for p in extracted_pages.values() if p.get('status') == 'success']),
                    'total_network_requests': len(network_requests),
                    'api_responses_captured': len(api_responses),
                    'extracted_pages': extracted_pages
                }
                
                report_file = os.path.join(self.output_dir, f'extraction_report_{self.timestamp}.json')
                with open(report_file, 'w') as f:
                    json.dump(report, f, indent=2, default=str)
                
                print(f"\n📊 Extraction complete!")
                print(f"  ✅ Extracted {report['pages_extracted']} pages successfully")
                print(f"  📊 Captured {report['total_network_requests']} network requests")
                print(f"  🔌 Found {report['api_responses_captured']} API responses")
                print(f"  📄 Report saved: {report_file}")
                
                input("\nPress Enter to close browser and complete extraction...")
                
                return self.output_dir
                
            except Exception as e:
                print(f"  ❌ Error during extraction: {e}")
                page.screenshot(path=os.path.join(self.dirs['screenshots'], 'error_state.png'))
                return None
            
            finally:
                browser.close()
    
    def _analyze_page_components(self, soup):
        """Analyze page components and structure"""
        return {
            'forms': len(soup.find_all('form')),
            'buttons': len(soup.find_all('button')),
            'inputs': len(soup.find_all('input')),
            'tables': len(soup.find_all('table')),
            'nav_elements': len(soup.find_all('nav')),
            'modals': len(soup.find_all(attrs={'role': 'dialog'})),
            'cards': len(soup.find_all(class_=lambda x: x and 'card' in str(x).lower())),
            'external_scripts': [script.get('src') for script in soup.find_all('script', src=True)],
            'external_styles': [link.get('href') for link in soup.find_all('link', rel='stylesheet')]
        }

def main():
    extractor = BRXAuthenticatedExtractor()
    result = extractor.login_and_extract()
    
    if result:
        print(f"\n✅ Authentication and extraction completed!")
        print(f"Files saved to: {result}")
        print(f"\n🎯 Next steps:")
        print(f"1. Review extracted HTML pages in {result}/html/")
        print(f"2. Check screenshots in {result}/screenshots/")
        print(f"3. Analyze API calls in {result}/api_calls/")
        print(f"4. Use the extracted code as reference for your replica")
    else:
        print("❌ Extraction failed. Check your credentials and network connection.")

if __name__ == "__main__":
    main()

