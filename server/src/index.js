import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import studentRoutes from './routes/student.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Add compression middleware for response optimization
app.use(compression({
  level: 6,  // Balance between speed and compression ratio
  threshold: 1024,  // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MSEC ERP Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()}:`, err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.status === 500 ? 'An internal server error occurred' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Only listen if not running on Vercel (Vercel handles binding automatically)
if (process.env.VERCEL) {
  console.log('🚀 MSEC ERP Server running in Serverless Mode');
} else {
  app.listen(PORT, () => {
    console.log(`🚀 MSEC ERP Server running on http://localhost:${PORT}`);
  });
}

export default app;
