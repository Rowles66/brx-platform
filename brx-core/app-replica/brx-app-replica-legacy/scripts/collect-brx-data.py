#!/usr/bin/env python3
"""
BRX Performance Data Collection Script
Systematically extracts data from BRX API and Exercise.com platform
"""

import requests
import json
import os
from datetime import datetime
import time

class BRXDataCollector:
    def __init__(self):
        # Load credentials from 1Password via environment
        self.base_url = "https://online.brxperformance.com/api/v4"
        self.api_token = os.getenv('BRX_API_TOKEN')
        self.bearer_token = os.getenv('BRX_BEARER_TOKEN')
        self.username = os.getenv('BRX_USERNAME')
        self.password = os.getenv('BRX_PASSWORD')
        
        self.headers = {
            'Authorization': f'Bearer {self.bearer_token}',
            'Content-Type': 'application/json',
            'User-Agent': 'BRX-Data-Collector/1.0'
        }
        
        # Create output directory
        self.output_dir = f"data_collection_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.makedirs(self.output_dir, exist_ok=True)
        
    def collect_api_endpoints(self):
        """Systematically test and document all API endpoints from swagger.yaml"""
        endpoints = [
            '/api/v3/equipment',
            '/api/v3/workout_blocks', 
            '/api/v3/workout_exercise_sets',
            '/api/v4/users',
            '/api/v4/workouts',
            '/api/v4/exercises',
            '/api/v4/programs',
            # Add more endpoints from swagger analysis
        ]
        
        results = {}
        for endpoint in endpoints:
            print(f"Testing endpoint: {endpoint}")
            try:
                response = requests.get(f"{self.base_url}{endpoint}", headers=self.headers)
                results[endpoint] = {
                    'status_code': response.status_code,
                    'headers': dict(response.headers),
                    'data': response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                }
                print(f"  ✓ Status: {response.status_code}")
            except Exception as e:
                results[endpoint] = {'error': str(e)}
                print(f"  ✗ Error: {e}")
            
            time.sleep(1)  # Rate limiting
        
        # Save results
        with open(f"{self.output_dir}/api_endpoints.json", 'w') as f:
            json.dump(results, f, indent=2)
        
        return results
    
    def analyze_data_structures(self, api_results):
        """Analyze and document data structures from API responses"""
        schemas = {}
        
        for endpoint, result in api_results.items():
            if 'data' in result and isinstance(result['data'], (dict, list)):
                schemas[endpoint] = self.extract_schema(result['data'])
        
        with open(f"{self.output_dir}/data_schemas.json", 'w') as f:
            json.dump(schemas, f, indent=2)
        
        return schemas
    
    def extract_schema(self, data):
        """Extract schema structure from data"""
        if isinstance(data, dict):
            return {key: type(value).__name__ for key, value in data.items()}
        elif isinstance(data, list) and len(data) > 0:
            return [self.extract_schema(data[0])]
        else:
            return type(data).__name__
    
    def scrape_web_interface(self):
        """Scrape and document the web interface structure"""
        # This would use tools like Playwright or Selenium
        # For now, we'll create a placeholder for manual documentation
        web_analysis = {
            'base_url': 'https://online.brxperformance.com',
            'login_required': True,
            'main_sections': [],
            'features_discovered': []
        }
        
        with open(f"{self.output_dir}/web_interface_analysis.json", 'w') as f:
            json.dump(web_analysis, f, indent=2)
        
        return web_analysis
    
    def generate_feature_inventory(self):
        """Generate comprehensive feature inventory"""
        # This will be expanded based on findings
        features = {
            'authentication': [],
            'user_management': [],
            'workout_management': [],
            'equipment_management': [],
            'reporting': [],
            'mobile_features': [],
            'integrations': []
        }
        
        with open(f"{self.output_dir}/feature_inventory.json", 'w') as f:
            json.dump(features, f, indent=2)
        
        return features
    
    def run_full_collection(self):
        """Execute complete data collection process"""
        print("Starting BRX Performance data collection...")
        
        # Step 1: API Analysis
        print("\n1. Collecting API endpoint data...")
        api_results = self.collect_api_endpoints()
        
        # Step 2: Schema Analysis
        print("\n2. Analyzing data structures...")
        schemas = self.analyze_data_structures(api_results)
        
        # Step 3: Web Interface
        print("\n3. Analyzing web interface...")
        web_analysis = self.scrape_web_interface()
        
        # Step 4: Feature Inventory
        print("\n4. Generating feature inventory...")
        features = self.generate_feature_inventory()
        
        # Step 5: Summary Report
        print("\n5. Creating summary report...")
        summary = {
            'collection_date': datetime.now().isoformat(),
            'endpoints_tested': len(api_results),
            'successful_endpoints': len([r for r in api_results.values() if 'error' not in r]),
            'schemas_extracted': len(schemas),
            'output_directory': self.output_dir
        }
        
        with open(f"{self.output_dir}/collection_summary.json", 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\n✅ Data collection complete! Results saved to: {self.output_dir}")
        return summary

if __name__ == "__main__":
    collector = BRXDataCollector()
    collector.run_full_collection()

