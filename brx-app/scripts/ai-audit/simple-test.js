#!/usr/bin/env node
import { chromium } from 'playwright'

async function simpleTest() {
  console.log('📸 Simple Screenshot Test Starting...')
  
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()
  
  try {
    console.log('🔍 Testing local home page...')
    await page.goto('http://localhost:3000/', { timeout: 30000 })
    await page.waitForLoadState('domcontentloaded')
    
    const screenshot = await page.screenshot({ 
      path: 'audit-results/screenshots/test-home.png',
      fullPage: true
    })
    
    console.log('✅ Screenshot saved to audit-results/screenshots/test-home.png')
    
    console.log('🔍 Testing dashboard page...')
    await page.goto('http://localhost:3000/dashboard', { timeout: 30000 })
    await page.waitForLoadState('domcontentloaded')
    
    await page.screenshot({ 
      path: 'audit-results/screenshots/test-dashboard.png',
      fullPage: true
    })
    
    console.log('✅ Dashboard screenshot saved to audit-results/screenshots/test-dashboard.png')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await browser.close()
  }
}

simpleTest()

