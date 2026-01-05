// MAIN SERVER FILE: Initializes Express app, connects to MongoDB, and starts server

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// MIDDLEWARE: Functions that process requests before they reach routes
// 1. Parse JSON request bodies (converts JSON to JavaScript objects)
app.use(express.json());

// 2. Enable CORS (allows frontend on different port to access API)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
}));

// 3. Log all requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next(); // Pass to next middleware
  });
}

// ROUTES: Define API endpoints
app.use('/api/auth', authRoutes); // Authentication routes (/api/auth/login, /api/auth/signup)
app.use('/api/documents', documentRoutes); // Document CRUD routes

// ROOT ROUTE: Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Retro Writing API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      documents: '/api/documents'
    }
  });
});

// ERROR HANDLING MIDDLEWARE: Catches all errors from routes
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 HANDLER: Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// DATABASE CONNECTION: Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    // Mongoose 8+ no longer needs useNewUrlParser or useUnifiedTopology options
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// START SERVER: Connect to DB first, then start listening
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📡 API URL: http://localhost:${PORT}/api`);
  });
});

// GRACEFUL SHUTDOWN: Close DB connection when server stops
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('\n👋 MongoDB connection closed. Server shutting down.');
  process.exit(0);
});
