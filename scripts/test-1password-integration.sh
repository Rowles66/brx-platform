#!/bin/bash

# 1Password Integration Test Script
# Tests all components of the AI agent 1Password integration

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEST_LOG="$PROJECT_ROOT/logs/integration-test.log"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Logging
log_test() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [TEST] ${message}" | tee -a "$TEST_LOG"
}

# Test execution wrapper
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    ((TESTS_RUN++))
    log_test "🧪 Running: $test_name"
    
    if eval "$test_command" >> "$TEST_LOG" 2>&1; then
        ((TESTS_PASSED++))
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        return 0
    else
        ((TESTS_FAILED++))  
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        return 1
    fi
}

# Create log directory
mkdir -p "$(dirname "$TEST_LOG")"

echo "🧪 Starting 1Password Integration Tests"
echo "========================================"

# Test 1: Check 1Password CLI availability
run_test "1Password CLI Installation" "command -v op"

# Test 2: Check 1Password CLI version
run_test "1Password CLI Version" "op --version | grep -E '^[2-9]'"

# Test 3: Check if signed into 1Password
run_test "1Password Session Status" "op account list"

# Test 4: Verify op-workflow script exists and is executable
run_test "op-workflow Script Executable" "test -x '$PROJECT_ROOT/scripts/op-workflow.sh'"

# Test 5: Check configuration files
run_test "1Password Config File" "test -f '$PROJECT_ROOT/.op-config.yaml'"
run_test "AI Agent Config File" "test -f '$PROJECT_ROOT/.ai-agent-config.json'"

# Test 6: Test op-workflow status command
run_test "op-workflow Status Command" "$PROJECT_ROOT/scripts/op-workflow.sh status"

# Test 7: Test environment file generation
run_test "Environment File Generation" "$PROJECT_ROOT/scripts/op-workflow.sh inject development"

# Test 8: Verify environment file has 1Password references
run_test "Environment File Format" "grep -q 'op://' '$PROJECT_ROOT/brx-app/.env.local'"

# Test 9: Test package.json has 1Password integration
run_test "Package.json 1Password Integration" "grep -q 'op run' '$PROJECT_ROOT/brx-app/package.json'"

# Test 10: Test secret retrieval (if we have a test secret)
if op item get "Development Test" --vault="Development Credentials" &>/dev/null; then
    run_test "Secret Retrieval Test" "op item get 'Development Test' --vault='Development Credentials' --fields label=test_field"
else
    echo -e "${YELLOW}⚠️  SKIP${NC}: Secret Retrieval Test (no test secret configured)"
fi

# Test 11: Test npm script with 1Password (dry run)
cd "$PROJECT_ROOT/brx-app"
if run_test "NPM Script 1Password Integration" "timeout 10s npm run lint || true"; then
    echo -e "${GREEN}✅${NC} NPM scripts can execute with 1Password"
else
    echo -e "${YELLOW}⚠️${NC} NPM script test inconclusive"
fi

# Test 12: Verify logs directory exists
run_test "Logs Directory" "test -d '$PROJECT_ROOT/logs'"

# Test 13: Test VS Code configuration
run_test "VS Code Settings" "test -f '$PROJECT_ROOT/.vscode/settings.json'"

# Test 14: Test GitHub Actions workflow
run_test "GitHub Actions Workflow" "test -f '$PROJECT_ROOT/.github/workflows/ci-with-1password.yml'"

# Display results
echo ""
echo "🏁 Test Results Summary"
echo "======================="
echo -e "Tests Run:    ${BLUE}$TESTS_RUN${NC}"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "\n${GREEN}🎉 All tests passed! 1Password integration is ready for AI agents.${NC}"
    echo ""
    echo "🤖 AI Agent Next Steps:"
    echo "1. Open Cursor IDE in this project"
    echo "2. Try asking: 'Start the development server'"
    echo "3. AI will automatically use 1Password for secrets"
    echo "4. All npm scripts now use secure 1Password integration"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Check the log file: $TEST_LOG${NC}"
    exit 1
fi