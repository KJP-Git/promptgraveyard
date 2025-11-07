# 🎃 Prompt Graveyard - Quick Start Guide 🎃

Get up and running with the Prompt Graveyard evaluation system in minutes!

## 🚀 Quick Start (3 Steps)

### Step 1: Run the Evaluation Demo

```bash
# Run the demo with sample prompts
python examples/run-evaluation-demo.py
```

This will:
- Evaluate 4 sample prompts (good, bad, creative, mediocre)
- Generate mock LLM responses
- Calculate metrics and classify zombies
- Save results to `data/results.json`

**Expected Output:**
```
🎃 PROMPT GRAVEYARD EVALUATION DEMO 🎃

📁 Found 4 sample prompts
🔮 Evaluating each prompt...
💾 Saved 4 evaluation results

📊 EVALUATION SUMMARY
Total Prompts: 4
Living Prompts: 2 ✨
Zombie Prompts: 2 🧟‍♂️
Zombie Rate: 50.0%
```

### Step 2: Start the API Server

```bash
# Navigate to server directory and start
cd server
npm install  # First time only
npm run dev
```

**Expected Output:**
```
🎃 PROMPT GRAVEYARD API SERVER 🎃

👻 Server Status: ALIVE
🌐 Port: 3001
🔮 API Endpoints ready!
```

### Step 3: Query the Results

In a new terminal:

```bash
# Get all results
curl "http://localhost:3001/api/results"

# Get zombie prompts
curl "http://localhost:3001/api/prompts/zombies"

# Get statistics
curl "http://localhost:3001/api/prompts/stats"
```

## 🎯 What You Get

### Sample Prompts Evaluated

1. **Good Prompt** ✨ - Detailed, well-structured
2. **Zombie Prompt** 💀 - Vague, minimal ("write code")
3. **Creative Prompt** 🎨 - Storytelling with good structure
4. **Mediocre Prompt** 😐 - Basic, lacking detail

### API Endpoints Available

| Endpoint | Description |
|----------|-------------|
| `GET /api/results` | All raw evaluation results |
| `GET /api/prompts` | Processed prompt summaries |
| `GET /api/prompts/zombies` | Only zombie prompts |
| `GET /api/prompts/stats` | Graveyard statistics |
| `GET /api/revive/suggestions/:id` | Revival suggestions |
| `POST /api/revive` | Attempt to revive a zombie |

## 📊 Example API Calls

### Get Zombie Prompts

```bash
curl "http://localhost:3001/api/prompts/zombies" | jq
```

**Response:**
```json
{
  "success": true,
  "data": {
    "zombies": [
      {
        "prompt_id": "abc123",
        "prompt_text": "write code",
        "overall_score": 0.35,
        "severity": "skeletal_zombie",
        "is_zombie": true
      }
    ],
    "total": 1
  },
  "message": "🧟‍♂️ Found 1 zombie prompts lurking in the graveyard"
}
```

### Get Revival Suggestions

```bash
# Get a zombie ID
ZOMBIE_ID=$(curl -s "http://localhost:3001/api/prompts/zombies?limit=1" | jq -r '.data.zombies[0].prompt_id')

# Get suggestions
curl "http://localhost:3001/api/revive/suggestions/$ZOMBIE_ID" | jq
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "improved_prompt": "Context: You are an expert...",
        "strategy": "clarity_enhancement",
        "confidence_score": 0.75,
        "expected_improvements": {
          "semantic_accuracy": 0.2,
          "coherence": 0.15
        }
      }
    ]
  }
}
```

### Attempt Revival

```bash
curl -X POST "http://localhost:3001/api/revive" \
  -H "Content-Type: application/json" \
  -d "{
    \"prompt_id\": \"$ZOMBIE_ID\",
    \"suggestion_index\": 0,
    \"user_feedback\": \"Testing revival\"
  }" | jq
```

## 🧪 Testing the Complete System

### Automated Test

