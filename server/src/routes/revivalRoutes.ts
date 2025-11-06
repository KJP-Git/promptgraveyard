/**
 * 🧙‍♀️ Revival Routes - The Necromancy Pathways 🧙‍♀️
 * All routes related to prompt revival and resurrection
 */

import { Router } from 'express';
import { RevivalController } from '@/controllers/revivalController';
import { RevivalService } from '@/services/revivalService';
import { GraveyardService } from '@/services/graveyardService';

const router = Router();

// Initialize services and controllers
const graveyardService = new GraveyardService();
const revivalService = new RevivalService(graveyardService);
const revivalController = new RevivalController(revivalService);

/**
 * 🧟‍♂️➡️✨ POST /api/revive - Attempt to revive a zombie prompt
 * Body:
 * {
 *   "prompt_id": "string",
 *   "suggestion_index": number,
 *   "user_feedback": "string" (optional)
 * }
 */
router.post('/', revivalController.revivePrompt);

/**
 * 📊 GET /api/revive/stats - Get revival statistics
 */
router.get('/stats', revivalController.getRevivalStats);

/**
 * 🔮 GET /api/revive/suggestions/:promptId - Get revival suggestions for a prompt
 */
router.get('/suggestions/:promptId', revivalController.getRevivalSuggestions);

/**
 * 📜 GET /api/revive/history/:promptId - Get revival history for a specific prompt
 */
router.get('/history/:promptId', revivalController.getRevivalHistory);

/**
 * 💾 POST /api/revive/save-improved/:revivalId - Save improved prompt to file
 * Body:
 * {
 *   "improved_prompt": "string"
 * }
 */
router.post('/save-improved/:revivalId', revivalController.saveImprovedPrompt);

export default router;