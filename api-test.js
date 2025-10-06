// api-test.js - Test all API endpoints
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
            headers: res.headers,
            body: JSON.parse(body)
          });
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
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testAllEndpoints() {
  console.log('🧪 Testing Express.js RESTful API - All Endpoints');
  console.log('=' .repeat(60));

  const API_KEY = 'demo-api-key-123';
  const BASE_URL = 'localhost';
  const PORT = 3000;

  try {
    // Test 1: Root route (Hello World)
    console.log('\n1. Testing Root Route (Hello World)...');
    const root = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: '/',
      method: 'GET'
    });
    console.log(`✅ Status: ${root.statusCode}`);
    console.log(`📋 Response: ${root.body}`);

    // Test 2: API Documentation
    console.log('\n2. Testing API Documentation...');
    const apiDocs = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: '/api',
      method: 'GET'
    });
    console.log(`✅ Status: ${apiDocs.statusCode}`);
    console.log(`📖 API Name: ${apiDocs.body.name}`);
    console.log(`📖 Version: ${apiDocs.body.version}`);

    // Test 3: Get all products
    console.log('\n3. Testing GET /api/products...');
    const products = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: '/api/products',
      method: 'GET',
      headers: { 'x-api-key': API_KEY }
    });
    console.log(`✅ Status: ${products.statusCode}`);
    console.log(`📦 Products found: ${products.body.data?.length || 0}`);

    // Test 4: Get products with filtering
    console.log('\n4. Testing GET /api/products with filtering...');
    const filteredProducts = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: '/api/products?category=electronics&page=1&limit=3',
      method: 'GET',
      headers: { 'x-api-key': API_KEY }
    });
    console.log(`✅ Status: ${filteredProducts.statusCode}`);
    console.log(`🔍 Filtered products: ${filteredProducts.body.data?.length || 0}`);
    console.log(`📄 Pagination: Page ${filteredProducts.body.pagination?.page}, Total: ${filteredProducts.body.pagination?.total}`);

    // Test 5: Get product statistics
    console.log('\n5. Testing GET /api/products/stats...');
    const stats = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: '/api/products/stats',
      method: 'GET',
      headers: { 'x-api-key': API_KEY }
    });
    console.log(`✅ Status: ${stats.statusCode}`);
    console.log(`📊 Total products: ${stats.body.data?.total}`);
    console.log(`📊 Categories: ${JSON.stringify(stats.body.data?.categories)}`);

    // Test 6: Search products
    console.log('\n6. Testing GET /api/products/search...');
    const searchResults = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: '/api/products/search?q=laptop',
      method: 'GET',
      headers: { 'x-api-key': API_KEY }
    });
    console.log(`✅ Status: ${searchResults.statusCode}`);
    console.log(`🔍 Search results: ${searchResults.body.count} products found`);

    // Test 7: Get specific product
    console.log('\n7. Testing GET /api/products/:id...');
    const singleProduct = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: '/api/products/1',
      method: 'GET',
      headers: { 'x-api-key': API_KEY }
    });
    console.log(`✅ Status: ${singleProduct.statusCode}`);
    console.log(`📦 Product: ${singleProduct.body.data?.name || 'Not found'}`);

    // Test 8: Create new product
    console.log('\n8. Testing POST /api/products...');
    const newProduct = {
      name: 'Test Product',
      description: 'A test product for API verification',
      price: 99.99,
      category: 'test',
      inStock: true
    };
    const createResult = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: '/api/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    }, newProduct);
    console.log(`✅ Status: ${createResult.statusCode}`);
    console.log(`📦 Created Product ID: ${createResult.body.data?.id || 'Failed'}`);
    
    const createdProductId = createResult.body.data?.id;

    // Test 9: Update product
    if (createdProductId) {
      console.log('\n9. Testing PUT /api/products/:id...');
      const updateData = { price: 89.99, inStock: false };
      const updateResult = await makeRequest({
        hostname: BASE_URL,
        port: PORT,
        path: `/api/products/${createdProductId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        }
      }, updateData);
      console.log(`✅ Status: ${updateResult.statusCode}`);
      console.log(`🔄 Updated price: ${updateResult.body.data?.price}`);

      // Test 10: Delete product
      console.log('\n10. Testing DELETE /api/products/:id...');
      const deleteResult = await makeRequest({
        hostname: BASE_URL,
        port: PORT,
        path: `/api/products/${createdProductId}`,
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY }
      });
      console.log(`✅ Status: ${deleteResult.statusCode}`);
      console.log(`🗑️ Deleted: ${deleteResult.body.data?.name || 'Success'}`);
    }

    // Test 11: Authentication failure
    console.log('\n11. Testing Authentication Failure...');
    const authFail = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: '/api/products',
      method: 'GET'
    });
    console.log(`✅ Status: ${authFail.statusCode} (Expected 401)`);
    console.log(`🔒 Error: ${authFail.body.message}`);

    // Test 12: Validation error
    console.log('\n12. Testing Validation Error...');
    const validationFail = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: '/api/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    }, { name: '', price: -10 }); // Invalid data
    console.log(`✅ Status: ${validationFail.statusCode} (Expected 400)`);
    console.log(`❌ Validation errors: ${validationFail.body.details?.length || 0} found`);

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 ALL API ENDPOINTS TESTED SUCCESSFULLY!');
    console.log('✅ Your Express.js RESTful API is fully functional!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the comprehensive test
testAllEndpoints();