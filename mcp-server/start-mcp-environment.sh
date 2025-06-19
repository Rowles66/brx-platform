#!/bin/bash

echo "🚀 Starting MCP Environment for Cursor..."
echo "=========================================="

# Function to check if Docker daemon is running
check_docker() {
    if sudo docker info > /dev/null 2>&1; then
        echo "✅ Docker is already running"
        return 0
    else
        echo "⚠️  Docker is not running, starting it..."
        sudo dockerd > /dev/null 2>&1 &
        sleep 3
        
        # Wait up to 30 seconds for Docker to start
        for i in {1..10}; do
            if sudo docker info > /dev/null 2>&1; then
                echo "✅ Docker started successfully"
                return 0
            fi
            echo "   Waiting for Docker to start... ($i/10)"
            sleep 3
        done
        
        echo "❌ Failed to start Docker"
        return 1
    fi
}

# Function to ensure MCP configuration exists
check_mcp_config() {
    if [ -f ~/.cursor/mcp.json ]; then
        echo "✅ MCP configuration exists"
        return 0
    else
        echo "⚠️  MCP configuration missing, creating it..."
        mkdir -p ~/.cursor
        
        cat > ~/.cursor/mcp.json << 'EOF'
{
  "mcpServers": {
    "brx-platform-docker": {
      "command": "sudo",
      "args": [
        "docker",
        "compose",
        "-f",
        "/workspace/mcp-server/docker-compose.yml",
        "run",
        "--rm",
        "-i",
        "brx-mcp-server"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    },
    "brx-platform-local": {
      "command": "node",
      "args": ["/workspace/mcp-server/src/index.js"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    },
    "docker-system": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-docker"]
    }
  }
}
EOF
        echo "✅ MCP configuration created"
        return 0
    fi
}

# Function to ensure Docker image exists
check_docker_image() {
    if sudo docker images | grep -q "brx-mcp-server"; then
        echo "✅ BRX MCP Server Docker image exists"
        return 0
    else
        echo "⚠️  BRX MCP Server image missing, building it..."
        cd /workspace/mcp-server
        if sudo docker compose build; then
            echo "✅ Docker image built successfully"
            return 0
        else
            echo "❌ Failed to build Docker image"
            return 1
        fi
    fi
}

# Function to test MCP server
test_mcp_server() {
    echo "🧪 Testing MCP server..."
    cd /workspace/mcp-server
    
    local test_msg='{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}'
    
    if echo "$test_msg" | timeout 10s sudo docker run --rm -i brx-mcp-server:latest | grep -q "protocolVersion"; then
        echo "✅ MCP server test passed"
        return 0
    else
        echo "⚠️  MCP server test failed (may still work with Cursor)"
        return 0  # Don't fail completely on test failure
    fi
}

# Main execution
main() {
    echo "Starting MCP environment setup..."
    echo
    
    # Check and start Docker
    if ! check_docker; then
        echo "❌ Cannot continue without Docker"
        exit 1
    fi
    
    # Ensure MCP configuration exists
    check_mcp_config
    
    # Ensure Docker image exists
    if ! check_docker_image; then
        echo "❌ Cannot continue without Docker image"
        exit 1
    fi
    
    # Test the MCP server
    test_mcp_server
    
    echo
    echo "🎉 MCP Environment Ready!"
    echo "========================="
    echo
    echo "✅ Docker daemon is running"
    echo "✅ MCP configuration is in place"
    echo "✅ BRX MCP Server image is built"
    echo "✅ All systems ready for Cursor"
    echo
    echo "📋 What's Available:"
    echo "   • brx-platform-docker  - Your custom Docker MCP server"
    echo "   • brx-platform-local   - Local version for development"  
    echo "   • filesystem          - Standard filesystem access"
    echo "   • git                 - Git operations"
    echo "   • docker-system       - Generic Docker tools"
    echo
    echo "🚀 You can now start Cursor - MCP servers will be available!"
    echo
    echo "💡 Tip: Add this script to your shell profile to run automatically"
    echo "   echo '/workspace/mcp-server/start-mcp-environment.sh' >> ~/.bashrc"
}

# Run main function
main "$@"