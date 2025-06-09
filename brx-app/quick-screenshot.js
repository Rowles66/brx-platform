const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🎯 Taking dashboard screenshot...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 }
  });
  
  try {
    await page.goto('https://brx-app-replica-2duu26wzf-brx-performance.vercel.app/dashboard-replica');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ 
      path: 'current-dashboard.png',
      fullPage: true 
    });
    
    console.log('✅ Screenshot saved as current-dashboard.png');
    console.log('📊 Reference: scraped_reference/auth_assets_from_auth_extract/screenshots/dashboard.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();

