#!/bin/bash

echo "Fixing Docker credential helper..."

# Check if Docker Desktop is installed
if [ ! -f "/Applications/Docker.app/Contents/Resources/bin/docker-credential-desktop" ]; then
    echo "Error: Docker Desktop not found. Please ensure Docker Desktop is installed."
    exit 1
fi

# Create symlink for docker-credential-desktop
echo "Creating symlink for docker-credential-desktop..."
ln -sf /Applications/Docker.app/Contents/Resources/bin/docker-credential-desktop /usr/local/bin/docker-credential-desktop

# Verify the fix
if which docker-credential-desktop > /dev/null; then
    echo "✅ Docker credential helper fixed successfully!"
    echo "Testing Docker login..."
    docker login
else
    echo "❌ Failed to fix Docker credential helper"
    echo "Alternative: Updating Docker config to use file store..."
    
    # Backup current config
    cp ~/.docker/config.json ~/.docker/config.json.backup
    
    # Update to use file store instead
    cat > ~/.docker/config.json << 'EOF'
{
  "auths": {},
  "credStore": ""
}
EOF
    
    echo "✅ Updated Docker config to use file-based credentials"
    echo "You may need to login again: docker login"
fi 
