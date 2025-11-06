/**
 * 🧙‍♀️ Revival Service - The Prompt Necromancer 🧙‍♀️
 * Brings zombie prompts back from the digital afterlife...
 */

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { 
  RevivalRequest, 
  RevivalResponse, 
  EvaluationResult, 
  RevivalSuggestion 
} from '@/types/graveyard';
import { GraveyardService } from './graveyardService';

interface RevivalAttempt {
  revival_id: string;
  prompt_id: string;
  original_prompt: string;
  improved_prompt: string;
  suggestion_index: number;
  strategy: string;
  confidence_score: number;
  expected_improvements: Record<string, number>;
  timestamp: string;
  user_feedback?: string;
  status: 'pending' | 'success' | 'failed';
}

export class RevivalService {
  private readonly graveyardService: GraveyardService;
  private readonly revivalLogPath: string;

  constructor(graveyardService: GraveyardService, dataPath: string = '../data') {
    this.graveyardService = graveyardService;
    this.revivalLogPath = path.resolve(__dirname, dataPath, 'revival_log.json');
  }

  /**
   * 🧟‍♂️➡️✨ Attempt to revive a zombie prompt
   */
  async revivePrompt(request: RevivalRequest): Promise<RevivalResponse> {
    try {
      // Find the cursed prompt in the graveyard
      const zombieResult = await this.graveyardService.getResultById(request.prompt_id);
      
      if (!zombieResult) {
        return {
          success: false,
          message: '💀 Prompt not found in the graveyard',
          original_prompt: '',
          improved_prompt: '',
          expected_improvements: {},
          revival_id: ''
        };
      }

      if (!zombieResult.zombie_status.is_zombie) {
        return {
          success: false,
          message: '✨ This prompt is already alive! No revival needed.',
          original_prompt: zombieResult.prompt_text,
          improved_prompt: '',
          expected_improvements: {},
          revival_id: ''
        };
      }

      // Get the specific revival suggestion
      const suggestion = zombieResult.revival_suggestions[request.suggestion_index];
      
      if (!suggestion) {
        return {
          success: false,
          message: `🔮 Revival suggestion ${request.suggestion_index} not found`,
          original_prompt: zombieResult.prompt_text,
          improved_prompt: '',
          expected_improvements: {},
          revival_id: ''
        };
      }

      // Create revival attempt record
      const revivalAttempt: RevivalAttempt = {
        revival_id: uuidv4(),
        prompt_id: request.prompt_id,
        original_prompt: zombieResult.prompt_text,
        improved_prompt: suggestion.improved_prompt,
        suggestion_index: request.suggestion_index,
        strategy: suggestion.strategy,
        confidence_score: suggestion.confidence_score,
        expected_improvements: suggestion.expected_improvements,
        timestamp: new Date().toISOString(),
        user_feedback: request.user_feedback,
        status: 'pending'
      };

      // Log the revival attempt
      await this.logRevivalAttempt(revivalAttempt);

      // In a real implementation, you would:
      // 1. Save the improved prompt to a file
      // 2. Trigger re-evaluation
      // 3. Update the revival status based on results
      
      // For now, we'll simulate success based on confidence score
      const simulatedSuccess = suggestion.confidence_score > 0.6;
      revivalAttempt.status = simulatedSuccess ? 'success' : 'failed';
      
      // Update the log with final status
      await this.updateRevivalStatus(revivalAttempt.revival_id, revivalAttempt.status);

      return {
        success: simulatedSuccess,
        message: simulatedSuccess 
          ? `🎉 Revival ritual successful! The prompt has been brought back to life with ${suggestion.strategy} strategy.`
          : `💀 Revival ritual failed. The zombie resisted our necromancy. Try a different approach.`,
        original_prompt: zombieResult.prompt_text,
        improved_prompt: suggestion.improved_prompt,
        expected_improvements: suggestion.expected_improvements,
        revival_id: revivalAttempt.revival_id
      };

    } catch (error) {
      console.error('💀 Revival ritual failed:', error);
      return {
        success: false,
        message: '⚡ The revival ritual was interrupted by dark forces. Please try again.',
        original_prompt: '',
        improved_prompt: '',
        expected_improvements: {},
        revival_id: ''
      };
    }
  }

