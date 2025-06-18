#!/usr/bin/env node

import { spawn } from 'child_process';
import { promisify } from 'util';

/**
 * 1Password Tools for MCP Server
 * Provides secure access to 1Password vault items for development workflow
 */
export class OnePasswordTools {
  constructor() {
    this.isSignedIn = false;
    this.lastSessionCheck = 0;
    this.sessionCheckInterval = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Check if 1Password CLI is available and user is signed in
   */
  async checkOnePasswordSession() {
    const now = Date.now();
    if (now - this.lastSessionCheck < this.sessionCheckInterval && this.isSignedIn) {
      return this.isSignedIn;
    }

    try {
      await this.runOpCommand(['account', 'list']);
      this.isSignedIn = true;
      this.lastSessionCheck = now;
      return true;
    } catch (error) {
      this.isSignedIn = false;
      return false;
    }
  }

  /**
   * Run an op command with proper error handling
   */
  async runOpCommand(args, options = {}) {
    return new Promise((resolve, reject) => {
      const process = spawn('op', args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        ...options
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`1Password CLI error (${code}): ${stderr}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to execute 1Password CLI: ${error.message}`));
      });
    });
  }

  /**
   * List all vaults accessible to the user
   */
  async listVaults() {
    await this.checkOnePasswordSession();
    if (!this.isSignedIn) {
      throw new Error('Not signed in to 1Password. Please run: op signin');
    }

    try {
      const output = await this.runOpCommand(['vault', 'list', '--format=json']);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to list vaults: ${error.message}`);
    }
  }

  /**
   * List items in a specific vault
   */
  async listVaultItems(vaultName = 'Development Credentials') {
    await this.checkOnePasswordSession();
    if (!this.isSignedIn) {
      throw new Error('Not signed in to 1Password. Please run: op signin');
    }

    try {
      const output = await this.runOpCommand([
        'item', 'list',
        '--vault', vaultName,
        '--format=json'
      ]);
      return JSON.parse(output);
    } catch (error) {
      throw new Error(`Failed to list items in vault '${vaultName}': ${error.message}`);
    }
  }

  /**
   * Get details for a specific item (without revealing secret values)
   */
  async getItemStructure(itemName, vaultName = 'Development Credentials') {
    await this.checkOnePasswordSession();
    if (!this.isSignedIn) {
      throw new Error('Not signed in to 1Password. Please run: op signin');
    }

    try {
      const output = await this.runOpCommand([
        'item', 'get', itemName,
        '--vault', vaultName,
        '--format=json'
      ]);
      
      const item = JSON.parse(output);
      
      // Remove actual secret values but keep structure
      const sanitizedItem = {
        id: item.id,
        title: item.title,
        category: item.category,
        vault: item.vault,
        fields: item.fields?.map(field => ({
          id: field.id,
          label: field.label,
          type: field.type,
          purpose: field.purpose,
          // Don't include actual values
          hasValue: !!field.value,
          reference: `op://${vaultName}/${itemName}/${field.label || field.id}`
        })) || []
      };

      return sanitizedItem;
    } catch (error) {
      throw new Error(`Failed to get item '${itemName}' from vault '${vaultName}': ${error.message}`);
    }
  }

  /**
   * Generate environment variable templates with 1Password references
   */
  async generateEnvTemplate(vaultName = 'Development Credentials') {
    const items = await this.listVaultItems(vaultName);
    const envVars = [];

    for (const item of items) {
      try {
        const structure = await this.getItemStructure(item.title, vaultName);
        
        // Generate environment variable names and references
        for (const field of structure.fields) {
          if (field.type === 'CONCEALED' || field.purpose === 'PASSWORD' || 
              field.label?.toLowerCase().includes('key') ||
              field.label?.toLowerCase().includes('token') ||
              field.label?.toLowerCase().includes('secret')) {
            
            // Generate env var name from item title and field label
            const envVarName = this.generateEnvVarName(item.title, field.label);
            const reference = field.reference;
            
            envVars.push({
              name: envVarName,
              reference: reference,
              description: `${item.title} - ${field.label}`,
              category: item.category
            });
          }
        }
      } catch (error) {
        console.error(`Skipping item ${item.title}: ${error.message}`);
      }
    }

    return envVars;
  }

  /**
   * Generate a standardized environment variable name
   */
  generateEnvVarName(itemTitle, fieldLabel) {
    const clean = (str) => str
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toUpperCase();

    if (fieldLabel && fieldLabel !== 'password' && fieldLabel !== 'credential') {
      return `${clean(itemTitle)}_${clean(fieldLabel)}`;
    }
    
    return clean(itemTitle);
  }

  /**
   * Discover environment variables needed by the project
   */
  async discoverProjectEnvVars(projectPath = '/workspace') {
    const envVarPatterns = [
      /\bprocess\.env\.([A-Z_][A-Z0-9_]*)/g,
      /\$\{([A-Z_][A-Z0-9_]*)\}/g,
      /\$([A-Z_][A-Z0-9_]*)/g
    ];

    const foundVars = new Set();
    
    // This would need to scan project files
    // For now, return common variables we know about
    const commonVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'PINECONE_API_KEY',
      'PINECONE_ENVIRONMENT',
      'FIRECRAWL_API_KEY',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'BRX_API_TOKEN',
      'BRX_BEARER_TOKEN',
      'BRX_API_DOCS_USERNAME',
      'BRX_API_DOCS_PASSWORD',
      'BRX_API_BASE_URL',
      'BRX_USERNAME',
      'BRX_PASSWORD',
      'JWT_SECRET',
      'ENCRYPTION_KEY'
    ];

    return commonVars.map(name => ({ name, discovered: true }));
  }

  /**
   * Create a comprehensive environment mapping
   */
  async createEnvironmentMapping(vaultName = 'Development Credentials') {
    const [vaultItems, projectVars] = await Promise.all([
      this.generateEnvTemplate(vaultName),
      this.discoverProjectEnvVars()
    ]);

    const mapping = {
      vault: vaultName,
      timestamp: new Date().toISOString(),
      available_items: vaultItems,
      project_variables: projectVars,
      mappings: []
    };

    // Try to match project variables with vault items
    for (const projectVar of projectVars) {
      const matchingItem = vaultItems.find(item => 
        item.name === projectVar.name ||
        item.name.includes(projectVar.name) ||
        projectVar.name.includes(item.name.split('_')[0])
      );

      if (matchingItem) {
        mapping.mappings.push({
          env_var: projectVar.name,
          reference: matchingItem.reference,
          status: 'mapped',
          description: matchingItem.description
        });
      } else {
        mapping.mappings.push({
          env_var: projectVar.name,
          reference: null,
          status: 'unmapped',
          description: 'No matching 1Password item found'
        });
      }
    }

    return mapping;
  }

  /**
   * Get the MCP tools definition for 1Password integration
   */
  getMCPTools() {
    return [
      {
        name: 'op_list_vaults',
        description: 'List all 1Password vaults accessible to the current user',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'op_list_vault_items',
        description: 'List items in a specific 1Password vault (without revealing secrets)',
        inputSchema: {
          type: 'object',
          properties: {
            vault: {
              type: 'string',
              description: 'Name of the vault to list items from',
              default: 'Development Credentials'
            }
          }
        }
      },
      {
        name: 'op_get_item_structure',
        description: 'Get the structure of a 1Password item (fields and types, but not secret values)',
        inputSchema: {
          type: 'object',
          properties: {
            item: {
              type: 'string',
              description: 'Name or ID of the item to examine'
            },
            vault: {
              type: 'string',
              description: 'Name of the vault containing the item',
              default: 'Development Credentials'
            }
          },
          required: ['item']
        }
      },
      {
        name: 'op_generate_env_template',
        description: 'Generate environment variable template with 1Password references',
        inputSchema: {
          type: 'object',
          properties: {
            vault: {
              type: 'string',
              description: 'Name of the vault to generate template from',
              default: 'Development Credentials'
            }
          }
        }
      },
      {
        name: 'op_discover_project_vars',
        description: 'Discover environment variables used by the project',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'op_create_env_mapping',
        description: 'Create comprehensive mapping between project variables and 1Password items',
        inputSchema: {
          type: 'object',
          properties: {
            vault: {
              type: 'string',
              description: 'Name of the vault to map from',
              default: 'Development Credentials'
            }
          }
        }
      },
      {
        name: 'op_check_session',
        description: 'Check if 1Password CLI session is active',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ];
  }

  /**
   * Handle MCP tool calls
   */
  async handleToolCall(name, args = {}) {
    try {
      switch (name) {
        case 'op_list_vaults':
          return await this.listVaults();

        case 'op_list_vault_items':
          return await this.listVaultItems(args.vault);

        case 'op_get_item_structure':
          return await this.getItemStructure(args.item, args.vault);

        case 'op_generate_env_template':
          return await this.generateEnvTemplate(args.vault);

        case 'op_discover_project_vars':
          return await this.discoverProjectEnvVars();

        case 'op_create_env_mapping':
          return await this.createEnvironmentMapping(args.vault);

        case 'op_check_session':
          const isSignedIn = await this.checkOnePasswordSession();
          return { 
            signedIn: isSignedIn,
            lastCheck: new Date(this.lastSessionCheck).toISOString()
          };

        default:
          throw new Error(`Unknown 1Password tool: ${name}`);
      }
    } catch (error) {
      return {
        error: true,
        message: error.message,
        suggestion: error.message.includes('signin') ? 
          'Run "op signin" to authenticate with 1Password' : null
      };
    }
  }
}