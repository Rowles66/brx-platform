#!/bin/bash

# Script to move repositories from ~/projects back to ~/github
# This script will move the main repositories while preserving git history

set -e  # Exit on any error

GITHUB_DIR="$HOME/github"
PROJECTS_DIR="$HOME/projects"

# Create github directory if it doesn't exist
mkdir -p "$GITHUB_DIR"

echo "Moving repositories from ~/projects to ~/github..."
echo "=============================================="

# Main repositories to move (excluding build artifacts and dependencies)
REPOS_TO_MOVE=(
    "brx-platform"
    "mcp-server"
    "warp-config"
    "ai-tools/aiforwork-prompts"
    "ai-tools/cursor-ai-setup"
    "ai-tools/self-operating-computer"
    "CopilotForXcode"
    "sports-analytics/pitching-suite/analysis"
    "sports-analytics/pitching-suite/movement-ai"
    "sports-analytics/pitch-perfect-ai"
    "sports-analytics/openbiomechanics"
    "raycast-workspace/git-manager"
    "raycast-workspace/extensions"
)

# Function to move a repository
move_repo() {
    local src_path="$1"
    local dest_path="$2"
    
    if [ ! -d "$src_path" ]; then
        echo "❌ Source directory does not exist: $src_path"
        return 1
    fi
    
    # Create destination directory structure
    mkdir -p "$(dirname "$dest_path")"
    
    if [ -d "$dest_path" ]; then
        echo "⚠️  Destination already exists: $dest_path"
        echo "   Skipping to avoid conflicts..."
        return 0
    fi
    
    echo "📦 Moving: $src_path"
    echo "    → $dest_path"
    
    # Move the repository
    mv "$src_path" "$dest_path"
    
    echo "✅ Successfully moved: $(basename "$dest_path")"
    echo ""
}

# Move each repository
for repo in "${REPOS_TO_MOVE[@]}"; do
    src_path="$PROJECTS_DIR/$repo"
    dest_path="$GITHUB_DIR/$repo"
    
    move_repo "$src_path" "$dest_path"
done

echo "=============================================="
echo "Migration Summary:"
echo "✅ Moved repositories from ~/projects to ~/github"
echo ""
echo "Note: Build artifacts and package dependencies were left in place"
echo "      as they are typically regenerated during builds."
echo ""
echo "Next steps:"
echo "1. Verify repositories are working in their new locations"
echo "2. Update any scripts or configurations that reference the old paths"
echo "3. Clean up empty directories in ~/projects if desired"

