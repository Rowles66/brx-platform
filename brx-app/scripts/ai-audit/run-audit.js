#!/usr/bin/env node
import AIVisualAuditor from './ai-visual-auditor.js'
import { spawn } from 'child_process'

async function runAudit() {
  console.log('🎬 BRX Performance AI Visual Audit Starting...')
  
  // Check if dev server is running
  console.log('🔍 Checking if development server is running...')
  
  // Start dev server if not running
  const devServer = spawn('npm', ['run', 'dev'], { 
    stdio: 'pipe',
    detached: true
  })
  
  console.log('⏳ Waiting for dev server to start...')
  await new Promise(resolve => setTimeout(resolve, 10000))
  
  try {
    // Initialize and run AI audit
    const auditor = new AIVisualAuditor()
    const report = await auditor.runCompleteAudit()
    
    // Display summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 AI VISUAL AUDIT COMPLETE!')
    console.log('='.repeat(60))
    console.log(`📊 Overall Score: ${report.averageScore.toFixed(1)}/10`)
    console.log(`🧪 Tests Completed: ${report.successfulTests}/${report.totalTests}`)
    console.log(`🚨 Critical Issues: ${report.criticalIssues.length}`)
    console.log(`📄 Full Report: audit-results/reports/ai-audit-report.html`)
    console.log('='.repeat(60))
    
    // Auto-open report
    if (process.platform === 'darwin') {
      spawn('open', ['audit-results/reports/ai-audit-report.html'])
    }
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message)
    process.exit(1)
  } finally {
    // Clean up dev server
    devServer.kill()
  }
}

runAudit()

