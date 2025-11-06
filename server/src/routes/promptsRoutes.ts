/**
 * 📝 Prompts Routes - The Graveyard Pathways 📝
 * All routes related to prompt management and retrieval
 */

import { Router } from 'express';
import { PromptsController } from '@/controllers/promptsController';
import { GraveyardService } from '@/services/graveyardService';

const router = Router();

// Initialize services and controllers
const graveyardService = new GraveyardService();
const promptsController = new PromptsController(graveyardService);

/**
 * 📋 GET /api/prompts - Get all prompts with filtering and pagination
 * Query parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - is_zombie: boolean
 * - severity: string
 * - min_score: number
 * - max_score: number
 * - sort_by: string (timestamp, score, cost, latency)
 * - sort_order: string (asc, desc)
 */
router.get('/', promptsController.getAllPrompts);

/**
 * 📊 GET /api/prompts/stats - Get graveyard statistics
 */
router.get('/stats', promptsController.getGraveyardStats);

/**
 * 🧟‍♂️ GET /api/prompts/zombies - Get all zombie prompts
 * Supports same query parameters as /api/prompts
 */
router.get('/zombies', promptsController.getZombiePrompts);

/**
 * ✨ GET /api/prompts/living - Get all living (successful) prompts
 * Query parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - sort_by: string (timestamp, score, cost, latency)
 * - sort_order: string (asc, desc)
 */
router.get('/living', promptsController.getLivingPrompts);

/**
 * 🔍 GET /api/prompts/:id - Get specific prompt by ID
 */
router.get('/:id', promptsController.getPromptById);

export default router;