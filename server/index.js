require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

// Route modules
const membersRouter = require('./routes/members');
const applicationsRouter = require('./routes/applications');
const contactRouter = require('./routes/contact');
const documentsRouter = require('./routes/documents');
const eventsRouter = require('./routes/events');
const paymentsRouter = require('./routes/payments');
const dashboardRouter = require('./routes/dashboard');
const adminRouter = require('./routes/admin');
const workspacesRouter = require('./routes/workspaces');
const portalRouter = require('./routes/portal');

const app = express();
const PORT = process.env.PORT || 4000;

// Security
app.use(helmet());

// CORS
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Logging
app.use(morgan('dev'));

// Body parsing
// The Stripe webhook route requires the raw body buffer for signature verification.
// Applying express.json() globally would consume the buffer before the webhook handler.
// Conditionally skip JSON parsing for that specific path.
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    // Raw body is handled inside the payments router via express.raw()
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.urlencoded({ extended: true })(req, res, next);
  }
});

// Rate limiting (global)
app.use('/api/', rateLimiter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API routes
app.use('/api/members', membersRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/admin', adminRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/portal', portalRouter);

// 404
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Leonard & Victoria API listening on port ${PORT}`);
});

module.exports = app;
