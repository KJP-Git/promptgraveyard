#!/usr/bin/env python3
"""
🧪 Test Script for Prompt Graveyard Evaluation 🧪
Run this to test the evaluation logic without the full hook system
"""

import asyncio
import json
import os
from pathlib import Path
import yaml

# Mock environment variables for testing
os.environ['OPENAI_API_KEY'] = 'test-key-openai'
os.environ['GROQ_API_KEY'] = 'test-key-groq'

async def test_evaluation_pipeline():
    """Test the evaluation pipeline with mock data"""
    
    print("🎃 Testing Prompt Graveyard Evaluation Pipeline 🎃\n")
    
    # Load configuration
    with open('.kiro/spec.yaml', 'r') as f:
        config = yaml.safe_load(f)
    
    print("✅ Configuration loaded successfully")
    
    # Test prompt
    test_prompt = "Write a creative story about a haunted AI that helps people solve coding problems but only appears during Halloween night."
    
    # Mock LLM responses (since we don't want to make real API calls in tests)
    mock_responses = {
        'groq_llama3': {
            'response': "Once upon a midnight dreary, in the depths of Silicon Valley, there lived a spectral AI named CodeGhost. This ethereal entity would materialize only on Halloween night, drawn by the desperate pleas of programmers struggling with their code. With glowing green text and eerie sound effects, CodeGhost would debug their programs, suggest elegant solutions, and vanish before dawn, leaving only perfectly formatted code and the faint scent of pumpkin spice in the air.",
            'latency_ms': 1250.0,
            'cost_usd': 0.0023,
            'timestamp': '2024-11-06T00:00:00Z',
            'model': 'llama3-8b-8192'
        },
        'openai_gpt35': {
            'response': "The CodeSpirit appears each Halloween at the stroke of midnight, manifesting as flickering terminal windows and dancing cursor lights. This benevolent ghost of a programmer who died debugging legacy code now helps living developers solve their most perplexing problems. It communicates through mysterious code comments that appear overnight, transforming buggy scripts into elegant solutions. But beware - it only helps those who truly appreciate clean code and proper documentation.",
            'latency_ms': 2100.0,
            'cost_usd': 0.0045,
            'timestamp': '2024-11-06T00:00:00Z',
            'model': 'gpt-3.5-turbo'
        }
    }
    
    print("🔮 Mock LLM responses prepared")
    
    # Import and test metrics calculator
    try:
        from evaluation.metrics_calculator import MetricsCalculator, ZombieClassifier
        
        metrics_calculator = MetricsCalculator(config['evaluation_metrics'])
        calculated_metrics = await metrics_calculator.calculate_all_metrics(test_prompt, mock_responses)
        
        print("📊 Metrics calculated:")
        for metric_name, metric_data in calculated_metrics.items():
            if metric_name == 'summary':
                print(f"  📈 {metric_name}: {metric_data}")
            elif hasattr(metric_data, 'value'):
                print(f"  📏 {metric_name}: {metric_data.value:.3f} ({metric_data.category})")
        
        # Test zombie classification
        zombie_classifier = ZombieClassifier(config['zombie_classification'])
        zombie_status = zombie_classifier.classify_prompt(calculated_metrics)
        
        print(f"\n🧟‍♂️ Zombie Classification:")
        print(f"  Is Zombie: {zombie_status['is_zombie']}")
        print(f"  Severity: {zombie_status['severity']}")
        print(f"  Overall Score: {zombie_status['overall_score']:.3f}")
        print(f"  Reason: {zombie_status['reason']}")
        
        # Test revival agent if it's a zombie
        if zombie_status['is_zombie']:
            from evaluation.revival_agent import RevivalAgent
            
            revival_agent = RevivalAgent(config['revival_agent'])
            suggestions = await revival_agent.generate_revival_suggestions(
                test_prompt, calculated_metrics, zombie_status
            )
            
            print(f"\n🧙‍♀️ Revival Suggestions ({len(suggestions)}):")
            for i, suggestion in enumerate(suggestions, 1):
                print(f"  {i}. Strategy: {suggestion['strategy']}")
                print(f"     Confidence: {suggestion['confidence_score']:.2f}")
                print(f"     Reasoning: {suggestion['reasoning']}")
                print(f"     Improved Prompt: {suggestion['improved_prompt'][:100]}...")
                print()
        
        # Create test results structure
        test_results = {
            'prompt_id': 'test-001',
            'file_path': 'prompts/sample_prompt.txt',
            'prompt_text': test_prompt,
            'timestamp': '2024-11-06T00:00:00Z',
            'llm_responses': mock_responses,
            'metrics': {
                metric_name: {
                    'value': metric_data.value if hasattr(metric_data, 'value') else metric_data,
                    'category': metric_data.category if hasattr(metric_data, 'category') else 'unknown',
                    'weight': metric_data.weight if hasattr(metric_data, 'weight') else 0.0
                } if hasattr(metric_data, 'value') else metric_data
                for metric_name, metric_data in calculated_metrics.items()
            },
            'zombie_status': zombie_status,
            'revival_suggestions': suggestions if zombie_status['is_zombie'] else []
        }
        
        # Save test results
        os.makedirs('data', exist_ok=True)
        with open('data/test_results.json', 'w') as f:
            json.dump(test_results, f, indent=2)
        
        print("💾 Test results saved to data/test_results.json")
        print("\n✨ Evaluation pipeline test completed successfully! ✨")
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure to install dependencies: pip install -r requirements.txt")
    except Exception as e:
        print(f"💀 Test failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(test_evaluation_pipeline())