#!/bin/bash

# AI Agent Setup Script for Maximum Cursor Autonomy
# Designed by 20+ year development guru for workflow optimization
# Version: 2.0

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_ROOT/logs/ai-agent-setup.log"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Logging
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

success() {
    log "SUCCESS" "${GREEN}$1${NC}"
}

info() {
    log "INFO" "${BLUE}$1${NC}"
}

warning() {
    log "WARNING" "${YELLOW}$1${NC}"
}

error() {
    log "ERROR" "${RED}$1${NC}"
}

# Create log directory
mkdir -p "$(dirname "$LOG_FILE")"

# Function to setup Cursor AI permissions
setup_cursor_permissions() {
    info "🤖 Setting up Cursor AI permissions for maximum autonomy..."
    
    # Create VSCode settings for Cursor integration
    local vscode_dir="$PROJECT_ROOT/.vscode"
    mkdir -p "$vscode_dir"
    
    cat > "$vscode_dir/settings.json" << 'EOF'
{
  "cursor.ai.autonomousMode": "aggressive",
  "cursor.ai.codeGeneration": {
    "enabled": true,
    "autoComplete": true,
    "suggestions": true,
    "1passwordIntegration": true
  },
  "cursor.ai.secretManagement": {
    "provider": "1password",
    "autoInject": true,
    "validateBeforeCommit": true
  },
  "cursor.ai.workflows": {
    "developmentStart": {
      "enabled": true,
      "command": "./scripts/op-workflow.sh start"
    },
    "credentialValidation": {
      "enabled": true,
      "command": "./scripts/op-workflow.sh validate"
    },
    "environmentInjection": {
      "enabled": true,
      "command": "./scripts/op-workflow.sh inject development"
    }
  },
  "terminal.integrated.env.osx": {
    "PATH": "/opt/homebrew/bin:${env:PATH}"
  },
  "terminal.integrated.profiles.osx": {
    "bash-with-1password": {
      "path": "/bin/bash",
      "args": ["-c", "source ~/.bashrc && exec bash"],
      "env": {
        "OP_CLI_AVAILABLE": "true"
      }
    }
  },
  "terminal.integrated.defaultProfile.osx": "bash-with-1password",
  "files.associations": {
    "*.cursorrules": "yaml",
    ".op-config.yaml": "yaml",
    ".ai-agent-config.json": "jsonc"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/logs": true,
    "**/.env*": true,
    "**/dist": true,
    "**/.next": true
  }
}
EOF
    
    success "✅ Cursor AI settings configured"
}

# Function to setup shell integration
setup_shell_integration() {
    info "🐚 Setting up shell integration for AI agent..."
    
    # Create bash profile additions
    local bash_profile="$HOME/.bash_profile"
    local bashrc="$HOME/.bashrc"
    
    # Backup existing files
    [[ -f "$bash_profile" ]] && cp "$bash_profile" "$bash_profile.backup"
    [[ -f "$bashrc" ]] && cp "$bashrc" "$bashrc.backup"
    
    # Add 1Password and AI agent aliases
    cat >> "$bashrc" << 'EOF'

# BRX Platform AI Agent Integration
export BRX_PLATFORM_ROOT="/Users/joshrowles/github/brx-platform"
export OP_CLI_AVAILABLE=true

# 1Password CLI shortcuts for AI agents
alias op-init="$BRX_PLATFORM_ROOT/scripts/op-workflow.sh init"
alias op-start="$BRX_PLATFORM_ROOT/scripts/op-workflow.sh start"
alias op-inject="$BRX_PLATFORM_ROOT/scripts/op-workflow.sh inject"
alias op-validate="$BRX_PLATFORM_ROOT/scripts/op-workflow.sh validate"
alias op-status="$BRX_PLATFORM_ROOT/scripts/op-workflow.sh status"
alias op-run="$BRX_PLATFORM_ROOT/scripts/op-workflow.sh run"

# Development shortcuts
alias brx-dev="cd $BRX_PLATFORM_ROOT/brx-app && op-start"
alias brx-test="cd $BRX_PLATFORM_ROOT/brx-app && op-run npm run test:e2e"
alias brx-build="cd $BRX_PLATFORM_ROOT/brx-app && op-run npm run build"

# AI Agent functions
brx-ai-context() {
    echo "🤖 BRX Platform AI Agent Context:"
    echo "📁 Project Root: $BRX_PLATFORM_ROOT"
    echo "🔐 1Password Status: $(op account list &>/dev/null && echo '✅ Active' || echo '❌ Inactive')"
    echo "📊 Environment: $(cd $BRX_PLATFORM_ROOT/brx-app && cat .env.local 2>/dev/null | grep NODE_ENV || echo 'Not set')"
    echo "🚀 Services:"
    echo "   - Next.js: $(cd $BRX_PLATFORM_ROOT/brx-app && npm list next --depth=0 2>/dev/null | grep next || echo 'Not installed')"
    echo "   - Prisma: $(cd $BRX_PLATFORM_ROOT/brx-app && npm list prisma --depth=0 2>/dev/null | grep prisma || echo 'Not installed')"
    echo "   - Playwright: $(cd $BRX_PLATFORM_ROOT/brx-app && npm list @playwright/test --depth=0 2>/dev/null | grep playwright || echo 'Not installed')"
}

# Auto-completion for op-workflow commands
_op_workflow_completions() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local commands="init setup start dev inject validate run rotate status cleanup help"
    COMPREPLY=($(compgen -W "$commands" -- "$cur"))
}
complete -F _op_workflow_completions op-workflow.sh

