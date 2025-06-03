#!/bin/bash

# Nightly FireCrawl Snapshot Script
# This script runs FireCrawl extraction and pushes results to a date-specific branch

set -euo pipefail  # Exit on error, undefined vars, and pipe failures

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DATE=$(date +%Y-%m-%d)
BRANCH_NAME="frontend_sources/firecrawl/$DATE"
OUTPUT_DIR="$PROJECT_ROOT/frontend_sources/firecrawl"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Error handling
error_exit() {
    log_error "$1"
    exit 1
}

# Cleanup function
cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        log_error "Script failed with exit code $exit_code"
        # Return to main branch if we're on a feature branch
        if git rev-parse --verify "$BRANCH_NAME" >/dev/null 2>&1; then
            log_info "Cleaning up: switching back to main branch"
            git checkout main || git checkout master || true
        fi
    fi
    exit $exit_code
}

trap cleanup EXIT

# Main execution
main() {
    log_info "Starting nightly FireCrawl snapshot for $DATE"
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    # Verify we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error_exit "Not in a git repository"
    fi
    
    # Check if 1Password CLI is available
    if ! command -v op &> /dev/null; then
        error_exit "1Password CLI (op) is not installed or not in PATH"
    fi
    
    # Verify 1Password session
    if ! op account list &> /dev/null; then
        error_exit "1Password CLI is not authenticated. Please run 'op signin'"
    fi
    
    # Check if Python script exists
    if [ ! -f "$SCRIPT_DIR/extract_with_firecrawl.py" ]; then
        error_exit "FireCrawl extraction script not found: $SCRIPT_DIR/extract_with_firecrawl.py"
    fi
    
    # Ensure we have the latest changes
    log_info "Fetching latest changes from remote"
    git fetch origin || log_warn "Failed to fetch from origin, continuing..."
    
    # Create and checkout the branch for today's extraction
    log_info "Creating branch: $BRANCH_NAME"
    
    # Start from the main branch
    MAIN_BRANCH="main"
    if git show-ref --verify --quiet refs/heads/master; then
        MAIN_BRANCH="master"
    fi
    
    git checkout "$MAIN_BRANCH" || error_exit "Failed to checkout $MAIN_BRANCH"
    git pull origin "$MAIN_BRANCH" || log_warn "Failed to pull latest changes from $MAIN_BRANCH"
    
    # Delete existing branch if it exists
    if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
        log_warn "Branch $BRANCH_NAME already exists, deleting it"
        git branch -D "$BRANCH_NAME" || error_exit "Failed to delete existing branch"
    fi
    
    # Create new branch
    git checkout -b "$BRANCH_NAME" || error_exit "Failed to create branch $BRANCH_NAME"
    
    # Run the FireCrawl extraction with 1Password
    log_info "Running FireCrawl extraction with 1Password environment variables"
    
    if ! op run -- python3 "$SCRIPT_DIR/extract_with_firecrawl.py"; then
        error_exit "FireCrawl extraction failed"
    fi
    
    # Check if any files were created/modified
    if [ ! -d "$OUTPUT_DIR" ] || [ -z "$(find "$OUTPUT_DIR" -name "*.json" -newer "$SCRIPT_DIR/extract_with_firecrawl.py" 2>/dev/null)" ]; then
        log_warn "No new extraction files found, nothing to commit"
        return 0
    fi
    
    # Add the extracted files to git
    log_info "Adding extracted files to git"
    git add "$OUTPUT_DIR/" || error_exit "Failed to add files to git"
    
    # Check if there are any changes to commit
    if git diff --cached --quiet; then
        log_warn "No changes to commit"
        return 0
    fi
    
    # Commit the changes
    COMMIT_MSG="feat: nightly FireCrawl snapshot for $DATE

Automated extraction of content using FireCrawl API.
Generated on: $(date -u '+%Y-%m-%d %H:%M:%S UTC')
Branch: $BRANCH_NAME"
    
    log_info "Committing changes"
    git commit -m "$COMMIT_MSG" || error_exit "Failed to commit changes"
    
    # Push the branch to remote
    log_info "Pushing branch to remote: $BRANCH_NAME"
    git push origin "$BRANCH_NAME" || error_exit "Failed to push branch to remote"
    
    # Switch back to main branch
    log_info "Switching back to $MAIN_BRANCH"
    git checkout "$MAIN_BRANCH" || log_warn "Failed to switch back to $MAIN_BRANCH"
    
    # Generate summary
    EXTRACTION_FILE="$(find "$OUTPUT_DIR" -name "firecrawl_extraction_$DATE.json" 2>/dev/null | head -1)"
    if [ -n "$EXTRACTION_FILE" ] && [ -f "$EXTRACTION_FILE" ]; then
        TOTAL_EXTRACTIONS=$(python3 -c "import json; data=json.load(open('$EXTRACTION_FILE')); print(len(data.get('extractions', [])))" 2>/dev/null || echo "unknown")
        SUCCESSFUL_EXTRACTIONS=$(python3 -c "import json; data=json.load(open('$EXTRACTION_FILE')); print(len([e for e in data.get('extractions', []) if e.get('status') == 'success']))" 2>/dev/null || echo "unknown")
        
        log_info "Extraction Summary:"
        log_info "  Total extractions: $TOTAL_EXTRACTIONS"
        log_info "  Successful: $SUCCESSFUL_EXTRACTIONS"
        log_info "  Results file: $EXTRACTION_FILE"
        log_info "  Branch: $BRANCH_NAME"
    fi
    
    log_info "✓ Nightly FireCrawl snapshot completed successfully!"
}

# Script usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Automated nightly FireCrawl content extraction and git operations.

Options:
    -h, --help     Show this help message
    --dry-run      Run extraction but don't commit/push (not implemented)
    --date DATE    Use specific date (YYYY-MM-DD) instead of today

Examples:
    $0                    # Run for today's date
    $0 --date 2024-01-15  # Run for specific date

Requirements:
    - 1Password CLI (op) installed and authenticated
    - Python 3 with required dependencies
    - Git repository with remote configured
    - FIRECRAWL_API_KEY in 1Password

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        --date)
            if [[ -n "${2:-}" ]]; then
                DATE="$2"
                BRANCH_NAME="frontend_sources/firecrawl/$DATE"
                shift 2
            else
                error_exit "--date requires a date argument (YYYY-MM-DD)"
            fi
            ;;
        --dry-run)
            log_warn "Dry run mode not implemented yet"
            shift
            ;;
        *)
            error_exit "Unknown option: $1. Use --help for usage information."
            ;;
    esac
done

# Validate date format if custom date provided
if ! date -d "$DATE" >/dev/null 2>&1; then
    error_exit "Invalid date format: $DATE. Use YYYY-MM-DD format."
fi

# Run main function
main

