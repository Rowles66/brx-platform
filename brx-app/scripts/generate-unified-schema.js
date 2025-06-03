#!/usr/bin/env node

/**
 * Unified Prisma Schema Generator
 * 
 * This script analyzes:
 * 1. Scraped UI form fields from React components
 * 2. tRPC API router schemas and Zod validations 
 * 3. Existing Prisma models
 * 
 * It then generates an enhanced Prisma schema that unifies all data structures
 * found across the UI forms and API definitions.
 */

const fs = require('fs');
const path = require('path');

// Paths
const SCRAPED_COMPONENTS_DIR = './src/components/scraped';
const API_ROUTERS_DIR = './src/server/api/routers';
const PRISMA_SCHEMA_PATH = './prisma/schema.prisma';
const OUTPUT_SCHEMA_PATH = './prisma/unified-schema.prisma';

// Data structure to collect all field information
const unifiedSchema = {
  models: new Map(),
  relations: [],
  enums: new Map()
};

/**
 * Extract form fields from React component files
 */
function analyzeFormComponents() {
  console.log('🔍 Analyzing scraped UI form components...');
  
  const componentFiles = fs.readdirSync(SCRAPED_COMPONENTS_DIR)
    .filter(file => file.endsWith('.tsx') && file.includes('Form'));
  
  componentFiles.forEach(file => {
    const filePath = path.join(SCRAPED_COMPONENTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`  📄 Analyzing ${file}...`);
    
    // Extract form data interfaces
    const interfaceMatches = content.match(/interface\s+(\w+FormData)\s*{([^}]+)}/g);
    
    if (interfaceMatches) {
      interfaceMatches.forEach(match => {
        const nameMatch = match.match(/interface\s+(\w+)FormData/);
        const fieldsMatch = match.match(/{([^}]+)}/);
        
        if (nameMatch && fieldsMatch) {
          const modelName = nameMatch[1].replace('FormData', '');
          const fieldsText = fieldsMatch[1];
          
          const fields = new Map();
          
          // Parse individual fields
          const fieldLines = fieldsText.split(';').filter(line => line.trim());
          fieldLines.forEach(line => {
            const fieldMatch = line.trim().match(/(\w+)\s*:\s*([^;]+)/);
            if (fieldMatch) {
              const [, fieldName, fieldType] = fieldMatch;
              fields.set(fieldName, {
                type: mapTypeScriptToPrismaType(fieldType.trim()),
                required: !fieldType.includes('?'),
                source: 'ui-form'
              });
            }
          });
          
          if (fields.size > 0) {
            unifiedSchema.models.set(modelName, fields);
            console.log(`    ✅ Found ${modelName} model with ${fields.size} fields`);
          }
        }
      });
    }
    
    // Extract FormField usage patterns
    const formFieldMatches = content.match(/<FormField[^>]*name="([^"]+)"[^>]*type="([^"]+)"/g);
    if (formFieldMatches) {
      formFieldMatches.forEach(match => {
        const nameMatch = match.match(/name="([^"]+)"/);
        const typeMatch = match.match(/type="([^"]+)"/);
        
        if (nameMatch && typeMatch) {
          const fieldName = nameMatch[1];
          const inputType = typeMatch[1];
          
          // Add to a generic User model if not already categorized
          if (!Array.from(unifiedSchema.models.values()).some(model => model.has(fieldName))) {
            if (!unifiedSchema.models.has('User')) {
              unifiedSchema.models.set('User', new Map());
            }
            
            unifiedSchema.models.get('User').set(fieldName, {
              type: mapInputTypeToPrismaType(inputType),
              required: match.includes('required'),
              source: 'ui-form-field'
            });
          }
        }
      });
    }
  });
}

/**
 * Extract schema information from tRPC API routers
 */
