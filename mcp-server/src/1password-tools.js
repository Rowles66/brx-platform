import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export class OnePasswordTools {
  constructor() {
    this.checkPrerequisites();
  }

  checkPrerequisites() {
    try {
      execSync('which op', { stdio: 'ignore' });
    } catch {
      console.error('[1Password] Warning: 1Password CLI not installed in container');
    }
  }

  async isAvailable() {
    try {
      execSync('op account list', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  getTools() {
    return [
      {
        name: 'search_1password',
        description: 'Search for items in 1Password by name or pattern',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for 1Password items'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'get_1password_reference',
        description: 'Get the reference string for a specific 1Password item and field',
        inputSchema: {
          type: 'object',
          properties: {
            item_name: {
              type: 'string',
              description: 'Name of the 1Password item'
            },
            field_name: {
              type: 'string',
              description: 'Field name (default: password)',
              default: 'password'
            }
          },
          required: ['item_name']
        }
      },
      {
        name: 'analyze_env_requirements',
        description: 'Analyze project to find required environment variables',
        inputSchema: {
          type: 'object',
          properties: {
            project_path: {
              type: 'string',
              description: 'Path to analyze (relative to workspace)',
              default: 'brx-app'
            }
          }
        }
      },
      {
        name: 'generate_env_from_1password',
        description: 'Generate .env file with 1Password references based on project analysis',
        inputSchema: {
          type: 'object',
          properties: {
            output_file: {
              type: 'string',
              description: 'Output filename',
              default: '.env.1password'
            },
            project_path: {
              type: 'string',
              description: 'Project path to analyze',
              default: 'brx-app'
            }
          }
        }
      },
      {
        name: 'convert_env_to_1password',
        description: 'Convert existing .env file to use 1Password references',
        inputSchema: {
          type: 'object',
          properties: {
            env_file: {
              type: 'string',
              description: 'Path to .env file to convert'
            }
          },
          required: ['env_file']
        }
      }
    ];
  }

  async handleToolCall(name, args) {
    if (!await this.isAvailable()) {
      return {
        content: [{
          type: 'text',
          text: '❌ 1Password CLI not available. Please ensure:\n1. 1Password CLI is installed in the Docker container\n2. You are signed in with: eval $(op signin)'
        }]
      };
    }

    switch (name) {
      case 'search_1password':
        return await this.search1Password(args.query);
      
      case 'get_1password_reference':
        return await this.get1PasswordReference(args.item_name, args.field_name);
      
      case 'analyze_env_requirements':
        return await this.analyzeEnvRequirements(args.project_path);
      
      case 'generate_env_from_1password':
        return await this.generateEnvFrom1Password(args.output_file, args.project_path);
      
      case 'convert_env_to_1password':
        return await this.convertEnvTo1Password(args.env_file);
      
      default:
        throw new Error(`Unknown 1Password tool: ${name}`);
    }
  }

  async search1Password(query) {
    try {
      const result = execSync(
        `op item list --format json | jq -r --arg q "${query}" '.[] | select(.title | test($q; "i")) | "\\(.vault.name)/\\(.title) [\\(.category)]"' | sort`,
        { encoding: 'utf8' }
      );

      const items = result.trim().split('\n').filter(Boolean);
      
      return {
        content: [{
          type: 'text',
          text: `Found ${items.length} items matching "${query}":\n\n${items.join('\n')}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error searching 1Password: ${error.message}`
        }]
      };
    }
  }

  async get1PasswordReference(itemName, fieldName = 'password') {
    try {
      const itemJson = execSync(
        `op item list --format json | jq -r --arg name "${itemName}" '.[] | select(.title == $name)' | head -1`,
        { encoding: 'utf8' }
      );

      if (!itemJson || itemJson.trim() === '') {
        return {
          content: [{
            type: 'text',
            text: `❌ Item '${itemName}' not found in 1Password`
          }]
        };
      }

      const item = JSON.parse(itemJson);
      const reference = `op://${item.vault.name}/${item.title}/${fieldName}`;

      return {
        content: [{
          type: 'text',
          text: `1Password reference: ${reference}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting reference: ${error.message}`
        }]
      };
    }
  }

  async analyzeEnvRequirements(projectPath = 'brx-app') {
    try {
      // Find all environment variable references in the code
      const envVarPattern = 'process\\.env\\.|os\\.environ\\[|getenv|ENV\\[';
      const result = execSync(
        `cd /workspace && grep -r "${envVarPattern}" "${projectPath}" 2>/dev/null | grep -oE "[A-Z_]+_(KEY|TOKEN|SECRET|URL|PASSWORD|USERNAME|ID)" | sort -u`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
      );

      const envVars = result.trim().split('\n').filter(Boolean);
      
      // Search for matching 1Password items
      const matches = {};
      
      for (const envVar of envVars) {
        const searchTerm = envVar
          .replace(/_/g, ' ')
          .replace(/KEY$|TOKEN$|URL$|SECRET$/i, '')
          .trim();
        
        try {
          const searchResult = execSync(
            `op item list --format json | jq -r --arg s "${searchTerm}" '.[] | select(.title | test($s; "i")) | "\\(.vault.name)/\\(.title)"' | head -3`,
            { encoding: 'utf8' }
          );
          
          const items = searchResult.trim().split('\n').filter(Boolean);
          if (items.length > 0) {
            matches[envVar] = items;
          }
        } catch {
          // No matches found
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            required_variables: envVars,
            total: envVars.length,
            matched: Object.keys(matches).length,
            suggestions: matches
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error analyzing environment requirements: ${error.message}`
        }]
      };
    }
  }

  async generateEnvFrom1Password(outputFile = '.env.1password', projectPath = 'brx-app') {
    try {
      // First analyze the project
      const analysis = await this.analyzeEnvRequirements(projectPath);
      const data = JSON.parse(analysis.content[0].text);
      
      // Generate the .env file
      const lines = [
        '# Auto-generated 1Password environment file',
        `# Generated for: ${projectPath}`,
        `# Date: ${new Date().toISOString()}`,
        '',
        '# Found environment variables and suggested 1Password items:',
        ''
      ];

      for (const [envVar, suggestions] of Object.entries(data.suggestions)) {
        lines.push(`# ${envVar}:`);
        suggestions.forEach(s => lines.push(`#   - ${s}`));
        
        // Make best guess at reference
        if (suggestions.length > 0) {
          const [vault, item] = suggestions[0].split('/');
          let field = 'password';
          
          if (envVar.includes('KEY')) field = 'api_key';
          else if (envVar.includes('TOKEN')) field = 'token';
          else if (envVar.includes('URL')) field = 'url';
          else if (envVar.includes('SECRET')) field = 'secret';
          
          lines.push(`${envVar}="op://${vault}/${item}/${field}"`);
        } else {
          lines.push(`# ${envVar}="op://VAULT/ITEM/FIELD" # No matches found`);
        }
        lines.push('');
      }

      // Add unmatched variables
      const unmatched = data.required_variables.filter(v => !data.suggestions[v]);
      if (unmatched.length > 0) {
        lines.push('# Variables without 1Password matches:');
        unmatched.forEach(v => {
          lines.push(`# ${v}="op://VAULT/ITEM/FIELD"`);
        });
      }

      const fullPath = path.join('/workspace', outputFile);
      await fs.writeFile(fullPath, lines.join('\n'));

      return {
        content: [{
          type: 'text',
          text: `✅ Generated ${outputFile} with ${Object.keys(data.suggestions).length} matched variables and ${unmatched.length} unmatched.\n\nFile location: ${fullPath}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error generating env file: ${error.message}`
        }]
      };
    }
  }

  async convertEnvTo1Password(envFile) {
    try {
      const fullPath = path.join('/workspace', envFile);
      const content = await fs.readFile(fullPath, 'utf8');
      const lines = content.split('\n');
      
      const outputLines = [`# Converted from ${envFile} to 1Password references`, ''];
      let convertedCount = 0;

      for (const line of lines) {
        if (line.trim().startsWith('#') || line.trim() === '') {
          outputLines.push(line);
          continue;
        }

        const match = line.match(/^([A-Z_]+)=(.*)$/);
        if (match) {
          const [, varName, varValue] = match;
          
          // Try to find matching 1Password item
          const searchTerm = varName
            .replace(/_/g, ' ')
            .replace(/KEY$|TOKEN$|URL$|SECRET$/i, '')
            .trim();
          
          try {
            const searchResult = execSync(
              `op item list --format json | jq -r --arg s "${searchTerm}" '.[] | select(.title | test($s; "i")) | "\\(.vault.name)/\\(.title)"' | head -1`,
              { encoding: 'utf8' }
            );
            
            if (searchResult.trim()) {
              const [vault, item] = searchResult.trim().split('/');
              let field = 'password';
              
              if (varName.includes('KEY')) field = 'api_key';
              else if (varName.includes('TOKEN')) field = 'token';
              else if (varName.includes('URL')) field = 'url';
              else if (varName.includes('SECRET')) field = 'secret';
              
              outputLines.push(`${varName}="op://${vault}/${item}/${field}"`);
              convertedCount++;
            } else {
              outputLines.push(`# ${line} # No 1Password match found`);
            }
          } catch {
            outputLines.push(`# ${line} # No 1Password match found`);
          }
        } else {
          outputLines.push(line);
        }
      }

      const outputFile = `${envFile}.1password`;
      const outputPath = path.join('/workspace', outputFile);
      await fs.writeFile(outputPath, outputLines.join('\n'));

      return {
        content: [{
          type: 'text',
          text: `✅ Converted ${envFile} to ${outputFile}\n\nConverted ${convertedCount} variables to 1Password references.\n\nTo use: op run --env-file=${outputFile} -- <command>`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error converting env file: ${error.message}`
        }]
      };
    }
  }
}