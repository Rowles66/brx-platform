import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

class PlaywrightVisualAuditor {
  constructor() {
    this.results = []
    this.browser = null
    this.config = JSON.parse(fs.readFileSync('audit-config/pages-config.json'))
  }

  async initialize() {
    console.log('🚀 Initializing Playwright Visual Auditor...')
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 500
    })
    console.log('✅ Browser initialized')
  }

  async authenticateToLiveSite(page) {
    console.log('🔐 Authenticating to live BRX site...')
    try {
      await page.goto('https://online.brxperformance.com/login')
      await page.waitForSelector('#username', { timeout: 10000 })
      
      await page.fill('#username', process.env.BRX_USERNAME)
      await page.fill('#password', process.env.BRX_PASSWORD)
      await page.click('button[type="submit"]')
      
      await page.waitForURL('**/dashboard', { timeout: 15000 })
      console.log('✅ Successfully authenticated to live site')
      return true
    } catch (error) {
      console.error('❌ Authentication failed:', error.message)
      return false
    }
  }

  async captureScreenshot(page, url, waitFor, name) {
    console.log(`📸 Capturing screenshot: ${name} at ${url}`)
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' })
      
      if (waitFor) {
        await page.waitForSelector(waitFor, { timeout: 10000 })
      } else {
        // Just wait for the page to be loaded if no specific selector
        await page.waitForLoadState('domcontentloaded')
      }
      
      await page.waitForTimeout(this.config.auditSettings.screenshotDelay)
      
      const screenshot = await page.screenshot({ 
        fullPage: this.config.auditSettings.fullPage,
        type: 'png'
      })
      
      const filename = `audit-results/screenshots/${name.toLowerCase().replace(/\s+/g, '-')}.png`
      fs.writeFileSync(filename, screenshot)
      
      console.log(`✅ Screenshot saved: ${filename}`)
      return { screenshot, filename }
    } catch (error) {
      console.error(`❌ Failed to capture ${name}:`, error.message)
      return null
    }
  }

  async compareImages(localScreenshot, liveScreenshot, pageName) {
    console.log(`🔍 Comparing images for: ${pageName}`)
    
    try {
      const img1 = PNG.sync.read(localScreenshot)
      const img2 = PNG.sync.read(liveScreenshot)
      
      const { width, height } = img1
      const diff = new PNG({ width, height })
      
      // Perform pixel comparison
      const numDiffPixels = pixelmatch(
        img1.data, 
        img2.data, 
        diff.data, 
        width, 
        height, 
        {
          threshold: this.config.auditSettings.diffThreshold,
          alpha: 0.1,
          diff: true
        }
      )
      
      // Save diff image
      const diffFilename = `audit-results/diffs/${pageName.toLowerCase().replace(/\s+/g, '-')}-diff.png`
      fs.writeFileSync(diffFilename, PNG.sync.write(diff))
      
      const totalPixels = width * height
      const diffPercentage = (numDiffPixels / totalPixels) * 100
      
      // Score based on visual similarity
      const visualScore = Math.max(0, 10 - (diffPercentage / 2))
      
      const analysis = {
        overallScore: Math.round(visualScore * 10) / 10,
        diffPixels: numDiffPixels,
        totalPixels,
        diffPercentage: Math.round(diffPercentage * 100) / 100,
        visualSimilarity: Math.round((100 - diffPercentage) * 100) / 100,
        diffImagePath: diffFilename,
        criticalIssues: this.generateIssues(diffPercentage, 'critical'),
        minorIssues: this.generateIssues(diffPercentage, 'minor'),
        workingWell: this.generatePositives(diffPercentage),
        recommendations: this.generateRecommendations(diffPercentage),
        detailedAnalysis: this.generateDetailedAnalysis(diffPercentage, numDiffPixels, totalPixels),
        priorityLevel: this.getPriorityLevel(diffPercentage)
      }
      
      console.log(`✅ Image comparison complete: ${analysis.overallScore}/10 (${analysis.diffPercentage}% different)`)
      return analysis
      
    } catch (error) {
      console.error(`❌ Image comparison failed:`, error.message)
      return {
        overallScore: 0,
        criticalIssues: [`Image comparison failed: ${error.message}`],
        error: true
      }
    }
  }

  generateIssues(diffPercentage, severity) {
    const issues = []
    
    if (severity === 'critical' && diffPercentage > 15) {
      issues.push('Significant visual differences detected')
      if (diffPercentage > 30) {
        issues.push('Major layout inconsistencies found')
      }
      if (diffPercentage > 50) {
        issues.push('Fundamental structural differences')
      }
    }
    
    if (severity === 'minor' && diffPercentage > 5 && diffPercentage <= 15) {
      issues.push('Minor visual inconsistencies')
      issues.push('Small spacing or color differences')
    }
    
    return issues
  }

  generatePositives(diffPercentage) {
    const positives = []
    
    if (diffPercentage < 5) {
      positives.push('Excellent visual fidelity')
      positives.push('Layout structure matches well')
    }
    if (diffPercentage < 2) {
      positives.push('Near pixel-perfect recreation')
    }
    if (diffPercentage < 10) {
      positives.push('Overall visual consistency maintained')
    }
    
    return positives
  }

  generateRecommendations(diffPercentage) {
    const recommendations = []
    
    if (diffPercentage > 15) {
      recommendations.push('Review layout structure and positioning')
      recommendations.push('Check component styling and dimensions')
    }
    if (diffPercentage > 30) {
      recommendations.push('Investigate fundamental layout differences')
      recommendations.push('Verify responsive design implementation')
    }
    if (diffPercentage > 5 && diffPercentage <= 15) {
      recommendations.push('Fine-tune spacing and typography')
      recommendations.push('Adjust color values and styling details')
    }
    
    return recommendations
  }

  generateDetailedAnalysis(diffPercentage, numDiffPixels, totalPixels) {
    return `Visual comparison analysis shows ${diffPercentage.toFixed(2)}% pixel difference (${numDiffPixels.toLocaleString()} of ${totalPixels.toLocaleString()} pixels). ${
      diffPercentage < 2 ? 'Excellent recreation with minimal differences.' :
      diffPercentage < 5 ? 'Very good recreation with minor variations.' :
      diffPercentage < 15 ? 'Good recreation with some noticeable differences.' :
      diffPercentage < 30 ? 'Moderate differences that may need attention.' :
      'Significant differences requiring review and adjustment.'
    }`
  }

  getPriorityLevel(diffPercentage) {
    if (diffPercentage > 30) return 'critical'
    if (diffPercentage > 15) return 'high'
    if (diffPercentage > 5) return 'medium'
    return 'low'
  }

  async auditPage(pageConfig, viewport) {
    const { name, local, live, waitFor, priority } = pageConfig
    const pageName = `${name} (${viewport.name})`
    
    console.log(`\n🎯 Auditing: ${pageName}`)
    
    const context = await this.browser.newContext({ 
      viewport: { width: viewport.width, height: viewport.height }
    })
    
    try {
      // Capture local app screenshot
      const localPage = await context.newPage()
      const localCapture = await this.captureScreenshot(localPage, local, waitFor, `${name}-local-${viewport.name}`)
      
      if (!localCapture) {
        throw new Error('Failed to capture local screenshot')
      }

      // Capture live site screenshot  
      const livePage = await context.newPage()
      const authSuccess = await this.authenticateToLiveSite(livePage)
      
      if (!authSuccess) {
        throw new Error('Failed to authenticate to live site')
      }
      
      const liveCapture = await this.captureScreenshot(livePage, live, waitFor, `${name}-live-${viewport.name}`)
      
      if (!liveCapture) {
        throw new Error('Failed to capture live screenshot')
      }

      // Pixel-level comparison
      const analysis = await this.compareImages(
        localCapture.screenshot, 
        liveCapture.screenshot, 
        pageName
      )

      const result = {
        page: name,
        viewport: viewport.name,
        priority,
        analysis,
        screenshots: {
          local: localCapture.filename,
          live: liveCapture.filename
        },
        timestamp: new Date().toISOString(),
        urls: { local, live }
      }

      this.results.push(result)
      console.log(`✅ ${pageName} audit complete - Score: ${analysis.overallScore}/10`)

    } catch (error) {
      console.error(`❌ Failed to audit ${pageName}:`, error.message)
      this.results.push({
        page: name,
        viewport: viewport.name,
        priority,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      await context.close()
    }
  }

  async runCompleteAudit() {
    console.log('🎬 Starting Complete Playwright Visual Audit...')
    await this.initialize()

    for (const page of this.config.pages) {
      for (const viewport of this.config.viewports) {
        await this.auditPage(page, viewport)
      }
    }

    const report = await this.generateReport()
    await this.browser.close()
    
    console.log('\n🎉 Playwright Visual Audit Complete!')
    console.log(`📊 Overall Score: ${report.averageScore.toFixed(1)}/10`)
    console.log(`🚨 Critical Issues: ${report.criticalIssues.length}`)
    console.log(`📋 Total Pages Tested: ${report.totalTests}`)
    console.log(`📄 Full report: audit-results/reports/playwright-audit-report.html`)

    return report
  }

  async generateReport() {
    const validResults = this.results.filter(r => !r.error)
    const averageScore = validResults.reduce((sum, r) => sum + r.analysis.overallScore, 0) / validResults.length || 0
    
    const criticalIssues = validResults.flatMap(r => 
      r.analysis.criticalIssues?.map(issue => ({
        page: r.page,
        viewport: r.viewport,
        issue,
        priority: r.priority
      })) || []
    )

    const report = {
      auditDate: new Date().toISOString(),
      totalTests: this.results.length,
      successfulTests: validResults.length,
      averageScore,
      criticalIssues,
      pageResults: this.results,
      summary: {
        excellent: validResults.filter(r => r.analysis.overallScore >= 8).length,
        good: validResults.filter(r => r.analysis.overallScore >= 6 && r.analysis.overallScore < 8).length,
        needsWork: validResults.filter(r => r.analysis.overallScore < 6).length
      }
    }

    fs.writeFileSync('audit-results/reports/playwright-audit-report.json', JSON.stringify(report, null, 2))
    await this.generateHTMLReport(report)
    
    return report
  }

  async generateHTMLReport(report) {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BRX Performance Playwright Visual Audit Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; }
        .score { font-size: 3em; font-weight: bold; color: ${report.averageScore >= 8 ? '#10b981' : report.averageScore >= 6 ? '#f59e0b' : '#ef4444'}; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .summary-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
        .critical-issue { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 10px 0; }
        .page-result { border: 1px solid #e5e7eb; margin: 20px 0; padding: 20px; border-radius: 8px; }
        .score-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; color: white; font-weight: bold; }
        .score-excellent { background: #10b981; }
        .score-good { background: #f59e0b; }
        .score-poor { background: #ef4444; }
        .screenshots { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 20px 0; }
        .screenshot-container { text-align: center; }
        .screenshot-container img { max-width: 100%; border: 1px solid #d1d5db; border-radius: 4px; }
        .diff-container { text-align: center; background: #fff7ed; padding: 10px; border-radius: 8px; }
        .recommendations { background: #eff6ff; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .working-well { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .stats { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎭 BRX Performance Playwright Visual Audit Report</h1>
          <div class="score">${report.averageScore.toFixed(1)}/10</div>
          <p>Generated on ${new Date(report.auditDate).toLocaleString()}</p>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Tests</h3>
            <div style="font-size: 2em; font-weight: bold;">${report.totalTests}</div>
          </div>
          <div class="summary-card">
            <h3>Critical Issues</h3>
            <div style="font-size: 2em; font-weight: bold; color: #ef4444;">${report.criticalIssues.length}</div>
          </div>
          <div class="summary-card">
            <h3>Excellent Pages</h3>
            <div style="font-size: 2em; font-weight: bold; color: #10b981;">${report.summary.excellent}</div>
          </div>
          <div class="summary-card">
            <h3>Success Rate</h3>
            <div style="font-size: 2em; font-weight: bold;">${((report.successfulTests / report.totalTests) * 100).toFixed(0)}%</div>
          </div>
        </div>

        <h2>🚨 Critical Issues Requiring Immediate Attention</h2>
        ${report.criticalIssues.map(issue => `
          <div class="critical-issue">
            <strong>${issue.page} (${issue.viewport})</strong><br>
            ${issue.issue}
          </div>
        `).join('')}

        <h2>📊 Detailed Page Results</h2>
        ${report.pageResults.filter(r => !r.error).map(result => `
          <div class="page-result">
            <h3>
              ${result.page} - ${result.viewport}
              <span class="score-badge ${result.analysis.overallScore >= 8 ? 'score-excellent' : result.analysis.overallScore >= 6 ? 'score-good' : 'score-poor'}">
                ${result.analysis.overallScore}/10
              </span>
            </h3>
            
            <div class="stats">
              <strong>Visual Similarity:</strong> ${result.analysis.visualSimilarity}% • 
              <strong>Different Pixels:</strong> ${result.analysis.diffPixels?.toLocaleString()} (${result.analysis.diffPercentage}%)
            </div>
            
            <div class="screenshots">
              <div class="screenshot-container">
                <h4>Your App (Recreation)</h4>
                <img src="../${result.screenshots.local}" alt="Local screenshot">
              </div>
              <div class="screenshot-container">
                <h4>Live BRX Site (Original)</h4>
                <img src="../${result.screenshots.live}" alt="Live screenshot">
              </div>
              <div class="diff-container">
                <h4>🔍 Visual Differences</h4>
                <img src="../${result.analysis.diffImagePath}" alt="Difference visualization">
                <p><small>Red areas show pixel differences</small></p>
              </div>
            </div>

            ${result.analysis.workingWell?.length ? `
              <div class="working-well">
                <h4>✅ Working Well:</h4>
                <ul>${result.analysis.workingWell.map(item => `<li>${item}</li>`).join('')}</ul>
              </div>
            ` : ''}

            ${result.analysis.recommendations?.length ? `
              <div class="recommendations">
                <h4>💡 Recommendations:</h4>
                <ul>${result.analysis.recommendations.map(item => `<li>${item}</li>`).join('')}</ul>
              </div>
            ` : ''}

            <p><strong>Analysis:</strong> ${result.analysis.detailedAnalysis}</p>
          </div>
        `).join('')}
      </div>
    </body>
    </html>`

    fs.writeFileSync('audit-results/reports/playwright-audit-report.html', html)
  }
}

export default PlaywrightVisualAuditor

