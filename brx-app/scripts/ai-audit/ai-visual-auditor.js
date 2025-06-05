import { chromium } from 'playwright'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

class AIVisualAuditor {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    this.results = []
    this.browser = null
    this.config = JSON.parse(fs.readFileSync('audit-config/pages-config.json'))
  }

  async initialize() {
    console.log('🚀 Initializing AI Visual Auditor...')
    this.browser = await chromium.launch({ 
      headless: false, // Set to true for faster execution
      slowMo: 1000 // Slow down for demo purposes
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
      
      // Wait for successful login
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
      }
      
      // Wait for additional loading
      await page.waitForTimeout(this.config.auditSettings.screenshotDelay)
      
      const screenshot = await page.screenshot({ 
        fullPage: this.config.auditSettings.fullPage,
        type: 'png'
      })
      
      // Save screenshot
      const filename = `audit-results/screenshots/${name.toLowerCase().replace(/\s+/g, '-')}.png`
      fs.writeFileSync(filename, screenshot)
      
      console.log(`✅ Screenshot saved: ${filename}`)
      return { screenshot, filename }
    } catch (error) {
      console.error(`❌ Failed to capture ${name}:`, error.message)
      return null
    }
  }

  async analyzeWithAI(localScreenshot, liveScreenshot, pageName) {
    console.log(`🤖 AI analyzing: ${pageName}`)
    
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.auditSettings.aiModel,
        messages: [
          {
            role: "system",
            content: `You are an expert UI/UX auditor specializing in fitness applications. Analyze screenshots for accuracy, usability, and visual consistency. Provide detailed, actionable feedback in JSON format.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Compare these ${pageName} screenshots from the BRX Performance fitness app. 
IMAGE 1: Recreation/replica version
IMAGE 2: Original live production version
Analyze and provide a JSON response with:
{
  "overallScore": number (1-10),
  "layoutAccuracy": number (1-10),
  "visualConsistency": number (1-10), 
  "componentCompleteness": number (1-10),
  "contentAccuracy": number (1-10),
  "criticalIssues": ["specific issue 1", "specific issue 2"],
  "minorIssues": ["minor issue 1", "minor issue 2"],
  "workingWell": ["what works well 1", "what works well 2"],
  "recommendations": ["fix recommendation 1", "fix recommendation 2"],
  "detailedAnalysis": "paragraph of detailed analysis",
  "priorityLevel": "critical|high|medium|low"
}
Focus on fitness app specific elements: navigation, exercise cards, workout displays, progress tracking, user dashboards.`
              },
              {
                type: "image_url",
                image_url: { url: `data:image/png;base64,${localScreenshot.toString('base64')}` }
              },
              {
                type: "image_url", 
                image_url: { url: `data:image/png;base64,${liveScreenshot.toString('base64')}` }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      })

      const analysis = JSON.parse(response.choices[0].message.content)
      console.log(`✅ AI analysis complete for ${pageName}: ${analysis.overallScore}/10`)
      return analysis
      
    } catch (error) {
      console.error(`❌ AI analysis failed for ${pageName}:`, error.message)
      return {
        overallScore: 0,
        criticalIssues: [`AI analysis failed: ${error.message}`],
        error: true
      }
    }
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

      // AI analysis
      const analysis = await this.analyzeWithAI(
        localCapture.screenshot, 
        liveCapture.screenshot, 
        pageName
      )

      // Store results
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
    console.log('🎬 Starting Complete AI Visual Audit...')
    await this.initialize()

    // Audit each page across all viewports
    for (const page of this.config.pages) {
      for (const viewport of this.config.viewports) {
        await this.auditPage(page, viewport)
      }
    }

    // Generate comprehensive report
    const report = await this.generateReport()
    await this.browser.close()
    
    console.log('\n🎉 AI Visual Audit Complete!')
    console.log(`📊 Overall Score: ${report.averageScore.toFixed(1)}/10`)
    console.log(`🚨 Critical Issues: ${report.criticalIssues.length}`)
    console.log(`📋 Total Pages Tested: ${report.totalTests}`)
    console.log(`📄 Full report: audit-results/reports/ai-audit-report.html`)

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

    // Save JSON report
    fs.writeFileSync('audit-results/reports/ai-audit-report.json', JSON.stringify(report, null, 2))
    
    // Generate HTML report
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
      <title>BRX Performance AI Visual Audit Report</title>
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
        .screenshots { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .screenshot-container { text-align: center; }
        .screenshot-container img { max-width: 100%; border: 1px solid #d1d5db; border-radius: 4px; }
        .recommendations { background: #eff6ff; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .working-well { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🤖 BRX Performance AI Visual Audit Report</h1>
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
            
            <div class="screenshots">
              <div class="screenshot-container">
                <h4>Your App (Recreation)</h4>
                <img src="../${result.screenshots.local}" alt="Local screenshot">
              </div>
              <div class="screenshot-container">
                <h4>Live BRX Site (Original)</h4>
                <img src="../${result.screenshots.live}" alt="Live screenshot">
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

            <p><strong>Detailed Analysis:</strong> ${result.analysis.detailedAnalysis || 'No detailed analysis available'}</p>
          </div>
        `).join('')}
      </div>
    </body>
    </html>`

    fs.writeFileSync('audit-results/reports/ai-audit-report.html', html)
  }
}

export default AIVisualAuditor