function analyzeApiRouters() {
  console.log('🔍 Analyzing tRPC API router schemas...');
  
  const routerFiles = fs.readdirSync(API_ROUTERS_DIR)
    .filter(file => file.endsWith('.ts'));
  
  routerFiles.forEach(file => {
    const filePath = path.join(API_ROUTERS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`  📄 Analyzing ${file}...`);
    
    // Extract Zod input schemas
    const zodSchemaMatches = content.match(/\.input\(z\.object\(\{([^}]+)\}\)\)/g);
    
    if (zodSchemaMatches) {
      zodSchemaMatches.forEach(match => {
        const fieldsMatch = match.match(/\{([^}]+)\}/);
        if (fieldsMatch) {
          const fieldsText = fieldsMatch[1];
          
          // Determine model name from context (basic heuristic)
          const modelName = file.replace('.ts', '').replace('Router', '').replace('s', '');
          const capitalizedModel = modelName.charAt(0).toUpperCase() + modelName.slice(1);
          
          if (!unifiedSchema.models.has(capitalizedModel)) {
            unifiedSchema.models.set(capitalizedModel, new Map());
          }
          
          const model = unifiedSchema.models.get(capitalizedModel);
          
          // Parse Zod field definitions
          const fieldLines = fieldsText.split(',').filter(line => line.trim());
          fieldLines.forEach(line => {
            const fieldMatch = line.trim().match(/(\w+)\s*:\s*z\.([^,]+)/);
            if (fieldMatch) {
              const [, fieldName, zodType] = fieldMatch;
              
              const existing = model.get(fieldName);
              const newField = {
                type: mapZodToPrismaType(zodType.trim()),
                required: !zodType.includes('optional'),
                source: existing ? `${existing.source}, api-schema` : 'api-schema'
              };
              
              model.set(fieldName, newField);
            }
          });
          
          console.log(`    ✅ Enhanced ${capitalizedModel} model from API schema`);
        }
      });
    }
    
    // Look for static data structures that might indicate model fields
    const staticDataMatches = content.match(/return\s*\[([^\]]+)\]/g);
    if (staticDataMatches) {
      staticDataMatches.forEach(match => {
        const objectMatches = match.match(/\{([^}]+)\}/g);
        if (objectMatches && objectMatches.length > 0) {
          // Use first object as template
          const firstObject = objectMatches[0];
          const fieldMatches = firstObject.match(/(\w+)\s*:\s*[^,}]+/g);
          
          if (fieldMatches) {
            const modelName = file.replace('.ts', '').replace('Router', '').replace('s', '');
            const capitalizedModel = modelName.charAt(0).toUpperCase() + modelName.slice(1);
            
            if (!unifiedSchema.models.has(capitalizedModel)) {
              unifiedSchema.models.set(capitalizedModel, new Map());
            }
            
            const model = unifiedSchema.models.get(capitalizedModel);
            
            fieldMatches.forEach(fieldMatch => {
              const nameMatch = fieldMatch.match(/(\w+)\s*:/);
              if (nameMatch && !model.has(nameMatch[1])) {
                model.set(nameMatch[1], {
                  type: inferPrismaTypeFromValue(fieldMatch),
                  required: true,
                  source: 'api-static-data'
                });
              }
            });
          }
        }
      });
    }
  });
}

/**
 * Read existing Prisma schema to preserve existing models
 */
function analyzeExistingSchema() {
  console.log('🔍 Analyzing existing Prisma schema...');
  
  if (!fs.existsSync(PRISMA_SCHEMA_PATH)) {
    console.log('  ⚠️ No existing schema found');
    return;
  }
  
  const content = fs.readFileSync(PRISMA_SCHEMA_PATH, 'utf8');
  
  // Extract existing models
  const modelMatches = content.match(/model\s+(\w+)\s*\{([^}]+)\}/g);
  
  if (modelMatches) {
    modelMatches.forEach(match => {
      const nameMatch = match.match(/model\s+(\w+)/);
      const fieldsMatch = match.match(/\{([^}]+)\}/);
      
      if (nameMatch && fieldsMatch) {
        const modelName = nameMatch[1];
        const fieldsText = fieldsMatch[1];
        
        console.log(`  📄 Found existing model: ${modelName}`);
        
        if (!unifiedSchema.models.has(modelName)) {
          unifiedSchema.models.set(modelName, new Map());
        }
        
        const model = unifiedSchema.models.get(modelName);
        
        // Parse existing fields
        const fieldLines = fieldsText.split('\n').filter(line => {
          const trimmed = line.trim();
          return trimmed && !trimmed.startsWith('@@') && !trimmed.startsWith('//');
        });
        
        fieldLines.forEach(line => {
          const fieldMatch = line.trim().match(/(\w+)\s+(\w+[\[\]?]*)(\s+[^\s]+)*/);
          if (fieldMatch) {
            const [, fieldName, fieldType] = fieldMatch;
            
            const existing = model.get(fieldName);
            model.set(fieldName, {
              type: fieldType,
              required: !line.includes('?'),
              source: existing ? `${existing.source}, existing-schema` : 'existing-schema',
              attributes: extractAttributes(line)
            });
          }
        });
      }
    });
  }
}

/**
 * Generate enhanced Prisma schema
 */
