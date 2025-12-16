import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

// Load environment variables
dotenv.config();

// Import routes
import contextRoutes from './routes/context.routes';
import layoutRoutes from './routes/layout.routes';
import metricsRoutes from './routes/metrics.routes';
import studyRoutes from './routes/study.routes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server for Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/v1/context', contextRoutes);
app.use('/api/v1/layout', layoutRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/study', studyRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ContextType Backend',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'ContextType Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      context: '/api/v1/context',
      layout: '/api/v1/layout',
      metrics: '/api/v1/metrics',
      study: '/api/v1/study'
    }
  });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Listen for keystroke events
  socket.on('keystroke', (data) => {
    // Broadcast to analytics dashboard
    socket.broadcast.emit('keystroke_update', data);
  });

  // Listen for context changes
  socket.on('context_change', (data) => {
    socket.broadcast.emit('context_update', data);
  });
});

// Export io for use in other modules
export { io };

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 ContextType Backend running on http://localhost:${PORT}`);
  console.log(`📊 WebSocket server ready for connections`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`💾 Database: ${process.env.DATABASE_URL?.split('@')[1] || 'Not configured'}`);
});
