/**
 * 🏚️ Graveyard Service - The Keeper of Dead Prompts 🏚️
 * Manages the eternal resting place of evaluation results...
 */

import fs from 'fs/promises';
import path from 'path';
import { 
  EvaluationResult, 
  PromptSummary, 
  GraveyardStats, 
  FilterParams, 
  PaginationParams 
} from '@/types/graveyard';

export class GraveyardService {
  private readonly resultsPath: string;
  private cachedResults: EvaluationResult[] = [];
  private lastCacheUpdate: number = 0;
  private readonly cacheTimeout = 30000; // 30 seconds

  constructor(dataPath: string = '../data') {
    this.resultsPath = path.resolve(__dirname, dataPath, 'results.json');
  }

  /**
   * 👻 Summon all evaluation results from the graveyard
   */
  async getAllResults(): Promise<EvaluationResult[]> {
    await this.refreshCacheIfNeeded();
    return [...this.cachedResults]; // Return copy to prevent mutations
  }

  /**
   * 🔍 Find a specific prompt by its cursed ID
   */
  async getResultById(promptId: string): Promise<EvaluationResult | null> {
    const results = await this.getAllResults();
    return results.find(result => result.prompt_id === promptId) || null;
  }

  /**
   * 📊 Get spooky statistics about the graveyard
   */
  async getGraveyardStats(): Promise<GraveyardStats> {
    const results = await this.getAllResults();
    
    if (results.length === 0) {
      return this.getEmptyStats();
    }

    const zombieResults = results.filter(r => r.zombie_status.is_zombie);
    const totalCost = results.reduce((sum, r) => 
      sum + Object.values(r.llm_responses).reduce((respSum, resp) => 
        respSum + (resp.cost_usd || 0), 0), 0);
    
    const avgLatency = this.calculateAverageLatency(results);
    const avgScore = results.reduce((sum, r) => sum + r.zombie_status.overall_score, 0) / results.length;
    
    // Count severity breakdown
    const severityBreakdown = zombieResults.reduce((acc, result) => {
      const severity = result.zombie_status.severity;
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get recent activity (last 10 results)
    const recentActivity = results
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(this.mapToPromptSummary);

    return {
      total_prompts: results.length,
      zombie_count: zombieResults.length,
      zombie_rate: zombieResults.length / results.length,
      avg_score: avgScore,
      total_cost: totalCost,
      avg_latency: avgLatency,
      revival_success_rate: this.calculateRevivalSuccessRate(results),
      severity_breakdown: severityBreakdown,
      recent_activity: recentActivity
    };
  }

  /**
   * 🧟‍♂️ Get all zombie prompts (the undead ones)
   */
  async getZombiePrompts(filters?: FilterParams, pagination?: PaginationParams): Promise<{
    zombies: PromptSummary[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const results = await this.getAllResults();
    let zombies = results.filter(r => r.zombie_status.is_zombie);

    // Apply filters
    if (filters) {
      zombies = this.applyFilters(zombies, filters);
    }

    const total = zombies.length;

    // Apply pagination
    if (pagination) {
      const { page, limit, sort_by, sort_order } = pagination;
      
      // Sort
      if (sort_by) {
        zombies = this.sortResults(zombies, sort_by, sort_order || 'desc');
      }

      // Paginate
      const startIndex = (page - 1) * limit;
      zombies = zombies.slice(startIndex, startIndex + limit);
    }

    return {
      zombies: zombies.map(this.mapToPromptSummary),
      total,
      page: pagination?.page || 1,
      totalPages: pagination ? Math.ceil(total / pagination.limit) : 1
    };
  }

  /**
   * ✨ Get living prompts (the successful ones)
   */
  async getLivingPrompts(pagination?: PaginationParams): Promise<{
    living: PromptSummary[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const results = await this.getAllResults();
    let living = results.filter(r => !r.zombie_status.is_zombie);

    const total = living.length;

    // Apply pagination
    if (pagination) {
      const { page, limit, sort_by, sort_order } = pagination;
      
      // Sort by score (highest first for living prompts)
      if (sort_by) {
        living = this.sortResults(living, sort_by, sort_order || 'desc');
      }

      const startIndex = (page - 1) * limit;
      living = living.slice(startIndex, startIndex + limit);
    }

    return {
      living: living.map(this.mapToPromptSummary),
      total,
      page: pagination?.page || 1,
      totalPages: pagination ? Math.ceil(total / pagination.limit) : 1
    };
  }

  /**
   * 🔄 Refresh the cache if it's getting stale
   */
  private async refreshCacheIfNeeded(): Promise<void> {
    const now = Date.now();
    if (now - this.lastCacheUpdate > this.cacheTimeout) {
      await this.loadResultsFromFile();
      this.lastCacheUpdate = now;
    }
  }

  /**
   * 📖 Read the cursed results from the JSON file
   */
  private async loadResultsFromFile(): Promise<void> {
    try {
      const fileContent = await fs.readFile(this.resultsPath, 'utf-8');
      
      // Handle JSONL format (one JSON object per line)
      const lines = fileContent.trim().split('\n').filter(line => line.trim());
      this.cachedResults = lines.map(line => JSON.parse(line) as EvaluationResult);
      
      console.log(`👻 Loaded ${this.cachedResults.length} cursed results from graveyard`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log('📁 No results file found - graveyard is empty');
        this.cachedResults = [];
      } else {
        console.error('💀 Failed to read from graveyard:', error);
        throw new Error('Failed to access the graveyard records');
      }
    }
  }

  /**
   * 🎯 Apply filters to results
   */
  private applyFilters(results: EvaluationResult[], filters: FilterParams): EvaluationResult[] {
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
      
      if (filters.date_from) {
        const resultDate = new Date(result.timestamp);
        const fromDate = new Date(filters.date_from);
        if (resultDate < fromDate) return false;
      }
      
      if (filters.date_to) {
        const resultDate = new Date(result.timestamp);
        const toDate = new Date(filters.date_to);
        if (resultDate > toDate) return false;
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
  private sortResults(results: EvaluationResult[], sortBy: string, order: 'asc' | 'desc'): EvaluationResult[] {
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
          aValue = Object.values(a.llm_responses).reduce((sum, resp) => sum + (resp.cost_usd || 0), 0);
          bValue = Object.values(b.llm_responses).reduce((sum, resp) => sum + (resp.cost_usd || 0), 0);
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
   * 📊 Calculate average latency for results
   */
  private calculateAverageLatency(results: EvaluationResult[]): number {
    if (results.length === 0) return 0;
    
    const totalLatency = results.reduce((sum, result) => {
      const responseLatencies = Object.values(result.llm_responses)
        .filter(resp => resp.latency_ms !== undefined)
        .map(resp => resp.latency_ms!);
      
      const avgLatency = responseLatencies.length > 0 
        ? responseLatencies.reduce((a, b) => a + b, 0) / responseLatencies.length 
        : 0;
      
      return sum + avgLatency;
    }, 0);
    
    return totalLatency / results.length;
  }

  /**
   * 📈 Calculate revival success rate (placeholder for now)
   */
  private calculateRevivalSuccessRate(results: EvaluationResult[]): number {
    // For now, return a mock value
    // In a real implementation, you'd track revival attempts and successes
    const zombiesWithSuggestions = results.filter(r => 
      r.zombie_status.is_zombie && r.revival_suggestions.length > 0
    );
    
    return zombiesWithSuggestions.length > 0 ? 0.65 : 0; // 65% mock success rate
  }

  /**
   * 🗺️ Map evaluation result to prompt summary
   */
  private mapToPromptSummary = (result: EvaluationResult): PromptSummary => {
    const totalCost = Object.values(result.llm_responses)
      .reduce((sum, resp) => sum + (resp.cost_usd || 0), 0);
    
    const avgLatency = this.calculateAverageLatency([result]);
    const llmCount = Object.keys(result.llm_responses).length;

    return {
      prompt_id: result.prompt_id,
      file_path: result.file_path,
      prompt_text: result.prompt_text,
      timestamp: result.timestamp,
      overall_score: result.zombie_status.overall_score,
      is_zombie: result.zombie_status.is_zombie,
      severity: result.zombie_status.severity,
      total_cost: totalCost,
      avg_latency: avgLatency,
      llm_count: llmCount
    };
  };

  /**
   * 🏗️ Get empty stats structure
   */
  private getEmptyStats(): GraveyardStats {
    return {
      total_prompts: 0,
      zombie_count: 0,
      zombie_rate: 0,
      avg_score: 0,
      total_cost: 0,
      avg_latency: 0,
      revival_success_rate: 0,
      severity_breakdown: {},
      recent_activity: []
    };
  }
}