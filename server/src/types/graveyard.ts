/**
 * 🧟‍♂️ Graveyard Type Definitions 🧟‍♂️
 * Where TypeScript types come to haunt our code...
 */

export interface SpookyMetric {
  value: number;
  normalized_score: number;
  category: 'excellent' | 'good' | 'acceptable' | 'poor' | 'zombie';
  weight: number;
}

export interface LLMResponse {
  response?: string;
  latency_ms?: number;
  cost_usd?: number;
  timestamp: string;
  model?: string;
  error?: string;
}

export interface ZombieStatus {
  is_zombie: boolean;
  overall_score: number;
  severity: 'shambling_zombie' | 'rotting_zombie' | 'skeletal_zombie' | 'alive';
  visual_theme: string;
  revival_priority: 'low' | 'medium' | 'high';
  failed_critical_metrics: string[];
  reason: string;
}

export interface RevivalSuggestion {
  improved_prompt: string;
  strategy: string;
  technique: string;
  reasoning: string;
  confidence_score: number;
  expected_improvements: Record<string, number>;
}

export interface EvaluationResult {
  prompt_id: string;
  file_path: string;
  prompt_text: string;
  timestamp: string;
  llm_responses: Record<string, LLMResponse>;
  metrics: Record<string, SpookyMetric | any>;
  zombie_status: ZombieStatus;
  revival_suggestions: RevivalSuggestion[];
}

export interface PromptSummary {
  prompt_id: string;
  file_path: string;
  prompt_text: string;
  timestamp: string;
  overall_score: number;
  is_zombie: boolean;
  severity: string;
  total_cost: number;
  avg_latency: number;
  llm_count: number;
}

export interface GraveyardStats {
  total_prompts: number;
  zombie_count: number;
  zombie_rate: number;
  avg_score: number;
  total_cost: number;
  avg_latency: number;
  revival_success_rate: number;
  severity_breakdown: Record<string, number>;
  recent_activity: PromptSummary[];
}

export interface RevivalRequest {
  prompt_id: string;
  suggestion_index: number;
  user_feedback?: string;
}

export interface RevivalResponse {
  success: boolean;
  message: string;
  original_prompt: string;
  improved_prompt: string;
  expected_improvements: Record<string, number>;
  revival_id: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  request_id: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  is_zombie?: boolean;
  severity?: string;
  min_score?: number;
  max_score?: number;
  date_from?: string;
  date_to?: string;
  llm_provider?: string;
}