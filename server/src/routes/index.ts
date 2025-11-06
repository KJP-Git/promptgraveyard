/**
 * 🗺️ API Routes Index - The Master Grimoire 🗺️
 * Central routing configuration for the Prompt Graveyard API
 */

import { Router } from 'express';
import promptsRoutes from './promptsRoutes';
import resultsRoutes from './resultsRoutes';
import revivalRoutes from './revivalRoutes';
import { createApiResponse } from '@/utils/apiHelpers';

const router = Router();

/**
 * 🎃 Root API endpoint - Welcome to the graveyard
 */
router.get('/', (req, res) => {
  const welcomeData = {
    message: '🎃 Welcome to the Prompt Graveyard API! 🎃',
    description: 'Where prompts come to be evaluated... and possibly become zombies 🧟‍♂️',
    version: '1.0.0',
    endpoints: {
      prompts: {
        description: 'Manage and retrieve prompt evaluation results',
        routes: [
          'GET /api/prompts - Get all prompts with filtering',
          'GET /api/prompts/stats - Get graveyard statistics',
          'GET /api/prompts/zombies - Get zombie prompts',
          'GET /api/prompts/living - Get living prompts',
          'GET /api/prompts/:id - Get specific prompt'
        ]
      },
      results: {
        description: 'Raw evaluation results and aggregated metrics',
        routes: [
          'GET /api/results - Get all raw evaluation results',
          'GET /api/results/metrics - Get aggregated metrics',
          'GET /api/results/by-provider/:provider - Get results by LLM provider',
          'GET /api/results/by-date - Get results by date range',
          'GET /api/results/:id - Get specific evaluation result'
        ]
      },
      revival: {
        description: 'Necromancy services for bringing zombie prompts back to life',
        routes: [
          'POST /api/revive - Attempt to revive a zombie prompt',
          'GET /api/revive/stats - Get revival statistics',
          'GET /api/revive/suggestions/:promptId - Get revival suggestions',
          'GET /api/revive/history/:promptId - Get revival history',
          'POST /api/revive/save-improved/:revivalId - Save improved prompt'
        ]
      }
    },
    spooky_features: [
      '👻 Halloween-themed responses and error messages',
      '🧟‍♂️ Zombie prompt classification and revival',
      '📊 Comprehensive evaluation metrics and statistics',
      '🔮 AI-powered revival suggestions',
      '⚡ Real-time evaluation results',
      '🎭 Spooky middleware and logging'
    ],
    documentation: 'https://github.com/your-repo/prompt-graveyard#api-documentation',
    support: 'May the spirits guide your API calls! 🌟'
  };

  const response = createApiResponse(
    welcomeData,
    'Welcome, brave soul, to the digital realm of prompt evaluation! 🏚️'
  );

  res.json(response);
});

/**
 * 📊 Health check endpoint
 */
router.get('/health', (req, res) => {
  const healthData = {
    status: 'alive', // Not zombie! 😄
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    spooky_status: '🎃 All systems are delightfully haunted!'
  };

  const response = createApiResponse(
    healthData,
    '✨ The API spirits are alive and well!'
  );

  res.json(response);
});

/**
 * 🧟‍♂️ Mount route modules
 */
router.use('/prompts', promptsRoutes);
router.use('/results', resultsRoutes);
router.use('/revive', revivalRoutes);

/**
 * 🕳️ Catch-all for undefined routes
 */
router.use('*', (req, res) => {
  const response = createApiResponse(
    null,
    `🕳️ The endpoint '${req.originalUrl}' has vanished into the digital void. Check your spell... er, URL!`,
    false
  );

  res.status(404).json(response);
});

export default router;