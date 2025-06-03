#!/usr/bin/env python3
"""
Generate UI-to-API Mapping Matrix

This script creates a comprehensive mapping between UI pages/features and their
corresponding API endpoints based on the extraction report and Swagger analysis.

Columns: Page URL, UI Feature, Expected API Endpoint(s), Auth Required (Y/N), CRUD verbs
"""

import json
import csv
import os
from pathlib import Path
from typing import Dict, List, Set, Any
import re


class UIAPIMapper:
    def __init__(self):
        # Try multiple possible base directories
        possible_paths = [
            Path(__file__).parent.parent,
            Path.home() / "github/brx-platform/brx-core/app-replica/brx-app-replica",
            Path.home() / "github/brx-app-replica",
            Path("/Users/joshrowles/github/brx-platform/brx-core/app-replica/brx-app-replica")
        ]
        
        self.base_dir = None
        for path in possible_paths:
            if (path / "data_analysis/swagger_analysis/endpoint_summary.json").exists():
                self.base_dir = path
                break
        
        if not self.base_dir:
            print("Warning: Could not find data files. Using current directory.")
            self.base_dir = Path(__file__).parent.parent
            
        print(f"Using base directory: {self.base_dir}")
        
        self.extraction_data = None
        self.swagger_data = None
        self.endpoint_summary = None
        self.network_requests = None
        self.output_file = "ui_api_mapping_matrix.csv"
        
    def load_data_sources(self):
        """Load all required data sources with fallback handling"""
        # Try to load extraction report (optional)
        extraction_paths = [
            self.base_dir / "frontend_sources/firecrawl/20250529/extraction_report_20250529_141716.json",
            self.base_dir / "extraction_report.json"
        ]
        
        for extraction_path in extraction_paths:
            try:
                with open(extraction_path, 'r') as f:
                    self.extraction_data = json.load(f)
                print(f"✓ Loaded extraction report: {len(self.extraction_data.get('extraction_details', {}).get('public_pages', {}))} pages")
                break
            except FileNotFoundError:
                continue
        
        if not self.extraction_data:
            print("⚠ No extraction report found, will generate basic UI mappings")
            self.extraction_data = {"extraction_details": {"public_pages": {}}}
        
        # Try to load Swagger analysis (optional)
        swagger_paths = [
            self.base_dir / "data_analysis/swagger_analysis/full_analysis.json",
            self.base_dir / "full_analysis.json"
        ]
        
        for swagger_path in swagger_paths:
            try:
                with open(swagger_path, 'r') as f:
                    self.swagger_data = json.load(f)
                print(f"✓ Loaded Swagger analysis: {len(self.swagger_data.get('endpoints', {}))} endpoint paths")
                break
            except FileNotFoundError:
                continue
        
        if not self.swagger_data:
            print("⚠ No full Swagger analysis found, using endpoint summary only")
            self.swagger_data = {"endpoints": {}}
        
        # Load endpoint summary (required)
        endpoint_paths = [
            self.base_dir / "data_analysis/swagger_analysis/endpoint_summary.json",
            self.base_dir / "endpoint_summary.json"
        ]
        
        for endpoint_path in endpoint_paths:
            try:
                with open(endpoint_path, 'r') as f:
                    self.endpoint_summary = json.load(f)
                print(f"✓ Loaded endpoint summary: {len(self.endpoint_summary)} total endpoints")
                break
            except FileNotFoundError:
                continue
        
        if not self.endpoint_summary:
            raise FileNotFoundError("Could not find endpoint_summary.json in any expected location")
        
        # Try to load network requests (optional)
        network_paths = [
            self.base_dir / "frontend_sources/firecrawl/20250529/api_calls/network_requests.json",
            self.base_dir / "network_requests.json"
        ]
        
        for network_path in network_paths:
            try:
                with open(network_path, 'r') as f:
                    self.network_requests = json.load(f)
                print(f"✓ Loaded network requests: {len(self.network_requests)} captured requests")
                break
            except FileNotFoundError:
                continue
        
        if not self.network_requests:
            print("⚠ No network requests found, using Swagger data only")
            self.network_requests = []
    
    def extract_api_calls_from_network(self) -> List[Dict]:
        """Extract API calls from captured network requests"""
        api_calls = []
        for request in self.network_requests:
            url = request.get('url', '')
            if '/api/' in url:
                # Extract API endpoint from URL
                endpoint_match = re.search(r'/api/[^?]*', url)
                if endpoint_match:
                    endpoint = endpoint_match.group(0)
                    api_calls.append({
                        'endpoint': endpoint,
                        'method': request.get('method', 'GET'),
                        'full_url': url,
                        'resource_type': request.get('resource_type', 'xhr')
                    })
        return api_calls
    
    def categorize_endpoints_by_feature(self) -> Dict[str, List[Dict]]:
        """Categorize endpoints by functional area/feature"""
        categories = {
            'Authentication': [],
            'User Management': [],
            'Workout Management': [],
            'Exercise Management': [],
            'Equipment Management': [],
            'Calendar/Scheduling': [],
            'Business Management (FBM)': [],
            'Groups/Team Management': [],
            'Resources/Content': [],
            'Communication': [],
            'Payments/Commerce': [],
            'Tags/Organization': [],
            'Favorites': [],
            'Other': []
        }
        
        for endpoint in self.endpoint_summary:
            path = endpoint.get('path', '')
            method = endpoint.get('method', 'GET')
            tags = endpoint.get('tags', [])
            summary = endpoint.get('summary', '')
            
            # Categorize based on path and tags
            if any(tag in ['Authentication'] for tag in tags) or 'sign_in' in path or 'sign_out' in path or 'password' in path:
                categories['Authentication'].append(endpoint)
            elif any(tag in ['Users'] for tag in tags) or '/users/' in path:
                categories['User Management'].append(endpoint)
            elif any(tag in ['Workouts', 'Workout Exercises', 'Workout Blocks', 'Plan Workouts', 'Workout Plans'] for tag in tags):
                categories['Workout Management'].append(endpoint)
            elif any(tag in ['Exercises'] for tag in tags) or '/exercises' in path:
                categories['Exercise Management'].append(endpoint)
            elif any(tag in ['Equipment'] for tag in tags) or '/equipment' in path:
                categories['Equipment Management'].append(endpoint)
            elif any(tag in ['Calendar'] for tag in tags) or '/calendar' in path:
                categories['Calendar/Scheduling'].append(endpoint)
            elif '/fbm/' in path or any(tag in ['Appointments', 'Locations', 'Services', 'Schedules', 'Visits', 'Waitlist Entries'] for tag in tags):
                categories['Business Management (FBM)'].append(endpoint)
            elif any(tag in ['Groups'] for tag in tags) or '/groups' in path:
                categories['Groups/Team Management'].append(endpoint)
            elif any(tag in ['Resources', 'Group Resources'] for tag in tags) or '/resources' in path:
                categories['Resources/Content'].append(endpoint)
            elif any(tag in ['Conversations'] for tag in tags) or '/conversations' in path:
                categories['Communication'].append(endpoint)
            elif any(tag in ['Purchased Items', 'Coupons'] for tag in tags) or '/carts/' in path or '/coupons/' in path:
                categories['Payments/Commerce'].append(endpoint)
            elif any(tag in ['Tags'] for tag in tags) or '/tags' in path:
                categories['Tags/Organization'].append(endpoint)
            elif any(tag in ['Favorites'] for tag in tags) or '/favorites' in path:
                categories['Favorites'].append(endpoint)
            else:
                categories['Other'].append(endpoint)
        
        return categories
    
    def determine_auth_requirement(self, endpoint_path: str, method: str) -> str:
        """Determine if endpoint requires authentication"""
        # Check if endpoint has security requirements in Swagger data
        endpoint_key = endpoint_path
        if endpoint_key in self.swagger_data.get('endpoints', {}):
            endpoint_methods = self.swagger_data['endpoints'][endpoint_key]
            if method.lower() in endpoint_methods:
                security = endpoint_methods[method.lower()].get('security', [])
                if security and any(security):
                    return 'Y'
        
        # Default rules based on common patterns
        public_endpoints = ['/api/v2/platforms/current']  # Based on network requests
        auth_not_required = [
            'sign_in', 'password'  # These are for getting auth, not requiring it
        ]
        
        if endpoint_path in public_endpoints:
            return 'N'
        
        if any(pattern in endpoint_path for pattern in auth_not_required):
            return 'N'
        
        # Most endpoints require auth by default
        return 'Y'
    
    def extract_crud_verbs(self, endpoints_for_feature: List[Dict]) -> str:
        """Extract CRUD verbs from endpoint methods"""
        methods = set()
        for endpoint in endpoints_for_feature:
            method = endpoint.get('method', 'GET')
            methods.add(method)
        
        # Map HTTP methods to CRUD operations
        crud_mapping = {
            'GET': 'Read',
            'POST': 'Create',
            'PUT': 'Update',
            'PATCH': 'Update',
            'DELETE': 'Delete'
        }
        
        crud_verbs = []
        for method in sorted(methods):
            if method in crud_mapping:
                crud_verbs.append(crud_mapping[method])
        
        return ', '.join(crud_verbs) if crud_verbs else 'Read'
    
    def infer_ui_pages_from_features(self) -> List[Dict]:
        """Infer likely UI pages based on API features and known pages"""
        known_pages = []
        
        # Extract known pages from extraction report
        public_pages = self.extraction_data.get('extraction_details', {}).get('public_pages', {})
        for page_path, page_info in public_pages.items():
            status = page_info.get('status')
            if status == 'success':
                known_pages.append({
                    'url': f"https://online.brxperformance.com{page_path}",
                    'path': page_path,
                    'title': page_info.get('title', 'Unknown'),
                    'status': status
                })
        
        # Infer additional pages based on API endpoints
        categorized_endpoints = self.categorize_endpoints_by_feature()
        inferred_pages = []
        
        # Common page patterns for fitness/workout apps
        page_mappings = {
            'Authentication': ['/login', '/signup', '/forgot-password', '/reset-password'],
            'User Management': ['/profile', '/settings', '/account'],
            'Workout Management': ['/workouts', '/workout/{id}', '/workout-plans', '/workout-plan/{id}'],
            'Exercise Management': ['/exercises', '/exercise/{id}', '/exercise-library'],
            'Equipment Management': ['/equipment', '/gym-equipment'],
            'Calendar/Scheduling': ['/calendar', '/schedule', '/appointments'],
            'Business Management (FBM)': ['/business', '/locations', '/services', '/appointments-management'],
            'Groups/Team Management': ['/groups', '/teams', '/group/{id}'],
            'Resources/Content': ['/resources', '/library', '/content'],
            'Communication': ['/messages', '/conversations', '/chat'],
            'Payments/Commerce': ['/billing', '/subscription', '/payment', '/cart'],
            'Tags/Organization': ['/tags', '/categories'],
            'Favorites': ['/favorites', '/bookmarks']
        }
        
        for feature, endpoints in categorized_endpoints.items():
            if endpoints:  # Only add if there are actual endpoints
                feature_pages = page_mappings.get(feature, [f'/{feature.lower().replace(" ", "-")}'])
                for page_path in feature_pages:
                    inferred_pages.append({
                        'url': f"https://online.brxperformance.com{page_path}",
                        'path': page_path,
                        'title': f'{feature} Page',
                        'status': 'inferred'
                    })
        
        return known_pages + inferred_pages
    
    def generate_mapping_matrix(self) -> List[Dict]:
        """Generate the complete UI-to-API mapping matrix"""
        matrix = []
        
        # Categorize endpoints by feature
        categorized_endpoints = self.categorize_endpoints_by_feature()
        
        # Get UI pages
        ui_pages = self.infer_ui_pages_from_features()
        
        # Get API calls from network requests
        captured_api_calls = self.extract_api_calls_from_network()
        
        # Create mappings
        for feature, endpoints in categorized_endpoints.items():
            if not endpoints:
                continue
                
            # Find relevant UI pages for this feature
            relevant_pages = []
            feature_keywords = feature.lower().split()
            
            for page in ui_pages:
                page_path = page['path'].lower()
                if any(keyword in page_path for keyword in feature_keywords):
                    relevant_pages.append(page)
            
            # If no specific pages found, use a general page for the feature
            if not relevant_pages:
                relevant_pages = [{
                    'url': f"https://online.brxperformance.com/{feature.lower().replace(' ', '-')}",
                    'path': f"/{feature.lower().replace(' ', '-')}",
                    'title': f'{feature} Dashboard',
                    'status': 'inferred'
                }]
            
            # Group endpoints by base path for cleaner presentation
            endpoint_groups = {}
            for endpoint in endpoints:
                path = endpoint['path']
                # Extract base path (remove {id} and specific actions)
                base_path = re.sub(r'\{[^}]+\}', '{id}', path)
                base_path = re.sub(r'/[^/]+$', '', base_path) if base_path.count('/') > 3 else base_path
                
                if base_path not in endpoint_groups:
                    endpoint_groups[base_path] = []
                endpoint_groups[base_path].append(endpoint)
            
            # Create matrix entries
            for page in relevant_pages:
                for base_path, endpoint_group in endpoint_groups.items():
                    # Get all endpoint paths for this group
                    endpoint_paths = [ep['path'] for ep in endpoint_group]
                    
                    # Determine auth requirement (use first endpoint as representative)
                    auth_required = self.determine_auth_requirement(
                        endpoint_group[0]['path'], 
                        endpoint_group[0]['method']
                    )
                    
                    # Get CRUD verbs
                    crud_verbs = self.extract_crud_verbs(endpoint_group)
                    
                    matrix.append({
                        'Page URL': page['url'],
                        'UI Feature': feature,
                        'Expected API Endpoint(s)': '; '.join(endpoint_paths),
                        'Auth Required (Y/N)': auth_required,
                        'CRUD verbs': crud_verbs,
                        'Page Status': page['status'],
                        'Endpoint Count': len(endpoint_group)
                    })
        
        # Add captured API calls that might not be in Swagger
        for api_call in captured_api_calls:
            # Check if this endpoint is already covered
            covered = any(api_call['endpoint'] in row['Expected API Endpoint(s)'] for row in matrix)
            if not covered:
                matrix.append({
                    'Page URL': 'https://online.brxperformance.com/ (captured)',
                    'UI Feature': 'Runtime API Call',
                    'Expected API Endpoint(s)': api_call['endpoint'],
                    'Auth Required (Y/N)': 'Y',  # Assume yes for captured calls
                    'CRUD verbs': 'Read' if api_call['method'] == 'GET' else 'Create/Update',
                    'Page Status': 'network-captured',
                    'Endpoint Count': 1
                })
        
        return matrix
    
    def save_to_csv(self, matrix: List[Dict]):
        """Save the matrix to CSV file"""
        output_path = self.base_dir / self.output_file
        
        if not matrix:
            print("No data to save!")
            return
        
        # Define CSV columns (excluding internal fields)
        csv_columns = [
            'Page URL', 
            'UI Feature', 
            'Expected API Endpoint(s)', 
            'Auth Required (Y/N)', 
            'CRUD verbs'
        ]
        
        with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
            writer.writeheader()
            
            for row in matrix:
                # Only write the main columns to CSV
                csv_row = {col: row.get(col, '') for col in csv_columns}
                writer.writerow(csv_row)
        
        print(f"✓ Saved UI-API mapping matrix to: {output_path}")
        print(f"  Total mappings: {len(matrix)}")
        
        # Print summary statistics
        features = set(row['UI Feature'] for row in matrix)
        auth_required = sum(1 for row in matrix if row['Auth Required (Y/N)'] == 'Y')
        
        print(f"  Unique features: {len(features)}")
        print(f"  Auth required: {auth_required}/{len(matrix)} mappings")
        print(f"  Top features by endpoint count:")
        
        feature_counts = {}
        for row in matrix:
            feature = row['UI Feature']
            feature_counts[feature] = feature_counts.get(feature, 0) + 1
        
        for feature, count in sorted(feature_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"    {feature}: {count} mappings")
    
    def save_detailed_json(self, matrix: List[Dict]):
        """Save detailed analysis to JSON for further processing"""
        detailed_output = {
            'generation_info': {
                'source_files': {
                    'extraction_report': 'frontend_sources/firecrawl/20250529/extraction_report_20250529_141716.json',
                    'swagger_analysis': 'data_analysis/swagger_analysis/full_analysis.json',
                    'endpoint_summary': 'data_analysis/swagger_analysis/endpoint_summary.json',
                    'network_requests': 'frontend_sources/firecrawl/20250529/api_calls/network_requests.json'
                },
                'total_endpoints_analyzed': len(self.endpoint_summary),
                'total_network_requests': len(self.network_requests),
                'total_mappings_generated': len(matrix)
            },
            'mapping_matrix': matrix,
            'categorized_endpoints': self.categorize_endpoints_by_feature(),
            'captured_api_calls': self.extract_api_calls_from_network()
        }
        
        json_output_path = self.base_dir / 'ui_api_mapping_detailed.json'
        with open(json_output_path, 'w', encoding='utf-8') as f:
            json.dump(detailed_output, f, indent=2)
        
        print(f"✓ Saved detailed analysis to: {json_output_path}")
    
    def run(self):
        """Execute the complete mapping generation process"""
        print("🚀 Starting UI-to-API Mapping Matrix Generation\n")
        
        # Load data sources
        print("📁 Loading data sources...")
        self.load_data_sources()
        print()
        
        # Generate mapping matrix
        print("🔗 Generating UI-to-API mappings...")
        matrix = self.generate_mapping_matrix()
        print(f"Generated {len(matrix)} mappings\n")
        
        # Save outputs
        print("💾 Saving outputs...")
        self.save_to_csv(matrix)
        self.save_detailed_json(matrix)
        print()
        
        print("✅ UI-to-API Mapping Matrix generation complete!")
        print(f"📄 CSV output: {self.output_file}")
        print(f"📄 JSON output: ui_api_mapping_detailed.json")


if __name__ == "__main__":
    mapper = UIAPIMapper()
    mapper.run()