```bash
# Run the API test script
node server/test-api.js
```

This tests all major endpoints and displays results.

### Manual Testing

```bash
# 1. Health check
curl "http://localhost:3001/api/health"

# 2. Get all results
curl "http://localhost:3001/api/results?limit=5"

# 3. Get statistics
curl "http://localhost:3001/api/prompts/stats"

# 4. Filter zombies by severity
curl "http://localhost:3001/api/prompts/zombies?severity=skeletal_zombie"

# 5. Get aggregated metrics
curl "http://localhost:3001/api/results/metrics"
```

## 📝 Adding Your Own Prompts

### Create a New Prompt

```bash
# Add your prompt to the sample prompts directory
echo "Your amazing prompt here" > examples/sample-prompts/my-prompt.txt

# Re-run the evaluation
python examples/run-evaluation-demo.py

# Query the new results
curl "http://localhost:3001/api/results?sort_by=timestamp&sort_order=desc&limit=1"
```

### Batch Evaluation

```bash
# Add multiple prompts
for i in {1..5}; do
  echo "Test prompt $i with varying quality" > examples/sample-prompts/test-$i.txt
done

# Evaluate all
python examples/run-evaluation-demo.py
```

## 🎭 Understanding the Results

### Zombie Classification

- **Score ≥ 0.6**: Alive ✨ (Good performance)
- **0.5-0.6**: Shambling Zombie 🧟 (Mild issues)
- **0.3-0.5**: Rotting Zombie 🧟‍♂️ (Moderate issues)
- **< 0.3**: Skeletal Zombie 💀 (Severe issues)

### Metrics Breakdown

Each prompt is evaluated on:

- **Semantic Accuracy** (35% weight): Response relevance
- **Latency** (20% weight): Response speed
- **Cost Efficiency** (15% weight): API cost
- **Coherence** (20% weight): Response quality
- **Creativity** (10% weight): Creative value (when applicable)

### Revival Strategies

For zombie prompts, the system suggests:

1. **Clarity Enhancement**: Add context and structure
2. **Instruction Optimization**: Specify format requirements
3. **Context Enrichment**: Add examples and use cases

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```bash
PORT=3001
NODE_ENV=development
DATA_PATH=../data
```

### API Configuration

Edit `server/.env` to customize:
- Port number
- CORS origins
- Rate limiting
- Logging level

## 🎃 Next Steps

### 1. Integrate Real LLMs

Replace mock providers with actual API calls:

```python
# In evaluation/llm_providers.py
# Add your API keys to .env
OPENAI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

### 2. Set Up Agent Hooks

Enable automatic evaluation when prompts are added:

```bash
# The hook is already configured in .kiro/hooks/
# Just add prompts to the /prompts directory
echo "New prompt" > prompts/auto-eval-test.txt
```

### 3. Build a Frontend

Create a React dashboard to visualize results:

```bash
cd client
npm install
npm run dev
```

### 4. Deploy to Production

```bash
# Build the API
cd server
npm run build

# Start in production mode
NODE_ENV=production npm start
```

## 📚 Documentation

- **API Documentation**: `server/README.md`
- **Examples Guide**: `examples/README.md`
- **Complete API Reference**: `server/examples/api-usage-examples.md`
- **System Overview**: `API_SUMMARY.md`

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Change the port in server/.env
PORT=3002
```

### No Results Found

```bash
# Make sure you ran the demo first
python examples/run-evaluation-demo.py

# Check if results file exists
ls -la data/results.json
```

### API Not Starting

```bash
# Install dependencies
cd server
npm install

# Check for errors
npm run dev
```

## 🎉 Success!

You now have a fully functional Prompt Graveyard system running! 

**What you can do:**
- ✅ Evaluate prompts automatically
- ✅ Classify zombies by severity
- ✅ Get AI-powered revival suggestions
- ✅ Query results via REST API
- ✅ Track performance metrics
- ✅ Analyze trends over time

---

*May your prompts be ever living! 🌟*