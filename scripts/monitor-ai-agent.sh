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
