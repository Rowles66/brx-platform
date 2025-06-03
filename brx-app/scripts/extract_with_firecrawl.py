#!/usr/bin/env python3
"""
FireCrawl Data Extraction Script

This script uses FireCrawl to extract content from target websites
and saves the results as structured data for frontend consumption.
"""

import os
import json
import datetime
from pathlib import Path
import requests
import sys

def get_firecrawl_api_key():
    """Get FireCrawl API key from environment variables."""
    api_key = os.getenv('FIRECRAWL_API_KEY')
    if not api_key:
        print("Error: FIRECRAWL_API_KEY environment variable not set")
        sys.exit(1)
    return api_key

def extract_content():
    """Extract content using FireCrawl API."""
    api_key = get_firecrawl_api_key()
    
    # Example extraction targets - customize based on your needs
    targets = [
        {
            "name": "example_site",
            "url": "https://example.com",
            "description": "Example content extraction"
        }
    ]
    
    timestamp = datetime.datetime.now().isoformat()
    results = {
        "timestamp": timestamp,
        "version": "1.0",
        "extractions": []
    }
    
    for target in targets:
        try:
            print(f"Extracting content from {target['name']}: {target['url']}")
            
            # Use requests to call FireCrawl API
            # Note: This is a placeholder - adjust based on actual FireCrawl API endpoints
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "url": target["url"],
                "formats": ["markdown", "html"],
                "onlyMainContent": True
            }
            
            # Placeholder API call - replace with actual FireCrawl endpoint
            response = requests.post(
                "https://api.firecrawl.dev/v1/scrape",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                extraction_result = {
                    "name": target["name"],
                    "url": target["url"],
                    "description": target["description"],
                    "status": "success",
                    "data": response.json(),
                    "extracted_at": timestamp
                }
                results["extractions"].append(extraction_result)
                print(f"✓ Successfully extracted content from {target['name']}")
            else:
                print(f"✗ Failed to extract content from {target['name']}: {response.status_code}")
                extraction_result = {
                    "name": target["name"],
                    "url": target["url"],
                    "description": target["description"],
                    "status": "failed",
                    "error": f"HTTP {response.status_code}: {response.text}",
                    "extracted_at": timestamp
                }
                results["extractions"].append(extraction_result)
                
        except Exception as e:
            print(f"✗ Error extracting content from {target['name']}: {str(e)}")
            extraction_result = {
                "name": target["name"],
                "url": target["url"],
                "description": target["description"],
                "status": "error",
                "error": str(e),
                "extracted_at": timestamp
            }
            results["extractions"].append(extraction_result)
    
    return results

def save_results(results):
    """Save extraction results to file."""
    # Create output directory
    output_dir = Path("frontend_sources/firecrawl")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate filename with timestamp
    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    filename = f"firecrawl_extraction_{date_str}.json"
    output_path = output_dir / filename
    
    # Save results
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"Results saved to: {output_path}")
    return output_path

def main():
    """Main execution function."""
    print("Starting FireCrawl content extraction...")
    
    try:
        # Extract content
        results = extract_content()
        
        # Save results
        output_path = save_results(results)
        
        # Print summary
        total_extractions = len(results["extractions"])
        successful = len([e for e in results["extractions"] if e["status"] == "success"])
        failed = total_extractions - successful
        
        print(f"\nExtraction Summary:")
        print(f"Total targets: {total_extractions}")
        print(f"Successful: {successful}")
        print(f"Failed: {failed}")
        print(f"Results saved to: {output_path}")
        
        if failed > 0:
            print(f"\nWarning: {failed} extractions failed. Check the logs above for details.")
            sys.exit(1)
        
        print("\n✓ FireCrawl extraction completed successfully!")
        
    except Exception as e:
        print(f"\n✗ Fatal error during extraction: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()

