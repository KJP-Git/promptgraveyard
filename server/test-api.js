#!/usr/bin/env node
/**
 * 🧪 API Test Script 🧪
 * Quick test of the Prompt Graveyard API endpoints
 */

const baseUrl = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🎃 Testing Prompt Graveyard API 🎃\n');

  const tests = [
    {
      name: '🏠 API Welcome',
      url: `${baseUrl}/`,
      method: 'GET'
    },
    {
      name: '💓 Health Check',
      url: `${baseUrl}/health`,
      method: 'GET'
    },
    {
      name: '📊 Raw Results',
      url: `${baseUrl}/results?limit=5`,
      method: 'GET'
    },
    {
      name: '📈 Aggregated Metrics',
      url: `${baseUrl}/results/metrics`,
      method: 'GET'
    },
    {
      name: '📝 All Prompts',
      url: `${baseUrl}/prompts?limit=3`,
      method: 'GET'
    },
    {
      name: '🧟‍♂️ Zombie Prompts',
      url: `${baseUrl}/prompts/zombies?limit=3`,
      method: 'GET'
    },
    {
      name: '✨ Living Prompts',
      url: `${baseUrl}/prompts/living?limit=3`,
      method: 'GET'
    },
    {
      name: '📊 Graveyard Stats',
      url: `${baseUrl}/prompts/stats`,
      method: 'GET'
    },
    {
      name: '🔮 Revival Stats',
      url: `${baseUrl}/revive/stats`,
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`URL: ${test.url}`);
      
      const response = await fetch(test.url);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status}`);
        console.log(`📦 Success: ${data.success}`);
        console.log(`💬 Message: ${data.message || 'No message'}`);
        
        if (data.data) {
          if (Array.isArray(data.data)) {
            console.log(`📊 Data: Array with ${data.data.length} items`);
          } else if (typeof data.data === 'object') {
            const keys = Object.keys(data.data);
            console.log(`📊 Data: Object with keys: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`);
          }
        }
      } else {
        console.log(`❌ Status: ${response.status}`);
        console.log(`💀 Error: ${data.error || 'Unknown error'}`);
      }
      
      console.log('─'.repeat(60));
      
    } catch (error) {
      console.log(`💀 Request failed: ${error.message}`);
      console.log('─'.repeat(60));
    }
  }

  // Test a revival request (will fail without valid data, but shows the endpoint works)
  console.log('\n🧙‍♀️ Testing Revival Endpoint (expect failure without valid data)');
  try {
    const revivalResponse = await fetch(`${baseUrl}/revive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt_id: 'test-123',
        suggestion_index: 0,
        user_feedback: 'Testing the API'
      })
    });
    
    const revivalData = await revivalResponse.json();
    console.log(`Status: ${revivalResponse.status}`);
    console.log(`Response: ${JSON.stringify(revivalData, null, 2)}`);
  } catch (error) {
    console.log(`Revival test failed: ${error.message}`);
  }

  console.log('\n🎭 API Testing Complete! 🎭');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('💀 This script requires Node.js 18+ with built-in fetch support');
  console.log('Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

testAPI().catch(console.error);