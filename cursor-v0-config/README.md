# Cursor + v0 Configuration Guide

This guide helps you configure Cursor to maximize your use of v0 (Vercel's AI model) for development.

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Configuration Steps](#configuration-steps)
3. [Using v0 in Agent Mode](#using-v0-in-agent-mode)
4. [Best Practices](#best-practices)
5. [Prompt Templates](#prompt-templates)
6. [Troubleshooting](#troubleshooting)

## Initial Setup

### Prerequisites
- Cursor installed: https://cursor.com
- v0 API key from Vercel (get it from https://v0.dev/settings)

## Configuration Steps

### 1. Open Cursor Settings
- **macOS**: Press `⌘+Shift+J`
- **Windows/Linux**: Press `Ctrl+Shift+J`

### 2. Configure v0 as OpenAI Provider
1. Navigate to the **Models** tab
2. Scroll down to **OpenAI API Key**
3. Paste your v0 API key
4. Click **Override OpenAI Base URL**
5. Enter: `https://api.v0.dev/v1`
6. Click **Save**
7. Click **Verify** to confirm the connection

### 3. Enable Agent Mode for v0
To use v0-1.0-md in Cursor's Agent Mode:
1. Open a new chat
2. Set **Mode**: Agent
3. Set **Model**: Any OpenAI-labeled option (e.g., gpt-4o, gpt-4-turbo)
   - Note: Cursor will use v0-1.0-md regardless of the selected model
4. Verify with: "who are you?" - should respond as v0

## Using v0 in Agent Mode

### What v0 Excels At
v0 is specifically trained on:
- **Next.js** (App Router, Pages Router, all versions)
- **Vercel platform** (deployment, edge functions, serverless)
- **Turborepo** (monorepo management)
- **SvelteKit** (full-stack framework)
- **AI SDK** (Vercel AI SDK implementation)
- **Modern web development patterns**

### v0 Capabilities
1. **Code Generation**: Full-stack applications with Next.js
2. **Technical Planning**: PRDs, API specs, database schemas
3. **Architecture Design**: System design, patterns, best practices
4. **Troubleshooting**: Vercel deployments, Next.js issues
5. **Performance Optimization**: Core Web Vitals, bundle optimization

## Best Practices

### 1. Be Specific About Context
Always include:
- Framework version (e.g., "Next.js 15 with App Router")
- Deployment target (e.g., "Vercel Edge Functions")
- Relevant code snippets or error messages
- Project structure if relevant

### 2. Use Iterative Refinement
1. Start with broad requirements
2. Ask v0 to break down into technical specs
3. Request specific implementations
4. Ask for validation or alternatives

### 3. Leverage v0's Strengths
- Modern React patterns (Server Components, Server Actions)
- Edge computing and serverless architectures
- Vercel-specific optimizations
- Full-stack TypeScript applications

### 4. Known Limitations
- No attachment support (images, files)
- Best for Vercel ecosystem technologies
- May need guidance for non-Vercel deployments

## Quick Commands

### Project Setup
```
Create a new Next.js 15 app with TypeScript, Tailwind, and Shadcn UI
```

### Architecture Planning
```
Design a multi-tenant SaaS architecture using Next.js App Router with role-based access
```

### Performance Optimization
```
Optimize my Next.js app for Core Web Vitals with these Lighthouse scores: [paste scores]
```

### Troubleshooting
```
Debug this Vercel deployment error: [paste error]
```

## Tips for Maximum Effectiveness

1. **Use Agent Mode**: Always use Agent mode for complex tasks
2. **Provide Full Context**: Include package.json, error logs, current code
3. **Ask for Alternatives**: v0 can provide multiple approaches
4. **Request Validation**: Ask v0 to validate its own outputs
5. **Iterate Quickly**: Use v0's feedback to refine requirements

## Next Steps

1. Review the prompt templates in `prompt-templates.md`
2. Check `best-practices.md` for advanced usage
3. Use `quick-reference.md` as a cheat sheet

Remember: v0 is optimized for the Vercel ecosystem, so leverage it for Next.js, Vercel deployments, and modern web development patterns!