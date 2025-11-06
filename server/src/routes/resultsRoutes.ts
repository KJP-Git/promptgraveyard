/**
 * 📊 Results Routes - The Raw Data Pathways 📊
 * All routes related to raw evaluation results access
 */

import { Router } from 'express';
import { ResultsController } from '@/controllers/resultsController';
import { GraveyardService } from '@/services/graveyardService';

const router = Router();

// Initialize services and controllers
const graveyardService = new GraveyardService();
const resultsController = new ResultsController(graveyardService);

/**
 * 📋 GET /api/results - Get all raw evaluation results with filtering and pagination
 * Query parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - is_zombie: boolean
 * - severity: string
 * - min_score: number
 * - max_score: number
 * - llm_provider: string
 * - sort_by: string (timestamp, score, cost, latency)
 * - sort_order: string (asc, desc)
 */
router.get('/', resultsController.getAllResults);

/**
 * 📈 GET /api/results/metrics - Get aggregated metrics across all results
 */
router.get('/metrics', resultsController.getAggregatedMetrics);

/**
 * 🏷️ GET /api/results/by-provider/:provider - Get results filtered by LLM provider
 * Supports pagination query parameters
 */
router.get('/by-provider/:provider', resultsController.getResultsByProvider);

/**
 * 📅 GET /api/results/by-date - Get results filtered by date range
 * Query parameters:
 * - start_date: string (ISO date format, required)
 * - end_date: string (ISO date format, required)
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 */
router.get('/by-date', resultsController.getResultsByDateRange);

/**
 * 🔍 GET /api/results/:id - Get specific evaluation result by ID
 */
router.get('/:id', resultsController.getResultById);

export default router;