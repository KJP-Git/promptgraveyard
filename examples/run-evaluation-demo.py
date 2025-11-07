#!/usr/bin/env python3
"""
🎃 Prompt Graveyard Evaluation Demo 🎃
Demonstrates the complete evaluation pipeline with sample prompts
"""

import asyncio
import json
import os
from pathlib import Path
from datetime import datetime, timezone
import hashlib

# Mock the evaluation modules for demo purposes
class MockLLMProvider:
    """Mock LLM provider for demonstration"""
    
    def __init__(self, name, model, base_latency, base_cost):
        self.name = name
        self.model = model
        self.base_latency = base_latency
        self.base_cost = base_cost
    
    async def generate_response(self, prompt):
        """Generate a mock response based on prompt quality"""
        prompt_length = len(prompt.split())
        
        # Simulate different response qualities based on prompt
        if prompt_length < 5:
            # Zombie prompt - poor response
            response = "Here is some code."
            latency = self.base_latency * 0.5
            quality_factor = 0.3
        elif prompt_length < 20:
            # Mediocre prompt - okay response
            response = f"Here's an explanation: {prompt[:50]}... This covers the basics of what you asked."
            latency = self.base_latency * 0.8
            quality_factor = 0.6
        else:
            # Good prompt - quality response
            response = f"Comprehensive answer to '{prompt[:50]}...': This is a detailed, well-structured response with examples, explanations, and best practices. The content is organized logically and addresses all aspects of your question."
            latency = self.base_latency * 1.2
            quality_factor = 0.85
        
        cost = self.base_cost * len(response.split()) * 1.3
        
        return {
            'response': response,
            'latency_ms': latency,
            'cost_usd': cost,
            'quality_factor': quality_factor
        }


class MockMetricsCalculator:
    """Mock metrics calculator for demonstration"""
    
    @staticmethod
    def calculate_metrics(prompt, responses):
        """Calculate mock metrics"""
        avg_quality = sum(r['quality_factor'] for r in responses.values()) / len(responses)
        avg_latency = sum(r['latency_ms'] for r in responses.values()) / len(responses)
        total_cost = sum(r['cost_usd'] for r in responses.values())
        
        # Calculate overall score
        latency_score = max(0, 1 - (avg_latency / 10000))  # Normalize latency
        cost_score = max(0, 1 - (total_cost / 0.1))  # Normalize cost
        quality_score = avg_quality
        
        overall_score = (quality_score * 0.5) + (latency_score * 0.3) + (cost_score * 0.2)
        
        return {
            'semantic_accuracy': {'value': avg_quality, 'category': 'good' if avg_quality > 0.7 else 'poor'},
            'latency': {'value': avg_latency, 'category': 'good' if avg_latency < 3000 else 'poor'},
            'cost_efficiency': {'value': total_cost, 'category': 'good' if total_cost < 0.01 else 'acceptable'},
            'overall_score': overall_score
        }
    
    @staticmethod
    def classify_zombie(overall_score):
        """Classify if prompt is a zombie"""
        if overall_score < 0.6:
            if overall_score < 0.3:
                severity = 'skeletal_zombie'
                priority = 'high'
            elif overall_score < 0.5:
                severity = 'rotting_zombie'
                priority = 'medium'
            else:
                severity = 'shambling_zombie'
                priority = 'low'
            
            return {
                'is_zombie': True,
                'overall_score': overall_score,
                'severity': severity,
                'revival_priority': priority,
                'reason': f'Overall score ({overall_score:.2f}) below threshold (0.6)'
            }
        else:
            return {
                'is_zombie': False,
                'overall_score': overall_score,
                'severity': 'alive',
                'revival_priority': 'none',
                'reason': 'Performance within acceptable range'
            }


