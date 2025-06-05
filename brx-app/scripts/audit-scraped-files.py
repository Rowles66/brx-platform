#!/usr/bin/env python3
"""
BRX Scraped Files Audit Script

This script audits all scraped files from Firecrawl to identify:
- Valid files with good content
- Corrupted/blank files that need deletion
- Missing files that need re-scraping
- Generates cleanup and re-scrape scripts
"""

import os
import json
import sys
from pathlib import Path
from PIL import Image
import numpy as np
from typing import Dict, List, Tuple, Optional
import datetime

class ScrapedFilesAuditor:
    def __init__(self, scraped_dir: str):
        self.scraped_dir = Path(scraped_dir)
        self.auth_assets_dir = self.scraped_dir / "auth_assets_from_auth_extract"
        
        # Define expected directories
        self.html_dir = self.auth_assets_dir / "html"
        self.raw_pages_dir = self.auth_assets_dir / "raw_pages"
        self.screenshots_dir = self.auth_assets_dir / "screenshots"
        self.api_calls_dir = self.auth_assets_dir / "api_calls"
        
        # Results storage
        self.audit_results = {
            "valid_files": [],
            "corrupted_files": [],
            "missing_files": [],
            "blank_screenshots": [],
            "error_pages": [],
            "summary": {}
        }
        
        # Expected page names (we'll discover these from existing files)
        self.expected_pages = set()
        
    def discover_expected_pages(self):
        """Discover page names from existing files"""
        print("🔍 Discovering expected pages from existing files...")
        
        # Get page names from HTML files
        if self.html_dir.exists():
            for html_file in self.html_dir.glob("*.html"):
                page_name = html_file.stem
                self.expected_pages.add(page_name)
                
        # Get page names from screenshots
        if self.screenshots_dir.exists():
            for screenshot in self.screenshots_dir.glob("*.png"):
                # Skip numbered screenshots like 01_initial_page.png
                if not screenshot.stem.startswith(("01_", "02_", "03_")):
                    page_name = screenshot.stem
                    self.expected_pages.add(page_name)
        
        print(f"📋 Found {len(self.expected_pages)} expected pages: {sorted(self.expected_pages)}")
        
    def check_screenshot_validity(self, screenshot_path: Path) -> Tuple[bool, str, Dict]:
        """Check if a screenshot is valid (not blank/white)"""
        try:
            if not screenshot_path.exists():
                return False, "File does not exist", {}
                
            # Check file size (very small files are likely blank)
            file_size = screenshot_path.stat().st_size
            if file_size < 5000:  # Less than 5KB is suspicious
                return False, f"File too small ({file_size} bytes)", {"file_size": file_size}
            
            # Load and analyze image
            with Image.open(screenshot_path) as img:
                # Convert to RGB if needed
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Convert to numpy array
                img_array = np.array(img)
                
                # Check dimensions
                height, width = img_array.shape[:2]
                if height < 100 or width < 100:
                    return False, f"Image too small ({width}x{height})", {"width": width, "height": height}
                
                # Calculate average color
                avg_color = np.mean(img_array, axis=(0, 1))
                
                # Check if mostly white (all RGB values > 240)
                is_mostly_white = all(c > 240 for c in avg_color)
                
                # Calculate color variance (low variance = likely blank)
                color_variance = np.var(img_array)
                
                # Check for content indicators
                has_content = color_variance > 100  # Arbitrary threshold for content
                
                metadata = {
                    "file_size": file_size,
                    "width": width,
                    "height": height,
                    "avg_color": avg_color.tolist(),
                    "color_variance": float(color_variance),
                    "is_mostly_white": is_mostly_white
                }
                
                if is_mostly_white and not has_content:
                    return False, "Image is mostly white/blank", metadata
                elif not has_content:
                    return False, f"Low color variance ({color_variance:.2f}), likely blank", metadata
                else:
                    return True, "Valid screenshot with content", metadata
                    
        except Exception as e:
            return False, f"Error reading image: {str(e)}", {}
    
    def check_html_validity(self, html_path: Path) -> Tuple[bool, str, Dict]:
        """Check if HTML file contains valid content"""
        try:
            if not html_path.exists():
                return False, "File does not exist", {}
                
            file_size = html_path.stat().st_size
            if file_size < 1000:  # Less than 1KB is suspicious for HTML
                return False, f"File too small ({file_size} bytes)", {"file_size": file_size}
            
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for error indicators
            error_indicators = [
                "Module parse failed",
                "Unexpected character '@'",
                "500 Internal Server Error",
                "404 Not Found",
                "403 Forbidden",
                "Login Required",
                "Access Denied"
            ]
            
            # Check for content indicators
            content_indicators = [
                "MuiBox-root",  # Material-UI components
                "class=",       # HTML classes
                "<nav",         # Navigation
                "<main",        # Main content
                "<div",         # Div elements
                "<script",      # JavaScript
            ]
            
            has_errors = any(indicator in content for indicator in error_indicators)
            has_content = sum(1 for indicator in content_indicators if indicator in content) >= 3
            
            metadata = {
                "file_size": file_size,
                "content_length": len(content),
                "has_errors": has_errors,
                "has_content": has_content,
                "error_found": [err for err in error_indicators if err in content],
                "content_found": [ind for ind in content_indicators if ind in content]
            }
            
            if has_errors:
                return False, f"Contains error indicators: {metadata['error_found']}", metadata
            elif not has_content:
                return False, "Insufficient content indicators", metadata
            else:
                return True, "Valid HTML with content", metadata
                
        except Exception as e:
            return False, f"Error reading HTML: {str(e)}", {}
    
    def audit_page(self, page_name: str) -> Dict:
        """Audit all files for a specific page"""
        page_result = {
            "page_name": page_name,
            "files": {},
            "overall_status": "unknown",
            "issues": [],
            "valid_files_count": 0,
            "total_expected_files": 4  # html, raw_html, screenshot, (api is shared)
        }
        
        # Check HTML file
        html_file = self.html_dir / f"{page_name}.html"
        is_valid, reason, metadata = self.check_html_validity(html_file)
        page_result["files"]["html"] = {
            "path": str(html_file),
            "exists": html_file.exists(),
            "valid": is_valid,
            "reason": reason,
            "metadata": metadata
        }
        if is_valid:
            page_result["valid_files_count"] += 1
        elif html_file.exists():
            page_result["issues"].append(f"HTML: {reason}")
        
        # Check raw HTML file
        raw_html_file = self.raw_pages_dir / f"{page_name}_raw.html"
        is_valid, reason, metadata = self.check_html_validity(raw_html_file)
        page_result["files"]["raw_html"] = {
            "path": str(raw_html_file),
            "exists": raw_html_file.exists(),
            "valid": is_valid,
            "reason": reason,
            "metadata": metadata
        }
        if is_valid:
            page_result["valid_files_count"] += 1
        elif raw_html_file.exists():
            page_result["issues"].append(f"Raw HTML: {reason}")
        
        # Check screenshot
        screenshot_file = self.screenshots_dir / f"{page_name}.png"
        is_valid, reason, metadata = self.check_screenshot_validity(screenshot_file)
        page_result["files"]["screenshot"] = {
            "path": str(screenshot_file),
            "exists": screenshot_file.exists(),
            "valid": is_valid,
            "reason": reason,
            "metadata": metadata
        }
        if is_valid:
            page_result["valid_files_count"] += 1
        elif screenshot_file.exists():
            page_result["issues"].append(f"Screenshot: {reason}")
        
        # Determine overall status
        if page_result["valid_files_count"] >= 3:  # At least 3 out of 4 files valid
            page_result["overall_status"] = "good"
        elif page_result["valid_files_count"] >= 1:
            page_result["overall_status"] = "partial"
        else:
            page_result["overall_status"] = "bad"
        
        return page_result
    
    def run_audit(self) -> Dict:
        """Run complete audit of all scraped files"""
        print("🔎 Starting BRX Scraped Files Audit...")
        print(f"📁 Auditing directory: {self.scraped_dir}")
        
        # Discover expected pages
        self.discover_expected_pages()
        
        if not self.expected_pages:
            print("❌ No pages found to audit!")
            return self.audit_results
        
        # Audit each page
        print(f"\n🔍 Auditing {len(self.expected_pages)} pages...")
        page_results = []
        
        for page_name in sorted(self.expected_pages):
            print(f"  📄 Auditing {page_name}...")
            page_result = self.audit_page(page_name)
            page_results.append(page_result)
            
            # Categorize results
            if page_result["overall_status"] == "good":
                self.audit_results["valid_files"].append(page_result)
            elif page_result["overall_status"] == "partial":
                self.audit_results["corrupted_files"].append(page_result)
            else:
                self.audit_results["corrupted_files"].append(page_result)
            
            # Check for blank screenshots specifically
            screenshot_info = page_result["files"]["screenshot"]
            if (screenshot_info["exists"] and not screenshot_info["valid"] and 
                "blank" in screenshot_info["reason"].lower()):
                self.audit_results["blank_screenshots"].append(page_result)
            
            # Check for error pages
            html_info = page_result["files"]["html"]
            if (html_info["exists"] and not html_info["valid"] and 
                "error" in html_info["reason"].lower()):
                self.audit_results["error_pages"].append(page_result)
        
        # Generate summary
        self.audit_results["summary"] = {
            "total_pages": len(self.expected_pages),
            "good_pages": len(self.audit_results["valid_files"]),
            "corrupted_pages": len(self.audit_results["corrupted_files"]),
            "blank_screenshots": len(self.audit_results["blank_screenshots"]),
            "error_pages": len(self.audit_results["error_pages"]),
            "audit_timestamp": datetime.datetime.now().isoformat()
        }
        
        # Store detailed results
        self.audit_results["detailed_results"] = page_results
        
        return self.audit_results
    
    def generate_report(self, output_file: str = "audit-results/scraped-files-audit-report.json"):
        """Generate detailed audit report"""
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            json.dump(self.audit_results, f, indent=2)
        
        print(f"\n📊 Detailed audit report saved to: {output_path}")
        
    def generate_cleanup_script(self, output_file: str = "scripts/cleanup-corrupted-files.sh"):
        """Generate shell script to clean up corrupted files"""
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        script_content = [
            "#!/bin/bash",
            "# Auto-generated cleanup script for corrupted scraped files",
            f"# Generated on: {datetime.datetime.now().isoformat()}",
            "",
            "echo '🧹 Starting cleanup of corrupted scraped files...'",
            "echo ''",
            ""
        ]
        
        files_to_delete = []
        
        # Add files from corrupted pages
        for page_result in self.audit_results["corrupted_files"]:
            page_name = page_result["page_name"]
            for file_type, file_info in page_result["files"].items():
                if file_info["exists"] and not file_info["valid"]:
                    files_to_delete.append((file_info["path"], page_name, file_type, file_info["reason"]))
        
        if files_to_delete:
            script_content.extend([
                "# Delete corrupted files",
                "echo '🗑️  Deleting corrupted files...'",
                ""
            ])
            
            for file_path, page_name, file_type, reason in files_to_delete:
                script_content.extend([
                    f"# {page_name} - {file_type}: {reason}",
                    f"if [ -f '{file_path}' ]; then",
                    f"    echo '  Deleting {file_type} for {page_name}: {reason}'",
                    f"    rm '{file_path}'",
                    f"    echo '    ✅ Deleted {file_path}'",
                    "else",
                    f"    echo '    ⚠️  File not found: {file_path}'",
                    "fi",
                    ""
                ])
        
        # Add pages that need re-scraping
        pages_needing_rescrape = []
        for page_result in self.audit_results["corrupted_files"]:
            if page_result["valid_files_count"] < 2:  # Less than 2 valid files
                pages_needing_rescrape.append(page_result["page_name"])
        
        if pages_needing_rescrape:
            script_content.extend([
                "echo ''",
                "echo '📋 Pages that need re-scraping:'",
            ])
            
            for page_name in pages_needing_rescrape:
                script_content.append(f"echo '  - {page_name}'")
            
            script_content.extend([
                "echo ''",
                "echo '💡 To re-scrape these pages, run your Firecrawl script with these page URLs'",
                "echo ''"
            ])
        
        script_content.extend([
            "echo '✅ Cleanup complete!'",
            "echo '📊 Run the audit script again to verify cleanup:'",
            "echo '    python3 scripts/audit-scraped-files.py'",
            "echo ''"
        ])
        
        with open(output_path, 'w') as f:
            f.write('\n'.join(script_content))
        
        # Make script executable
        os.chmod(output_path, 0o755)
        
        print(f"🧹 Cleanup script generated: {output_path}")
        print(f"   Run with: bash {output_path}")
    
    def print_summary(self):
        """Print audit summary to console"""
        summary = self.audit_results["summary"]
        
        print("\n" + "="*60)
        print("📊 BRX SCRAPED FILES AUDIT SUMMARY")
        print("="*60)
        print(f"📁 Total Pages: {summary['total_pages']}")
        print(f"✅ Good Pages: {summary['good_pages']}")
        print(f"⚠️  Corrupted Pages: {summary['corrupted_pages']}")
        print(f"🖼️  Blank Screenshots: {summary['blank_screenshots']}")
        print(f"❌ Error Pages: {summary['error_pages']}")
        print("="*60)
        
        if self.audit_results["valid_files"]:
            print("\n✅ GOOD PAGES (3+ valid files):")
            for page_result in self.audit_results["valid_files"]:
                print(f"  ✓ {page_result['page_name']} ({page_result['valid_files_count']}/3 files valid)")
        
        if self.audit_results["corrupted_files"]:
            print("\n⚠️  PAGES WITH ISSUES:")
            for page_result in self.audit_results["corrupted_files"]:
                print(f"  ⚠️  {page_result['page_name']} ({page_result['valid_files_count']}/3 files valid)")
                for issue in page_result["issues"]:
                    print(f"     - {issue}")
        
        if self.audit_results["blank_screenshots"]:
            print("\n🖼️  BLANK SCREENSHOTS FOUND:")
            for page_result in self.audit_results["blank_screenshots"]:
                reason = page_result["files"]["screenshot"]["reason"]
                print(f"  🖼️  {page_result['page_name']}: {reason}")

def main():
    if len(sys.argv) > 1:
        scraped_dir = sys.argv[1]
    else:
        scraped_dir = "scraped_reference"
    
    if not Path(scraped_dir).exists():
        print(f"❌ Directory not found: {scraped_dir}")
        print("Usage: python3 audit-scraped-files.py [scraped_directory]")
        sys.exit(1)
    
    # Run audit
    auditor = ScrapedFilesAuditor(scraped_dir)
    results = auditor.run_audit()
    
    # Generate outputs
    auditor.print_summary()
    auditor.generate_report()
    auditor.generate_cleanup_script()
    
    print("\n🎉 Audit complete! Check the generated files for detailed results.")

if __name__ == "__main__":
    main()

