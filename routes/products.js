// routes/products.js - Product routes

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { validateProduct, validateProductUpdate } = require('../middleware/validation');
const { NotFoundError, asyncWrapper } = require('../middleware/errorHandler');

// In-memory products database (in a real app, this would be a database)
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones',
    price: 200,
    category: 'electronics',
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
    price: 300,
    category: 'furniture',
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper function to find product by ID
const findProductById = (id) => {
  return products.find(product => product.id === id);
};

// GET /api/products - Get all products with filtering, pagination, and search
router.get('/', asyncWrapper(async (req, res) => {
  let filteredProducts = [...products];
  
  // Search functionality
  const { search, category, inStock, page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;
  
  // Filter by search term (name or description)
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filter by stock status
  if (inStock !== undefined) {
    const stockFilter = inStock === 'true';
    filteredProducts = filteredProducts.filter(product => product.inStock === stockFilter);
  }
  
  // Sorting
  filteredProducts.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'desc') {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    } else {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
  });
  
  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Response with metadata
  res.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredProducts.length,
      pages: Math.ceil(filteredProducts.length / limitNum)
    },
    filters: {
      search,
      category,
      inStock,
      sortBy,
      sortOrder
    }
  });
}));

// GET /api/products/stats - Get product statistics
router.get('/stats', asyncWrapper(async (req, res) => {
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    categories: {},
    averagePrice: 0,
    priceRange: {
      min: 0,
      max: 0
    }
  };
  
  // Calculate category counts
  products.forEach(product => {
    if (stats.categories[product.category]) {
      stats.categories[product.category]++;
    } else {
      stats.categories[product.category] = 1;
    }
  });
  
  // Calculate average price
  if (products.length > 0) {
    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    stats.averagePrice = Math.round((totalPrice / products.length) * 100) / 100;
    
    // Calculate price range
    const prices = products.map(p => p.price);
    stats.priceRange.min = Math.min(...prices);
    stats.priceRange.max = Math.max(...prices);
  }
  
  res.json({
    success: true,
    data: stats
  });
}));

// GET /api/products/search - Search products
router.get('/search', asyncWrapper(async (req, res) => {
  const { q, category } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required',
      message: 'Please provide a search query using the "q" parameter'
    });
  }
  
  let results = products.filter(product => {
    const searchTerm = q.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                         product.description.toLowerCase().includes(searchTerm);
    
    if (category) {
      return matchesSearch && product.category.toLowerCase() === category.toLowerCase();
    }
    
    return matchesSearch;
  });
  
  res.json({
    success: true,
    data: results,
    query: q,
    category: category || null,
    count: results.length
  });
}));

// GET /api/products/:id - Get a specific product
router.get('/:id', asyncWrapper(async (req, res) => {
  const product = findProductById(req.params.id);
  
  if (!product) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  res.json({
    success: true,
    data: product
  });
}));

// POST /api/products - Create a new product
router.post('/', validateProduct, asyncWrapper(async (req, res) => {
  const newProduct = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
}));

// PUT /api/products/:id - Update a product
router.put('/:id', validateProductUpdate, asyncWrapper(async (req, res) => {
  const productIndex = products.findIndex(product => product.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  // Update the product
  products[productIndex] = {
    ...products[productIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: products[productIndex]
  });
}));

// DELETE /api/products/:id - Delete a product
router.delete('/:id', asyncWrapper(async (req, res) => {
  const productIndex = products.findIndex(product => product.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct
  });
}));

module.exports = router;