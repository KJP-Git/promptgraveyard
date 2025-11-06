# 🎃 Prompt Graveyard API Usage Examples 🎃

This document provides comprehensive examples of how to use the Prompt Graveyard API endpoints.

## 🚀 Getting Started

Start the server:
```bash
cd server
npm install
npm run dev
```

The API will be available at `http://localhost:3001/api`

## 📋 Core Endpoints

### 1. API Welcome & Health Check

```bash
# Welcome message with API documentation
curl "http://localhost:3001/api/"

# Health check
curl "http://localhost:3001/api/health"
```

### 2. Raw Evaluation Results (`/api/results`)

```bash
# Get all raw evaluation results (paginated)
curl "http://localhost:3001/api/results?page=1&limit=10"

# Get results with filtering
curl "http://localhost:3001/api/results?is_zombie=true&min_score=0.3&max_score=0.7"

# Get results sorted by score (ascending)
curl "http://localhost:3001/api/results?sort_by=score&sort_order=asc"

# Get specific result by ID
curl "http://localhost:3001/api/results/abc123"

# Get aggregated metrics across all results
curl "http://localhost:3001/api/results/metrics"

# Get results by LLM provider
curl "http://localhost:3001/api/results/by-provider/openai_gpt35"

# Get results by date range
curl "http://localhost:3001/api/results/by-date?start_date=2024-11-01&end_date=2024-11-06"
```

### 3. Prompt Management (`/api/prompts`)

```bash
# Get all prompts (processed summaries)
curl "http://localhost:3001/api/prompts?page=1&limit=5"

# Get only zombie prompts
curl "http://localhost:3001/api/prompts/zombies?severity=rotting_zombie"

# Get only living (successful) prompts
curl "http://localhost:3001/api/prompts/living?sort_by=score&sort_order=desc"

# Get graveyard statistics
curl "http://localhost:3001/api/prompts/stats"

# Get specific prompt by ID
curl "http://localhost:3001/api/prompts/abc123"
```

### 4. Revival System (`/api/revive`)

```bash
# Attempt to revive a zombie prompt
curl -X POST "http://localhost:3001/api/revive" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt_id": "abc123",
    "suggestion_index": 0,
    "user_feedback": "This suggestion looks promising!"
  }'

# Get revival suggestions for a prompt
curl "http://localhost:3001/api/revive/suggestions/abc123"

# Get revival history for a prompt
curl "http://localhost:3001/api/revive/history/abc123"

# Get revival statistics
curl "http://localhost:3001/api/revive/stats"

# Save improved prompt to file
curl -X POST "http://localhost:3001/api/revive/save-improved/revival-456" \
  -H "Content-Type: application/json" \
  -d '{
    "improved_prompt": "Write a creative story about a haunted AI..."
  }'
```

## 🔍 Advanced Filtering Examples

### Filter by Multiple Criteria

```bash
# Get zombie prompts with specific score range and provider
curl "http://localhost:3001/api/results?is_zombie=true&min_score=0.2&max_score=0.6&llm_provider=groq_llama3"

# Get recent high-performing prompts
curl "http://localhost:3001/api/prompts/living?min_score=0.8&sort_by=timestamp&sort_order=desc&limit=10"
```

### Pagination Examples

```bash
# Get second page of results with 25 items per page
curl "http://localhost:3001/api/results?page=2&limit=25"

# Get all zombie prompts, 5 per page, sorted by score
curl "http://localhost:3001/api/prompts/zombies?page=1&limit=5&sort_by=score&sort_order=asc"
```

## 📊 Response Format Examples

### Successful Response
```json
{
  "success": true,
  "data": {
    "results": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  },
  "message": "📊 Retrieved 10 raw evaluation results from the archives",
  "timestamp": "2024-11-06T12:00:00.000Z",
  "request_id": "ghost-1234-1699272000000"
}
```

### Error Response
```json
{
  "success": false,
  "error": "💀 Prompt not found in the graveyard",
  "timestamp": "2024-11-06T12:00:00.000Z",
  "request_id": "zombie-5678-1699272000000"
}
```

