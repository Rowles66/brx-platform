const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VERCEL_URL = 'https://brx-app-replica-ofg86p1vc-brx-performance.vercel.app';

const pages = [
  { name: 'dashboard', path: '/dashboard-replica' },
  // Add more pages as you implement them
  // { name: 'exercises', path: '/exercises-replica' },
];

async function auditAllPages() {
  console.log('🌐 Starting Vercel Visual Audit...');
  console.log(`🔗 Base URL: ${VERCEL_URL}`);
  
  const browser = await chromium.launch({
    headless: true
  });
  
  const results = [];
  
  for (const page of pages) {
    console.log(`\n📸 Capturing ${page.name}...`);
    
    const browserPage = await browser.newPage({
      viewport: { width: 1280, height: 720 }
    });
    
    try {
      const url = `${VERCEL_URL}${page.path}`;
      await browserPage.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 15000 
      });
      
      await browserPage.waitForTimeout(3000);
      
      const screenshotPath = `audit-results/screenshots/vercel-${page.name}.png`;
      await browserPage.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      const referencePath = `scraped_reference/auth_assets_from_auth_extract/screenshots/${page.name}.png`;
      const hasReference = fs.existsSync(referencePath);
      
      const result = {
        page: page.name,
        url: url,
        screenshot: screenshotPath,
        reference: hasReference ? referencePath : null,
        timestamp: new Date().toISOString()
      };
      
      results.push(result);
      
      console.log(`✅ ${page.name}: ${screenshotPath}`);
      if (hasReference) {
        console.log(`📊 Reference: ${referencePath}`);
      } else {
        console.log(`⚠️  No reference found for ${page.name}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to capture ${page.name}:`, error.message);
      results.push({
        page: page.name,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      await browserPage.close();
    }
  }
  
  await browser.close();
  
  // Save audit report
  const reportPath = 'audit-results/vercel-audit-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  console.log(`\n📄 Audit report saved: ${reportPath}`);
  console.log('\n🔍 Next Steps:');
  console.log('1. Compare screenshots with references');
  console.log('2. Identify visual differences');
  console.log('3. Update component styling');
  console.log('4. Re-deploy and re-audit');
  
  return results;
}

if (require.main === module) {
  auditAllPages().catch(console.error);
}

module.exports = { auditAllPages, VERCEL_URL };

