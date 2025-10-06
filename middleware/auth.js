// middleware/auth.js - Authentication middleware

const auth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required. Please provide an API key in the x-api-key header.'
    });
  }
  
  // In a real application, you would validate the API key against a database
  // For this demo, we'll use a simple check
  const validApiKey = 'demo-api-key-123';
  
  if (apiKey !== validApiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key provided.'
    });
  }
  
  // Add user info to request object (in real app, this would come from DB)
  req.user = {
    id: 'demo-user',
    name: 'Demo User'
  };
  
  next();
};

module.exports = auth;