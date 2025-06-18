# Testing and Using 1Password Integration with Cursor AI Agents

## 🧪 **Step-by-Step Testing Guide**

### **Phase 1: Initial Setup & Validation**

1. **Initialize the Integration**
   ```bash
   cd /Users/joshrowles/github/brx-platform
   ./scripts/op-workflow.sh init
   ```
   This will:
   - Verify 1Password CLI is working
   - Create the `.env.local` file with 1Password references
   - Set up AI agent permissions
   - Validate all prerequisites

2. **Test 1Password Session**
   ```bash
   ./scripts/op-workflow.sh status
   ```
   Should show:
   - ✅ 1Password CLI installed and version
   - ✅ Active session
   - ✅ Environment file present
   - ✅ Configuration files exist

3. **Validate Credentials**
   ```bash
   ./scripts/op-workflow.sh validate
   ```
   This tests connectivity to all services using 1Password secrets.

### **Phase 2: Development Workflow Testing**

4. **Test Secret Injection**
   ```bash
   cd brx-app
   
   # This should work with 1Password integration
   npm run dev
   
   # Or test manually
   ../scripts/op-workflow.sh run npm run dev:unsafe
   ```

5. **Test Database Operations**
   ```bash
   cd brx-app
   
   # These now use 1Password automatically
   npm run db:generate
   npm run db:push
   npm run db:studio
   ```

6. **Test Build Process**
   ```bash
   cd brx-app
   npm run build  # Uses 1Password secrets
   ```

### **Phase 3: AI Agent Interaction Testing**

7. **Test Cursor AI Integration**
   - Open Cursor IDE in the project
   - The `.cursorrules` file should be active
   - Try asking Cursor to "start the development server"
   - It should automatically use the 1Password integration

8. **Test AI Agent Commands**
   Ask Cursor AI to execute these commands:
   ```
   "Start the development environment"
   "Validate all credentials" 
   "Check the status of 1Password integration"
   "Run the E2E tests with proper secrets"
   ```

## 🤖 **How Cursor AI Agents Use This Integration**

### **Automatic Behavior**
When you ask Cursor AI to perform development tasks, it will:

1. **Automatically Check Prerequisites**
   - Verify 1Password session is active
   - Ensure environment files are present
   - Validate required credentials

2. **Use Secure Commands by Default**
   - All npm scripts now use 1Password integration
   - No manual secret management required
   - Fallback to unsafe mode only if explicitly needed

3. **Follow Security Rules**
   - Never hardcode secrets
   - Always use 1Password references
   - Log all operations for audit

### **AI Agent Capabilities**

The AI can now autonomously:

```bash
# Start development (AI will run this automatically)
./scripts/op-workflow.sh start

# Run tests with secrets (AI chooses this over unsafe version)
npm run test:e2e  # Automatically uses 1Password

# Deploy with proper credentials
npm run deploy:staging  # Uses staging vault secrets

# Validate everything is working
./scripts/op-workflow.sh validate
```

## 🔧 **Practical Usage Examples**

### **Example 1: Starting Development**
**You ask:** "Start the development server"

**AI will execute:**
```bash
cd /Users/joshrowles/github/brx-platform/brx-app
npm run dev  # This now automatically uses: op run --env-file=.env.local -- next dev
```

### **Example 2: Running Tests**
**You ask:** "Run the E2E tests"

**AI will execute:**
```bash
cd /Users/joshrowles/github/brx-platform/brx-app
npm run test:e2e  # Uses: op run --env-file=.env.local -- playwright test
```

### **Example 3: Database Operations**
**You ask:** "Push the database schema changes"

**AI will execute:**
```bash
cd /Users/joshrowles/github/brx-platform/brx-app
npm run db:push  # Uses: op run --env-file=.env.local -- npx prisma db push
```

### **Example 4: Deployment**
**You ask:** "Deploy to staging"

**AI will execute:**
```bash
cd /Users/joshrowles/github/brx-platform/brx-app
npm run deploy:preview  # Uses production 1Password secrets
```

## 🧪 **Live Testing Script**

Here's a comprehensive test you can run:

```bash
#!/bin/bash
echo "🧪 Testing 1Password Integration with AI Agents"

# Test 1: Basic setup
echo "1. Testing basic setup..."
./scripts/op-workflow.sh status

# Test 2: Secret injection  
echo "2. Testing secret injection..."
./scripts/op-workflow.sh inject development

# Test 3: Credential validation
echo "3. Testing credential validation..."
./scripts/op-workflow.sh validate

# Test 4: Running with secrets
echo "4. Testing command execution with secrets..."
cd brx-app
../scripts/op-workflow.sh run npm run lint

# Test 5: Direct npm script (should use 1Password automatically)
echo "5. Testing npm scripts..."
npm run db:generate

echo "✅ All tests completed!"
```

## 🎯 **AI Agent Interaction Patterns**

### **Smart Prompts to Test**

1. **"Set up my development environment"**
   - AI should run `./scripts/op-workflow.sh init`
   - Then start the development server

2. **"I need to run tests with the database"**
   - AI should validate database credentials first
   - Then run tests with proper secrets

3. **"Deploy this to production"**
   - AI should switch to production vault
   - Validate production credentials
   - Execute deployment with proper secrets

4. **"Check if all my API keys are working"**
   - AI should run credential validation
   - Report on each service's connectivity

### **Advanced AI Capabilities**

The AI can now:

- **Context-Aware Secret Management**: Knows which secrets are needed for which operations
- **Automatic Error Recovery**: If a session expires, it can re-authenticate
- **Environment-Specific Operations**: Automatically uses the right vault for dev/staging/prod
- **Security Compliance**: Never exposes secrets, always uses references
- **Performance Optimization**: Batches secret operations for efficiency

## 🚨 **Troubleshooting Tests**

If something doesn't work:

1. **Check 1Password Session**
   ```bash
   op account list
   # If fails: op signin
   ```

2. **Verify Environment File**
   ```bash
   cat brx-app/.env.local
   # Should show op:// references, not actual secrets
   ```

3. **Test Manual Secret Retrieval**
   ```bash
   op run --env-file=brx-app/.env.local -- env | grep DATABASE_URL
   # Should show actual database URL, not the reference
   ```

4. **Check Logs**
   ```bash
   tail -f logs/op-workflow.log
   # Shows all 1Password operations and any errors
   ```

## 🎉 **Success Indicators**

You'll know it's working when:

- ✅ All npm scripts run without manual secret input
- ✅ AI agents can start development autonomously  
- ✅ No hardcoded secrets anywhere in the codebase
- ✅ All operations are logged for audit
- ✅ Different environments use appropriate vault secrets
- ✅ Session management is completely automatic

The integration transforms Cursor AI from a code assistant into a fully autonomous development partner that handles the entire secure development lifecycle!