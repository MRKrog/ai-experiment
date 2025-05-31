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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection with retry logic
const connectDB = async (retries = 5, timeout = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      if (i === retries - 1) {
        console.error('Failed to connect to MongoDB:', error);
        return false;
      }
      console.log(`Retrying connection in ${timeout/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }
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
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? (status === 500 ? 'Internal Server Error' : err.message)
    : err.message;

  // Log error details in non-production
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

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

// Start server only if MongoDB connects successfully
const startServer = async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('Failed to start server due to MongoDB connection issues');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 