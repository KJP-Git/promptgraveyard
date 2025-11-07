# 🎃 Prompt Graveyard Examples 🎃

This directory contains example prompts and demonstration scripts to showcase the Prompt Graveyard evaluation system.

## 📁 Contents

### Sample Prompts (`sample-prompts/`)

Four example prompts demonstrating different quality levels:

1. **`good-prompt.txt`** ✨
   - Well-structured, detailed prompt with clear requirements
   - Expected to score high and remain "alive"
   - Demonstrates best practices for prompt engineering

2. **`zombie-prompt.txt`** 💀
   - Extremely vague, minimal prompt
   - Expected to become a "skeletal zombie" (severe issues)
   - Shows what happens with poor prompt quality

3. **`creative-prompt.txt`** 🎨
   - Creative storytelling prompt with good structure
   - Tests creativity metrics
   - Should score well overall

4. **`mediocre-prompt.txt`** 😐
   - Basic prompt with some structure but lacking detail
   - Expected to be borderline (shambling zombie or barely alive)
   - Shows the middle ground

## 🚀 Running the Demo

### Quick Start

```bash
# Run the evaluation demo
python examples/run-evaluation-demo.py
```

### What the Demo Does

The demo script will:

1. **Load Sample Prompts** - Reads all `.txt` files from `sample-prompts/`
2. **Evaluate Each Prompt** - Simulates evaluation with mock LLM providers
3. **Calculate Metrics** - Computes latency, cost, semantic accuracy, etc.
4. **Classify Zombies** - Determines which prompts are "zombies"
5. **Generate Revival Suggestions** - Creates improvement suggestions for zombies
6. **Save Results** - Appends results to `data/results.json` in JSONL format
7. **Display Summary** - Shows statistics and zombie breakdown

### Expected Output

```
🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃

     🏚️  PROMPT GRAVEYARD EVALUATION DEMO  🏚️
     
     Demonstrating the complete evaluation pipeline
     with sample prompts of varying quality
     
🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃

🔮 Initialized 2 LLM providers
📁 Found 4 sample prompts

============================================================
🎃 Evaluating: creative-prompt.txt
============================================================
📝 Prompt: Write a spooky Halloween story about an AI...
📏 Length: 42 words

🔮 Calling LLM providers...
  ⚡ OpenAI GPT-3.5... ✓ (2400ms, $0.0156)
  ⚡ Groq LLaMA3... ✓ (1440ms, $0.0078)

📊 Calculating metrics...
  📈 Semantic Accuracy: 0.85 (good)
  ⚡ Avg Latency: 1920ms (good)
  💰 Total Cost: $0.0234 (acceptable)
  🎯 Overall Score: 0.78

🧟‍♂️ Zombie Classification:
  Status: ALIVE ✨
  Severity: alive
  Priority: none

[... continues for each prompt ...]

============================================================
📊 EVALUATION SUMMARY
============================================================
Total Prompts Evaluated: 4
Living Prompts: 2 ✨
Zombie Prompts: 2 🧟‍♂️
Zombie Rate: 50.0%
Average Score: 0.62
Total Cost: $0.0456

🎭 Zombie Breakdown:
  skeletal_zombie: 1
  shambling_zombie: 1

============================================================
🎉 Evaluation Demo Complete!
============================================================
```

## 🔗 Integration with API

After running the demo, the results are saved to `data/results.json`. You can then:

### 1. Start the API Server

```bash
cd server
npm run dev
```

### 2. Query the Results

```bash
# Get all results
curl "http://localhost:3001/api/results"

# Get zombie prompts
curl "http://localhost:3001/api/prompts/zombies"

# Get graveyard statistics
curl "http://localhost:3001/api/prompts/stats"

# Get aggregated metrics
curl "http://localhost:3001/api/results/metrics"
```

### 3. Test Revival System

```bash
# Get a zombie prompt ID from the results
ZOMBIE_ID=$(curl -s "http://localhost:3001/api/prompts/zombies?limit=1" | jq -r '.data.zombies[0].prompt_id')

# Get revival suggestions
curl "http://localhost:3001/api/revive/suggestions/$ZOMBIE_ID"

# Attempt to revive the zombie
curl -X POST "http://localhost:3001/api/revive" \
  -H "Content-Type: application/json" \
  -d "{\"prompt_id\": \"$ZOMBIE_ID\", \"suggestion_index\": 0}"
```

## 📝 Creating Your Own Sample Prompts

Add new prompts to the `sample-prompts/` directory:

```bash
# Create a new prompt file
echo "Your prompt text here" > examples/sample-prompts/my-prompt.txt

# Run the evaluation
python examples/run-evaluation-demo.py
```

### Tips for Creating Sample Prompts

**For Good Prompts (High Scores):**
- Be specific and detailed
- Include clear requirements
- Specify desired format
- Provide context
- Use structured formatting

**For Zombie Prompts (Low Scores):**
- Be extremely vague
- Use minimal words
- Lack context or structure
- Have unclear intent
- Omit important details

## 🎭 Understanding the Results

### Zombie Classification

- **Alive** (Score ≥ 0.6): Prompt performs well ✨
- **Shambling Zombie** (0.5-0.6): Mild issues, low priority 🧟
- **Rotting Zombie** (0.3-0.5): Moderate issues, medium priority 🧟‍♂️
- **Skeletal Zombie** (< 0.3): Severe issues, high priority 💀

### Metrics Explained

- **Semantic Accuracy**: How well responses address the prompt
- **Latency**: Average response time across LLM providers
- **Cost Efficiency**: Total cost of generating responses
- **Overall Score**: Weighted combination of all metrics

### Revival Suggestions

For zombie prompts, the system generates 3 improvement strategies:

1. **Clarity Enhancement**: Add context and structure
2. **Instruction Optimization**: Specify format and requirements
3. **Context Enrichment**: Add examples and use cases

## 🧪 Testing the Complete Pipeline

### Full End-to-End Test

```bash
# 1. Run evaluation demo
python examples/run-evaluation-demo.py

# 2. Start API server (in another terminal)
cd server && npm run dev

# 3. Test API endpoints (in another terminal)
node server/test-api.js

# 4. View results in browser
open http://localhost:3001/api/
```

## 🎃 Next Steps

1. **Customize Prompts**: Modify sample prompts to test different scenarios
2. **Add More Samples**: Create additional prompts in various domains
3. **Test Real LLMs**: Replace mock providers with actual API calls
4. **Build Frontend**: Create a React dashboard to visualize results
5. **Automate**: Set up agent hooks to evaluate prompts automatically

---

*May your prompts be ever living! 🌟*