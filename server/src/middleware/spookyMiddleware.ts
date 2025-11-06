/**
 * 👻 Spooky Middleware Collection 👻
 * Halloween-themed middleware for our haunted API
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { createApiResponse } from '@/utils/apiHelpers';

/**
 * 🎃 Add spooky headers to all responses
 */
export const spookyHeaders = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('X-Powered-By', '🎃 Prompt Graveyard API');
  res.setHeader('X-Spooky-Version', '1.0.0');
  res.setHeader('X-Halloween-Spirit', 'Maximum Spookiness');
  
  // Add a random spooky quote
  const spookyQuotes = [
    'In code we trust, in prompts we debug 👻',
    'May your prompts be ever living 🧙‍♀️',
    'Beware of zombie prompts after midnight 🧟‍♂️',
    'The graveyard remembers all evaluations ⚰️',
    'Revival magic is strong with this API ✨'
  ];
  
  const randomQuote = spookyQuotes[Math.floor(Math.random() * spookyQuotes.length)];
  res.setHeader('X-Spooky-Quote', randomQuote);
  
  next();
};

/**
 * 🕐 Log requests with spooky timestamps
 */
export const spookyLogger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown Spirit';
  
  console.log(`👻 [${timestamp}] ${method} ${url} - Summoned by: ${userAgent}`);
  
  // Log response when it finishes
  const originalSend = res.send;
  res.send = function(data) {
    const statusCode = res.statusCode;
    const statusEmoji = statusCode >= 400 ? '💀' : statusCode >= 300 ? '🎭' : '✨';
    
    console.log(`${statusEmoji} [${timestamp}] ${method} ${url} - ${statusCode} - Response sent to the realm`);
    return originalSend.call(this, data);
  };
  
  next();
};

/**
 * ⚡ Rate limiting with spooky messages
 */
export const spookyRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: (req: Request, res: Response) => {
    const response = createApiResponse(
      null,
      '🧙‍♀️ Whoa there, eager spirit! You\'re casting spells too quickly. Please wait before trying again.',
      false
    );
    return response;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const response = createApiResponse(
      null,
      '⚡ The magical barriers have been activated! Too many requests from your realm. Please wait before trying again.',
      false
    );
    res.status(429).json(response);
  }
});

/**
 * 🔮 CORS with spooky origins
 */
export const spookyCors = (req: Request, res: Response, next: NextFunction): void => {
  const origin = req.get('Origin');
  
  // Allow requests from localhost and common development ports
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080'
  ];
  
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
};

/**
 * 💀 Error handler with spooky messages
 */
export const spookyErrorHandler = (
  error: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  console.error('💀 Spooky Error Detected:', error);
  
  // Don't handle if response already sent
  if (res.headersSent) {
    return next(error);
  }
  
  const statusCode = error.statusCode || error.status || 500;
  
  const spookyErrorMessages = {
    400: '👻 The spirits are confused by your request format',
    401: '🔐 You need proper magical credentials to access this realm',
    403: '🚫 The ancient guardians forbid access to this sacred ground',
    404: '🕳️ This endpoint has vanished into the digital void',
    429: '⚡ The magical barriers are up! Too many requests detected',
    500: '💀 The server spirits are having a bad day. Please try again later.'
  };
  
  const message = spookyErrorMessages[statusCode as keyof typeof spookyErrorMessages] 
    || '👻 Something spooky happened in the digital realm';
  
  const response = createApiResponse(
    null,
    message,
    false
  );
  
  res.status(statusCode).json(response);
};

/**
 * 🎭 Request ID generator for tracking
 */
export const requestIdGenerator = (req: Request, res: Response, next: NextFunction): void => {
  // Generate a spooky request ID
  const spookyPrefixes = ['ghost', 'zombie', 'witch', 'vampire', 'spirit', 'phantom'];
  const randomPrefix = spookyPrefixes[Math.floor(Math.random() * spookyPrefixes.length)];
  const randomNumber = Math.floor(Math.random() * 9999);
  
  const requestId = `${randomPrefix}-${randomNumber}-${Date.now()}`;
  
  // Add to request object for use in controllers
  (req as any).requestId = requestId;
  
  // Add to response headers
  res.setHeader('X-Request-ID', requestId);
  
  next();
};

/**
 * 🧙‍♀️ Validate content type for POST/PUT requests
 */
export const validateContentType = (req: Request, res: Response, next: NextFunction): void => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const response = createApiResponse(
        null,
        '🧙‍♀️ The spirits only accept JSON offerings! Please set Content-Type to application/json',
        false
      );
      res.status(400).json(response);
      return;
    }
  }
  
  next();
};