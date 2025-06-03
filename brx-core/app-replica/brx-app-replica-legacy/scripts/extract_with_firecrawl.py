#!/usr/bin/env python3
"""
BRX Frontend Extraction with FireCrawl

Uses FireCrawl API for fast, comprehensive website extraction
with support for authentication and dynamic content
"""

import os
import json
import requests
import time
from datetime import datetime

class BRXFireCrawlExtractor:
    def __init__(self):
        self.base_url = "https://online.brxperformance.com"
        self.firecrawl_api_key = os.environ.get('FIRECRAWL_API_KEY')
        self.brx_username = os.environ.get('BRX_APP_USERNAME')
        self.brx_password = os.environ.get('BRX_APP_PASSWORD')
        
        self.output_dir = "../extracted_frontend_firecrawl"
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Create output directories
        self.dirs = {
            'pages': os.path.join(self.output_dir, 'pages'),
            'markdown': os.path.join(self.output_dir, 'markdown'),
            'structured': os.path.join(self.output_dir, 'structured_data'),
            'screenshots': os.path.join(self.output_dir, 'screenshots'),
            'metadata': os.path.join(self.output_dir, 'metadata')
        }
        
        for dir_path in self.dirs.values():
            os.makedirs(dir_path, exist_ok=True)
        
        if not self.firecrawl_api_key:
            print("⚠️  FIRECRAWL_API_KEY not found. Please set it in your environment.")
    
    def scrape_single_page(self, url, options=None):
        """Scrape a single page with FireCrawl"""
        if not self.firecrawl_api_key:
            print("❌ FireCrawl API key required")
            return None
        
        default_options = {
            "includeHtml": True,
            "includeMarkdown": True,
            "includeMetadata": True,
            "includeLinks": True,
            "screenshot": True,
            "waitFor": 3000,  # Wait 3 seconds for dynamic content
            "timeout": 30000
        }
        
        if options:
            default_options.update(options)
        
        # Add authentication if credentials are available
        if self.brx_username and self.brx_password:
            default_options["authentication"] = {
                "username": self.brx_username,
                "password": self.brx_password
            }
        
        headers = {
            "Authorization": f"Bearer {self.firecrawl_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "url": url,
            "formats": ["markdown", "html", "screenshot"],
            "options": default_options
        }
        
        try:
            print(f"  🔥 FireCrawling: {url}")
            response = requests.post(
                "https://api.firecrawl.dev/v1/scrape",
                headers=headers,
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"    ❌ Error {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            print(f"    ❌ Exception: {e}")
            return None
    
    def crawl_site(self, options=None):
        """Crawl entire site with FireCrawl"""
        if not self.firecrawl_api_key:
            print("❌ FireCrawl API key required")
            return None
        
        default_options = {
            "crawlerOptions": {
                "includes": [
                    f"{self.base_url}/*",
                    f"{self.base_url}/dashboard*",
                    f"{self.base_url}/workouts*",
                    f"{self.base_url}/exercises*",
                    f"{self.base_url}/clients*",
                    f"{self.base_url}/programs*"
                ],
                "excludes": [
                    "*/logout*",
                    "*/api/*",
                    "*.pdf",
                    "*.zip"
                ],
                "limit": 50,
                "maxDepth": 3
            },
            "pageOptions": {
                "includeHtml": True,
                "includeMarkdown": True,
                "includeMetadata": True,
                "includeLinks": True,
                "screenshot": True,
                "waitFor": 3000
            }
        }
        
        if options:
            default_options.update(options)
        
        headers = {
            "Authorization": f"Bearer {self.firecrawl_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "url": self.base_url,
            "options": default_options
        }
        
        try:
            print(f"🔥 Starting FireCrawl site crawl for {self.base_url}")
            response = requests.post(
                "https://api.firecrawl.dev/v1/crawl",
                headers=headers,
                json=payload,
                timeout=120
            )
            
            if response.status_code == 200:
                crawl_data = response.json()
                job_id = crawl_data.get('id')
                
                if job_id:
                    print(f"  ⚙️ Crawl started with job ID: {job_id}")
                    return self._monitor_crawl_job(job_id)
                else:
                    print("  ❌ No job ID returned")
                    return None
            else:
                print(f"  ❌ Error {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            print(f"  ❌ Exception: {e}")
            return None
    
    def _monitor_crawl_job(self, job_id):
        """Monitor crawl job progress"""
        headers = {
            "Authorization": f"Bearer {self.firecrawl_api_key}"
        }
        
        while True:
            try:
                response = requests.get(
                    f"https://api.firecrawl.dev/v1/crawl/{job_id}",
                    headers=headers,
                    timeout=30
                )
                
                if response.status_code == 200:
                    job_data = response.json()
                    status = job_data.get('status')
                    
                    if status == 'completed':
                        print("  ✅ Crawl completed!")
                        return job_data.get('data', [])
                    elif status == 'failed':
                        print("  ❌ Crawl failed")
                        return None
                    else:
                        progress = job_data.get('progress', 0)
                        print(f"  ⏳ Crawling in progress... {progress}%")
                        time.sleep(10)
                else:
                    print(f"  ❌ Error checking job status: {response.status_code}")
                    return None
                    
            except Exception as e:
                print(f"  ❌ Exception monitoring job: {e}")
                time.sleep(10)
    
    def extract_key_pages(self):
        """Extract key application pages individually"""
        print("🚀 Starting FireCrawl extraction of key BRX pages...\n")
        
        # Key pages to extract
        key_pages = {
            'homepage': self.base_url,
            'login': f"{self.base_url}/login",
            'dashboard': f"{self.base_url}/dashboard",
            'workouts': f"{self.base_url}/workouts",
            'exercises': f"{self.base_url}/exercises",
            'clients': f"{self.base_url}/clients",
            'programs': f"{self.base_url}/programs",
            'analytics': f"{self.base_url}/analytics",
            'settings': f"{self.base_url}/settings"
        }
        
        extracted_data = {}
        
        for page_name, url in key_pages.items():
            # Special options for authenticated pages
            options = {
                "includeHtml": True,
                "includeMarkdown": True,
                "includeMetadata": True,
                "screenshot": True,
                "waitFor": 5000 if page_name != 'login' else 2000
            }
            
            result = self.scrape_single_page(url, options)
            
            if result and result.get('success'):
                data = result.get('data', {})
                
                # Save HTML
                if data.get('html'):
                    html_file = os.path.join(self.dirs['pages'], f"{page_name}.html")
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(data['html'])
                
                # Save Markdown
                if data.get('markdown'):
                    md_file = os.path.join(self.dirs['markdown'], f"{page_name}.md")
                    with open(md_file, 'w', encoding='utf-8') as f:
                        f.write(data['markdown'])
                
                # Save screenshot
                if data.get('screenshot'):
                    screenshot_file = os.path.join(self.dirs['screenshots'], f"{page_name}.png")
                    # Save screenshot data (base64 or URL)
                    with open(f"{screenshot_file}.info", 'w') as f:
                        f.write(str(data['screenshot']))
                
                # Save metadata
                metadata = {
                    'url': data.get('url'),
                    'title': data.get('title'),
                    'description': data.get('description'),
                    'keywords': data.get('keywords'),
                    'ogTitle': data.get('ogTitle'),
                    'ogDescription': data.get('ogDescription'),
                    'sourceURL': data.get('sourceURL'),
                    'statusCode': data.get('statusCode'),
                    'links': data.get('links', [])[:20]  # First 20 links
                }
                
                metadata_file = os.path.join(self.dirs['metadata'], f"{page_name}_metadata.json")
                with open(metadata_file, 'w') as f:
                    json.dump(metadata, f, indent=2)
                
                extracted_data[page_name] = {
                    'success': True,
                    'url': url,
                    'title': data.get('title'),
                    'html_length': len(data.get('html', '')),
                    'markdown_length': len(data.get('markdown', '')),
                    'links_count': len(data.get('links', [])),
                    'files': {
                        'html': f"pages/{page_name}.html",
                        'markdown': f"markdown/{page_name}.md",
                        'metadata': f"metadata/{page_name}_metadata.json"
                    }
                }
                
                print(f"    ✅ Successfully extracted {page_name}")
            else:
                print(f"    ❌ Failed to extract {page_name}")
                extracted_data[page_name] = {'success': False, 'url': url}
        
        return extracted_data
    
    def generate_firecrawl_report(self, extracted_data):
        """Generate comprehensive FireCrawl extraction report"""
        successful_extractions = len([d for d in extracted_data.values() if d.get('success')])
        total_extractions = len(extracted_data)
        
        report = {
            'extraction_method': 'FireCrawl API',
            'extraction_timestamp': self.timestamp,
            'base_url': self.base_url,
            'successful_extractions': successful_extractions,
            'total_attempted': total_extractions,
            'success_rate': f"{(successful_extractions/total_extractions)*100:.1f}%" if total_extractions > 0 else "0%",
            'extracted_pages': extracted_data,
            'output_directories': self.dirs,
            'firecrawl_features_used': [
                'HTML extraction',
                'Markdown conversion',
                'Screenshot capture',
                'Metadata extraction',
                'Link discovery',
                'Dynamic content waiting'
            ]
        }
        
        report_file = os.path.join(self.output_dir, f'firecrawl_extraction_report_{self.timestamp}.json')
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📊 FireCrawl Extraction Report:")
        print(f"  ✅ Successfully extracted: {successful_extractions}/{total_extractions} pages")
        print(f"  📁 Files saved to: {self.output_dir}")
        print(f"  📄 Report: {report_file}")
        
        return report_file
    
    def run_extraction(self):
        """Run complete FireCrawl extraction"""
        if not self.firecrawl_api_key:
            print("❌ FireCrawl API key required. Please set FIRECRAWL_API_KEY environment variable.")
            return None
        
        print(f"🔥 Starting BRX Frontend Extraction with FireCrawl...\n")
        
        # Extract key pages individually for better control
        extracted_data = self.extract_key_pages()
        
        # Generate report
        report_file = self.generate_firecrawl_report(extracted_data)
        
        print(f"\n🎯 Next Steps:")
        print(f"1. Review extracted HTML in: {self.dirs['pages']}")
        print(f"2. Check markdown versions in: {self.dirs['markdown']}")
        print(f"3. View screenshots in: {self.dirs['screenshots']}")
        print(f"4. Analyze metadata in: {self.dirs['metadata']}")
        print(f"5. Use extracted content to build your replica")
        
        return self.output_dir

def main():
    extractor = BRXFireCrawlExtractor()
    result = extractor.run_extraction()
    
    if result:
        print(f"\n✅ FireCrawl extraction completed successfully!")
        print(f"All files saved to: {result}")
    else:
        print(f"\n❌ FireCrawl extraction failed. Check your API key and credentials.")

if __name__ == "__main__":
    main()

