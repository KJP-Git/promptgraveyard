/**
 * 🎃 Prompt Graveyard API Server 🎃
 * The haunted Express server that serves up spooky evaluation results
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';

// Import our spooky middleware and routes
import {
  spookyHeaders,
  spookyLogger,
  spookyRateLimit,
  spookyCors,
  spookyErrorHandler,
  requestIdGenerator,
  validateContentType
} from '@/middleware/spookyMiddleware';
import apiRoutes from '@/routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * 🛡️ Security and Performance Middleware
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(spookyRateLimit);

/**
 * 👻 Spooky Custom Middleware
 */
app.use(requestIdGenerator);
app.use(spookyHeaders);
app.use(spookyLogger);
app.use(spookyCors);

/**
 * 📦 Body Parsing Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(validateContentType);

/**
 * 🗺️ API Routes
 */
app.use('/api', apiRoutes);

/**
 * 🏠 Serve static files (for frontend if needed)
 */
if (NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../public');
  app.use(express.static(staticPath));
  
  // Serve frontend for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

/**
 * 💀 Error Handling Middleware (must be last)
 */
app.use(spookyErrorHandler);

/**
 * 🚀 Start the haunted server
 */
const server = app.listen(PORT, () => {
  console.log(`
  🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃
  
       🏚️  PROMPT GRAVEYARD API SERVER  🏚️
       
       👻 Server Status: ALIVE (not zombie!)
       🌐 Port: ${PORT}
       🎭 Environment: ${NODE_ENV}
       ⚡ Process ID: ${process.pid}
       🕐 Started: ${new Date().toISOString()}
       
       🔮 API Endpoints:
       • GET  /api/health          - Health check
       • GET  /api/prompts         - All prompts
       • GET  /api/results         - Raw evaluation results
       • GET  /api/prompts/zombies - Zombie prompts
       • GET  /api/prompts/living  - Living prompts
       • POST /api/revive          - Revive zombies
       
       🧙‍♀️ May your API calls be swift and your prompts be alive!
       
  🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃
  `);
});

/**
 * 🛑 Graceful shutdown handling
 */
process.on('SIGTERM', () => {
  console.log('💀 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('⚰️ Server has been laid to rest. Process terminated.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('💀 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('⚰️ Server has been laid to rest. Process terminated.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💀 Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in production, just log
  if (NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('💀 Uncaught Exception:', error);
  // Exit gracefully
  server.close(() => {
    process.exit(1);
  });
});

export default app;