class MockRevivalAgent:
    """Mock revival agent for demonstration"""
    
    @staticmethod
    def generate_suggestions(prompt, zombie_status):
        """Generate mock revival suggestions"""
        if not zombie_status['is_zombie']:
            return []
        
        suggestions = []
        
        # Suggestion 1: Add context
        suggestions.append({
            'improved_prompt': f"Context: You are an expert assistant.\n\n{prompt}\n\nPlease provide a detailed, well-structured response.",
            'strategy': 'clarity_enhancement',
            'technique': 'add_context',
            'reasoning': 'Added context and structure to improve clarity',
            'confidence_score': 0.75,
            'expected_improvements': {
                'semantic_accuracy': 0.2,
                'coherence': 0.15
            }
        })
        
        # Suggestion 2: Add specificity
        suggestions.append({
            'improved_prompt': f"{prompt}\n\nPlease include:\n- Specific examples\n- Step-by-step explanations\n- Best practices\n- Common pitfalls to avoid",
            'strategy': 'instruction_optimization',
            'technique': 'specify_format',
            'reasoning': 'Added specific requirements to guide response quality',
            'confidence_score': 0.82,
            'expected_improvements': {
                'semantic_accuracy': 0.25,
                'coherence': 0.2
            }
        })
        
        # Suggestion 3: Add examples
        suggestions.append({
            'improved_prompt': f"{prompt}\n\nProvide concrete examples and use cases to illustrate your explanation. Format your response with clear sections and code snippets where applicable.",
            'strategy': 'context_enrichment',
            'technique': 'example_provision',
            'reasoning': 'Added example requirements to improve practical value',
            'confidence_score': 0.68,
            'expected_improvements': {
                'semantic_accuracy': 0.18,
                'creativity': 0.15
            }
        })
        
        return suggestions


async def evaluate_prompt(prompt_file, providers):
    """Evaluate a single prompt"""
    print(f"\n{'='*60}")
    print(f"🎃 Evaluating: {prompt_file.name}")
    print(f"{'='*60}")
    
    # Read prompt
    prompt_text = prompt_file.read_text().strip()
    print(f"📝 Prompt: {prompt_text[:100]}{'...' if len(prompt_text) > 100 else ''}")
    print(f"📏 Length: {len(prompt_text.split())} words\n")
    
    # Generate prompt ID
    prompt_id = hashlib.md5(f"{prompt_file.name}_{datetime.now().isoformat()}".encode()).hexdigest()[:12]
    
    # Evaluate with each provider
    print("🔮 Calling LLM providers...")
    llm_responses = {}
    
    for provider in providers:
        print(f"  ⚡ {provider.name}...", end=' ')
        response_data = await provider.generate_response(prompt_text)
        
        llm_responses[provider.name.lower().replace(' ', '_')] = {
            'response': response_data['response'],
            'latency_ms': response_data['latency_ms'],
            'cost_usd': response_data['cost_usd'],
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'model': provider.model
        }
        
        print(f"✓ ({response_data['latency_ms']:.0f}ms, ${response_data['cost_usd']:.4f})")
    
    # Calculate metrics
    print("\n📊 Calculating metrics...")
    metrics = MockMetricsCalculator.calculate_metrics(prompt_text, 
        {k: {'quality_factor': v['quality_factor'], 'latency_ms': v['latency_ms'], 'cost_usd': v['cost_usd']} 
         for k, v in [(k, {**llm_responses[k], 'quality_factor': 0.8 if llm_responses[k]['latency_ms'] < 2000 else 0.5}) 
                      for k in llm_responses.keys()]})
    
    print(f"  📈 Semantic Accuracy: {metrics['semantic_accuracy']['value']:.2f} ({metrics['semantic_accuracy']['category']})")
    print(f"  ⚡ Avg Latency: {metrics['latency']['value']:.0f}ms ({metrics['latency']['category']})")
    print(f"  💰 Total Cost: ${metrics['cost_efficiency']['value']:.4f} ({metrics['cost_efficiency']['category']})")
    print(f"  🎯 Overall Score: {metrics['overall_score']:.2f}")
    
    # Classify zombie status
    zombie_status = MockMetricsCalculator.classify_zombie(metrics['overall_score'])
    
    print(f"\n🧟‍♂️ Zombie Classification:")
    print(f"  Status: {'ZOMBIE 💀' if zombie_status['is_zombie'] else 'ALIVE ✨'}")
    print(f"  Severity: {zombie_status['severity']}")
    print(f"  Priority: {zombie_status['revival_priority']}")
    
    # Generate revival suggestions if zombie
    revival_suggestions = []
    if zombie_status['is_zombie']:
        print(f"\n🧙‍♀️ Generating revival suggestions...")
        revival_suggestions = MockRevivalAgent.generate_suggestions(prompt_text, zombie_status)
        print(f"  Generated {len(revival_suggestions)} suggestions:")
        for i, suggestion in enumerate(revival_suggestions, 1):
            print(f"    {i}. {suggestion['strategy']} (confidence: {suggestion['confidence_score']:.2f})")
    
    # Create evaluation result
    result = {
        'prompt_id': prompt_id,
        'file_path': str(prompt_file),
        'prompt_text': prompt_text,
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'llm_responses': llm_responses,
        'metrics': metrics,
        'zombie_status': zombie_status,
        'revival_suggestions': revival_suggestions
    }
    
    return result


async def main():
    """Run the evaluation demo"""
    print("""
    🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃
    
         🏚️  PROMPT GRAVEYARD EVALUATION DEMO  🏚️
         
         Demonstrating the complete evaluation pipeline
         with sample prompts of varying quality
         
    🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃
    """)
    
    # Initialize mock LLM providers
    providers = [
        MockLLMProvider("OpenAI GPT-3.5", "gpt-3.5-turbo", 2000, 0.002),
        MockLLMProvider("Groq LLaMA3", "llama3-8b-8192", 1200, 0.001),
    ]
    
    print(f"🔮 Initialized {len(providers)} LLM providers")
    
    # Find sample prompts
    sample_prompts_dir = Path("examples/sample-prompts")
    if not sample_prompts_dir.exists():
        print(f"💀 Sample prompts directory not found: {sample_prompts_dir}")
        return
    
    prompt_files = sorted(sample_prompts_dir.glob("*.txt"))
    print(f"📁 Found {len(prompt_files)} sample prompts\n")
    
    # Evaluate each prompt
    results = []
    for prompt_file in prompt_files:
        result = await evaluate_prompt(prompt_file, providers)
        results.append(result)
        await asyncio.sleep(0.5)  # Small delay between evaluations
    
    # Save results
    print(f"\n{'='*60}")
    print("💾 Saving results to data/results.json...")
    
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    
    results_file = data_dir / "results.json"
    
    # Append to results file (JSONL format)
    with open(results_file, 'a') as f:
        for result in results:
            f.write(json.dumps(result) + '\n')
    
    print(f"✅ Saved {len(results)} evaluation results")
    
    # Print summary
    print(f"\n{'='*60}")
    print("📊 EVALUATION SUMMARY")
    print(f"{'='*60}")
    
    total_prompts = len(results)
    zombie_prompts = sum(1 for r in results if r['zombie_status']['is_zombie'])
    living_prompts = total_prompts - zombie_prompts
    
    avg_score = sum(r['zombie_status']['overall_score'] for r in results) / total_prompts
    total_cost = sum(
        sum(resp['cost_usd'] for resp in r['llm_responses'].values())
        for r in results
    )
    
    print(f"Total Prompts Evaluated: {total_prompts}")
    print(f"Living Prompts: {living_prompts} ✨")
    print(f"Zombie Prompts: {zombie_prompts} 🧟‍♂️")
    print(f"Zombie Rate: {(zombie_prompts/total_prompts)*100:.1f}%")
    print(f"Average Score: {avg_score:.2f}")
    print(f"Total Cost: ${total_cost:.4f}")
    
    print(f"\n🎭 Zombie Breakdown:")
    severity_counts = {}
    for result in results:
        if result['zombie_status']['is_zombie']:
            severity = result['zombie_status']['severity']
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
    
    for severity, count in severity_counts.items():
        print(f"  {severity}: {count}")
    
    print(f"\n{'='*60}")
    print("🎉 Evaluation Demo Complete!")
    print(f"{'='*60}")
    print(f"\n📚 Next steps:")
    print(f"  1. Start the API server: cd server && npm run dev")
    print(f"  2. View results: curl http://localhost:3001/api/results")
    print(f"  3. Check zombies: curl http://localhost:3001/api/prompts/zombies")
    print(f"  4. Get stats: curl http://localhost:3001/api/prompts/stats")
    print(f"\n🧙‍♀️ May your prompts be ever living! ✨\n")


if __name__ == "__main__":
    asyncio.run(main())