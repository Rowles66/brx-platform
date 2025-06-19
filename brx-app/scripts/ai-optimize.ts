#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { generateTests, optimizePrismaSchema, optimizeReactComponent, reviewCode } from '../src/lib/ai/dev-tools';

// CLI tool for AI-powered code optimization
async function main() {
  const command = process.argv[2];
  const filePath = process.argv[3];

  if (!command || !filePath) {
    console.log(`
AI Code Optimizer - Usage:
  npm run ai:optimize <command> <file>

Commands:
  review <file>     - Review code and suggest optimizations
  react <file>      - Optimize React component
  test <file>       - Generate tests for code
  prisma <file>     - Optimize Prisma schema

Examples:
  npm run ai:optimize review src/components/Dashboard.tsx
  npm run ai:optimize react src/components/WorkoutCard.tsx
  npm run ai:optimize test src/lib/utils.ts
  npm run ai:optimize prisma prisma/schema.prisma
    `);
    process.exit(1);
  }

  try {
    const fullPath = resolve(process.cwd(), filePath);
    const code = readFileSync(fullPath, 'utf-8');
    
    console.log(`🤖 Analyzing ${filePath}...`);

    let result: string;
    switch (command) {
      case 'review':
        result = await reviewCode(code, `File: ${filePath}`);
        break;
      case 'react':
        result = await optimizeReactComponent(code) || '';
        break;
      case 'test':
        result = await generateTests(code);
        // Save tests to a new file
        const testPath = filePath.replace(/\.tsx?$/, '.test.$&');
        writeFileSync(testPath, result);
        console.log(`✅ Tests generated: ${testPath}`);
        return;
      case 'prisma':
        result = await optimizePrismaSchema(code);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }

    console.log('\n📋 AI Analysis:\n');
    console.log(result);

    // Optionally save optimized version
    if (process.argv.includes('--save')) {
      const optimizedPath = filePath.replace(/\.([^.]+)$/, '.optimized.$1');
      writeFileSync(optimizedPath, result);
      console.log(`\n✅ Optimized version saved: ${optimizedPath}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main(); 
