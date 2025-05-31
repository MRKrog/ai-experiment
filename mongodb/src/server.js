import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import taskRoutes from './routes/taskRoutes.js';

const app = express();

// Security middleware
app.disable('x-powered-by');
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic route for immediate feedback
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  console.log('Health check - DB Connected:', isDbConnected);
  console.log('Current DB State:', mongoose.connection.readyState);
  
  if (!isDbConnected) {
    return res.status(503).json({ 
      status: 'error',
      message: 'Database connection not established',
      dbState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    });
  }
  res.json({ 
    status: 'ok',
    database: 'connected',
    timestamp: new Date().toISOString() 
  });
});

// POST /api/tasks
// {
//   "title": "Generate Landing Page Code",
//   "description": "Generate React code for a modern landing page",
//   "type": "code_generation",
//   "prompt": "Create a React landing page with a hero section, features section, and contact form",
//   "createdBy": "user_id_here",
//   "metadata": {
//     "framework": "React",
//     "styling": "Tailwind CSS"
//   }
// }

// GET /api/tasks?status=pending&type=code_generation&page=1&limit=10

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection with retry logic
const connectDB = async (retries = 5, timeout = 5000) => {
  console.log('Starting MongoDB connection process...');
  
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in environment variables');
    return false;
  }

  // Log a sanitized version of the connection string
  const sanitizedUri = process.env.MONGODB_URI.replace(
    /(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/,
    '$1[USERNAME]:[PASSWORD]@'
  );
  console.log('Attempting to connect to MongoDB with URI:', sanitizedUri);

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Connection attempt ${i + 1} of ${retries}`);
      
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
      });
      
      console.log('MongoDB Connection Successful');
      console.log(`Connected to MongoDB host: ${conn.connection.host}`);
      console.log(`Database name: ${conn.connection.name}`);
      console.log(`Connection state: ${conn.connection.readyState}`);
      
      // Set up connection event listeners
      mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });

      return true;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message);
      console.error('Full error:', error);
      
      if (i === retries - 1) {
        console.error('All connection attempts failed');
        return false;
      }
      
      console.log(`Waiting ${timeout/1000} seconds before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }
  return false;
};

// Routes
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Welcome to the AI Task Generation API',
    version: process.env.npm_package_version || '1.0.0',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? (status === 500 ? 'Internal Server Error' : err.message)
    : err.message;

  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Not Found',
      status: 404,
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;

// Start server with enhanced logging
const startServer = async () => {
  console.log('\n=== Server Startup ===');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Port:', PORT);
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('Current working directory:', process.cwd());
  console.log('=====================\n');

  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('Failed to establish MongoDB connection - shutting down');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n=== Server Running ===`);
    console.log(`Port: ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`MongoDB Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log('===================\n');
  });
};

// Enhanced error handling
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 