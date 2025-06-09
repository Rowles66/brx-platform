import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

const pages = [
  { name: 'dashboard', path: '/dashboard-replica' },
  { name: 'exercises', path: '/exercises-replica' },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');
  const action = searchParams.get('action') || 'screenshot';
  const baseUrl = `https://${request.headers.get('host')}`;
  
  try {
    if (action === 'screenshot') {
      const browser = await chromium.launch({ headless: true });
      const browserPage = await browser.newPage({
        viewport: { width: 1280, height: 720 }
      });
      
      const targetPage = pages.find(p => p.name === page) || pages[0];
      const url = `${baseUrl}${targetPage.path}`;
      
      await browserPage.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 15000 
      });
      
      await browserPage.waitForTimeout(2000);
      
      const screenshot = await browserPage.screenshot({ 
        fullPage: true,
        type: 'png'
      });
      
      await browser.close();
      
      return new NextResponse(screenshot, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-cache'
        }
      });
    }
    
    if (action === 'audit') {
      const results = [];
      const browser = await chromium.launch({ headless: true });
      
      for (const pageConfig of pages) {
        const browserPage = await browser.newPage({
          viewport: { width: 1280, height: 720 }
        });
        
        try {
          const url = `${baseUrl}${pageConfig.path}`;
          await browserPage.goto(url, { 
            waitUntil: 'networkidle',
            timeout: 15000 
          });
          
          await browserPage.waitForTimeout(2000);
          
          const screenshot = await browserPage.screenshot({ 
            fullPage: true,
            type: 'png'
          });
          
          results.push({
            page: pageConfig.name,
            url: url,
            screenshot: `data:image/png;base64,${screenshot.toString('base64')}`,
            timestamp: new Date().toISOString()
          });
          
        } catch (error) {
          results.push({
            page: pageConfig.name,
            error: error.message,
            timestamp: new Date().toISOString()
          });
        } finally {
          await browserPage.close();
        }
      }
      
      await browser.close();
      
      return NextResponse.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        baseUrl: baseUrl,
        results: results
      });
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Invalid action. Use ?action=screenshot&page=dashboard or ?action=audit'
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { page, action = 'screenshot' } = body;
  const baseUrl = `https://${request.headers.get('host')}`;
  
  // Same logic as GET but with POST body
  return GET(request);
}

