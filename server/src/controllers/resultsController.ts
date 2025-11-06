/**
 * 📊 Results Controller - The Raw Data Keeper 📊
 * Handles direct access to evaluation results with minimal processing
 */

import { Request, Response } from 'express';
import { GraveyardService } from '@/services/graveyardService';
import { ApiResponse, FilterParams, PaginationParams } from '@/types/graveyard';
import { createApiResponse, handleControllerError } from '@/utils/apiHelpers';

export class ResultsController {
  constructor(private graveyardService: GraveyardService) {}

  /**
   * 📋 GET /api/results - Get raw evaluation results
   */
  getAllResults = async (req: Request, res: Response): Promise<void> => {
    try {
      const pagination = this.parsePagination(req.query);
      const filters = this.parseFilters(req.query);

      const allResults = await this.graveyardService.getAllResults();
      
      // Apply filters if provided
      let filteredResults = allResults;
      if (Object.keys(filters).length > 0) {
        filteredResults = this.applyFilters(allResults, filters);
      }

      // Apply sorting
      if (pagination.sort_by) {
        filteredResults = this.sortResults(filteredResults, pagination.sort_by, pagination.sort_order || 'desc');
      }

      // Apply pagination
      const total = filteredResults.length;
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedResults = filteredResults.slice(startIndex, startIndex + pagination.limit);

      const response: ApiResponse = createApiResponse({
        results: paginatedResults,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages: Math.ceil(total / pagination.limit)
        },
        filters_applied: filters,
        sort_applied: {
          sort_by: pagination.sort_by,
          sort_order: pagination.sort_order
        }
      }, `📊 Retrieved ${paginatedResults.length} raw evaluation results from the archives`);

      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to retrieve evaluation results from the digital archives');
    }
  };

  /**
   * 🔍 GET /api/results/:id - Get specific evaluation result by ID
   */
  getResultById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.graveyardService.getResultById(id);

      if (!result) {
        const response: ApiResponse = createApiResponse(
          null, 
          '🕳️ Evaluation result not found in the digital archives', 
          false
        );
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = createApiResponse(
        result, 
        '📜 Evaluation result summoned from the archives'
      );
      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to summon evaluation result from the archives');
    }
  };

  /**
   * 📈 GET /api/results/metrics - Get aggregated metrics across all results
   */
  getAggregatedMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
      const results = await this.graveyardService.getAllResults();
      
      if (results.length === 0) {
        const response: ApiResponse = createApiResponse({
          total_results: 0,
          message: 'No evaluation results found in the archives'
        }, '📭 The evaluation archives are empty');
        res.json(response);
        return;
      }

      // Calculate aggregated metrics
      const aggregatedMetrics = this.calculateAggregatedMetrics(results);

      const response: ApiResponse = createApiResponse(
        aggregatedMetrics,
        `📊 Aggregated metrics calculated from ${results.length} evaluation results`
      );
      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to calculate aggregated metrics');
    }
  };

  /**
   * 🏷️ GET /api/results/by-provider/:provider - Get results filtered by LLM provider
   */
  getResultsByProvider = async (req: Request, res: Response): Promise<void> => {
    try {
      const { provider } = req.params;
      const pagination = this.parsePagination(req.query);

      const allResults = await this.graveyardService.getAllResults();
      
      // Filter by provider
      const providerResults = allResults.filter(result => 
        Object.keys(result.llm_responses).includes(provider)
      );

      // Apply pagination
      const total = providerResults.length;
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedResults = providerResults.slice(startIndex, startIndex + pagination.limit);

      const response: ApiResponse = createApiResponse({
        provider,
        results: paginatedResults,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages: Math.ceil(total / pagination.limit)
        }
      }, `🔮 Found ${total} results for ${provider} provider`);

      res.json(response);
    } catch (error) {
      handleControllerError(res, error, `Failed to retrieve results for provider: ${req.params.provider}`);
    }
  };

  /**
   * 📅 GET /api/results/by-date - Get results filtered by date range
   */
  getResultsByDateRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const { start_date, end_date } = req.query;
      const pagination = this.parsePagination(req.query);

      if (!start_date || !end_date) {
        const response: ApiResponse = createApiResponse(
          null,
          '📅 Both start_date and end_date are required for date range filtering',
          false
        );
        res.status(400).json(response);
        return;
      }

      const allResults = await this.graveyardService.getAllResults();
      
      // Filter by date range
      const startDateTime = new Date(start_date as string);
      const endDateTime = new Date(end_date as string);
      
      const dateFilteredResults = allResults.filter(result => {
        const resultDate = new Date(result.timestamp);
        return resultDate >= startDateTime && resultDate <= endDateTime;
      });

      // Apply pagination
      const total = dateFilteredResults.length;
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedResults = dateFilteredResults.slice(startIndex, startIndex + pagination.limit);

      const response: ApiResponse = createApiResponse({
        date_range: {
          start_date: start_date,
          end_date: end_date
        },
        results: paginatedResults,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages: Math.ceil(total / pagination.limit)
        }
      }, `📅 Found ${total} results in the specified date range`);

      res.json(response);
    } catch (error) {
      handleControllerError(res, error, 'Failed to filter results by date range');
    }
  };

  /**
   * 🔧 Apply filters to results
   */
  private applyFilters(results: any[], filters: FilterParams): any[] {
    return results.filter(result => {
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
      
      if (filters.llm_provider) {
        const hasProvider = Object.keys(result.llm_responses).includes(filters.llm_provider);
        if (!hasProvider) return false;
      }
      
      return true;
    });
  }

  /**
   * 📈 Sort results by specified field
   */
  private sortResults(results: any[], sortBy: string, order: 'asc' | 'desc'): any[] {
    return results.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'score':
          aValue = a.zombie_status.overall_score;
          bValue = b.zombie_status.overall_score;
          break;
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'cost':
          aValue = Object.values(a.llm_responses).reduce((sum: number, resp: any) => sum + (resp.cost_usd || 0), 0);
          bValue = Object.values(b.llm_responses).reduce((sum: number, resp: any) => sum + (resp.cost_usd || 0), 0);
          break;
        case 'latency':
          aValue = this.calculateAverageLatency([a]);
          bValue = this.calculateAverageLatency([b]);
          break;
        default:
          return 0;
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  /**
   * 📊 Calculate aggregated metrics across all results
   */
  private calculateAggregatedMetrics(results: any[]): any {
    const totalResults = results.length;
    const zombieResults = results.filter(r => r.zombie_status.is_zombie);
    
    // Calculate averages
    const avgScore = results.reduce((sum, r) => sum + r.zombie_status.overall_score, 0) / totalResults;
    const totalCost = results.reduce((sum, r) => 
      sum + Object.values(r.llm_responses).reduce((respSum: number, resp: any) => 
        respSum + (resp.cost_usd || 0), 0), 0);
    const avgLatency = this.calculateAverageLatency(results);

    // Provider statistics
    const providerStats = this.calculateProviderStats(results);
    
    // Severity breakdown
    const severityBreakdown = zombieResults.reduce((acc, result) => {
      const severity = result.zombie_status.severity;
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Time-based statistics
    const timeStats = this.calculateTimeStats(results);

    return {
      total_results: totalResults,
      zombie_count: zombieResults.length,
      zombie_rate: zombieResults.length / totalResults,
      living_count: totalResults - zombieResults.length,
      
      performance_metrics: {
        avg_score: avgScore,
        total_cost_usd: totalCost,
        avg_latency_ms: avgLatency,
        cost_per_result: totalCost / totalResults
      },
      
      provider_statistics: providerStats,
      severity_breakdown: severityBreakdown,
      time_statistics: timeStats,
      
      calculated_at: new Date().toISOString()
    };
  }

  /**
   * 📊 Calculate provider-specific statistics
   */
  private calculateProviderStats(results: any[]): Record<string, any> {
    const providerStats: Record<string, any> = {};
    
    results.forEach(result => {
      Object.entries(result.llm_responses).forEach(([provider, response]: [string, any]) => {
        if (!providerStats[provider]) {
          providerStats[provider] = {
            total_calls: 0,
            successful_calls: 0,
            failed_calls: 0,
            total_cost: 0,
            total_latency: 0,
            avg_cost: 0,
            avg_latency: 0
          };
        }
        
        providerStats[provider].total_calls++;
        
        if (response.error) {
          providerStats[provider].failed_calls++;
        } else {
          providerStats[provider].successful_calls++;
          providerStats[provider].total_cost += response.cost_usd || 0;
          providerStats[provider].total_latency += response.latency_ms || 0;
        }
      });
    });
    
    // Calculate averages
    Object.values(providerStats).forEach((stats: any) => {
      if (stats.successful_calls > 0) {
        stats.avg_cost = stats.total_cost / stats.successful_calls;
        stats.avg_latency = stats.total_latency / stats.successful_calls;
      }
      stats.success_rate = stats.successful_calls / stats.total_calls;
    });
    
    return providerStats;
  }

  /**
   * ⏰ Calculate time-based statistics
   */
  private calculateTimeStats(results: any[]): any {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const last24Hours = results.filter(r => new Date(r.timestamp) >= oneDayAgo);
    const lastWeek = results.filter(r => new Date(r.timestamp) >= oneWeekAgo);
    
    return {
      last_24_hours: {
        total_results: last24Hours.length,
        zombie_count: last24Hours.filter(r => r.zombie_status.is_zombie).length
      },
      last_week: {
        total_results: lastWeek.length,
        zombie_count: lastWeek.filter(r => r.zombie_status.is_zombie).length
      },
      oldest_result: results.length > 0 ? 
        results.reduce((oldest, current) => 
          new Date(current.timestamp) < new Date(oldest.timestamp) ? current : oldest
        ).timestamp : null,
      newest_result: results.length > 0 ? 
        results.reduce((newest, current) => 
          new Date(current.timestamp) > new Date(newest.timestamp) ? current : newest
        ).timestamp : null
    };
  }

  /**
   * 📊 Calculate average latency for results
   */
  private calculateAverageLatency(results: any[]): number {
    if (results.length === 0) return 0;
    
    const totalLatency = results.reduce((sum, result) => {
      const responseLatencies = Object.values(result.llm_responses)
        .filter((resp: any) => resp.latency_ms !== undefined)
        .map((resp: any) => resp.latency_ms!);
      
      const avgLatency = responseLatencies.length > 0 
        ? responseLatencies.reduce((a, b) => a + b, 0) / responseLatencies.length 
        : 0;
      
      return sum + avgLatency;
    }, 0);
    
    return totalLatency / results.length;
  }

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