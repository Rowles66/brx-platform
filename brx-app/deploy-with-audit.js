#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel Deployment with Visual Audit Integration...');

async function deployWithAudit() {
  try {
    // Step 1: Build and Deploy to Vercel
    console.log('\n📦 Building and deploying to Vercel...');
    const deployOutput = execSync('vercel --prod --yes', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log(deployOutput);
    
    // Extract deployment URL from output
    const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
    if (!urlMatch) {
      throw new Error('Could not extract deployment URL from Vercel output');
    }
    
    const deploymentUrl = urlMatch[0];
    console.log(`✅ Deployment successful: ${deploymentUrl}`);
    
    // Step 2: Wait for deployment to be ready
    console.log('\n⏳ Waiting for deployment to be ready...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Step 3: Update visual audit script with new URL
    console.log('\n🔄 Updating visual audit configuration...');
    updateAuditScript(deploymentUrl);
    
    // Step 4: Run visual audit
    console.log('\n📸 Running visual audit on deployed application...');
    const auditOutput = execSync('node vercel-visual-audit.js', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log(auditOutput);
    
    // Step 5: Generate deployment report
    console.log('\n📊 Generating deployment report...');
    const report = {
      deployment: {
        url: deploymentUrl,
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      audit: {
        completed: true,
        screenshotsPath: 'audit-results/screenshots/',
        reportPath: 'audit-results/vercel-audit-report.json'
      },
      apis: {
        visualAudit: `${deploymentUrl}/api/visual-audit?action=audit`,
        screenshot: `${deploymentUrl}/api/visual-audit?action=screenshot&page=dashboard`
      },
      pages: {
        dashboard: `${deploymentUrl}/dashboard-replica`,
        exercises: `${deploymentUrl}/exercises-replica`
      }
    };
    
    fs.writeFileSync(
      'audit-results/deployment-report.json', 
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n🎉 Deployment and Visual Audit Complete!');
    console.log('═══════════════════════════════════════════');
    console.log(`📱 Live Application: ${deploymentUrl}`);
    console.log(`🎯 Dashboard Replica: ${deploymentUrl}/dashboard-replica`);
    console.log(`🔬 Visual Audit API: ${deploymentUrl}/api/visual-audit?action=audit`);
    console.log(`📊 Deployment Report: audit-results/deployment-report.json`);
    console.log('═══════════════════════════════════════════');
    
    return report;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

function updateAuditScript(newUrl) {
  const auditScriptPath = 'vercel-visual-audit.js';
  let content = fs.readFileSync(auditScriptPath, 'utf8');
  
  // Update the VERCEL_URL constant
  content = content.replace(
    /const VERCEL_URL = '[^']*';/,
    `const VERCEL_URL = '${newUrl}';`
  );
  
  fs.writeFileSync(auditScriptPath, content);
  console.log(`✅ Updated audit script with new URL: ${newUrl}`);
}

if (require.main === module) {
  deployWithAudit();
}

module.exports = { deployWithAudit };

