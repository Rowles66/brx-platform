#!/usr/bin/env python3
"""
BRX Frontend Code Extraction Tool

Extracts HTML, CSS, JavaScript, and UX components from online.brxperformance.com
"""

import os
import requests
import json
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import time
from urllib.parse import urljoin, urlparse
import re

class BRXFrontendExtractor:
    def __init__(self):
        self.base_url = "https://online.brxperformance.com"
        self.output_dir = "../extracted_frontend"
        self.timestamp = time.strftime("%Y%m%d_%H%M%S")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Create subdirectories
        self.dirs = {
            'html': os.path.join(self.output_dir, 'html'),
            'css': os.path.join(self.output_dir, 'css'),
            'js': os.path.join(self.output_dir, 'js'),
            'assets': os.path.join(self.output_dir, 'assets'),
            'api': os.path.join(self.output_dir, 'api_calls'),
            'components': os.path.join(self.output_dir, 'components')
        }
        
        for dir_path in self.dirs.values():
            os.makedirs(dir_path, exist_ok=True)
    
    def extract_public_pages(self):
        """Extract publicly accessible pages without authentication"""
        print("🌐 Extracting public pages...")
        
        public_pages = [
            '/',
            '/login',
            '/signup',
            '/about',
            '/features',
            '/pricing',
            '/contact'
        ]
        
        extracted_pages = {}
        
        for page in public_pages:
            try:
                url = urljoin(self.base_url, page)
                print(f"  📄 Extracting: {url}")
                
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Save HTML
                    page_name = page.strip('/') or 'index'
                    html_file = os.path.join(self.dirs['html'], f"{page_name}.html")
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(soup.prettify())
                    
                    # Extract inline CSS and JS
                    css_content = self._extract_inline_css(soup)
                    js_content = self._extract_inline_js(soup)
                    
                    # Extract external resources
                    external_css = self._extract_external_css(soup)
                    external_js = self._extract_external_js(soup)
                    
                    extracted_pages[page] = {
                        'html_file': html_file,
                        'title': soup.title.string if soup.title else 'No title',
                        'inline_css_lines': len(css_content.splitlines()) if css_content else 0,
                        'inline_js_lines': len(js_content.splitlines()) if js_content else 0,
                        'external_css_count': len(external_css),
                        'external_js_count': len(external_js),
                        'status': 'success'
                    }
                    
                    print(f"    ✅ Extracted {page_name}.html")
                    
                else:
                    print(f"    ❌ Failed to load {url}: HTTP {response.status_code}")
                    extracted_pages[page] = {'status': f'HTTP {response.status_code}'}
                    
            except Exception as e:
                print(f"    ❌ Error extracting {page}: {e}")
                extracted_pages[page] = {'status': f'Error: {e}'}
        
        return extracted_pages
    
    def extract_with_browser_automation(self):
        """Use Playwright to extract dynamic content"""
        print("🤖 Extracting with browser automation...")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Capture network requests
            network_requests = []
            page.on('request', lambda request: network_requests.append({
                'url': request.url,
                'method': request.method,
                'resource_type': request.resource_type,
                'headers': dict(request.headers)
            }))
            
            try:
                # Go to main page
                page.goto(self.base_url, wait_until='networkidle')
                
                # Take screenshot
                screenshot_path = os.path.join(self.dirs['assets'], 'homepage_screenshot.png')
                page.screenshot(path=screenshot_path, full_page=True)
                
                # Extract page source after JS execution
                html_content = page.content()
                with open(os.path.join(self.dirs['html'], 'dynamic_index.html'), 'w') as f:
                    f.write(html_content)
                
                # Extract JavaScript frameworks detected
                frameworks = page.evaluate("""
                    () => {
                        const detected = [];
                        if (window.React) detected.push({name: 'React', version: window.React.version || 'unknown'});
                        if (window.Vue) detected.push({name: 'Vue', version: window.Vue.version || 'unknown'});
                        if (window.angular) detected.push({name: 'Angular', version: window.angular.version?.full || 'unknown'});
                        if (window.jQuery) detected.push({name: 'jQuery', version: window.jQuery.fn.jquery || 'unknown'});
                        if (window.bootstrap) detected.push({name: 'Bootstrap', version: 'detected'});
                        return detected;
                    }
                """)
                
                # Save network requests
                with open(os.path.join(self.dirs['api'], 'network_requests.json'), 'w') as f:
                    json.dump(network_requests, f, indent=2)
                
                print(f"    ✅ Captured {len(network_requests)} network requests")
                print(f"    🔍 Detected frameworks: {frameworks}")
                
                return {
                    'frameworks': frameworks,
                    'network_requests': len(network_requests),
                    'screenshot': screenshot_path,
                    'dynamic_html': 'dynamic_index.html'
                }
                
            finally:
                browser.close()
    
    def _extract_inline_css(self, soup):
        """Extract inline CSS from style tags"""
        css_content = ""
        for style_tag in soup.find_all('style'):
            css_content += style_tag.string or ""
        
        if css_content:
            css_file = os.path.join(self.dirs['css'], 'inline_styles.css')
            with open(css_file, 'w') as f:
                f.write(css_content)
        
        return css_content
    
    def _extract_inline_js(self, soup):
        """Extract inline JavaScript from script tags"""
        js_content = ""
        for script_tag in soup.find_all('script'):
            if script_tag.string and not script_tag.get('src'):
                js_content += script_tag.string + "\n\n"
        
        if js_content:
            js_file = os.path.join(self.dirs['js'], 'inline_scripts.js')
            with open(js_file, 'w') as f:
                f.write(js_content)
        
        return js_content
    
    def _extract_external_css(self, soup):
        """Extract external CSS file URLs"""
        css_files = []
        for link in soup.find_all('link', rel='stylesheet'):
            href = link.get('href')
            if href:
                css_files.append(urljoin(self.base_url, href))
        return css_files
    
    def _extract_external_js(self, soup):
        """Extract external JavaScript file URLs"""
        js_files = []
        for script in soup.find_all('script', src=True):
            src = script.get('src')
            if src:
                js_files.append(urljoin(self.base_url, src))
        return js_files
    
    def download_external_resources(self, css_urls, js_urls):
        """Download external CSS and JS files"""
        print("📥 Downloading external resources...")
        
        # Download CSS files
        for i, css_url in enumerate(css_urls):
            try:
                response = requests.get(css_url, timeout=10)
                if response.status_code == 200:
                    filename = f"external_{i+1}.css"
                    filepath = os.path.join(self.dirs['css'], filename)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(response.text)
                    print(f"    ✅ Downloaded {filename}")
            except Exception as e:
                print(f"    ❌ Failed to download {css_url}: {e}")
        
        # Download JS files
        for i, js_url in enumerate(js_urls):
            try:
                response = requests.get(js_url, timeout=10)
                if response.status_code == 200:
                    filename = f"external_{i+1}.js"
                    filepath = os.path.join(self.dirs['js'], filename)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(response.text)
                    print(f"    ✅ Downloaded {filename}")
            except Exception as e:
                print(f"    ❌ Failed to download {js_url}: {e}")
    
    def analyze_ui_components(self, html_file):
        """Analyze and extract UI components from HTML"""
        print("🧩 Analyzing UI components...")
        
        with open(html_file, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        
        components = {
            'forms': [],
            'buttons': [],
            'navigation': [],
            'modals': [],
            'tables': [],
            'cards': []
        }
        
        # Extract forms
        for form in soup.find_all('form'):
            components['forms'].append({
                'action': form.get('action', ''),
                'method': form.get('method', 'GET'),
                'inputs': len(form.find_all('input')),
                'html': str(form)
            })
        
        # Extract buttons
        for button in soup.find_all(['button', 'input']):
            if button.name == 'input' and button.get('type') not in ['button', 'submit']:
                continue
            components['buttons'].append({
                'text': button.get_text(strip=True),
                'type': button.get('type', ''),
                'classes': button.get('class', []),
                'html': str(button)
            })
        
        # Extract navigation
        for nav in soup.find_all(['nav', 'ul']):
            if nav.find('a'):  # Contains links
                links = [a.get('href') for a in nav.find_all('a')]
                components['navigation'].append({
                    'links': links,
                    'html': str(nav)
                })
        
        # Save component analysis
        components_file = os.path.join(self.dirs['components'], 'ui_components.json')
        with open(components_file, 'w') as f:
            json.dump(components, f, indent=2)
        
        return components
    
    def generate_extraction_report(self, public_pages, automation_results, components):
        """Generate comprehensive extraction report"""
        report = {
            'extraction_timestamp': self.timestamp,
            'base_url': self.base_url,
            'public_pages_extracted': len([p for p in public_pages.values() if p.get('status') == 'success']),
            'total_pages_attempted': len(public_pages),
            'frameworks_detected': automation_results.get('frameworks', []),
            'network_requests_captured': automation_results.get('network_requests', 0),
            'ui_components_found': {
                'forms': len(components.get('forms', [])),
                'buttons': len(components.get('buttons', [])),
                'navigation': len(components.get('navigation', [])),
                'modals': len(components.get('modals', [])),
                'tables': len(components.get('tables', [])),
                'cards': len(components.get('cards', []))
            },
            'extraction_details': {
                'public_pages': public_pages,
                'automation_results': automation_results
            }
        }
        
        report_file = os.path.join(self.output_dir, f'extraction_report_{self.timestamp}.json')
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📊 Extraction Report Generated: {report_file}")
        print(f"✅ Successfully extracted {report['public_pages_extracted']} pages")
        print(f"🔍 Detected frameworks: {[f['name'] for f in report['frameworks_detected']]}")
        print(f"🧩 Found {sum(report['ui_components_found'].values())} UI components")
        
        return report_file
    
    def run_extraction(self):
        """Run complete frontend extraction"""
        print("🚀 Starting BRX Frontend Code Extraction...\n")
        
        # Extract public pages
        public_pages = self.extract_public_pages()
        
        # Extract with browser automation
        automation_results = self.extract_with_browser_automation()
        
        # Analyze components from extracted HTML
        components = {}
        for page, data in public_pages.items():
            if data.get('status') == 'success':
                page_components = self.analyze_ui_components(data['html_file'])
                components.update(page_components)
                break  # Analyze first successful page
        
        # Generate report
        report_file = self.generate_extraction_report(public_pages, automation_results, components)
        
        print(f"\n🎯 Next Steps:")
        print(f"1. Review extracted files in: {self.output_dir}")
        print(f"2. Check extraction report: {report_file}")
        print(f"3. Use browser dev tools for authenticated pages")
        print(f"4. Consider using the authenticated scraping method for full app")
        
        return self.output_dir

def main():
    extractor = BRXFrontendExtractor()
    output_dir = extractor.run_extraction()
    print(f"\n✅ Frontend extraction complete! Files saved to: {output_dir}")

if __name__ == "__main__":
    main()

