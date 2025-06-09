import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function screenshotDashboard() {
  console.log('🎯 Taking screenshot of dashboard replica...');
  
  const browser = await chromium.launch({
    headless: true
  });
  
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 }
  });
  
  try {
    // Navigate to dashboard replica
    console.log('📍 Navigating to http://localhost:3006/dashboard-replica');
    await page.goto('http://localhost:3006/dashboard-replica', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    // Wait a bit for any dynamic content
    await page.waitForTimeout(2000);
    
    // Take screenshot
    const screenshotPath = path.join(process.cwd(), 'audit-results', 'screenshots', 'current-dashboard-replica.png');
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`✅ Screenshot saved to: ${screenshotPath}`);
    
    // Also take a reference comparison screenshot
    const referencePath = path.join(process.cwd(), 'scraped_reference', 'auth_assets_from_auth_extract', 'screenshots', 'dashboard.png');
    if (fs.existsSync(referencePath)) {
      console.log(`📊 Reference screenshot available at: ${referencePath}`);
      console.log('\n🔍 Visual Comparison Next Steps:');
      console.log('1. Open both images in your preferred image viewer');
      console.log('2. Use ComparisonView.jsx component for overlay comparison');
      console.log('3. Identify styling differences to fix');
    } else {
      console.log('❌ Reference screenshot not found');
    }
    
  } catch (error) {
    console.error('❌ Screenshot failed:', error.message);
  } finally {
    await browser.close();
  }
}

screenshotDashboard().catch(console.error);

