# Making MCP Settings Persistent for Cursor

## The Challenge
Your MCP configuration needs several components to work every time you start Cursor:
1. **Docker daemon** must be running
2. **MCP configuration file** must exist (`~/.cursor/mcp.json`)
3. **Docker images** must be available
4. **Environment setup** must be initialized

## 🚀 Solution Options

### Option 1: Manual Startup (Recommended for Testing)
Run this command before starting Cursor:
```bash
/workspace/mcp-server/start-mcp-environment.sh
```

### Option 2: Auto-Start with Shell Profile (Most Common)
Add to your shell startup file so it runs every time you open a terminal:

**For Bash:**
```bash
echo '/workspace/mcp-server/start-mcp-environment.sh' >> ~/.bashrc
```

**For Zsh:**
```bash
echo '/workspace/mcp-server/start-mcp-environment.sh' >> ~/.zshrc
```

### Option 3: Systemd Service (Linux/Server Environments)
Create a system service that starts Docker and maintains MCP environment:

```bash
# Create service file
sudo tee /etc/systemd/system/cursor-mcp.service << 'EOF'
[Unit]
Description=Cursor MCP Environment
After=network.target

[Service]
Type=forking
User=ubuntu
WorkingDirectory=/workspace/mcp-server
ExecStart=/workspace/mcp-server/start-mcp-environment.sh
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl enable cursor-mcp.service
sudo systemctl start cursor-mcp.service
```

### Option 4: Desktop Shortcut (GUI Environments)
Create a desktop shortcut that starts the environment and then Cursor:

```bash
# Create cursor-with-mcp.sh
cat > ~/cursor-with-mcp.sh << 'EOF'
#!/bin/bash
# Start MCP environment
/workspace/mcp-server/start-mcp-environment.sh

# Wait a moment for everything to initialize
sleep 2

# Start Cursor
cursor
EOF

chmod +x ~/cursor-with-mcp.sh
```

## 🔧 What Gets Persisted Automatically

### ✅ Already Persistent:
- **MCP Configuration**: `~/.cursor/mcp.json` (saved in your home directory)
- **Docker Images**: Once built, they persist until manually removed
- **Source Code**: All your MCP server code in `/workspace/mcp-server/`

### ⚠️ Needs Manual Start:
- **Docker Daemon**: Must be running (not persistent in this environment)
- **Environment Variables**: Any session-specific variables

## 🎯 Recommended Approach

**For Development/Testing:**
1. Use the manual startup approach
2. Run `/workspace/mcp-server/start-mcp-environment.sh` before starting Cursor

**For Production/Daily Use:**
1. Add to your shell profile (Option 2)
2. This ensures the MCP environment is ready every time you open a terminal

## 📋 Quick Setup Commands

### One-Time Setup (Run Once):
```bash
# Make the startup script available globally
sudo ln -sf /workspace/mcp-server/start-mcp-environment.sh /usr/local/bin/start-cursor-mcp

# Add to your shell profile
echo 'start-cursor-mcp' >> ~/.bashrc

# Reload your shell
source ~/.bashrc
```

### Verification Commands:
```bash
# Check if MCP environment is ready
/workspace/mcp-server/verify-setup.sh

# Test Docker is running
sudo docker ps

# Check MCP config exists
ls -la ~/.cursor/mcp.json
```

## 🔄 Auto-Recovery Features

The `start-mcp-environment.sh` script includes auto-recovery:
- **Auto-starts Docker** if it's not running
- **Recreates MCP config** if it's missing
- **Rebuilds Docker image** if it's missing
- **Tests everything** before reporting success

## 🛠️ Troubleshooting Persistence Issues

### Issue: "Docker not running" after restart
**Solution:** Add Docker auto-start to your shell profile:
```bash
echo 'sudo dockerd > /dev/null 2>&1 &' >> ~/.bashrc
```

### Issue: "MCP servers not found in Cursor"
**Solutions:**
1. Restart Cursor completely
2. Run: `/workspace/mcp-server/start-mcp-environment.sh`
3. Check: `cat ~/.cursor/mcp.json`

### Issue: "Permission denied"
**Solution:** Ensure scripts are executable:
```bash
chmod +x /workspace/mcp-server/*.sh
```

## 📱 Usage Workflow

### Daily Development Workflow:
1. **Open Terminal** (MCP environment auto-starts if added to profile)
2. **Start Cursor** 
3. **MCP tools are ready** - no additional setup needed!

### Alternative Workflow:
1. **Run:** `/workspace/mcp-server/start-mcp-environment.sh`
2. **Start Cursor**
3. **Use MCP tools**

## 🎉 Success Indicators

You'll know it's working persistently when:
- ✅ Cursor shows MCP servers in Command Palette
- ✅ AI chat can access your custom tools
- ✅ No manual setup needed between sessions
- ✅ Docker containers start without errors

Choose the option that best fits your workflow!