function generateUnifiedSchema() {
  console.log('🏗️ Generating unified Prisma schema...');
  
  let schema = `// Unified Prisma Schema
// Generated by: scripts/generate-unified-schema.js
// Sources: UI Forms, API Schemas, Existing Schema
// Generated at: ${new Date().toISOString()}

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

`;

  // Add models
  unifiedSchema.models.forEach((fields, modelName) => {
    schema += `model ${modelName} {
`;
    
    // Ensure id field exists
    if (!fields.has('id')) {
      fields.set('id', {
        type: 'String',
        required: true,
        source: 'auto-generated',
        attributes: '@id @default(cuid())'
      });
    }
    
    // Ensure timestamp fields exist
    if (!fields.has('createdAt')) {
      fields.set('createdAt', {
        type: 'DateTime',
        required: true,
        source: 'auto-generated',
        attributes: '@default(now())'
      });
    }
    
    if (!fields.has('updatedAt')) {
      fields.set('updatedAt', {
        type: 'DateTime',
        required: true,
        source: 'auto-generated',
        attributes: '@updatedAt'
      });
    }
    
    // Add fields
    fields.forEach((field, fieldName) => {
      const optional = field.required ? '' : '?';
      const attributes = field.attributes || '';
      const comment = field.source ? ` // Source: ${field.source}` : '';
      
      schema += `  ${fieldName.padEnd(12)} ${field.type}${optional}${attributes ? ' ' + attributes : ''}${comment}\n`;
    });
    
    // Add table mapping
    const tableName = modelName.toLowerCase() + 's';
    schema += `\n  @@map("${tableName}")\n`;
    schema += `}\n\n`;
    
    console.log(`  ✅ Generated ${modelName} model with ${fields.size} fields`);
  });
  
  // Add potential relations (basic inference)
  schema += addInferredRelations();
  
  return schema;
}

/**
 * Add inferred relations between models
 */
function addInferredRelations() {
  let relations = '';
  
  // Look for fields that might be foreign keys
  unifiedSchema.models.forEach((fields, modelName) => {
    fields.forEach((field, fieldName) => {
      if (fieldName.endsWith('Id') && field.type === 'String') {
        const relatedModel = fieldName.replace('Id', '');
        const capitalizedRelated = relatedModel.charAt(0).toUpperCase() + relatedModel.slice(1);
        
        if (unifiedSchema.models.has(capitalizedRelated)) {
          // Add relation comment
          relations += `// Potential relation: ${modelName}.${fieldName} -> ${capitalizedRelated}.id\n`;
        }
      }
    });
  });
  
  return relations;
}

/**
 * Type mapping functions
 */
function mapTypeScriptToPrismaType(tsType) {
  const type = tsType.replace('?', '').trim();
  
  switch (type) {
    case 'string': return 'String';
    case 'number': return 'Int';
    case 'boolean': return 'Boolean';
    case 'Date': return 'DateTime';
    default: return 'String';
  }
}

function mapInputTypeToPrismaType(inputType) {
  switch (inputType) {
    case 'email':
    case 'text':
    case 'password': return 'String';
    case 'number': return 'Int';
    case 'checkbox': return 'Boolean';
    case 'date': return 'DateTime';
    default: return 'String';
  }
}

function mapZodToPrismaType(zodType) {
  if (zodType.includes('string')) return 'String';
  if (zodType.includes('number')) return 'Int';
  if (zodType.includes('boolean')) return 'Boolean';
  if (zodType.includes('date')) return 'DateTime';
  return 'String';
}

function inferPrismaTypeFromValue(valueString) {
  if (valueString.includes("'") || valueString.includes('"')) return 'String';
  if (valueString.includes('new Date')) return 'DateTime';
  if (valueString.match(/\d+/)) return 'Int';
  if (valueString.includes('true') || valueString.includes('false')) return 'Boolean';
  return 'String';
}

function extractAttributes(line) {
  const attrMatch = line.match(/@[^\s]+(?:\([^)]*\))?/g);
  return attrMatch ? attrMatch.join(' ') : '';
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting unified Prisma schema generation...');
  console.log('='.repeat(60));
  
  try {
    // Analyze all sources
    analyzeExistingSchema();
    analyzeFormComponents();
    analyzeApiRouters();
    
    // Generate unified schema
    const unifiedSchemaContent = generateUnifiedSchema();
    
    // Write to file
    fs.writeFileSync(OUTPUT_SCHEMA_PATH, unifiedSchemaContent);
    
    console.log('='.repeat(60));
    console.log(`✅ Unified schema generated successfully!`);
    console.log(`📄 Output: ${OUTPUT_SCHEMA_PATH}`);
    console.log(`📊 Models found: ${unifiedSchema.models.size}`);
    
    // Show summary
    console.log('\n📋 Summary:');
    unifiedSchema.models.forEach((fields, modelName) => {
      console.log(`  ${modelName}: ${fields.size} fields`);
    });
    
    console.log('\n🔄 Next steps:');
    console.log('  1. Review the generated schema');
    console.log('  2. Replace prisma/schema.prisma if satisfied');
    console.log('  3. Run: npx prisma db push --preview-feature');
    
  } catch (error) {
    console.error('❌ Error generating schema:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, unifiedSchema };

