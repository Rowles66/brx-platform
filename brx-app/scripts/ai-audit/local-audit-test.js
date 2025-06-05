#!/usr/bin/env node
import { chromium } from 'playwright'
import fs from 'fs'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

async function runLocalAuditTest() {
  console.log('🎭 Local Visual Audit Test Starting...')
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 })
  
  try {
    // Test 1: Compare home page vs dashboard (for demonstration)
    console.log('\n🎯 Test 1: Comparing Home Page vs Dashboard')
    
    const context1 = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
    
    // Capture home page
    const page1 = await context1.newPage()
    await page1.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
    await page1.waitForLoadState('domcontentloaded')
    await page1.waitForTimeout(3000)
    
    const homeScreenshot = await page1.screenshot({ fullPage: true, type: 'png' })
    fs.writeFileSync('audit-results/screenshots/local-test-home.png', homeScreenshot)
    console.log('✅ Home page screenshot captured')
    
    // Capture dashboard page
    const page2 = await context1.newPage()
    await page2.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' })
    await page2.waitForLoadState('domcontentloaded')
    await page2.waitForTimeout(3000)
    
    const dashboardScreenshot = await page2.screenshot({ fullPage: true, type: 'png' })
    fs.writeFileSync('audit-results/screenshots/local-test-dashboard.png', dashboardScreenshot)
    console.log('✅ Dashboard screenshot captured')
    
    await context1.close()
    
    // Compare the images
    console.log('🔍 Performing pixel comparison...')
    const comparison = await compareImages(homeScreenshot, dashboardScreenshot, 'Home vs Dashboard')
    
    console.log(`\n📊 Comparison Results:`)
    console.log(`Visual Similarity: ${comparison.visualSimilarity}%`)
    console.log(`Different Pixels: ${comparison.diffPixels.toLocaleString()} (${comparison.diffPercentage}%)`)
    console.log(`Overall Score: ${comparison.overallScore}/10`)
    
    // Test 2: Compare same page at different times (should be very similar)
    console.log('\n🎯 Test 2: Comparing Dashboard vs Dashboard (consistency test)')
    
    const context2 = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
    
    // First dashboard capture
    const page3 = await context2.newPage()
    await page3.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' })
    await page3.waitForLoadState('domcontentloaded')
    await page3.waitForTimeout(3000)
    
    const dashboard1Screenshot = await page3.screenshot({ fullPage: true, type: 'png' })
    fs.writeFileSync('audit-results/screenshots/local-test-dashboard1.png', dashboard1Screenshot)
    
    // Second dashboard capture (should be identical)
    await page3.reload({ waitUntil: 'networkidle' })
    await page3.waitForLoadState('domcontentloaded')
    await page3.waitForTimeout(3000)
    
    const dashboard2Screenshot = await page3.screenshot({ fullPage: true, type: 'png' })
    fs.writeFileSync('audit-results/screenshots/local-test-dashboard2.png', dashboard2Screenshot)
    console.log('✅ Consistency test screenshots captured')
    
    await context2.close()
    
    // Compare the identical pages
    const consistencyComparison = await compareImages(dashboard1Screenshot, dashboard2Screenshot, 'Dashboard Consistency')
    
    console.log(`\n📊 Consistency Test Results:`)
    console.log(`Visual Similarity: ${consistencyComparison.visualSimilarity}%`)
    console.log(`Different Pixels: ${consistencyComparison.diffPixels.toLocaleString()} (${consistencyComparison.diffPercentage}%)`)
    console.log(`Overall Score: ${consistencyComparison.overallScore}/10`)
    
    // Generate a simple report
    const report = {
      timestamp: new Date().toISOString(),
      tests: [
        {
          name: 'Home vs Dashboard',
          description: 'Comparison between different pages (should be different)',
          ...comparison
        },
        {
          name: 'Dashboard Consistency',
          description: 'Same page reloaded (should be identical)',
          ...consistencyComparison
        }
      ]
    }
    
    fs.writeFileSync('audit-results/reports/local-audit-test.json', JSON.stringify(report, null, 2))
    
    console.log('\n' + '='.repeat(60))
    console.log('🎉 LOCAL VISUAL AUDIT TEST COMPLETE!')
    console.log('='.repeat(60))
    console.log(`📊 Test 1 Score: ${comparison.overallScore}/10 (Different pages)`)
    console.log(`📊 Test 2 Score: ${consistencyComparison.overallScore}/10 (Same page)`)
    console.log(`📁 Screenshots saved to: audit-results/screenshots/`)
    console.log(`📄 Report saved to: audit-results/reports/local-audit-test.json`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await browser.close()
  }
}

async function compareImages(screenshot1, screenshot2, testName) {
  try {
    const img1 = PNG.sync.read(screenshot1)
    const img2 = PNG.sync.read(screenshot2)
    
    const { width, height } = img1
    const diff = new PNG({ width, height })
    
    const numDiffPixels = pixelmatch(
      img1.data, 
      img2.data, 
      diff.data, 
      width, 
      height, 
      {
        threshold: 0.1,
        alpha: 0.1,
        diff: true
      }
    )
    
    // Save diff image
    const diffFilename = `audit-results/diffs/${testName.toLowerCase().replace(/\s+/g, '-')}-diff.png`
    fs.writeFileSync(diffFilename, PNG.sync.write(diff))
    
    const totalPixels = width * height
    const diffPercentage = (numDiffPixels / totalPixels) * 100
    const visualSimilarity = 100 - diffPercentage
    const overallScore = Math.max(0, 10 - (diffPercentage / 2))
    
    return {
      diffPixels: numDiffPixels,
      totalPixels,
      diffPercentage: Math.round(diffPercentage * 100) / 100,
      visualSimilarity: Math.round(visualSimilarity * 100) / 100,
      overallScore: Math.round(overallScore * 10) / 10,
      diffImagePath: diffFilename
    }
    
  } catch (error) {
    console.error(`❌ Image comparison failed:`, error.message)
    return {
      diffPixels: 0,
      totalPixels: 0,
      diffPercentage: 100,
      visualSimilarity: 0,
      overallScore: 0,
      error: error.message
    }
  }
}

runLocalAuditTest()

