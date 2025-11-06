"""
📊 Metrics Calculator & Zombie Classifier 🧟‍♂️
Where we judge the quality of LLM responses and determine their fate...
"""

import asyncio
import statistics
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import re
import math


@dataclass
class MetricScore:
    """Individual metric score with details"""
    value: float
    normalized_score: float
    category: str  # excellent, good, acceptable, poor, zombie
    weight: float


class MetricsCalculator:
    """The Grand Judge of Response Quality 👨‍⚖️"""
    
    def __init__(self, metrics_config: Dict[str, Any]):
        self.config = metrics_config
        
    async def calculate_all_metrics(self, prompt: str, llm_responses: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate all configured metrics for the responses"""
        
        # Filter out failed responses
        valid_responses = {
            provider: resp for provider, resp in llm_responses.items()
            if 'response' in resp and 'error' not in resp
        }
        
        if not valid_responses:
            return {
                'error': 'No valid responses to evaluate',
                'total_responses': len(llm_responses),
                'failed_responses': len(llm_responses)
            }
        
        metrics = {}
        
        # Calculate latency metrics
        if 'latency' in self.config:
            metrics['latency'] = await self._calculate_latency_metrics(valid_responses)
        
        # Calculate cost efficiency
        if 'cost_efficiency' in self.config:
            metrics['cost_efficiency'] = await self._calculate_cost_metrics(valid_responses)
        
        # Calculate semantic accuracy
        if 'semantic_accuracy' in self.config:
            metrics['semantic_accuracy'] = await self._calculate_semantic_accuracy(
                prompt, valid_responses
            )
        
        # Calculate coherence
        if 'coherence' in self.config:
            metrics['coherence'] = await self._calculate_coherence_metrics(valid_responses)
        
        # Calculate creativity (if enabled for this prompt type)
        if 'creativity' in self.config:
            metrics['creativity'] = await self._calculate_creativity_metrics(
                prompt, valid_responses
            )
        
        # Calculate overall weighted score
        overall_score = self._calculate_weighted_score(metrics)
        
        # Add summary statistics
        metrics['summary'] = {
            'overall_score': overall_score,
            'total_responses': len(valid_responses),
            'failed_responses': len(llm_responses) - len(valid_responses),
            'avg_latency_ms': statistics.mean([
                resp['latency_ms'] for resp in valid_responses.values()
            ]),
            'total_cost_usd': sum([
                resp.get('cost_usd', 0) for resp in valid_responses.values()
            ])
        }
        
        return metrics
    
    async def _calculate_latency_metrics(self, responses: Dict[str, Any]) -> MetricScore:
        """Calculate latency performance metrics ⚡"""
        latencies = [resp['latency_ms'] for resp in responses.values()]
        avg_latency = statistics.mean(latencies)
        
        # Score based on configured thresholds
        config = self.config['latency']
        score_info = self._score_against_thresholds(avg_latency, config['scoring'])
        
        return MetricScore(
            value=avg_latency,
            normalized_score=score_info['score'],
            category=score_info['category'],
            weight=config['weight']
        )
    
    async def _calculate_cost_metrics(self, responses: Dict[str, Any]) -> MetricScore:
        """Calculate cost efficiency metrics 💰"""
        total_cost = sum([resp.get('cost_usd', 0) for resp in responses.values()])
        
        config = self.config['cost_efficiency']
        score_info = self._score_against_thresholds(total_cost, config['scoring'])
        
        return MetricScore(
            value=total_cost,
            normalized_score=score_info['score'],
            category=score_info['category'],
            weight=config['weight']
        )
    
    async def _calculate_semantic_accuracy(self, prompt: str, responses: Dict[str, Any]) -> MetricScore:
        """Calculate semantic accuracy using LLM judge 🎯"""
        config = self.config['semantic_accuracy']
        
        if config.get('scoring_method') == 'llm_judge':
            # Use LLM to judge semantic accuracy
            accuracy_scores = []
            
            for provider, resp in responses.items():
                try:
                    # Format the judge prompt
                    judge_prompt = config['judge_prompt'].format(
                        prompt=prompt,
                        response=resp['response']
                    )
                    
                    # For now, use a simple heuristic (in production, use actual LLM judge)
                    score = await self._heuristic_semantic_score(prompt, resp['response'])
                    accuracy_scores.append(score)
                    
                except Exception as e:
                    print(f"⚠️ Failed to judge {provider} response: {str(e)}")
                    accuracy_scores.append(0.5)  # Default neutral score
            
            avg_accuracy = statistics.mean(accuracy_scores) if accuracy_scores else 0.0
        else:
            # Fallback to heuristic scoring
            accuracy_scores = []
            for resp in responses.values():
                score = await self._heuristic_semantic_score(prompt, resp['response'])
                accuracy_scores.append(score)
            avg_accuracy = statistics.mean(accuracy_scores) if accuracy_scores else 0.0
        
        score_info = self._score_against_thresholds(avg_accuracy, config['scoring'])
        
        return MetricScore(
            value=avg_accuracy,
            normalized_score=score_info['score'],
            category=score_info['category'],
            weight=config['weight']
        )
    
    async def _calculate_coherence_metrics(self, responses: Dict[str, Any]) -> MetricScore:
        """Calculate response coherence metrics 🧠"""
        coherence_scores = []
        
        for resp in responses.values():
            score = await self._calculate_coherence_score(resp['response'])
            coherence_scores.append(score)
        
        avg_coherence = statistics.mean(coherence_scores) if coherence_scores else 0.0
        
        config = self.config['coherence']
        score_info = self._score_against_thresholds(avg_coherence, config['scoring'])
        
        return MetricScore(
            value=avg_coherence,
            normalized_score=score_info['score'],
            category=score_info['category'],
            weight=config['weight']
        )
    
    async def _calculate_creativity_metrics(self, prompt: str, responses: Dict[str, Any]) -> Optional[MetricScore]:
        """Calculate creativity metrics (if applicable) 🎨"""
        config = self.config['creativity']
        
        # Check if creativity is enabled for this prompt type
        enabled_types = config.get('enabled_for_prompts', [])
        if enabled_types:
            prompt_lower = prompt.lower()
            if not any(ptype in prompt_lower for ptype in enabled_types):
                return None  # Skip creativity for this prompt
        
        creativity_scores = []
        for resp in responses.values():
            score = await self._calculate_creativity_score(resp['response'])
            creativity_scores.append(score)
        
        avg_creativity = statistics.mean(creativity_scores) if creativity_scores else 0.0
        
        score_info = self._score_against_thresholds(avg_creativity, config['scoring'])
        
        return MetricScore(
            value=avg_creativity,
            normalized_score=score_info['score'],
            category=score_info['category'],
            weight=config['weight']
        )
    
    def _score_against_thresholds(self, value: float, scoring_config: Dict[str, Any]) -> Dict[str, Any]:
        """Score a value against configured thresholds"""
        for category, threshold in scoring_config.items():
            if threshold['min'] <= value <= threshold['max']:
                return {
                    'score': threshold['score'],
                    'category': category
                }
        
        # Default to zombie if no threshold matches
        return {'score': 0.2, 'category': 'zombie'}
    
    def _calculate_weighted_score(self, metrics: Dict[str, MetricScore]) -> float:
        """Calculate overall weighted score"""
        total_weight = 0
        weighted_sum = 0
        
        for metric_name, metric in metrics.items():
            if isinstance(metric, MetricScore):
                weighted_sum += metric.normalized_score * metric.weight
                total_weight += metric.weight
        
        return weighted_sum / total_weight if total_weight > 0 else 0.0
    
    async def _heuristic_semantic_score(self, prompt: str, response: str) -> float:
        """Simple heuristic for semantic accuracy (replace with actual LLM judge)"""
        if not response or len(response.strip()) < 10:
            return 0.1
        
        # Check for basic relevance indicators
        prompt_words = set(prompt.lower().split())
        response_words = set(response.lower().split())
        
        # Calculate word overlap
        overlap = len(prompt_words.intersection(response_words))
        overlap_ratio = overlap / len(prompt_words) if prompt_words else 0
        
        # Check response length appropriateness
        length_score = min(len(response) / 100, 1.0)  # Prefer longer responses up to 100 chars
        
        # Combine factors
        base_score = (overlap_ratio * 0.6) + (length_score * 0.4)
        
        # Add randomness to simulate LLM judge variability
        import random
        noise = random.uniform(-0.1, 0.1)
        
        return max(0.0, min(1.0, base_score + noise))
    
    async def _calculate_coherence_score(self, response: str) -> float:
        """Calculate coherence score using simple heuristics"""
        if not response or len(response.strip()) < 10:
            return 0.1
        
        sentences = re.split(r'[.!?]+', response)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if len(sentences) < 2:
            return 0.6  # Single sentence, moderate coherence
        
        # Check for repetition (incoherent responses often repeat)
        unique_sentences = set(sentences)
        repetition_penalty = len(unique_sentences) / len(sentences)
        
        # Check sentence length variation (good coherence has varied sentence lengths)
        lengths = [len(s.split()) for s in sentences]
        if len(lengths) > 1:
            length_variance = statistics.stdev(lengths) / statistics.mean(lengths)
            variance_score = min(length_variance, 1.0)
        else:
            variance_score = 0.5
        
        # Combine factors
        coherence = (repetition_penalty * 0.6) + (variance_score * 0.4)
        
        return max(0.0, min(1.0, coherence))
    
    async def _calculate_creativity_score(self, response: str) -> float:
        """Calculate creativity score using simple heuristics"""
        if not response or len(response.strip()) < 10:
            return 0.1
        
        # Check for creative indicators
        creative_words = [
            'imagine', 'creative', 'unique', 'innovative', 'original',
            'artistic', 'inventive', 'novel', 'fresh', 'unusual'
        ]
        
        response_lower = response.lower()
        creative_count = sum(1 for word in creative_words if word in response_lower)
        
        # Check for varied vocabulary
        words = response_lower.split()
        unique_words = set(words)
        vocabulary_diversity = len(unique_words) / len(words) if words else 0
        
        # Check for metaphors/analogies (simple heuristic)
        metaphor_indicators = ['like', 'as if', 'similar to', 'reminds me of']
        metaphor_count = sum(1 for indicator in metaphor_indicators if indicator in response_lower)
        
        # Combine factors
        creativity = (
            (creative_count / 10) * 0.4 +  # Creative word usage
            vocabulary_diversity * 0.4 +    # Vocabulary diversity
            min(metaphor_count / 3, 1.0) * 0.2  # Metaphorical language
        )
        
        return max(0.0, min(1.0, creativity))


class ZombieClassifier:
    """Determines if a prompt has become a zombie 🧟‍♂️"""
    
    def __init__(self, zombie_config: Dict[str, Any]):
        self.config = zombie_config
    
    def classify_prompt(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Classify if prompt is a zombie and determine severity"""
        
        overall_score = metrics.get('summary', {}).get('overall_score', 0.0)
        
        # Check overall threshold
        is_zombie = overall_score < self.config['overall_threshold']
        
        # Check critical metrics that can trigger zombie status individually
        critical_zombie = False
        failed_metrics = []
        
        for critical_metric in self.config.get('critical_metrics', []):
            metric_name = critical_metric['metric']
            threshold = critical_metric['threshold']
            
            if metric_name in metrics:
                metric_value = metrics[metric_name].value
                if metric_value < threshold:
                    critical_zombie = True
                    failed_metrics.append(metric_name)
        
        # Final zombie determination
        final_zombie_status = is_zombie or critical_zombie
        
        # Determine severity level
        severity = self._determine_severity(overall_score)
        
        return {
            'is_zombie': final_zombie_status,
            'overall_score': overall_score,
            'severity': severity['level'],
            'visual_theme': severity['visual_theme'],
            'revival_priority': severity['revival_priority'],
            'failed_critical_metrics': failed_metrics,
            'reason': self._generate_zombie_reason(overall_score, failed_metrics)
        }
    
    def _determine_severity(self, score: float) -> Dict[str, str]:
        """Determine zombie severity level"""
        for level_name, level_config in self.config['severity_levels'].items():
            score_range = level_config['score_range']
            if score_range['min'] <= score <= score_range['max']:
                return {
                    'level': level_name,
                    'visual_theme': level_config['visual_theme'],
                    'revival_priority': level_config['revival_priority']
                }
        
        # Default to most severe
        return {
            'level': 'skeletal_zombie',
            'visual_theme': 'heavily_decayed',
            'revival_priority': 'high'
        }
    
    def _generate_zombie_reason(self, score: float, failed_metrics: List[str]) -> str:
        """Generate human-readable reason for zombie classification"""
        reasons = []
        
        if score < self.config['overall_threshold']:
            reasons.append(f"Overall performance score ({score:.2f}) below threshold ({self.config['overall_threshold']})")
        
        if failed_metrics:
            reasons.append(f"Critical metrics failed: {', '.join(failed_metrics)}")
        
        return '; '.join(reasons) if reasons else "Performance within acceptable range"