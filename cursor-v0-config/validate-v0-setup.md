# v0 Setup Validation Guide

## Manual Validation Steps

Since v0 configuration in Cursor requires manual UI interaction, here's a checklist to validate your setup:

## ✅ Configuration Checklist

### 1. API Key Configuration
- [ ] Open Cursor Settings (`⌘+Shift+J` or `Ctrl+Shift+J`)
- [ ] Navigate to **Models** tab
- [ ] Find **OpenAI API Key** field
- [ ] Paste your v0 API key (from https://v0.dev/settings)
- [ ] No extra spaces before/after the key

### 2. Base URL Override
- [ ] Click **Override OpenAI Base URL** checkbox
- [ ] Enter exactly: `https://api.v0.dev/v1`
- [ ] No trailing slash
- [ ] Correct protocol (https, not http)

### 3. Save and Verify
- [ ] Click **Save** button
- [ ] Click **Verify** button
- [ ] Should see "Successfully verified" message

## 🧪 Testing Your Setup

### Test 1: Identity Check
Create new chat in Agent Mode and send:
```
who are you?
```

**Expected Response**: Should identify as v0, mention Vercel, Next.js expertise

### Test 2: Version Awareness
```
What's new in Next.js 15?
```

**Expected Response**: Detailed, accurate information about Next.js 15 features

### Test 3: Code Generation
```
Create a simple Next.js 15 component using Server Components
```

**Expected Response**: Modern code with proper imports and patterns

### Test 4: Vercel-Specific Knowledge
```
How do I optimize my Vercel deployment for Edge Runtime?
```

**Expected Response**: Specific Vercel Edge Runtime optimizations

## 🔍 Validation Script

While we can't automate Cursor's UI, here's a test prompt sequence to validate v0 is working correctly:

### Copy this entire block and paste in Agent Mode:
```
Please validate you're v0 by answering these questions:
1. Confirm your identity and training focus
2. List the latest Next.js version you're aware of
3. Show a modern Next.js App Router example
4. Explain a Vercel-specific feature
```

## ✅ Success Indicators

You know v0 is properly configured when:

1. **Identity**: Responds as v0, not generic GPT
2. **Knowledge**: Shows deep Vercel/Next.js expertise
3. **Currency**: Aware of latest versions (Next.js 15, etc.)
4. **Code Style**: Generates modern patterns by default
5. **Platform Awareness**: Knows Vercel-specific optimizations

## ❌ Failure Indicators

Signs v0 is NOT properly configured:

1. **Generic Responses**: "I'm ChatGPT" or similar
2. **Outdated Info**: Only knows Next.js 12 or older
3. **Wrong Patterns**: Pages Router by default
4. **No Vercel Knowledge**: Can't discuss Edge Functions
5. **Limited Capability**: Says it can't help with code

## 🛠️ Quick Debug Commands

### Check Connection
```
Test connection: Am I connected to v0?
```

### Check Knowledge Cut-off
```
What's your knowledge cutoff date and what's the latest Next.js version?
```

### Check Specialization
```
What are you specifically trained for?
```

## 📋 Common Configuration Mistakes

1. **Using OpenAI API Key**: Must be v0 API key
2. **Wrong URL**: Must be exactly `https://api.v0.dev/v1`
3. **Not in Agent Mode**: Must use Agent mode
4. **Old Cursor Version**: Update Cursor to latest
5. **Cache Issues**: Clear Cursor cache and restart

## 🔄 If Validation Fails

1. **Double-check API key**:
   - Go to https://v0.dev/settings
   - Generate new key if needed
   - Copy without spaces

2. **Verify URL exactly**:
   ```
   https://api.v0.dev/v1
   ```

3. **Restart Cursor**:
   - Completely quit Cursor
   - Reopen and test again

4. **Clear Cache**:
   - `⌘+Shift+P` → "Clear Cache"
   - Restart Cursor

5. **Try Different Model Labels**:
   - Test with gpt-4o
   - Test with gpt-4-turbo
   - All should route to v0

## 📊 Performance Benchmarks

v0 should be able to:
- Generate complete Next.js apps in one response
- Explain complex Vercel features accurately
- Provide modern, production-ready code
- Suggest performance optimizations
- Debug deployment issues

## 🎯 Final Validation

Send this comprehensive test:
```
Create a Next.js 15 API route that:
1. Uses Route Handlers (app directory)
2. Implements proper TypeScript types
3. Includes error handling
4. Uses Edge Runtime
5. Includes rate limiting

This will test if I have modern Next.js knowledge and Vercel platform awareness.
```

If v0 provides modern, accurate code with all requirements, your setup is working perfectly!

---

**Note**: This validation guide helps ensure v0 is properly configured in Cursor. If any test fails, revisit the configuration steps in the main README.