## 🧟‍♂️ Working with Zombie Prompts

### Find All Zombies by Severity

```bash
# Shambling zombies (mild issues)
curl "http://localhost:3001/api/prompts/zombies?severity=shambling_zombie"

# Rotting zombies (moderate issues)
curl "http://localhost:3001/api/prompts/zombies?severity=rotting_zombie"

# Skeletal zombies (severe issues)
curl "http://localhost:3001/api/prompts/zombies?severity=skeletal_zombie"
```

### Revival Workflow

```bash
# 1. Get a zombie prompt
ZOMBIE_ID=$(curl -s "http://localhost:3001/api/prompts/zombies?limit=1" | jq -r '.data.zombies[0].prompt_id')

# 2. Get revival suggestions
curl "http://localhost:3001/api/revive/suggestions/$ZOMBIE_ID"

# 3. Apply a revival suggestion
curl -X POST "http://localhost:3001/api/revive" \
  -H "Content-Type: application/json" \
  -d "{\"prompt_id\": \"$ZOMBIE_ID\", \"suggestion_index\": 0}"

# 4. Check revival history
curl "http://localhost:3001/api/revive/history/$ZOMBIE_ID"
```

## 📈 Analytics and Metrics

### Get Comprehensive Statistics

```bash
# Overall graveyard statistics
curl "http://localhost:3001/api/prompts/stats"

# Detailed aggregated metrics
curl "http://localhost:3001/api/results/metrics"

# Revival success rates
curl "http://localhost:3001/api/revive/stats"
```

### Provider Performance Analysis

```bash
# Get all results for OpenAI GPT-3.5
curl "http://localhost:3001/api/results/by-provider/openai_gpt35"

# Get all results for Groq LLaMA3
curl "http://localhost:3001/api/results/by-provider/groq_llama3"

# Compare provider performance in aggregated metrics
curl "http://localhost:3001/api/results/metrics" | jq '.data.provider_statistics'
```

## 🎭 JavaScript/Node.js Examples

### Fetch API Usage

```javascript
// Get zombie prompts with error handling
async function getZombiePrompts() {
  try {
    const response = await fetch('http://localhost:3001/api/prompts/zombies?limit=10');
    const data = await response.json();
    
    if (data.success) {
      console.log(`Found ${data.data.total} zombie prompts`);
      return data.data.zombies;
    } else {
      console.error('API Error:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Network Error:', error);
    return [];
  }
}

// Revive a zombie prompt
async function reviveZombie(promptId, suggestionIndex) {
  try {
    const response = await fetch('http://localhost:3001/api/revive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt_id: promptId,
        suggestion_index: suggestionIndex,
        user_feedback: 'Automated revival attempt'
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Revival failed:', error);
    return { success: false, error: error.message };
  }
}
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useGraveyardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('http://localhost:3001/api/prompts/stats');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}
```

## 🔧 Testing the API

### Run the Test Script

```bash
# Make sure the server is running first
npm run dev

# In another terminal, run the test script
node test-api.js
```

### Manual Testing with curl

```bash
# Test all main endpoints quickly
curl -s "http://localhost:3001/api/health" | jq '.success'
curl -s "http://localhost:3001/api/results?limit=1" | jq '.data.pagination.total'
curl -s "http://localhost:3001/api/prompts/stats" | jq '.data.total_prompts'
```

## 🎃 Spooky Features

The API includes Halloween-themed features:

- **Spooky Headers**: Each response includes Halloween-themed headers
- **Themed Messages**: Success and error messages use spooky language
- **Request IDs**: Generated with spooky prefixes (ghost-, zombie-, witch-, etc.)
- **Haunted Logging**: Server logs include spooky emojis and timestamps
- **Rate Limiting**: Protective spells against API abuse

## 🚨 Error Handling

The API provides detailed error responses:

- `400 Bad Request`: Invalid parameters or request format
- `404 Not Found`: Resource not found in the graveyard
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side issues

All errors include spooky messages and helpful guidance for resolution.

---

*May your API calls be swift and your prompts be alive! 🌟*