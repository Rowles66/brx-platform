#!/usr/bin/env python3
"""
Swagger Documentation Analyzer
Parses swagger.yaml and extracts comprehensive API information
"""

import yaml
import json
from pathlib import Path

def analyze_swagger():
    """Analyze swagger.yaml and extract all API information"""
    
    # Load swagger.yaml
    with open('swagger.yaml', 'r') as f:
        swagger_data = yaml.safe_load(f)
    
    analysis = {
        'api_info': swagger_data.get('info', {}),
        'base_path': swagger_data.get('basePath', ''),
        'schemes': swagger_data.get('schemes', []),
        'endpoints': {},
        'models': {},
        'security': swagger_data.get('securityDefinitions', {})
    }
    
    # Analyze endpoints
    paths = swagger_data.get('paths', {})
    for path, methods in paths.items():
        analysis['endpoints'][path] = {}
        for method, details in methods.items():
            if isinstance(details, dict):
                analysis['endpoints'][path][method] = {
                    'summary': details.get('summary', ''),
                    'description': details.get('description', ''),
                    'tags': details.get('tags', []),
                    'parameters': details.get('parameters', []),
                    'responses': details.get('responses', {}),
                    'security': details.get('security', [])
                }
    
    # Analyze data models
    definitions = swagger_data.get('definitions', {})
    for model_name, model_def in definitions.items():
        analysis['models'][model_name] = {
            'type': model_def.get('type', ''),
            'properties': model_def.get('properties', {}),
            'required': model_def.get('required', [])
        }
    
    # Generate endpoint summary
    endpoint_summary = []
    for path, methods in analysis['endpoints'].items():
        for method, details in methods.items():
            endpoint_summary.append({
                'path': path,
                'method': method.upper(),
                'summary': details['summary'],
                'tags': details['tags']
            })
    
    # Save analysis results
    output_dir = Path('swagger_analysis')
    output_dir.mkdir(exist_ok=True)
    
    with open(output_dir / 'full_analysis.json', 'w') as f:
        json.dump(analysis, f, indent=2)
    
    with open(output_dir / 'endpoint_summary.json', 'w') as f:
        json.dump(endpoint_summary, f, indent=2)
    
    # Generate human-readable report
    report = generate_readable_report(analysis, endpoint_summary)
    with open(output_dir / 'api_report.md', 'w') as f:
        f.write(report)
    
    print(f"✅ Swagger analysis complete! Results saved to {output_dir}/")
    print(f"📊 Found {len(endpoint_summary)} endpoints across {len(set(ep['tags'][0] if ep['tags'] else 'Untagged' for ep in endpoint_summary))} categories")
    
    return analysis

def generate_readable_report(analysis, endpoint_summary):
    """Generate a human-readable markdown report"""
    
    report = f"""# BRX Performance API Analysis Report

Generated from swagger.yaml on {Path().cwd()}

## API Information
- **Title:** {analysis['api_info'].get('title', 'N/A')}
- **Version:** {analysis['api_info'].get('version', 'N/A')}
- **Base Path:** {analysis['base_path']}
- **Schemes:** {', '.join(analysis['schemes'])}

## Security
{json.dumps(analysis['security'], indent=2)}

## Endpoints Summary

| Method | Path | Summary | Tags |
|--------|------|---------|------|
"""
    
    for ep in endpoint_summary:
        tags = ', '.join(ep['tags']) if ep['tags'] else 'None'
        report += f"| {ep['method']} | `{ep['path']}` | {ep['summary']} | {tags} |\n"
    
    report += "\n## Data Models\n\n"
    
    for model_name, model_def in analysis['models'].items():
        report += f"### {model_name}\n"
        report += f"- **Type:** {model_def['type']}\n"
        if model_def['required']:
            report += f"- **Required fields:** {', '.join(model_def['required'])}\n"
        report += "\n**Properties:**\n"
        for prop_name, prop_def in model_def['properties'].items():
            prop_type = prop_def.get('type', 'unknown')
            report += f"- `{prop_name}`: {prop_type}\n"
        report += "\n"
    
    return report

if __name__ == "__main__":
    analyze_swagger()

