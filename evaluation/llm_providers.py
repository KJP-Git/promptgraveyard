"""
🧙‍♀️ LLM Provider Summoning Chamber 🧙‍♀️
Where we conjure responses from various AI spirits across the digital realm
"""

import os
import asyncio
import aiohttp
import time
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from dataclasses import dataclass


@dataclass
class LLMResponse:
    """Container for LLM response data"""
    text: str
    latency_ms: float
    cost_usd: float
    model: str
    provider: str
    timestamp: str
    error: Optional[str] = None


class BaseLLMProvider(ABC):
    """Abstract base class for all LLM providers - the spirit interface"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.name = config['name']
        self.model_name = config['model']
        self.api_endpoint = config['api_endpoint']
        self.api_key = os.getenv(config['api_key_env'])
        self.max_tokens = config.get('max_tokens', 4096)
        self.temperature = config.get('temperature', 0.7)
        self.timeout = config.get('timeout', 30)
        
        if not self.api_key:
            raise ValueError(f"💀 Missing API key for {self.name}: {config['api_key_env']}")
    
    @abstractmethod
    async def generate_response(self, prompt: str) -> str:
        """Generate response from the LLM spirit"""
        pass
    
    def calculate_cost(self, prompt: str, response: str) -> float:
        """Calculate the cursed cost of summoning this response"""
        input_tokens = len(prompt.split()) * 1.3  # Rough token estimation
        output_tokens = len(response.split()) * 1.3
        
        input_cost = input_tokens * self.config['cost_per_token']['input']
        output_cost = output_tokens * self.config['cost_per_token']['output']
        
        return input_cost + output_cost


class OpenAIProvider(BaseLLMProvider):
    """OpenAI GPT Provider - The Corporate Spirit 🏢"""
    
    async def generate_response(self, prompt: str) -> str:
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': self.model_name,
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': self.max_tokens,
            'temperature': self.temperature
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.api_endpoint,
                headers=headers,
                json=payload,
                timeout=aiohttp.ClientTimeout(total=self.timeout)
            ) as response:
                
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"OpenAI API error {response.status}: {error_text}")
                
                data = await response.json()
                return data['choices'][0]['message']['content'].strip()


class GroqProvider(BaseLLMProvider):
    """Groq LLaMA Provider - The Speed Demon 🏃‍♂️💨"""
    
    async def generate_response(self, prompt: str) -> str:
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': self.model_name,
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': self.max_tokens,
            'temperature': self.temperature
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.api_endpoint,
                headers=headers,
                json=payload,
                timeout=aiohttp.ClientTimeout(total=self.timeout)
            ) as response:
                
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Groq API error {response.status}: {error_text}")
                
                data = await response.json()
                return data['choices'][0]['message']['content'].strip()


class AnthropicProvider(BaseLLMProvider):
    """Anthropic Claude Provider - The Thoughtful Spirit 🤔"""
    
    async def generate_response(self, prompt: str) -> str:
        headers = {
            'x-api-key': self.api_key,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        }
        
        payload = {
            'model': self.model_name,
            'max_tokens': self.max_tokens,
            'temperature': self.temperature,
            'messages': [{'role': 'user', 'content': prompt}]
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                'https://api.anthropic.com/v1/messages',
                headers=headers,
                json=payload,
                timeout=aiohttp.ClientTimeout(total=self.timeout)
            ) as response:
                
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Anthropic API error {response.status}: {error_text}")
                
                data = await response.json()
                return data['content'][0]['text'].strip()


class LLMProviderFactory:
    """Factory for summoning the appropriate LLM spirits 🏭👻"""
    
    PROVIDER_CLASSES = {
        'openai': OpenAIProvider,
        'groq': GroqProvider,
        'anthropic': AnthropicProvider
    }
    
    def __init__(self, providers_config: Dict[str, Any]):
        self.providers_config = providers_config
        self.providers = {}
        
        # Initialize all enabled providers
        for provider_id, config in providers_config.items():
            if config.get('enabled', True):  # Default to enabled
                try:
                    provider_type = config['provider']
                    if provider_type in self.PROVIDER_CLASSES:
                        provider_class = self.PROVIDER_CLASSES[provider_type]
                        self.providers[provider_id] = provider_class(config)
                        print(f"✨ Summoned {config['name']} spirit")
                    else:
                        print(f"⚠️ Unknown provider type: {provider_type}")
                except Exception as e:
                    print(f"💀 Failed to summon {config.get('name', provider_id)}: {str(e)}")
    
    def get_active_providers(self) -> Dict[str, BaseLLMProvider]:
        """Get all successfully initialized providers"""
        return self.providers
    
    def get_provider(self, provider_id: str) -> Optional[BaseLLMProvider]:
        """Get a specific provider by ID"""
        return self.providers.get(provider_id)


class RateLimiter:
    """Rate limiting for API calls to avoid angering the spirits 😇"""
    
    def __init__(self, requests_per_minute: int):
        self.requests_per_minute = requests_per_minute
        self.requests = []
    
    async def wait_if_needed(self):
        """Wait if we're hitting rate limits"""
        now = time.time()
        
        # Remove requests older than 1 minute
        self.requests = [req_time for req_time in self.requests if now - req_time < 60]
        
        # If we're at the limit, wait
        if len(self.requests) >= self.requests_per_minute:
            sleep_time = 60 - (now - self.requests[0])
            if sleep_time > 0:
                print(f"⏰ Rate limit reached, sleeping for {sleep_time:.1f}s...")
                await asyncio.sleep(sleep_time)
        
        # Record this request
        self.requests.append(now)