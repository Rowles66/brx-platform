import { generateText } from 'ai';
import { AI_MODELS, anthropic, openai, vercelAnthropic, vercelOpenAI } from './client';

// 1. Code Review and Optimization
export async function reviewCode(code: string, context?: string) {
  const response = await anthropic.messages.create({
    model: AI_MODELS.code.claude,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Review this code and suggest optimizations:

${code}

${context ? `Context: ${context}` : ''}

Provide:
1. Performance optimizations
2. Best practices violations
3. Security concerns
4. Readability improvements
5. Suggested refactoring`,
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// 2. Generate TypeScript Types from API Response
export async function generateTypesFromJSON(jsonData: any, typeName: string) {
  const { text } = await generateText({
    model: vercelOpenAI('gpt-4-turbo-preview'),
    prompt: `Generate TypeScript interfaces for this JSON data:

${JSON.stringify(jsonData, null, 2)}

Root type name: ${typeName}
Include all nested types and make the types as specific as possible.`,
  });

  return text;
}

// 3. SQL Query Optimization
export async function optimizeSQL(query: string, schema?: string) {
  const { text } = await generateText({
    model: vercelAnthropic('claude-3-opus-20240229'),
    prompt: `Optimize this SQL query for PostgreSQL:

${query}

${schema ? `Schema:\n${schema}` : ''}

Provide:
1. Optimized query
2. Explanation of changes
3. Index recommendations
4. Performance considerations`,
  });

  return text;
}

// 4. React Component Optimization
export async function optimizeReactComponent(component: string) {
  const response = await openai.chat.completions.create({
    model: AI_MODELS.code.default,
    messages: [
      {
        role: 'system',
        content: 'You are an expert React developer focused on performance and best practices.',
      },
      {
        role: 'user',
        content: `Optimize this React component:

${component}

Focus on:
1. Performance (memoization, lazy loading, etc.)
2. Accessibility
3. TypeScript best practices
4. Modern React patterns (hooks, composition)
5. Bundle size optimization`,
      },
    ],
  });

  return response.choices[0].message.content;
}

// 5. Generate API Route from Description
export async function generateAPIRoute(description: string, method: string = 'POST') {
  const { text } = await generateText({
    model: vercelAnthropic('claude-3-opus-20240229'),
    prompt: `Generate a Next.js 14 API route with App Router:

Description: ${description}
Method: ${method}

Include:
1. TypeScript types
2. Input validation (zod)
3. Error handling
4. Proper status codes
5. Comments explaining the logic`,
  });

  return text;
}

// 6. Convert Code Between Frameworks
export async function convertCode(code: string, from: string, to: string) {
  const response = await anthropic.messages.create({
    model: AI_MODELS.code.claude,
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: `Convert this ${from} code to ${to}:

${code}

Maintain the same functionality and follow ${to} best practices.`,
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// 7. Generate Tests
export async function generateTests(code: string, framework: 'jest' | 'vitest' | 'playwright' = 'jest') {
  const { text } = await generateText({
    model: vercelOpenAI('gpt-4-turbo-preview'),
    prompt: `Generate comprehensive tests for this code using ${framework}:

${code}

Include:
1. Unit tests for all functions
2. Edge cases
3. Error scenarios
4. Mocking where needed
5. Clear test descriptions`,
  });

  return text;
}

// 8. Prisma Schema Optimization
export async function optimizePrismaSchema(schema: string) {
  const response = await anthropic.messages.create({
    model: AI_MODELS.code.claude,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Optimize this Prisma schema:

${schema}

Suggest:
1. Index optimizations
2. Relation improvements
3. Field type optimizations
4. Performance considerations
5. Best practices`,
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// 9. Debug Helper
export async function debugCode(code: string, error: string, stackTrace?: string) {
  const { text } = await generateText({
    model: vercelAnthropic('claude-3-sonnet-20240229'),
    prompt: `Debug this code:

Code:
${code}

Error:
${error}

${stackTrace ? `Stack trace:\n${stackTrace}` : ''}

Provide:
1. Root cause analysis
2. Fix suggestion
3. Code correction
4. Prevention tips`,
  });

  return text;
}

// 10. Performance Profiling Analysis
export async function analyzePerformanceProfile(profileData: any) {
  const { text } = await generateText({
    model: vercelOpenAI('gpt-4-turbo-preview'),
    prompt: `Analyze this performance profile data:

${JSON.stringify(profileData, null, 2)}

Identify:
1. Performance bottlenecks
2. Memory leaks
3. Optimization opportunities
4. Specific code areas to improve`,
  });

  return text;
} 
