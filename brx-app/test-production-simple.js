#!/usr/bin/env node

const https = require('https');

console.log('🚀 Testing BRX App Production Deployment...');
console.log('🔗 URL: https://brx-app-replica.vercel.app');

const options = {
  hostname: 'brx-app-replica.vercel.app',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'BRX-App-Test/1.0'
  }
};

const req = https.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('🎉 SUCCESS: App is live and responding!');
      console.log(`📊 Response size: ${data.length} bytes`);
      
      // Check for key elements
      const hasTitle = data.includes('<title>');
      const hasReact = data.includes('react');
      const hasNextJs = data.includes('next');
      
      console.log('🔍 Content Analysis:');
      console.log(`   - Has title tag: ${hasTitle ? '✅' : '❌'}`);
      console.log(`   - Contains React: ${hasReact ? '✅' : '❌'}`);
      console.log(`   - Contains Next.js: ${hasNextJs ? '✅' : '❌'}`);
      
      if (hasTitle && hasReact) {
        console.log('🏆 FINAL RESULT: Production deployment is SUCCESSFUL!');
      } else {
        console.log('⚠️  FINAL RESULT: Deployment responding but may have issues');
      }
    } else {
      console.log(`❌ FAILED: Received status ${res.statusCode}`);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ ERROR: ${e.message}`);
});

req.setTimeout(10000, () => {
  console.log('⏰ TIMEOUT: Request took too long');
  req.abort();
});

req.end();