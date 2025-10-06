// server.js - Complete Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Import custom middleware
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const productRoutes = require('./routes/products');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Global middleware setup
app.use(bodyParser.json()); // Parse JSON bodies - using body-parser as required
app.use(logger); // Custom logging middleware

// Health check route (no auth required)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root route - "Hello World" as required by Task 1
app.get('/', (req, res) => {
  res.send('Hello World! Welcome to the Product API.');
});

// API overview route
app.get('/overview', (req, res) => {
  res.json({
    message: 'Welcome to the Product API!',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      health: '/health',
      docs: 'https://github.com/your-repo/README.md'
    },
    authentication: 'API key required for /api routes (x-api-key header)'
  });
});

// API Documentation route
app.get('/api', (req, res) => {
  res.json({
    name: 'Product API',
    version: '1.0.0',
    description: 'RESTful API for managing products',
    endpoints: {
      'GET /api/products': 'Get all products (supports filtering, pagination, search)',
      'GET /api/products/stats': 'Get product statistics',
      'GET /api/products/search': 'Search products by name or description',
      'GET /api/products/:id': 'Get a specific product by ID',
      'POST /api/products': 'Create a new product',
      'PUT /api/products/:id': 'Update an existing product',
      'DELETE /api/products/:id': 'Delete a product'
    },
    queryParameters: {
      'search': 'Search term for name/description',
      'category': 'Filter by category',
      'inStock': 'Filter by stock status (true/false)',
      'page': 'Page number for pagination (default: 1)',
      'limit': 'Items per page (default: 10)',
      'sortBy': 'Sort field (default: name)',
      'sortOrder': 'Sort order (asc/desc, default: asc)'
    },
    authentication: {
      type: 'API Key',
      header: 'x-api-key',
      example: 'demo-api-key-123'
    }
  });
});

// Protected API routes (require authentication)
app.use('/api/products', auth, productRoutes);

// Handle 404 for undefined routes
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  console.log('🚀 Server started successfully!');
  console.log(`📍 Server is running on http://localhost:${PORT}`);
  console.log('📖 API Documentation available at http://localhost:' + PORT + '/api');
  console.log('💊 Health check available at http://localhost:' + PORT + '/health');
  console.log('─'.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Export the app for testing purposes
module.exports = app; 