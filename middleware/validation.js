// middleware/validation.js - Validation middleware for products

const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];
  
  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }
  
  if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be a positive number');
  }
  
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }
  
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    errors.push('inStock must be a boolean value');
  }
  
  // Validate field lengths
  if (name && name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (description && description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  if (category && category.length > 50) {
    errors.push('Category must be less than 50 characters');
  }
  
  // Validate price range
  if (price && price > 1000000) {
    errors.push('Price must be less than 1,000,000');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid product data',
      details: errors
    });
  }
  
  // Sanitize input data
  req.body.name = name.trim();
  req.body.description = description.trim();
  req.body.category = category.trim().toLowerCase();
  
  // Set default value for inStock if not provided
  if (req.body.inStock === undefined) {
    req.body.inStock = true;
  }
  
  next();
};

const validateProductUpdate = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];
  
  // For updates, fields are optional but must be valid if provided
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name must be a non-empty string');
    }
    if (name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }
  }
  
  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length === 0) {
      errors.push('Description must be a non-empty string');
    }
    if (description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }
  }
  
  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      errors.push('Price must be a positive number');
    }
    if (price > 1000000) {
      errors.push('Price must be less than 1,000,000');
    }
  }
  
  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim().length === 0) {
      errors.push('Category must be a non-empty string');
    }
    if (category.length > 50) {
      errors.push('Category must be less than 50 characters');
    }
  }
  
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    errors.push('inStock must be a boolean value');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid product data',
      details: errors
    });
  }
  
  // Sanitize input data
  if (name) req.body.name = name.trim();
  if (description) req.body.description = description.trim();
  if (category) req.body.category = category.trim().toLowerCase();
  
  next();
};

module.exports = {
  validateProduct,
  validateProductUpdate
};