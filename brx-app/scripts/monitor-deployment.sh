#!/bin/bash
# Vercel Deployment Monitoring Script
# This script monitors the Vercel deployment and can take proactive actions

# Configuration
DEPLOYMENT_URL="brx-app-replica-l2eepoqqn-brx-performance.vercel.app"
PROJECT_NAME="brx-app-replica"
TEAM_SCOPE="brx-performance"
LOG_DIR="./logs/vercel"
TIME_WINDOW=300 # 5 minutes in seconds
CURSOR_EDITOR="/usr/local/bin/cursor"

# Create log directory
mkdir -p $LOG_DIR

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize counters
error_count=0
request_count=0
warning_count=0

# Timestamp function
timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

# Function to get runtime logs with time window
get_runtime_logs() {
  # Get logs for last 5 minutes
  local since_time=$(date -u -v-5M +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null)
  
  # If the above fails (non-macOS), try Linux date format
  if [ $? -ne 0 ]; then
    since_time=$(date -u -d "5 minutes ago" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null)
  fi
  
  # Fall back to simple format if both fail
  if [ $? -ne 0 ]; then
    since_time="5m"
  fi
  
  echo -e "${BLUE}[$(timestamp)] Getting logs since $since_time...${NC}"
  vercel logs $DEPLOYMENT_URL --scope $TEAM_SCOPE
}

# Function to get build logs
get_build_logs() {
  vercel inspect --logs $DEPLOYMENT_URL --scope $TEAM_SCOPE
}

# Function to check deployment status
check_status() {
  echo -e "${BLUE}[$(timestamp)] Checking deployment status...${NC}"
  status_output=$(vercel inspect $DEPLOYMENT_URL --scope $TEAM_SCOPE)
  echo "$status_output" > "$LOG_DIR/status_$(date +%Y%m%d_%H%M%S).txt"
  
  # Check if deployment is ready
  if echo "$status_output" | grep -q "● Ready"; then
    echo -e "${GREEN}✓ Deployment is READY${NC}"
    return 0
  else
    echo -e "${RED}✗ Deployment status issue${NC}"
    return 1
  fi
}

# Function to analyze logs for errors
analyze_logs() {
  local log_file=$1
  
  # Count errors and warnings
  local errors=$(grep -c "error" $log_file)
  local warnings=$(grep -c "warn" $log_file)
  
  echo -e "${BLUE}Log analysis:${NC}"
  echo -e "  Errors: $errors"
  echo -e "  Warnings: $warnings"
  
  # Update global counters
  error_count=$((error_count + errors))
  warning_count=$((warning_count + warnings))
  
  # Check for specific issues
  if grep -q "ECONNREFUSED" $log_file; then
    echo -e "${RED}⚠️ DATABASE CONNECTION ISSUE DETECTED!${NC}"
    return 1
  fi
  
  if grep -q "memory limit exceeded" $log_file; then
    echo -e "${RED}⚠️ MEMORY LIMIT EXCEEDED!${NC}"
    return 1
  fi
  
  return 0
}

# Function to send alerts
send_alert() {
  local message="$1"
  echo -e "${RED}[$(timestamp)] ALERT: $message${NC}"
  
  # Log the alert
  echo "[$(timestamp)] ALERT: $message" >> "$LOG_DIR/alerts.log"
  
  # Create action file
  echo "$message" > "$LOG_DIR/action_required_$(date +%Y%m%d_%H%M%S).txt"
  
  # Open in Cursor if available
  if [ -x "$CURSOR_EDITOR" ]; then
    $CURSOR_EDITOR "$LOG_DIR/action_required_$(date +%Y%m%d_%H%M%S).txt"
  fi
}

# Main monitoring loop
monitor() {
  echo -e "${BLUE}Starting monitoring for $DEPLOYMENT_URL${NC}"
  echo -e "${BLUE}Logs will be saved to $LOG_DIR${NC}"
  
  while true; do
    echo -e "\n${BLUE}========== Monitoring Cycle: $(timestamp) ==========${NC}"
    
    # Check deployment status
    check_status
    
    # Get runtime logs
    echo -e "${BLUE}[$(timestamp)] Fetching runtime logs...${NC}"
    runtime_logs=$(get_runtime_logs)
    runtime_log_file="$LOG_DIR/runtime_$(date +%Y%m%d_%H%M%S).log"
    echo "$runtime_logs" > "$runtime_log_file"
    
    # Get build logs
    echo -e "${BLUE}[$(timestamp)] Fetching build logs...${NC}"
    build_logs=$(get_build_logs)
    build_log_file="$LOG_DIR/build_$(date +%Y%m%d_%H%M%S).log"
    echo "$build_logs" > "$build_log_file"
    
    # Analyze logs
    echo -e "${BLUE}[$(timestamp)] Analyzing logs...${NC}"
    analyze_logs "$runtime_log_file"
    analyze_logs "$build_log_file"
    
    # Check if we need to take action
    if [ $error_count -ge 3 ]; then
      send_alert "High error rate detected ($error_count errors)"
      error_count=0
    fi
    
    # Summary
    echo -e "\n${BLUE}Monitoring Summary:${NC}"
    echo -e "  Total Warnings: $warning_count"
    echo -e "  Total Errors: $error_count"
    echo -e "${BLUE}Next check in $(($TIME_WINDOW / 60)) minutes...${NC}"
    
    sleep $TIME_WINDOW
  done
}

# Start the monitoring
monitor