  /**
   * 📜 Get revival history for a specific prompt
   */
  async getRevivalHistory(promptId: string): Promise<RevivalAttempt[]> {
    try {
      const revivalLog = await this.loadRevivalLog();
      return revivalLog.filter(attempt => attempt.prompt_id === promptId);
    } catch (error) {
      console.error('📚 Failed to read revival history:', error);
      return [];
    }
  }

  /**
   * 📊 Get revival statistics
   */
  async getRevivalStats(): Promise<{
    total_attempts: number;
    successful_revivals: number;
    success_rate: number;
    most_successful_strategy: string;
    recent_revivals: RevivalAttempt[];
  }> {
    try {
      const revivalLog = await this.loadRevivalLog();
      
      const totalAttempts = revivalLog.length;
      const successfulRevivals = revivalLog.filter(attempt => attempt.status === 'success').length;
      const successRate = totalAttempts > 0 ? successfulRevivals / totalAttempts : 0;

      // Find most successful strategy
      const strategyStats = revivalLog.reduce((acc, attempt) => {
        if (attempt.status === 'success') {
          acc[attempt.strategy] = (acc[attempt.strategy] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const mostSuccessfulStrategy = Object.entries(strategyStats)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

      // Get recent revivals (last 10)
      const recentRevivals = revivalLog
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

      return {
        total_attempts: totalAttempts,
        successful_revivals: successfulRevivals,
        success_rate: successRate,
        most_successful_strategy: mostSuccessfulStrategy,
        recent_revivals: recentRevivals
      };
    } catch (error) {
      console.error('📊 Failed to calculate revival stats:', error);
      return {
        total_attempts: 0,
        successful_revivals: 0,
        success_rate: 0,
        most_successful_strategy: 'none',
        recent_revivals: []
      };
    }
  }

  /**
   * 💾 Log a revival attempt to the eternal records
   */
  private async logRevivalAttempt(attempt: RevivalAttempt): Promise<void> {
    try {
      const revivalLog = await this.loadRevivalLog();
      revivalLog.push(attempt);
      
      await fs.writeFile(
        this.revivalLogPath, 
        JSON.stringify(revivalLog, null, 2), 
        'utf-8'
      );
      
      console.log(`📝 Revival attempt logged: ${attempt.revival_id}`);
    } catch (error) {
      console.error('💀 Failed to log revival attempt:', error);
      throw error;
    }
  }

  /**
   * 🔄 Update revival status
   */
  private async updateRevivalStatus(revivalId: string, status: 'success' | 'failed'): Promise<void> {
    try {
      const revivalLog = await this.loadRevivalLog();
      const attemptIndex = revivalLog.findIndex(attempt => attempt.revival_id === revivalId);
      
      if (attemptIndex !== -1) {
        revivalLog[attemptIndex].status = status;
        
        await fs.writeFile(
          this.revivalLogPath, 
          JSON.stringify(revivalLog, null, 2), 
          'utf-8'
        );
        
        console.log(`🔄 Revival status updated: ${revivalId} -> ${status}`);
      }
    } catch (error) {
      console.error('💀 Failed to update revival status:', error);
    }
  }

  /**
   * 📖 Load revival log from file
   */
  private async loadRevivalLog(): Promise<RevivalAttempt[]> {
    try {
      const fileContent = await fs.readFile(this.revivalLogPath, 'utf-8');
      return JSON.parse(fileContent) as RevivalAttempt[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // File doesn't exist yet, return empty array
        return [];
      }
      throw error;
    }
  }

  /**
   * 💾 Save improved prompt to file system
   */
  async saveImprovedPrompt(revivalId: string, improvedPrompt: string): Promise<string> {
    try {
      const improvedPromptsDir = path.resolve(__dirname, '../data/improved_prompts');
      
      // Ensure directory exists
      await fs.mkdir(improvedPromptsDir, { recursive: true });
      
      const fileName = `revival_${revivalId}.txt`;
      const filePath = path.join(improvedPromptsDir, fileName);
      
      await fs.writeFile(filePath, improvedPrompt, 'utf-8');
      
      console.log(`💾 Improved prompt saved: ${fileName}`);
      return filePath;
    } catch (error) {
      console.error('💀 Failed to save improved prompt:', error);
      throw error;
    }
  }
}