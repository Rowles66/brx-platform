#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root (two levels up from src/index.js)
const PROJECT_ROOT = path.resolve(__dirname, '../../');

class BRXMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'brx-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_project_info',
            description: 'Get information about the BRX platform project structure and status',
            inputSchema: {
              type: 'object',
              properties: {
                section: {
                  type: 'string',
                  description: 'Specific section to get info about (architecture, dependencies, scripts, etc.)',
                  enum: ['architecture', 'dependencies', 'scripts', 'status', 'all']
                }
              }
            }
          },
          {
            name: 'analyze_codebase',
            description: 'Analyze the codebase for patterns, components, or specific functionality',
            inputSchema: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  description: 'Type of analysis to perform',
                  enum: ['components', 'apis', 'tests', 'patterns', 'dependencies']
                },
                pattern: {
                  type: 'string',
                  description: 'Optional pattern to search for'
                }
              },
              required: ['type']
            }
          },
          {
            name: 'get_development_context',
            description: 'Get current development context including recent commits, changes, and project status',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_project_info':
            return await this.getProjectInfo(args.section || 'all');
          
          case 'analyze_codebase':
            return await this.analyzeCodebase(args.type, args.pattern);
          
          case 'get_development_context':
            return await this.getDevelopmentContext();
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async getProjectInfo(section) {
    const info = {
      architecture: {
        framework: 'Next.js 15 with App Router',
        api: 'tRPC for type-safe APIs',
        database: 'Prisma ORM with PostgreSQL',
        auth: 'Currently mock auth (NextAuth planned)',
        styling: 'Tailwind CSS',
        testing: 'Playwright for E2E, Vitest for unit tests'
      },
      structure: {
        main_app: 'brx-app/',
        components: 'src/components/ (organized by feature)',
        api: 'src/server/api/ (tRPC routers)',
        pages: 'src/app/ (Next.js App Router)',
        tests: 'tests/ (E2E and integration)',
        database: 'prisma/ (schema and migrations)'
      }
    };

    if (section === 'all') {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(info, null, 2)
          }
        ]
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(info[section] || {}, null, 2)
        }
      ]
    };
  }

  async analyzeCodebase(type, pattern) {
    const brxAppPath = path.join(PROJECT_ROOT, 'brx-app');
    
    try {
      let results = {};
      
      switch (type) {
        case 'components':
          results = await this.analyzeComponents(brxAppPath);
          break;
        case 'apis':
          results = await this.analyzeAPIs(brxAppPath);
          break;
        case 'tests':
          results = await this.analyzeTests(brxAppPath);
          break;
        default:
          results = { message: `Analysis type '${type}' not implemented yet` };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2)
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to analyze codebase: ${error.message}`);
    }
  }

  async analyzeComponents(appPath) {
    const componentsPath = path.join(appPath, 'src', 'components');
    try {
      const components = await this.walkDirectory(componentsPath, ['.tsx', '.jsx']);
      return {
        total: components.length,
        byFeature: this.groupByDirectory(components, componentsPath),
        files: components
      };
    } catch (error) {
      return { error: `Cannot analyze components: ${error.message}` };
    }
  }

  async analyzeAPIs(appPath) {
    const apiPath = path.join(appPath, 'src', 'server', 'api', 'routers');
    try {
      const apis = await this.walkDirectory(apiPath, ['.ts']);
      return {
        total: apis.length,
        routers: apis.map(file => path.basename(file, '.ts')),
        files: apis
      };
    } catch (error) {
      return { error: `Cannot analyze APIs: ${error.message}` };
    }
  }

  async analyzeTests(appPath) {
    const testsPath = path.join(appPath, 'tests');
    try {
      const tests = await this.walkDirectory(testsPath, ['.spec.ts', '.test.ts']);
      return {
        total: tests.length,
        byType: this.groupByDirectory(tests, testsPath),
        files: tests
      };
    } catch (error) {
      return { error: `Cannot analyze tests: ${error.message}` };
    }
  }

  async walkDirectory(dir, extensions = []) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.walkDirectory(fullPath, extensions);
          files.push(...subFiles);
        } else if (extensions.length === 0 || extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return files;
  }

  groupByDirectory(files, basePath) {
    const groups = {};
    
    for (const file of files) {
      const relativePath = path.relative(basePath, file);
      const dir = path.dirname(relativePath);
      
      if (!groups[dir]) groups[dir] = [];
      groups[dir].push(path.basename(file));
    }
    
    return groups;
  }

  async getDevelopmentContext() {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            project: 'BRX Platform - Fitness coaching application migration',
            phase: 'Phase 2 - Migration from Exercise.com to independent platform',
            goal: 'Create AI-powered solution for strength coaches to earn $100K+ annually',
            currentStatus: 'Active development with Next.js, tRPC, and Prisma',
            keyFeatures: [
              'Dashboard with client overview and workout tracking',
              'Exercise library with search and filtering',
              'Program management and scheduling',
              'Progress tracking and analytics',
              'AI-powered automation features'
            ]
          }, null, 2)
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('BRX MCP Server running on stdio');
  }
}

// Start the server
const server = new BRXMCPServer();
server.run().catch(console.error);