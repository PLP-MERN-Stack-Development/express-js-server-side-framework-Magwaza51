// test-api.js - Simple test script for the API

const http = require('http');

// Function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(body)
          };
          resolve(response);
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test function
async function testAPI() {
  console.log('🧪 Testing Express.js RESTful API');
  console.log('=' .repeat(50));

  try {
    // Test 1: Health check
    console.log('\n1. Testing Health Check...');
    const health = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/health',
      method: 'GET'
    });
    console.log(`✅ Status: ${health.statusCode}`);
    console.log(`📋 Response:`, health.body);

    // Test 2: Get API documentation
    console.log('\n2. Testing API Documentation...');
    const apiDocs = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api',
      method: 'GET'
    });
    console.log(`✅ Status: ${apiDocs.statusCode}`);
    console.log(`📋 Response:`, apiDocs.body);

    // Test 3: Get all products (with auth)
    console.log('\n3. Testing Get All Products...');
    const products = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'GET',
      headers: {
        'x-api-key': 'demo-api-key-123'
      }
    });
    console.log(`✅ Status: ${products.statusCode}`);
    console.log(`📋 Products found: ${products.body.data ? products.body.data.length : 0}`);

    // Test 4: Get product statistics
    console.log('\n4. Testing Product Statistics...');
    const stats = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products/stats',
      method: 'GET',
      headers: {
        'x-api-key': 'demo-api-key-123'
      }
    });
    console.log(`✅ Status: ${stats.statusCode}`);
    console.log(`📊 Stats:`, stats.body.data);

    // Test 5: Create a new product
    console.log('\n5. Testing Create Product...');
    const newProduct = {
      name: 'Test Gaming Mouse',
      description: 'High-precision gaming mouse for testing',
      price: 75.99,
      category: 'electronics',
      inStock: true
    };

    const createResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'demo-api-key-123'
      }
    }, newProduct);
    console.log(`✅ Status: ${createResult.statusCode}`);
    console.log(`📦 Created Product ID: ${createResult.body.data ? createResult.body.data.id : 'N/A'}`);

    // Test 6: Search products
    console.log('\n6. Testing Product Search...');
    const searchResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products/search?q=laptop',
      method: 'GET',
      headers: {
        'x-api-key': 'demo-api-key-123'
      }
    });
    console.log(`✅ Status: ${searchResult.statusCode}`);
    console.log(`🔍 Search results: ${searchResult.body.count} products found`);

    // Test 7: Test authentication failure
    console.log('\n7. Testing Authentication Failure...');
    const authFail = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/products',
      method: 'GET'
    });
    console.log(`✅ Status: ${authFail.statusCode} (Expected 401)`);
    console.log(`🔒 Auth Error:`, authFail.body.message);

    console.log('\n' + '=' .repeat(50));
    console.log('🎉 API Testing Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAPI();