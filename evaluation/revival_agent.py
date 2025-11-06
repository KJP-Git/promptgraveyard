"""
🧙‍♀️ Revival Agent - The Prompt Necromancer 🧙‍♀️
Brings zombie prompts back from the dead with improved versions
"""

import asyncio
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import random


@dataclass
class RevivalSuggestion:
    """A suggestion for improving a zombie prompt"""
    improved_prompt: str
    strategy: str
    reasoning: str
    confidence_score: float
    expected_improvement: Dict[str, float]


class RevivalAgent:
    """The mystical agent that resurrects zombie prompts 🧙‍♀️⚡"""
    
    def __init__(self, revival_config: Dict[str, Any]):
        self.config = revival_config
        self.strategies = revival_config['improvement_strategies']
        self.suggestion_limit = revival_config.get('suggestion_limit', 3)
    
    async def generate_revival_suggestions(
        self, 
        zombie_prompt: str, 
        metrics: Dict[str, Any], 
        zombie_status: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate improvement suggestions for a zombie prompt"""
        
        print(f"🧙‍♀️ Analyzing zombie prompt for revival opportunities...")
        
        # Analyze what went wrong
        problem_analysis = self._analyze_zombie_problems(metrics, zombie_status)
        
        # Generate suggestions based on problems found
        suggestions = []
        
        for strategy_name, strategy_config in self.strategies.items():
            if len(suggestions) >= self.suggestion_limit:
                break
                
            suggestion = await self._generate_strategy_suggestion(
                zombie_prompt, 
                strategy_name, 
                strategy_config, 
                problem_analysis
            )
            
            if suggestion:
                suggestions.append(suggestion)
        
        # Sort by confidence score
        suggestions.sort(key=lambda x: x['confidence_score'], reverse=True)
        
        print(f"🎭 Generated {len(suggestions)} revival suggestions")
        return suggestions[:self.suggestion_limit]
    
    def _analyze_zombie_problems(self, metrics: Dict[str, Any], zombie_status: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze what problems caused the prompt to become a zombie"""
        problems = {
            'low_semantic_accuracy': False,
            'poor_coherence': False,
            'high_latency': False,
            'high_cost': False,
            'low_creativity': False,
            'failed_critical_metrics': zombie_status.get('failed_critical_metrics', [])
        }
        
        # Check each metric for problems
        for metric_name, metric_data in metrics.items():
            if metric_name == 'summary':
                continue
                
            if hasattr(metric_data, 'category'):
                if metric_data.category in ['poor', 'zombie']:
                    if metric_name == 'semantic_accuracy':
                        problems['low_semantic_accuracy'] = True
                    elif metric_name == 'coherence':
                        problems['poor_coherence'] = True
                    elif metric_name == 'latency':
                        problems['high_latency'] = True
                    elif metric_name == 'cost_efficiency':
                        problems['high_cost'] = True
                    elif metric_name == 'creativity':
                        problems['low_creativity'] = True
        
        return problems
    
    async def _generate_strategy_suggestion(
        self, 
        prompt: str, 
        strategy_name: str, 
        strategy_config: Dict[str, Any], 
        problems: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Generate a suggestion using a specific improvement strategy"""
        
        techniques = strategy_config['techniques']
        weight = strategy_config['weight']
        
        # Select appropriate technique based on problems
        selected_technique = self._select_technique_for_problems(techniques, problems)
        
        if not selected_technique:
            return None
        
        # Generate improved prompt
        improved_prompt = await self._apply_technique(prompt, selected_technique, problems)
        
        if not improved_prompt or improved_prompt == prompt:
            return None
        
        # Generate reasoning
        reasoning = self._generate_reasoning(strategy_name, selected_technique, problems)
        
        # Calculate confidence score
        confidence = self._calculate_confidence(strategy_name, problems, weight)
        
        # Predict expected improvements
        expected_improvements = self._predict_improvements(selected_technique, problems)
        
        return {
            'improved_prompt': improved_prompt,
            'strategy': strategy_name,
            'technique': selected_technique,
            'reasoning': reasoning,
            'confidence_score': confidence,
            'expected_improvements': expected_improvements
        }
    
    def _select_technique_for_problems(self, techniques: List[str], problems: Dict[str, Any]) -> Optional[str]:
        """Select the most appropriate technique based on identified problems"""
        
        # Map problems to preferred techniques
        problem_technique_map = {
            'low_semantic_accuracy': ['clarify_intent', 'add_context', 'example_provision'],
            'poor_coherence': ['step_by_step_breakdown', 'structure_specification'],
            'high_latency': ['constraint_specification', 'length_guidelines'],
            'high_cost': ['constraint_specification', 'specify_format'],
            'low_creativity': ['use_case_examples', 'domain_context']
        }
        
        # Find techniques that address current problems
        relevant_techniques = []
        for problem, has_problem in problems.items():
            if has_problem and problem in problem_technique_map:
                relevant_techniques.extend(problem_technique_map[problem])
        
        # Find intersection with available techniques
        applicable_techniques = [t for t in techniques if t in relevant_techniques]
        
        if applicable_techniques:
            return random.choice(applicable_techniques)
        elif techniques:
            return random.choice(techniques)  # Fallback to any available technique
        else:
            return None
    
    async def _apply_technique(self, prompt: str, technique: str, problems: Dict[str, Any]) -> str:
        """Apply a specific improvement technique to the prompt"""
        
        if technique == 'add_context':
            return self._add_context(prompt)
        elif technique == 'specify_format':
            return self._specify_format(prompt)
        elif technique == 'clarify_intent':
            return self._clarify_intent(prompt)
        elif technique == 'step_by_step_breakdown':
            return self._add_step_by_step(prompt)
        elif technique == 'example_provision':
            return self._add_examples(prompt)
        elif technique == 'constraint_specification':
            return self._add_constraints(prompt)
        elif technique == 'domain_context':
            return self._add_domain_context(prompt)
        elif technique == 'audience_specification':
            return self._specify_audience(prompt)
        elif technique == 'use_case_examples':
            return self._add_use_cases(prompt)
        elif technique == 'output_template':
            return self._add_output_template(prompt)
        elif technique == 'structure_specification':
            return self._add_structure(prompt)
        elif technique == 'length_guidelines':
            return self._add_length_guidelines(prompt)
        else:
            return prompt  # Unknown technique, return original
    
    def _add_context(self, prompt: str) -> str:
        """Add contextual information to make the prompt clearer"""
        context_additions = [
            "Context: You are an expert assistant helping with this task.",
            "Background: This request is part of a larger project to improve AI responses.",
            "Setting: Please approach this as a professional consultant would.",
        ]
        
        addition = random.choice(context_additions)
        return f"{addition}\n\n{prompt}"
    
    def _specify_format(self, prompt: str) -> str:
        """Add format specifications to the prompt"""
        format_additions = [
            "\n\nPlease format your response as a clear, structured answer.",
            "\n\nProvide your response in a well-organized format with clear sections.",
            "\n\nStructure your answer with numbered points or bullet points for clarity.",
        ]
        
        addition = random.choice(format_additions)
        return f"{prompt}{addition}"
    
    def _clarify_intent(self, prompt: str) -> str:
        """Make the intent of the prompt more explicit"""
        intent_clarifications = [
            "\n\nThe goal is to provide a comprehensive and accurate response.",
            "\n\nPlease focus on being helpful, accurate, and thorough in your answer.",
            "\n\nI'm looking for a detailed explanation that addresses all aspects of this question.",
        ]
        
        clarification = random.choice(intent_clarifications)
        return f"{prompt}{clarification}"
    
    def _add_step_by_step(self, prompt: str) -> str:
        """Add step-by-step instruction to improve coherence"""
        step_additions = [
            "\n\nPlease think through this step by step:",
            "\n\nBreak down your response into clear steps:",
            "\n\nApproach this systematically, step by step:",
        ]
        
        addition = random.choice(step_additions)
        return f"{prompt}{addition}"
    
    def _add_examples(self, prompt: str) -> str:
        """Add example requests to clarify expectations"""
        example_additions = [
            "\n\nFor example, include specific details and explanations in your response.",
            "\n\nProvide concrete examples where applicable to illustrate your points.",
            "\n\nUse examples to make your explanation clearer and more practical.",
        ]
        
        addition = random.choice(example_additions)
        return f"{prompt}{addition}"
    
    def _add_constraints(self, prompt: str) -> str:
        """Add constraints to improve focus and reduce cost"""
        constraint_additions = [
            "\n\nKeep your response concise but comprehensive.",
            "\n\nFocus on the most important aspects in your response.",
            "\n\nProvide a focused answer that directly addresses the question.",
        ]
        
        addition = random.choice(constraint_additions)
        return f"{prompt}{addition}"
    
    def _add_domain_context(self, prompt: str) -> str:
        """Add domain-specific context"""
        domain_additions = [
            "\n\nConsider this from a professional/technical perspective.",
            "\n\nApproach this with expertise in the relevant field.",
            "\n\nProvide insights based on best practices in this domain.",
        ]
        
        addition = random.choice(domain_additions)
        return f"{prompt}{addition}"
    
    def _specify_audience(self, prompt: str) -> str:
        """Specify the target audience"""
        audience_additions = [
            "\n\nExplain this for someone with intermediate knowledge of the topic.",
            "\n\nTailor your response for a professional audience.",
            "\n\nMake this accessible to someone learning about this topic.",
        ]
        
        addition = random.choice(audience_additions)
        return f"{prompt}{addition}"
    
    def _add_use_cases(self, prompt: str) -> str:
        """Add use case examples"""
        use_case_additions = [
            "\n\nInclude practical applications and use cases in your response.",
            "\n\nProvide real-world examples of how this applies.",
            "\n\nShow how this would be used in practice.",
        ]
        
        addition = random.choice(use_case_additions)
        return f"{prompt}{addition}"
    
    def _add_output_template(self, prompt: str) -> str:
        """Add output template specification"""
        template_additions = [
            "\n\nFormat your response as:\n1. Overview\n2. Key Points\n3. Conclusion",
            "\n\nStructure your answer with clear headings and subpoints.",
            "\n\nOrganize your response with an introduction, main content, and summary.",
        ]
        
        addition = random.choice(template_additions)
        return f"{prompt}{addition}"
    
    def _add_structure(self, prompt: str) -> str:
        """Add structural requirements"""
        structure_additions = [
            "\n\nEnsure your response has a logical flow from start to finish.",
            "\n\nOrganize your thoughts clearly with smooth transitions between ideas.",
            "\n\nPresent information in a well-structured, easy-to-follow manner.",
        ]
        
        addition = random.choice(structure_additions)
        return f"{prompt}{addition}"
    
    def _add_length_guidelines(self, prompt: str) -> str:
        """Add length guidelines to control response size"""
        length_additions = [
            "\n\nProvide a response of moderate length - thorough but not excessive.",
            "\n\nKeep your answer comprehensive yet concise.",
            "\n\nAim for a complete but efficiently worded response.",
        ]
        
        addition = random.choice(length_additions)
        return f"{prompt}{addition}"
    
    def _generate_reasoning(self, strategy: str, technique: str, problems: Dict[str, Any]) -> str:
        """Generate human-readable reasoning for the suggestion"""
        problem_descriptions = {
            'low_semantic_accuracy': 'poor relevance to the prompt',
            'poor_coherence': 'lack of logical flow',
            'high_latency': 'slow response times',
            'high_cost': 'expensive token usage',
            'low_creativity': 'insufficient creative elements'
        }
        
        identified_problems = [
            problem_descriptions[problem] 
            for problem, exists in problems.items() 
            if exists and problem in problem_descriptions
        ]
        
        if identified_problems:
            problem_text = ', '.join(identified_problems)
            return f"Applied {technique} technique from {strategy} strategy to address: {problem_text}"
        else:
            return f"Applied {technique} technique from {strategy} strategy for general improvement"
    
    def _calculate_confidence(self, strategy: str, problems: Dict[str, Any], weight: float) -> float:
        """Calculate confidence score for the suggestion"""
        base_confidence = weight  # Use strategy weight as base
        
        # Boost confidence if we're addressing specific problems
        problem_count = sum(1 for exists in problems.values() if exists and isinstance(exists, bool))
        problem_boost = min(problem_count * 0.1, 0.3)  # Up to 30% boost
        
        # Add some randomness to simulate real-world uncertainty
        randomness = random.uniform(-0.1, 0.1)
        
        final_confidence = base_confidence + problem_boost + randomness
        return max(0.1, min(1.0, final_confidence))  # Clamp between 0.1 and 1.0
    
    def _predict_improvements(self, technique: str, problems: Dict[str, Any]) -> Dict[str, float]:
        """Predict expected metric improvements"""
        
        # Base improvement predictions by technique
        technique_improvements = {
            'add_context': {'semantic_accuracy': 0.15, 'coherence': 0.10},
            'specify_format': {'coherence': 0.20, 'semantic_accuracy': 0.10},
            'clarify_intent': {'semantic_accuracy': 0.25, 'coherence': 0.15},
            'step_by_step_breakdown': {'coherence': 0.30, 'semantic_accuracy': 0.10},
            'example_provision': {'semantic_accuracy': 0.20, 'creativity': 0.15},
            'constraint_specification': {'cost_efficiency': 0.25, 'latency': 0.15},
            'domain_context': {'semantic_accuracy': 0.15, 'creativity': 0.20},
            'audience_specification': {'semantic_accuracy': 0.10, 'coherence': 0.15},
            'use_case_examples': {'creativity': 0.25, 'semantic_accuracy': 0.15},
            'output_template': {'coherence': 0.25, 'semantic_accuracy': 0.10},
            'structure_specification': {'coherence': 0.30, 'semantic_accuracy': 0.05},
            'length_guidelines': {'cost_efficiency': 0.20, 'latency': 0.10}
        }
        
        base_improvements = technique_improvements.get(technique, {})
        
        # Boost improvements for metrics that are currently problematic
        boosted_improvements = {}
        for metric, improvement in base_improvements.items():
            boost = 1.0
            
            # Check if this metric has problems
            metric_problem_map = {
                'semantic_accuracy': 'low_semantic_accuracy',
                'coherence': 'poor_coherence',
                'latency': 'high_latency',
                'cost_efficiency': 'high_cost',
                'creativity': 'low_creativity'
            }
            
            problem_key = metric_problem_map.get(metric)
            if problem_key and problems.get(problem_key, False):
                boost = 1.5  # 50% boost for problematic metrics
            
            boosted_improvements[metric] = min(improvement * boost, 0.5)  # Cap at 50% improvement
        
        return boosted_improvements