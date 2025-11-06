/**
 * 🧙‍♀️ Revival Controller - The Necromancy API 🧙‍♀️
 * Handles all revival-related endpoints for bringing zombies back to life
 */

import { Request, Response } from 'express';
import Joi from 'joi';
import { RevivalService } from '@/services/revivalService';
import { ApiResponse, RevivalRequest } from '@/types/graveyard';
import { createApiResponse, handleControllerError, validateRequest } from '@/utils/apiHelpers';

export class RevivalController {
  constructor(private revivalService: RevivalService) {}

  /**
   * 🧟‍♂️➡️✨ POST /api/revive - Attempt to revive a zombie prompt
   */
  revivePrompt = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const validationResult = validateRequest(req.body, this.revivalRequestSchema);
      if (!validationResult.isValid) {
        const response: ApiResponse = createApiResponse(
          null,
          `Invalid revival ritual: ${validationResult.error}`,
          false
        );
        res.status(400).json(response);
        return;
      }

      const revivalRequest: RevivalRequest = req.body;
      const result = await this.revivalService.revivePrompt(revivalRequest);

      const statusCode = result.success ? 200 : 400;
      const response: ApiResponse = createApiResponse(
        result,
        result.message,
        result.success
      );

      res.status(statusCode).json(response);
    } catch (error) {
      handleControllerError(res, error, 'Revival ritual was interrupted by dark forces');
    }
  };

  /**
   * 📜 GET /api/revive/history/:promptId - Get revival history for a prompt
   */
  getRevivalHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { promptId } = req.params;
      
      if (!promptId) {
        const response: ApiResponse = createApiResponse(
          null,
          'Prompt ID is required to access the revival archives',
          false
        );
        res.status(400).json(response);
        return;
      }

      const history = await this.revivalService.getRevivalHistory(promptId);

      const response: ApiResponse = createApiResponse(
        { 
          prompt_id: promptId,
          revival_attempts: history,
          total_attempts: history.length
        },
        `Retrieved ${history.length} revival attempts from the archives`
      );

      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to access revival archives');
    }
  };

  /**
   * 📊 GET /api/revive/stats - Get revival statistics
   */
  getRevivalStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.revivalService.getRevivalStats();

      const response: ApiResponse = createApiResponse(
        stats,
        'Revival statistics summoned from the necromantic records'
      );

      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to conjure revival statistics');
    }
  };

  /**
   * 💾 POST /api/revive/save-improved/:revivalId - Save improved prompt to file
   */
  saveImprovedPrompt = async (req: Request, res: Response): Promise<void> => {
    try {
      const { revivalId } = req.params;
      const { improved_prompt } = req.body;

      if (!revivalId || !improved_prompt) {
        const response: ApiResponse = createApiResponse(
          null,
          'Revival ID and improved prompt are required for preservation',
          false
        );
        res.status(400).json(response);
        return;
      }

      const filePath = await this.revivalService.saveImprovedPrompt(revivalId, improved_prompt);

      const response: ApiResponse = createApiResponse(
        { 
          revival_id: revivalId,
          file_path: filePath,
          saved_at: new Date().toISOString()
        },
        'Improved prompt has been preserved in the digital archives'
      );

      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to preserve improved prompt');
    }
  };

  /**
   * 🔮 GET /api/revive/suggestions/:promptId - Get revival suggestions for a prompt
   */
  getRevivalSuggestions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { promptId } = req.params;
      
      // This would typically come from the graveyard service
      // For now, we'll delegate to the graveyard service to get the prompt with suggestions
      const graveyardService = (this.revivalService as any).graveyardService;
      const result = await graveyardService.getResultById(promptId);

      if (!result) {
        const response: ApiResponse = createApiResponse(
          null,
          'Prompt not found in the graveyard',
          false
        );
        res.status(404).json(response);
        return;
      }

      if (!result.zombie_status.is_zombie) {
        const response: ApiResponse = createApiResponse(
          { suggestions: [] },
          'This prompt is already alive - no revival suggestions needed'
        );
        res.json(response);
        return;
      }

      const response: ApiResponse = createApiResponse(
        {
          prompt_id: promptId,
          is_zombie: result.zombie_status.is_zombie,
          severity: result.zombie_status.severity,
          suggestions: result.revival_suggestions,
          total_suggestions: result.revival_suggestions.length
        },
        `Found ${result.revival_suggestions.length} revival suggestions for this zombie prompt`
      );

      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to retrieve revival suggestions');
    }
  };

  /**
   * 📋 Validation schema for revival requests
   */
  private revivalRequestSchema = Joi.object({
    prompt_id: Joi.string().required().messages({
      'string.empty': 'Prompt ID cannot be empty',
      'any.required': 'Prompt ID is required for the revival ritual'
    }),
    suggestion_index: Joi.number().integer().min(0).required().messages({
      'number.base': 'Suggestion index must be a number',
      'number.integer': 'Suggestion index must be an integer',
      'number.min': 'Suggestion index must be 0 or greater',
      'any.required': 'Suggestion index is required to select the revival method'
    }),
    user_feedback: Joi.string().optional().allow('').messages({
      'string.base': 'User feedback must be a string'
    })
  });
}