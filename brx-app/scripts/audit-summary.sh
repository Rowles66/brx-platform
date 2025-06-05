#!/bin/bash

# BRX Scraped Files Audit Summary Script
# Quick overview of file audit status

echo "🔎 BRX Scraped Files Audit Summary"
echo "================================="
echo ""

# Run the audit
python3 scripts/audit-scraped-files.py

echo ""
echo "📁 Generated Files:"
echo "  📊 Detailed Report: audit-results/scraped-files-audit-report.json"
echo "  🧹 Cleanup Script: scripts/cleanup-corrupted-files.sh"
echo ""
echo "🚀 Next Steps:"
echo "  1. Review the audit results above"
echo "  2. Run cleanup script to remove corrupted files: bash scripts/cleanup-corrupted-files.sh"
echo "  3. Re-scrape the pages listed above using your Firecrawl script"
echo "  4. Run this audit again to verify: bash scripts/audit-summary.sh"
echo ""
echo "💡 Good pages (dashboard, exercises) are ready to use for component development!"
echo ""