EOF
    
    success "✅ Shell integration configured"
}

# Function to setup VS Code extensions recommendations
setup_vscode_extensions() {
    info "🔧 Setting up VS Code extensions for maximum productivity..."
    
    local vscode_dir="$PROJECT_ROOT/.vscode"
    mkdir -p "$vscode_dir"
    
    cat > "$vscode_dir/extensions.json" << 'EOF'
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-secrets",
    "1password.op-vscode",
    "github.copilot",
    "github.copilot-chat",
    "ms-vscode.remote-ssh",
    "ms-vscode.remote-containers",
    "ms-vscode.remote-wsl",
    "ms-vscode.hexeditor",
    "ms-vscode.vscode-serial-monitor",
    "ms-vscode.makefile-tools",
    "ms-vscode.cmake-tools",
    "ms-vscode.cpptools",
    "ms-python.python",
    "ms-python.debugpy",
    "ms-toolsai.jupyter"
  ],
  "unwantedRecommendations": [
    "ms-vscode.vscode-typescript",
    "hookyqr.beautify"
  ]
}
EOF
    
    success "✅ VS Code extensions configured"
}

# Function to setup monitoring and alerts
setup_monitoring() {
    info "📊 Setting up monitoring and alerts..."
    
    # Create monitoring script
    cat > "$PROJECT_ROOT/scripts/monitor-ai-agent.sh" << 'EOF'
#!/bin/bash

# AI Agent Monitoring Script
LOG_FILE="/Users/joshrowles/github/brx-platform/logs/ai-agent-monitor.log"
HEALTH_CHECK_INTERVAL=300  # 5 minutes

monitor_1password_session() {
    if ! op account list &>/dev/null; then
        echo "$(date): ⚠️ 1Password session inactive" >> "$LOG_FILE"
        return 1
    fi
    echo "$(date): ✅ 1Password session active" >> "$LOG_FILE"
    return 0
}

monitor_development_server() {
    if curl -s http://localhost:3000/api/health &>/dev/null; then
        echo "$(date): ✅ Development server healthy" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): ⚠️ Development server unreachable" >> "$LOG_FILE"
        return 1
    fi
}

# Main monitoring loop
while true; do
    monitor_1password_session
    monitor_development_server
    sleep $HEALTH_CHECK_INTERVAL
done
EOF
    
    chmod +x "$PROJECT_ROOT/scripts/monitor-ai-agent.sh"
    
    success "✅ Monitoring script created"
}

