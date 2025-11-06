/**
 * 📝 Prompts Controller - The Graveyard Keeper 📝
 * Handles all prompt-related API endpoints with spooky flair
 */

import { Request, Response } from 'express';
import { GraveyardService } from '@/services/graveyardService';
import { ApiResponse, FilterParams, PaginationParams } from '@/types/graveyard';
import { createApiResponse, handleControllerError } from '@/utils/apiHelpers';

export class PromptsController {
  constructor(private graveyardService: GraveyardService) {}

  /**
   * 📋 GET /api/prompts - Get all prompts with optional filtering
   */
  getAllPrompts = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = this.parseFilters(req.query);
      const pagination = this.parsePagination(req.query);

      const results = await this.graveyardService.getAllResults();
      
      // Apply filters if provided
      let filteredResults = results;
      if (Object.keys(filters).length > 0) {
        // For simplicity, we'll get all and filter client-side
        // In production, you'd want database-level filtering
        filteredResults = results.filter(result => {
          if (filters.is_zombie !== undefined && result.zombie_status.is_zombie !== filters.is_zombie) {
            return false;
          }
          if (filters.severity && result.zombie_status.severity !== filters.severity) {
            return false;
          }
          if (filters.min_score !== undefined && result.zombie_status.overall_score < filters.min_score) {
            return false;
          }
          if (filters.max_score !== undefined && result.zombie_status.overall_score > filters.max_score) {
            return false;
          }
          return true;
        });
      }

      // Apply pagination
      const total = filteredResults.length;
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedResults = filteredResults.slice(startIndex, startIndex + pagination.limit);

      const response: ApiResponse = createApiResponse({
        prompts: paginatedResults,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages: Math.ceil(total / pagination.limit)
        }
      }, 'Prompts retrieved from the graveyard');

      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to retrieve prompts from the graveyard');
    }
  };

  /**
   * 🔍 GET /api/prompts/:id - Get specific prompt by ID
   */
  getPromptById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.graveyardService.getResultById(id);

      if (!result) {
        const response: ApiResponse = createApiResponse(
          null, 
          'Prompt not found in the graveyard', 
          false
        );
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = createApiResponse(
        result, 
        'Prompt summoned from the graveyard'
      );
      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to summon prompt from the graveyard');
    }
  };

  /**
   * 🧟‍♂️ GET /api/prompts/zombies - Get all zombie prompts
   */
  getZombiePrompts = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = this.parseFilters(req.query);
      const pagination = this.parsePagination(req.query);

      const result = await this.graveyardService.getZombiePrompts(filters, pagination);

      const response: ApiResponse = createApiResponse(
        result, 
        `Found ${result.total} zombie prompts lurking in the graveyard`
      );
      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to locate zombie prompts');
    }
  };

  /**
   * ✨ GET /api/prompts/living - Get all living (successful) prompts
   */
  getLivingPrompts = async (req: Request, res: Response): Promise<void> => {
    try {
      const pagination = this.parsePagination(req.query);

      const result = await this.graveyardService.getLivingPrompts(pagination);

      const response: ApiResponse = createApiResponse(
        result, 
        `Found ${result.total} living prompts thriving in the realm`
      );
      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to locate living prompts');
    }
  };

  /**
   * 📊 GET /api/prompts/stats - Get graveyard statistics
   */
  getGraveyardStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.graveyardService.getGraveyardStats();

      const response: ApiResponse = createApiResponse(
        stats, 
        'Graveyard statistics conjured from the digital realm'
      );
      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to conjure graveyard statistics');
    }
  };

  /**
   * 🔧 Parse filter parameters from query string
   */
  private parseFilters(query: any): FilterParams {
    const filters: FilterParams = {};

    if (query.is_zombie !== undefined) {
      filters.is_zombie = query.is_zombie === 'true';
    }
    if (query.severity) {
      filters.severity = query.severity;
    }
    if (query.min_score !== undefined) {
      filters.min_score = parseFloat(query.min_score);
    }
    if (query.max_score !== undefined) {
      filters.max_score = parseFloat(query.max_score);
    }
    if (query.date_from) {
      filters.date_from = query.date_from;
    }
    if (query.date_to) {
      filters.date_to = query.date_to;
    }
    if (query.llm_provider) {
      filters.llm_provider = query.llm_provider;
    }

    return filters;
  }

  /**
   * 📄 Parse pagination parameters from query string
   */
  private parsePagination(query: any): PaginationParams {
    return {
      page: parseInt(query.page) || 1,
      limit: Math.min(parseInt(query.limit) || 20, 100), // Max 100 per page
      sort_by: query.sort_by || 'timestamp',
      sort_order: query.sort_order === 'asc' ? 'asc' : 'desc'
    };
  }
}