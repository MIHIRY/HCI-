// CRITICAL: Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

// Now import everything else AFTER env vars are loaded
import express from 'express';
import cors from 'cors';
import suggestionsRouter from './routes/suggestions.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    groq_api_configured: !!process.env.GROQ_API_KEY
  });
});

// API routes
app.use('/api/v1', suggestionsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.url
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('=� ContextType Backend Server');
  console.log(`=� Running on http://localhost:${PORT}`);
  console.log(`= Groq API: ${process.env.GROQ_API_KEY ? ' Configured' : 'L Not configured'}`);
  console.log(`< CORS: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('');
  console.log('=� Endpoints:');
  console.log('   GET  /health');
  console.log('   POST /api/v1/suggestions');
  console.log('');
});
