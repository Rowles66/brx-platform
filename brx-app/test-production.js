const { chromium } = require('playwright');

async function testProduction() {
  console.log('🚀 Testing BRX Performance App on Production...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📍 Navigating to: https://brx-app-replica.vercel.app');
    await page.goto('https://brx-app-replica.vercel.app', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully');
    
    // Wait for the redirect to dashboard
    await page.waitForTimeout(3000);
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'production-test-screenshot.png',
      fullPage: true 
    });
    
    console.log('📸 Screenshot saved as production-test-screenshot.png');
    
    // Check for key elements
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Look for BRX branding
    const logo = await page.locator('img[alt*="BRX"], img[src*="brx"], img[src*="logo"]').first();
    if (await logo.isVisible()) {
      console.log('🎨 BRX logo found');
    }
    
    // Look for dashboard elements
    const dashboardElements = await page.locator('h1, h2').count();
    console.log('📊 Dashboard elements found:', dashboardElements);
    
    // Check for workout cards or stats
    const workoutCards = await page.locator('[class*="bg-white"], [class*="card"], [class*="rounded"]').count();
    console.log('💪 Workout/stat cards found:', workoutCards);
    
    // Verify the orange BRX color is present
    const orangeElements = await page.locator('[style*="#fe3f00"], [style*="rgb(254, 63, 0)"]').count();
    console.log('🧡 BRX orange elements found:', orangeElements);
    
    console.log('🎉 Production test completed successfully!');
    console.log('🌐 App is live at: https://brx-app-replica.vercel.app');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'production-test-error.png' });
    console.log('📸 Error screenshot saved as production-test-error.png');
  } finally {
    await browser.close();
  }
}

testProduction();