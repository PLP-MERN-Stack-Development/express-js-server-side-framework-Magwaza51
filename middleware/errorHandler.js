// middleware/errorHandler.js - Global error handling middleware

// Custom error classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.details = details;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = 500;
  }
}

// Async error wrapper to catch async errors
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  console.error('Error:', err);
  
  // Default error response
  let response = {
    error: error.name || 'ServerError',
    message: error.message || 'Internal Server Error'
  };
  
  let statusCode = error.statusCode || 500;
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    response.details = error.details;
  }
  
  if (error.name === 'CastError') {
    response.message = 'Invalid ID format';
    statusCode = 400;
  }
  
  // Add stack trace in development mode (always show for this demo)
  response.stack = err.stack;
  
  res.status(statusCode).json(response);
};

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = {
  NotFoundError,
  ValidationError,
  AuthenticationError,
  ServerError,
  asyncWrapper,
  errorHandler,
  notFoundHandler
};