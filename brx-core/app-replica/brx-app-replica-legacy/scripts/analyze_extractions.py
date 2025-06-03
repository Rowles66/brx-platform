#!/usr/bin/env python3
"""
BRX Extraction Analysis Tool

Analyzes all extracted frontend data and provides recommendations
"""

import os
import json
from bs4 import BeautifulSoup
import glob
from collections import defaultdict

class BRXExtractionAnalyzer:
    def __init__(self):
        self.base_dir = "../"
        self.extraction_dirs = [
            "extracted_frontend",
            "extracted_frontend_auth", 
            "extracted_frontend_firecrawl"
        ]
        self.analysis_results = {}
    
    def analyze_all_extractions(self):
        """Analyze all available extraction directories"""
        print("🔍 Analyzing all BRX frontend extractions...\n")
        
        for extraction_dir in self.extraction_dirs:
            full_path = os.path.join(self.base_dir, extraction_dir)
            if os.path.exists(full_path):
                print(f"  📁 Found extraction: {extraction_dir}")
                self.analysis_results[extraction_dir] = self._analyze_extraction_dir(full_path)
            else:
                print(f"  ⚠️  Missing: {extraction_dir}")
                self.analysis_results[extraction_dir] = {'status': 'not_found'}
        
        return self.analysis_results
    
    def _analyze_extraction_dir(self, dir_path):
        """Analyze a specific extraction directory"""
        analysis = {
            'status': 'found',
            'html_files': [],
            'css_files': [],
            'js_files': [],
            'screenshots': [],
            'api_data': [],
            'components_analysis': {},
            'total_files': 0,
            'frameworks_detected': [],
            'ui_patterns': []
        }
        
        # Count all files
        for root, dirs, files in os.walk(dir_path):
            analysis['total_files'] += len(files)
        
        # Analyze HTML files
        html_dir = os.path.join(dir_path, 'html')
        if os.path.exists(html_dir):
            for html_file in glob.glob(os.path.join(html_dir, '*.html')):
                analysis['html_files'].append(os.path.basename(html_file))
                
                # Quick analysis of HTML content
                try:
                    with open(html_file, 'r', encoding='utf-8') as f:
                        soup = BeautifulSoup(f.read(), 'html.parser')
                        
                    # Detect frameworks
                    if soup.find(attrs={'data-reactroot': True}) or soup.find(id='root'):
                        if 'React' not in analysis['frameworks_detected']:
                            analysis['frameworks_detected'].append('React')
                    
                    if soup.find(attrs={'ng-app': True}) or soup.find(class_=lambda x: x and 'ng-' in str(x)):
                        if 'Angular' not in analysis['frameworks_detected']:
                            analysis['frameworks_detected'].append('Angular')
                    
                    # Analyze UI patterns
                    if soup.find_all('form'):
                        analysis['ui_patterns'].append('Forms')
                    if soup.find_all('table'):
                        analysis['ui_patterns'].append('Tables')
                    if soup.find_all(attrs={'role': 'dialog'}) or soup.find_all(class_=lambda x: x and 'modal' in str(x).lower()):
                        analysis['ui_patterns'].append('Modals')
                    if soup.find_all('nav') or soup.find_all(class_=lambda x: x and 'nav' in str(x).lower()):
                        analysis['ui_patterns'].append('Navigation')
                    
                except Exception as e:
                    print(f"    ⚠️  Error analyzing {html_file}: {e}")
        
        # Analyze CSS files
        css_dir = os.path.join(dir_path, 'css')
        if os.path.exists(css_dir):
            analysis['css_files'] = [f for f in os.listdir(css_dir) if f.endswith('.css')]
        
        # Analyze JS files
        js_dir = os.path.join(dir_path, 'js')
        if os.path.exists(js_dir):
            analysis['js_files'] = [f for f in os.listdir(js_dir) if f.endswith('.js')]
        
        # Check for screenshots
        screenshots_dir = os.path.join(dir_path, 'screenshots')
        if os.path.exists(screenshots_dir):
            analysis['screenshots'] = [f for f in os.listdir(screenshots_dir) if f.endswith('.png')]
        
        # Check for API data
        api_dir = os.path.join(dir_path, 'api_calls')
        if os.path.exists(api_dir):
            analysis['api_data'] = [f for f in os.listdir(api_dir) if f.endswith('.json')]
        
        # Remove duplicates from UI patterns
        analysis['ui_patterns'] = list(set(analysis['ui_patterns']))
        
        return analysis
    
    def generate_comprehensive_report(self):
        """Generate comprehensive analysis report"""
        print("\n📊 Comprehensive BRX Frontend Extraction Analysis\n")
        print("=" * 60)
        
        total_html_files = 0
        total_screenshots = 0
        all_frameworks = set()
        all_ui_patterns = set()
        
        for extraction_name, analysis in self.analysis_results.items():
            if analysis.get('status') == 'found':
                print(f"\n📁 {extraction_name.upper()}:")
                print(f"  ✅ Status: Found")
                print(f"  📄 HTML files: {len(analysis['html_files'])} ({', '.join(analysis['html_files'])})")
                print(f"  🎨 CSS files: {len(analysis['css_files'])}")
                print(f"  📜 JS files: {len(analysis['js_files'])}")
                print(f"  📷 Screenshots: {len(analysis['screenshots'])}")
                print(f"  🔌 API data files: {len(analysis['api_data'])}")
                print(f"  📦 Total files: {analysis['total_files']}")
                print(f"  💬 Frameworks: {', '.join(analysis['frameworks_detected']) or 'None detected'}")
                print(f"  🧩 UI patterns: {', '.join(analysis['ui_patterns']) or 'None detected'}")
                
                total_html_files += len(analysis['html_files'])
                total_screenshots += len(analysis['screenshots'])
                all_frameworks.update(analysis['frameworks_detected'])
                all_ui_patterns.update(analysis['ui_patterns'])
            else:
                print(f"\n📁 {extraction_name.upper()}:")
                print(f"  ❌ Status: Not found")
        
        print("\n" + "=" * 60)
        print("📊 SUMMARY STATISTICS:")
        print(f"  📄 Total HTML pages extracted: {total_html_files}")
        print(f"  📷 Total screenshots captured: {total_screenshots}")
        print(f"  💬 Frameworks detected: {', '.join(all_frameworks) or 'None'}")
        print(f"  🧩 UI patterns found: {', '.join(all_ui_patterns) or 'None'}")
        
        return {
            'total_html_files': total_html_files,
            'total_screenshots': total_screenshots,
            'frameworks': list(all_frameworks),
            'ui_patterns': list(all_ui_patterns),
            'extraction_details': self.analysis_results
        }
    
    def recommend_next_steps(self, summary):
        """Provide recommendations based on analysis"""
        print("\n🎯 RECOMMENDATIONS:")
        print("=" * 60)
        
        if summary['total_html_files'] > 0:
            print("✅ SUCCESS: You have extracted HTML content!")
            print("\n🚀 IMMEDIATE NEXT STEPS:")
            
            if 'React' in summary['frameworks']:
                print("  1. 💬 Your app uses React - focus on component extraction")
                print("     → Look for JSX patterns in the HTML")
                print("     → Extract component structure and props")
            else:
                print("  1. 💬 No clear framework detected - likely server-rendered or vanilla JS")
                print("     → Focus on HTML structure and inline JavaScript")
            
            if summary['total_screenshots'] > 0:
                print("  2. 📷 Use screenshots for UI reference")
                print("     → Compare with your replica as you build")
            
            if 'Forms' in summary['ui_patterns']:
                print("  3. 📝 Replicate form structures first")
                print("     → Forms are core to user interaction")
            
            if 'Navigation' in summary['ui_patterns']:
                print("  4. 🧩 Build navigation component")
                print("     → Essential for app structure")
            
            print("\n🛠️  DEVELOPMENT WORKFLOW:")
            print("  1. Start with basic React app structure")
            print("  2. Extract and recreate navigation first")
            print("  3. Build main layout components")
            print("  4. Implement forms and data entry")
            print("  5. Add dynamic functionality")
            print("  6. Style to match screenshots")
            
        else:
            print("⚠️  LIMITED EXTRACTION: Consider these options:")
            print("  1. 🔥 Try FireCrawl for better extraction (get API key)")
            print("  2. 📱 Manual browser inspection with DevTools")
            print("  3. 🔍 Re-run authenticated extraction")
        
        print("\n📅 RECOMMENDED TOOLS:")
        print("  • Chrome DevTools for manual inspection")
        print("  • React Developer Tools (if React app)")
        print("  • FireCrawl API for automated extraction")
        print("  • Postman for API testing")
        
        print("\n📚 USEFUL COMMANDS:")
        print("  • View extracted HTML: open extracted_frontend/html/")
        print("  • Check screenshots: open extracted_frontend/assets/")
        print("  • Analyze network data: cat extracted_frontend/api_calls/*.json")

def main():
    analyzer = BRXExtractionAnalyzer()
    results = analyzer.analyze_all_extractions()
    summary = analyzer.generate_comprehensive_report()
    analyzer.recommend_next_steps(summary)
    
    # Save analysis report
    report_file = "../extraction_analysis_report.json"
    with open(report_file, 'w') as f:
        json.dump({
            'analysis_timestamp': os.path.basename(__file__),
            'summary': summary,
            'detailed_results': results
        }, f, indent=2)
    
    print(f"\n📄 Detailed analysis saved to: {report_file}")

if __name__ == "__main__":
    main()