# Function to create AI agent shortcuts
create_ai_shortcuts() {
    info "⚡ Creating AI agent shortcuts..."
    
    # Create desktop shortcuts (macOS)
    local shortcuts_dir="$HOME/Desktop/BRX-AI-Shortcuts"
    mkdir -p "$shortcuts_dir"
    
    # Start Development shortcut
    cat > "$shortcuts_dir/Start BRX Development.command" << 'EOF'
#!/bin/bash
cd /Users/joshrowles/github/brx-platform
./scripts/op-workflow.sh start
EOF
    
    # Validate Credentials shortcut
    cat > "$shortcuts_dir/Validate Credentials.command" << 'EOF'
#!/bin/bash
cd /Users/joshrowles/github/brx-platform
./scripts/op-workflow.sh validate
EOF
    
    # Check Status shortcut
    cat > "$shortcuts_dir/Check Status.command" << 'EOF'
#!/bin/bash
cd /Users/joshrowles/github/brx-platform
./scripts/op-workflow.sh status
EOF
    
    # Make shortcuts executable
    chmod +x "$shortcuts_dir"/*.command
    
    success "✅ AI agent shortcuts created in $shortcuts_dir"
}

# Function to setup auto-startup services
setup_auto_startup() {
    info "🚀 Setting up auto-startup services..."
    
    # Create LaunchAgent for monitoring (macOS)
    local launch_agents_dir="$HOME/Library/LaunchAgents"
    mkdir -p "$launch_agents_dir"
    
    cat > "$launch_agents_dir/com.brx.ai-agent-monitor.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.brx.ai-agent-monitor</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/joshrowles/github/brx-platform/scripts/monitor-ai-agent.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/joshrowles/github/brx-platform/logs/monitor.out</string>
    <key>StandardErrorPath</key>
    <string>/Users/joshrowles/github/brx-platform/logs/monitor.err</string>
</dict>
</plist>
EOF
    
    # Load the launch agent
    launchctl load "$launch_agents_dir/com.brx.ai-agent-monitor.plist" 2>/dev/null || true
    
    success "✅ Auto-startup services configured"
}

# Function to validate setup
validate_setup() {
    info "✅ Validating AI agent setup..."
    
    local validation_count=0
    local total_validations=8
    
    # Check 1Password CLI
    if command -v op &>/dev/null; then
        ((validation_count++))
        success "✅ 1Password CLI available"
    else
        warning "⚠️ 1Password CLI not found"
    fi
    
    # Check op-workflow script
    if [[ -x "$PROJECT_ROOT/scripts/op-workflow.sh" ]]; then
        ((validation_count++))
        success "✅ op-workflow.sh is executable"
    else
        warning "⚠️ op-workflow.sh not executable"
    fi
    
    # Check configuration files
    if [[ -f "$PROJECT_ROOT/.op-config.yaml" ]]; then
        ((validation_count++))
        success "✅ 1Password configuration present"
    else
        warning "⚠️ 1Password configuration missing"
    fi
    
    if [[ -f "$PROJECT_ROOT/.ai-agent-config.json" ]]; then
        ((validation_count++))
        success "✅ AI agent configuration present"
    else
        warning "⚠️ AI agent configuration missing"
    fi
    
    if [[ -f "$PROJECT_ROOT/.cursorrules" ]]; then
        ((validation_count++))
        success "✅ Cursor rules configured"
    else
        warning "⚠️ Cursor rules missing"
    fi
    
    # Check VS Code settings
    if [[ -f "$PROJECT_ROOT/.vscode/settings.json" ]]; then
        ((validation_count++))
        success "✅ VS Code settings configured"
    else
        warning "⚠️ VS Code settings missing"
    fi
    
    # Check package.json modifications
    if grep -q "op run" "$PROJECT_ROOT/brx-app/package.json"; then
        ((validation_count++))
        success "✅ Package.json has 1Password integration"
    else
        warning "⚠️ Package.json missing 1Password integration"
    fi
    
    # Check log directory
    if [[ -d "$PROJECT_ROOT/logs" ]]; then
        ((validation_count++))
        success "✅ Log directory exists"
    else
        warning "⚠️ Log directory missing"
    fi
    
    info "📊 Validation Summary: $validation_count/$total_validations components validated"
    
    if [[ $validation_count -eq $total_validations ]]; then
        success "🎉 AI agent setup is complete and validated!"
        return 0
    else
        warning "⚠️ Some components need attention. Check logs for details."
        return 1
    fi
}

# Function to show setup summary
show_summary() {
    cat << 'EOF'

🤖 BRX Platform AI Agent Setup Complete!

WHAT'S BEEN CONFIGURED:
✅ 1Password CLI integration with automatic session management
✅ Environment variable automation using 1Password secret references
✅ npm scripts updated to use 1Password for all operations
✅ Cursor AI rules for maximum autonomous development
✅ VS Code settings and extensions for optimal productivity
✅ Shell integration with shortcuts and auto-completion
✅ CI/CD pipeline with secure 1Password integration
✅ Monitoring and health check systems
✅ Desktop shortcuts for common operations

QUICK START COMMANDS:
  ./scripts/op-workflow.sh init     # Initialize 1Password integration
  ./scripts/op-workflow.sh start    # Start development with all secrets
  ./scripts/op-workflow.sh validate # Validate all credentials
  ./scripts/op-workflow.sh status   # Check integration status

AI AGENT CAPABILITIES:
🔐 Autonomous secret management (read, inject, validate)
🚀 Autonomous development workflow (start, test, build, deploy)
📊 Continuous monitoring and health checks
🛡️  Security-first approach with audit trails
⚡ Maximum efficiency with minimal manual intervention

SECURITY FEATURES:
• All secrets stored securely in 1Password vaults
• No hardcoded credentials anywhere in the codebase
• Separate vaults for development, staging, and production
• Automatic session management and renewal
• Comprehensive audit logging
• SSH-based authentication support

The AI agent now has maximum autonomy while maintaining enterprise-grade security.
Ready for 20+ year development guru level workflow optimization! 🚀

EOF
}

# Main execution
main() {
    info "🚀 Starting AI Agent Setup for Maximum Autonomy..."
    
    setup_cursor_permissions
    setup_shell_integration
    setup_vscode_extensions
    setup_monitoring
    create_ai_shortcuts
    setup_auto_startup
    
    if validate_setup; then
        show_summary
        success "🎉 AI Agent setup completed successfully!"
        exit 0
    else
        error "❌ AI Agent setup completed with warnings. Check logs."
        exit 1
    fi
}

# Run main function
main "$@"