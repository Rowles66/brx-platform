# v0 Troubleshooting Guide for Cursor

Common issues and solutions when using v0 in Cursor.

## 🔧 Setup Issues

### API Key Not Working
**Problem**: "Invalid API key" or connection errors
**Solutions**:
1. Verify you're using a v0 API key (not OpenAI)
2. Get your key from: https://v0.dev/settings
3. Ensure no extra spaces in the key
4. Check Override URL is exactly: `https://api.v0.dev/v1`

### Model Not Responding as v0
**Problem**: Getting generic responses, not v0-specific
**Solutions**:
1. Ensure you're in **Agent Mode**
2. Verify with prompt: "who are you?"
3. Restart Cursor after configuration changes
4. Clear Cursor cache: `⌘+Shift+P` → "Clear Cache"

### Verification Failed
**Problem**: "Failed to verify" message
**Solutions**:
1. Check internet connection
2. Verify API endpoint: `https://api.v0.dev/v1`
3. Try without VPN/proxy
4. Check v0 service status

## 🤖 Response Quality Issues

### Generic or Outdated Responses
**Problem**: v0 not using latest Next.js features
**Solutions**:
```
Prompt fix: "Using Next.js 15 with App Router (latest stable), create..."
Always specify: Version numbers, deployment target, specific features
```

### Not Following Best Practices
**Problem**: Code doesn't follow modern patterns
**Solutions**:
1. Be explicit: "following Next.js 15 best practices"
2. Request: "use Server Components where appropriate"
3. Add: "with proper TypeScript types"
4. Specify: "optimized for production"

### Incomplete Implementations
**Problem**: v0 provides partial code
**Solutions**:
1. Request complete implementation: "Show complete, runnable code"
2. Ask for missing pieces: "Include all imports and dependencies"
3. Specify scope: "Full CRUD implementation with error handling"

## 💻 Cursor-Specific Issues

### Agent Mode Not Working
**Problem**: Can't select Agent mode
**Solutions**:
1. Update Cursor to latest version
2. Restart Cursor completely
3. Check you have API key configured
4. Try different chat window

### Tool Calls Failing
**Problem**: v0 attempts tool calls that fail
**Solutions**:
1. v0 doesn't have access to Cursor tools
2. Ask for code directly instead
3. Copy code manually to files
4. Use standard chat for code generation

### Context Length Errors
**Problem**: "Context too long" errors
**Solutions**:
1. Break down large requests
2. Use separate chats for different features
3. Summarize instead of pasting entire codebases
4. Focus on specific files/components

## 🚀 Performance Issues

### Slow Responses
**Problem**: v0 takes long to respond
**Solutions**:
1. Check v0 service status
2. Simplify complex prompts
3. Break into smaller requests
4. Try during off-peak hours

### Timeout Errors
**Problem**: Requests timing out
**Solutions**:
1. Reduce prompt complexity
2. Ask for specific parts, not entire apps
3. Use iterative approach
4. Check network stability

## 📝 Prompt Issues

### v0 Misunderstanding Requirements
**Problem**: Output doesn't match needs
**Solutions**:
```
Structure your prompts:
1. Context: "I have a Next.js 15 app with..."
2. Goal: "I need to add..."
3. Specifics: "It should include..."
4. Constraints: "Must work with..."
```

### Getting Outdated Patterns
**Problem**: v0 suggests old approaches
**Solutions**:
```
Always specify:
- "Next.js 15 with App Router"
- "Using React Server Components"
- "Latest stable versions"
- "Modern patterns only"
```

## 🔍 Common Errors

### "Model not available"
**Solution**: 
- Select any OpenAI model (gpt-4o, etc.)
- v0 will be used regardless of selection

### "Attachment not supported"
**Solution**:
- Paste code/images as text
- Describe visual layouts in detail
- Use markdown for structure

### "Rate limit exceeded"
**Solution**:
- Wait a few minutes
- Reduce request frequency
- Break down complex requests
- Upgrade v0 plan if needed

## 🛠️ Best Practices for Debugging

### 1. Diagnostic Prompt
```
"Diagnose this Next.js error:
Error: [full error]
Context: [when it happens]
Environment: [dev/prod]
What I tried: [attempts]"
```

### 2. Step-by-Step Debugging
```
"Help me debug step by step:
1. What could cause this error?
2. How do I verify each cause?
3. What's the fix for each?
4. How do I prevent this?"
```

### 3. Code Review Request
```
"Review this code for issues:
[paste code]
Check for:
- Logic errors
- Type safety
- Performance issues
- Security problems"
```

## 🔄 Recovery Strategies

### When v0 Gets Stuck
1. Start fresh chat
2. Rephrase the prompt
3. Break into smaller tasks
4. Provide more context

### When Output Is Wrong
1. Clarify requirements
2. Provide examples
3. Ask for alternatives
4. Request explanation

### When Nothing Works
1. Check v0 status page
2. Try basic prompt: "Create a Next.js component"
3. Verify configuration
4. Contact support

## 📚 Learning from Issues

### Document Problems
Keep notes on:
- What prompts work best
- Common misunderstandings
- Successful patterns
- Time-saving approaches

### Build Prompt Library
Save working prompts for:
- Common tasks
- Complex features
- Debugging scenarios
- Performance optimization

## 🎯 Quick Fixes

### Force Modern Patterns
Add to every prompt:
```
"Use Next.js 15 App Router with TypeScript and modern best practices"
```

### Ensure Complete Code
Always request:
```
"Provide complete, production-ready code with all imports and error handling"
```

### Get Better Explanations
Ask:
```
"Explain your approach and why you chose this solution"
```

## 🚨 Emergency Fallbacks

If v0 isn't working:
1. Use regular Cursor AI temporarily
2. Check v0 documentation directly
3. Try web version of v0
4. Wait and retry later

## 📞 Getting Help

### v0 Resources
- Documentation: https://v0.dev/docs
- Status: https://v0.dev/status
- Community: https://v0.dev/community

### Cursor Resources
- Cursor Docs: https://cursor.sh/docs
- Cursor Discord: Community support
- GitHub Issues: Bug reports

---

**Remember**: Most issues are configuration or prompt-related. When in doubt, verify your setup and be more specific in your prompts!