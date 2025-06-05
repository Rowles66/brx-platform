const { chromium } = require('@playwright/test');

async function testProduction() {
  console.log('🎬 Starting visual test of production app...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔗 Navigating to: https://brx-app-replica.vercel.app');
    await page.goto('https://brx-app-replica.vercel.app', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'production-test.png', 
      fullPage: true 
    });
    
    // Check for key elements
    const title = await page.title();
    console.log(`📋 Page title: "${title}"`);
    
    // Check if app loaded
    const hasContent = await page.locator('body').isVisible();
    console.log(`✅ Page has content: ${hasContent}`);
    
    // Look for BRX branding
    const hasBrxLogo = await page.locator('[alt*="BRX"], [src*="brx"], [href*="brx"]').count();
    console.log(`🏷️  BRX elements found: ${hasBrxLogo}`);
    
    // Look for navigation
    const hasNav = await page.locator('nav, header, [role="navigation"]').count();
    console.log(`🧭 Navigation elements: ${hasNav}`);
    
    console.log('🏆 SUCCESS: Visual test completed!');
    console.log('📸 Screenshot saved as: production-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testProduction();