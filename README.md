# Express.js RESTful API - Product Management System

A complete RESTful API built with Express.js that demonstrates CRUD operations, middleware implementation, error handling, and advanced features like filtering, pagination, and search.

## 🚀 Features

- **Complete CRUD Operations** for product management
- **Custom Middleware** for logging, authentication, and validation
- **Global Error Handling** with custom error classes
- **Request Validation** with detailed error messages
- **API Authentication** using API keys
- **Advanced Filtering** by category, stock status, and search terms
- **Pagination Support** for large datasets
- **Sorting Options** by any field in ascending/descending order
- **Product Statistics** endpoint
- **Comprehensive Logging** with timestamps and request details
- **CORS Support** for cross-origin requests
- **Health Check** endpoint for monitoring
- **Auto-generated API Documentation**

## 📋 Requirements

- Node.js (v18 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd express-js-server-side-framework-Magwaza51
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   API_KEY=your-secret-api-key-here
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 📖 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
All `/api/*` routes require an API key in the request headers:
```
x-api-key: your-secret-api-key-here
```

### Available Endpoints

#### General Routes
- `GET /` - Welcome message and API overview
- `GET /health` - Health check endpoint
- `GET /api` - API documentation

#### Product Routes
- `GET /api/products` - Get all products (with filtering, pagination, search)
- `GET /api/products/stats` - Get product statistics
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## 🔍 API Usage Examples

### 1. Get All Products
```bash
curl -H "x-api-key: demo-api-key-123" \
     "http://localhost:3000/api/products"
```

### 2. Get Products with Filtering and Pagination
```bash
curl -H "x-api-key: demo-api-key-123" \
     "http://localhost:3000/api/products?category=electronics&page=1&limit=5&sortBy=price&sortOrder=desc"
```

### 3. Search Products
```bash
curl -H "x-api-key: demo-api-key-123" \
     "http://localhost:3000/api/products/search?q=laptop&category=electronics"
```

### 4. Get Product Statistics
```bash
curl -H "x-api-key: demo-api-key-123" \
     "http://localhost:3000/api/products/stats"
```

### 5. Create a New Product
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -H "x-api-key: demo-api-key-123" \
     -d '{
       "name": "Gaming Mouse",
       "description": "High-precision gaming mouse with RGB lighting",
       "price": 75,
       "category": "electronics",
       "inStock": true
     }' \
     "http://localhost:3000/api/products"
```

### 6. Update a Product
```bash
curl -X PUT \
     -H "Content-Type: application/json" \
     -H "x-api-key: demo-api-key-123" \
     -d '{
       "price": 80,
       "inStock": false
     }' \
     "http://localhost:3000/api/products/1"
```

### 7. Delete a Product
```bash
curl -X DELETE \
     -H "x-api-key: demo-api-key-123" \
     "http://localhost:3000/api/products/1"
```

## 📊 Query Parameters

### GET /api/products

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `search` | string | Search in product name/description | - |
| `category` | string | Filter by category | - |
| `inStock` | boolean | Filter by stock status | - |
| `page` | number | Page number for pagination | 1 |
| `limit` | number | Items per page | 10 |
| `sortBy` | string | Field to sort by | name |
| `sortOrder` | string | Sort order (asc/desc) | asc |

### GET /api/products/search

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `q` | string | Search query | Yes |
| `category` | string | Filter by category | No |

## 📋 Product Schema

```javascript
{
  "id": "string (UUID)",
  "name": "string (required, max 100 chars)",
  "description": "string (required, max 500 chars)",
  "price": "number (required, positive)",
  "category": "string (required, max 50 chars)",
  "inStock": "boolean (default: true)",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

## 🚦 Response Format

### Success Response
```javascript
{
  "success": true,
  "data": {...},
  "message": "Success message (optional)"
}
```

### Error Response
```javascript
{
  "error": "ErrorType",
  "message": "Error description",
  "details": ["Validation errors array (if applicable)"]
}
```

### Paginated Response
```javascript
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  },
  "filters": {...}
}
```

## 🛡️ Error Handling

The API includes comprehensive error handling for:

- **404 Not Found** - Resource not found
- **400 Bad Request** - Validation errors, malformed requests
- **401 Unauthorized** - Missing or invalid API key
- **500 Internal Server Error** - Server errors

## 📁 Project Structure

```
express-js-server-side-framework-Magwaza51/
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── errorHandler.js   # Error handling middleware
│   ├── logger.js         # Request logging middleware
│   └── validation.js     # Input validation middleware
├── routes/
│   └── products.js       # Product routes
├── .env.example          # Environment variables example
├── package.json          # Project dependencies
├── server.js             # Main server file
└── README.md            # Project documentation
```

## 🧪 Testing

You can test the API using:

### Postman Collection
Import the following endpoints into Postman:

1. **GET** `http://localhost:3000/health`
2. **GET** `http://localhost:3000/api/products` (with x-api-key header)
3. **POST** `http://localhost:3000/api/products` (with x-api-key header and JSON body)
4. **PUT** `http://localhost:3000/api/products/:id` (with x-api-key header and JSON body)
5. **DELETE** `http://localhost:3000/api/products/:id` (with x-api-key header)

### Example Test Data
```json
{
  "name": "Test Product",
  "description": "This is a test product for API testing",
  "price": 99.99,
  "category": "test",
  "inStock": true
}
```

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

This will start the server with nodemon for automatic restarting on file changes.

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `API_KEY` - API key for authentication (default: demo-api-key-123)

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong API key
3. Configure CORS for your frontend domain
4. Consider using a process manager like PM2
5. Set up proper logging and monitoring

## 📝 Assignment Requirements Completed

✅ **Task 1: Express.js Setup**
- ✅ Node.js project initialized with package.json
- ✅ Express.js and dependencies installed
- ✅ Basic server listening on port 3000
- ✅ "Hello World" route implemented

✅ **Task 2: RESTful API Routes**
- ✅ Product resource with all required fields
- ✅ GET /api/products - List all products
- ✅ GET /api/products/:id - Get specific product
- ✅ POST /api/products - Create new product
- ✅ PUT /api/products/:id - Update product
- ✅ DELETE /api/products/:id - Delete product

✅ **Task 3: Middleware Implementation**
- ✅ Custom logger middleware with timestamps
- ✅ JSON body parser middleware
- ✅ Authentication middleware with API key validation
- ✅ Validation middleware for product operations

✅ **Task 4: Error Handling**
- ✅ Global error handling middleware
- ✅ Custom error classes (NotFoundError, ValidationError, etc.)
- ✅ Proper HTTP status codes
- ✅ Async error handling with try/catch wrapper

✅ **Task 5: Advanced Features**
- ✅ Query parameters for filtering by category
- ✅ Pagination support with page and limit
- ✅ Search endpoint for product names
- ✅ Product statistics endpoint

## 👥 Author

Student Name - Week 2 Assignment for Express.js Server-Side Framework

## 📄 License

This project is part of a coding assignment and is for educational purposes.

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all the required API endpoints
2. Implement the middleware and error handling
3. Document your API in the README.md
4. Include examples of requests and responses

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 