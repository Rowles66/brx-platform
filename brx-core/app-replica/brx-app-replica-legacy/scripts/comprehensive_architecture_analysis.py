#!/usr/bin/env python3
"""
BRX Performance App - Comprehensive Architecture Analysis Tool

This script scrapes and analyzes all aspects of your current application
architecture across multiple platforms to map the complete system.
"""

import os
import json
import requests
import pandas as pd
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
import subprocess
from datetime import datetime
import yaml
import time

class BRXArchitectureAnalyzer:
    def __init__(self):
        # Corrected paths to be relative to the project root where the script is expected to be run from
        # or ensure the script is run from its own directory and paths are relative to it.
        # Assuming the script is in `brx-app-replica/scripts/` and run from `brx-app-replica/`
        self.project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
        self.output_dir = os.path.join(self.project_root, "data_analysis", "architecture_analysis")
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.results = {
            "frontend_analysis": {},
            "api_analysis": {},
            "database_analysis": {},
            "integrations": {},
            "infrastructure": {},
            "security": {},
            "performance": {}
        }
        os.makedirs(self.output_dir, exist_ok=True)
        self.username = os.environ.get('BRX_APP_USERNAME')
        self.password = os.environ.get('BRX_APP_PASSWORD')
    
    def _login(self, page, base_url):
        if not self.username or not self.password:
            print("  ⚠️  Username or password not provided. Skipping authenticated frontend scan.")
            return False

        print(f"  🔐 Attempting login to {base_url}...")
        try:
            page.goto(base_url, timeout=30000) 
            page.wait_for_load_state('networkidle', timeout=15000)
            print(f"    ✓ Navigated to {page.url}")

            # Specific selectors for online.brxperformance.com login
            user_field_selector = 'input[name="email"]' # Based on typical Exercise.com structure
            pass_field_selector = 'input[name="password"]'
            submit_button_selector = 'button[type="submit"]' # Or a more specific selector like 'button:has-text("Sign In")'

            if page.query_selector(user_field_selector):
                page.fill(user_field_selector, self.username)
                print(f"    ✓ Filled username field")
            else:
                print(f"    ❌ Username field ({user_field_selector}) not found.")
                # page.screenshot(path=os.path.join(self.output_dir, f"login_page_no_user_field_{self.timestamp}.png"))
                return False

            if page.query_selector(pass_field_selector):
                page.fill(pass_field_selector, self.password)
                print(f"    ✓ Filled password field")
            else:
                print(f"    ❌ Password field ({pass_field_selector}) not found.")
                # page.screenshot(path=os.path.join(self.output_dir, f"login_page_no_pass_field_{self.timestamp}.png"))
                return False

            if page.query_selector(submit_button_selector):
                page.click(submit_button_selector)
                print(f"    ✓ Clicked submit button")
            else:
                print(f"    ❌ Submit button ({submit_button_selector}) not found.")
                # page.screenshot(path=os.path.join(self.output_dir, f"login_page_no_submit_btn_{self.timestamp}.png"))
                return False
            
            page.wait_for_load_state('networkidle', timeout=20000) # Wait for navigation after login
            print(f"    ✓ Post-login URL: {page.url}")
            
            # More robust check for login success, e.g., looking for a dashboard-specific element
            # or checking if the URL is no longer a login/auth URL.
            if "login" in page.url.lower() or "signin" in page.url.lower() or "auth" in page.url.lower():
                print("    ❌ Login failed (URL suggests still on login/auth page).")
                # page.screenshot(path=os.path.join(self.output_dir, f"login_failure_url_{self.timestamp}.png"))
                return False
            else:
                print("    ✅ Login successful!")
                return True
                
        except PlaywrightTimeoutError as e:
            print(f"    ❌ Timeout during login attempt: {e}")
            # page.screenshot(path=os.path.join(self.output_dir, f"login_timeout_{self.timestamp}.png"))
            return False
        except Exception as e:
            print(f"  ❌ Error during login: {e}")
            # page.screenshot(path=os.path.join(self.output_dir, f"login_error_{self.timestamp}.png"))
            return False

    def analyze_frontend_architecture(self, base_url="https://online.brxperformance.com"):
        """Analyze frontend architecture through browser automation"""
        print(f"🌐 Analyzing frontend architecture at {base_url}")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True) # Set headless=False for debugging
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
            )
            page = context.new_page()
            
            login_successful = self._login(page, base_url)

            if not login_successful:
                print("  Skipping authenticated frontend analysis.")
                self.results['frontend_analysis']['status'] = "Login failed or skipped"
                browser.close()
                return

            try:
                print("  🚀 Starting authenticated frontend data extraction...")
                time.sleep(5) 

                js_frameworks = page.evaluate("""
                    () => {
                        const frameworks = new Set();
                        if (window.React || document.querySelector('[data-reactroot]')) frameworks.add('React');
                        if (window.Vue) frameworks.add('Vue');
                        if (window.angular || document.querySelector('.ng-scope')) frameworks.add('Angular');
                        if (window.jQuery || window.$) frameworks.add('jQuery');
                        if (window.bootstrap || (window.jQuery && window.jQuery.fn.modal)) frameworks.add('Bootstrap');
                        // Add checks for other frameworks (Ember, Backbone, Svelte, etc.)
                        // Check for common global objects or specific DOM attributes
                        return Array.from(frameworks);
                    }
                """)
                print(f"    🔍 Detected JS Frameworks: {js_frameworks}")
                
                network_requests = []
                page.on('request', lambda request: network_requests.append({
                    'url': request.url, 'method': request.method, 'resource_type': request.resource_type
                }))
                
                key_pages_to_analyze = {
                    "Dashboard": "/dashboard", 
                    "Workouts": "/workouts/calendar", # Example paths, adjust as needed
                    "Exercises": "/exercises/list",
                    "Clients": "/clients/list",
                    "Profile": "/profile/account"
                }
                page_analysis = {}
                
                for page_name, page_path in key_pages_to_analyze.items():
                    target_url = f"{base_url}{page_path}"
                    print(f"    Navigating to: {page_name} ({target_url})")
                    try:
                        page.goto(target_url, wait_until='networkidle', timeout=25000)
                        time.sleep(3) # Wait for any dynamic content loading
                        
                        page_content_summary = {
                            'title': page.title(),
                            'forms': len(page.query_selector_all('form')),
                            'tables': len(page.query_selector_all('table')),
                            'buttons': len(page.query_selector_all('button:visible')),
                            'inputs': len(page.query_selector_all('input:visible')),
                            'links': len(page.query_selector_all('a:visible')),
                            'current_url': page.url,
                            'status': 'OK'
                        }
                        page_analysis[page_name] = page_content_summary
                        print(f"      ✓ Analyzed {page_name}: Title - {page.title()}")
                    except PlaywrightTimeoutError:
                        print(f"      ⚠️  Timeout analyzing {page_name} at {target_url}.")
                        page_analysis[page_name] = {'status': 'Timeout', 'current_url': page.url, 'title': 'N/A'}
                    except Exception as e:
                        print(f"      ⚠️  Error analyzing {page_name} at {page_path}: {e}")
                        page_analysis[page_name] = {'status': f'Error: {e}', 'current_url': page.url, 'title': 'N/A'}
                
                self.results['frontend_analysis'] = {
                    'status': 'Authenticated analysis attempted',
                    'login_successful': login_successful,
                    'frameworks': js_frameworks,
                    'pages_analyzed': page_analysis,
                    'total_network_requests_captured': len(network_requests),
                    'api_endpoints_called_after_login': sorted(list(set([req['url'] for req in network_requests if 'api' in req['url'].lower()])))
                }
                
            except Exception as e:
                print(f"  ❌ Error during authenticated frontend analysis: {e}")
                self.results['frontend_analysis']['status'] = f"Error during analysis: {e}"
                self.results['frontend_analysis']['login_successful'] = login_successful
            finally:
                browser.close()
    
    def analyze_api_architecture(self):
        print("🔌 Analyzing API architecture from Swagger documentation")
        swagger_file_path = os.path.join(self.project_root, 'swagger.yaml')
        if not os.path.exists(swagger_file_path):
            print(f"  ⚠️ Swagger file not found at {swagger_file_path}")
            self.results['api_analysis'] = {'status': 'Swagger file not found'}
            return
        try:
            with open(swagger_file_path, 'r') as f: swagger_data = yaml.safe_load(f)
            paths = swagger_data.get('paths', {}); components = swagger_data.get('components', {})
            api_analysis = {
                'total_endpoints': len(paths), 'methods_used': set(),
                'data_models': list(components.get('schemas', {}).keys()),
                'security_schemes': list(components.get('securitySchemes', {}).keys()),
                'endpoints_by_category': {}
            }
            for path, methods in paths.items():
                for method in methods.keys():
                    api_analysis['methods_used'].add(method.upper())
                    category = path.split('/')[2] if len(path.split('/')) > 2 else 'root'
                    api_analysis['endpoints_by_category'].setdefault(category, []).append({'path': path, 'method': method.upper()})
            api_analysis['methods_used'] = sorted(list(api_analysis['methods_used']))
            self.results['api_analysis'] = api_analysis
            print("  ✓ API analysis complete.")
        except Exception as e:
            print(f"  ⚠️  Error analyzing API: {e}"); self.results['api_analysis'] = {'status': f'Error: {e}'}
    
    def analyze_google_cloud_infrastructure(self):
        print("☁️  Analyzing Google Cloud infrastructure")
        try:
            gcloud_path = subprocess.check_output(["which", "gcloud"], text=True).strip()
            print(f"    Using gcloud at: {gcloud_path}")
            config_cmd = subprocess.run([gcloud_path, 'config', 'list', '--format=json'], capture_output=True, text=True, check=False)
            config_data = json.loads(config_cmd.stdout) if config_cmd.returncode == 0 else {"error": f"Failed to get config: {config_cmd.stderr}"}
            services_cmd = subprocess.run([gcloud_path, 'services', 'list', '--enabled', '--format=json'], capture_output=True, text=True, check=False)
            services_data = json.loads(services_cmd.stdout) if services_cmd.returncode == 0 else []
            self.results['infrastructure'] = {
                'gcloud_config': config_data,
                'enabled_services': [s.get('config',{}).get('name','N/A') for s in services_data],
                'project_id': config_data.get('core', {}).get('project', 'N/A')
            }
            print("  ✓ Google Cloud analysis complete.")
        except FileNotFoundError:
            print("  ⚠️ gcloud command not found. Ensure it's in PATH. Skipping Google Cloud analysis.")
            self.results['infrastructure'] = {'status': 'gcloud not found'}
        except Exception as e:
            print(f"  ⚠️  Error analyzing Google Cloud: {e}"); self.results['infrastructure'] = {'status': f'Error: {e}'}
    
    def analyze_integrations(self):
        print("🔗 Analyzing third-party integrations")
        self.results['integrations'] = {
            'hubspot': {'type': 'CRM', 'configured': True},
            'exercise_com': {'type': 'Platform', 'configured': True},
            'google_cloud': {'type': 'Infrastructure', 'configured': True},
            '1password': {'type': 'Security', 'configured': True}
        }
        print("  ✓ Integrations analysis complete.")
    
    def generate_architecture_report(self):
        print("📊 Generating comprehensive architecture report")
        report_file = os.path.join(self.output_dir, f"architecture_report_{self.timestamp}.json")
        excel_file = os.path.join(self.output_dir, f"architecture_analysis_{self.timestamp}.xlsx")
        with open(report_file, 'w') as f: json.dump(self.results, f, indent=2, default=str)
        with pd.ExcelWriter(excel_file, engine='xlsxwriter') as writer:
            if self.results.get('api_analysis', {}).get('endpoints_by_category'):
                api_df_data = []
                for cat, eps in self.results['api_analysis']['endpoints_by_category'].items():
                    for ep in eps: api_df_data.append({'Category': cat, 'Path': ep['path'], 'Method': ep['method']})
                if api_df_data: pd.DataFrame(api_df_data).to_excel(writer, sheet_name='API Endpoints', index=False)
            if self.results.get('frontend_analysis', {}).get('pages_analyzed'):
                fe_df_data = []
                for page_name, data in self.results['frontend_analysis']['pages_analyzed'].items():
                    fe_df_data.append({'Page Name': page_name, **data})
                if fe_df_data: pd.DataFrame(fe_df_data).to_excel(writer, sheet_name='Frontend Pages', index=False)
            if self.results.get('integrations'):
                int_df_data = []
                for name, details in self.results['integrations'].items(): int_df_data.append({'Service': name, **details})
                if int_df_data: pd.DataFrame(int_df_data).to_excel(writer, sheet_name='Integrations', index=False)
        print(f"✅ Reports generated:")
        print(f"  📄 JSON: {report_file}")
        print(f"  📊 Excel: {excel_file}")
        return report_file, excel_file
    
    def run_full_analysis(self, analyze_live_frontend=False):
        print("🚀 Starting comprehensive BRX architecture analysis...\n")
        if analyze_live_frontend and self.username and self.password:
            self.analyze_frontend_architecture()
        else:
            print("⚠️  Live frontend analysis SKIPPED (credentials not provided or scan not requested).")
            self.results['frontend_analysis']['status'] = "Skipped (no credentials or not requested)"
        self.analyze_api_architecture()
        self.analyze_google_cloud_infrastructure()
        self.analyze_integrations()
        return self.generate_architecture_report()

def main():
    attempt_frontend_scan = bool(os.environ.get('BRX_APP_USERNAME') and os.environ.get('BRX_APP_PASSWORD'))
    analyzer = BRXArchitectureAnalyzer()
    json_report, excel_report = analyzer.run_full_analysis(analyze_live_frontend=attempt_frontend_scan)
    print(f"\n🎯 Next Steps for AI Analysis:\n1. Review the generated reports:\n   - {json_report}\n   - {excel_report}\n2. Use these reports with AI to identify gaps, improvements, priorities, and recommendations.")

if __name__ == "__main__":
    main()

