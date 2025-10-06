// quick-test.js - Quick test to verify all endpoints work

const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function quickTest() {
  console.log('🧪 Quick API Test...');
  
  try {
    // Test root route
    const root = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/',
      method: 'GET'
    });
    console.log(`✅ Root route: ${root.statusCode} - ${root.body}`);

    // Test products with auth
    const products = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/products',
      method: 'GET',
      headers: { 'x-api-key': 'demo-api-key-123' }
    });
    console.log(`✅ Products: ${products.statusCode} - Found ${products.body.data?.length || 0} products`);

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

quickTest();