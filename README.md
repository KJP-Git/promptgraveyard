# 🎃 Prompt Graveyard 🎃

A spooky Halloween-themed AI dashboard that evaluates prompt performance across multiple Large Language Models (LLMs) and automatically suggests improvements for poorly performing "zombie" prompts.

## 🧟‍♂️ What is Prompt Graveyard?

Prompt Graveyard is a comprehensive system that:
- **Evaluates prompts** across multiple LLMs (OpenAI GPT, Groq LLaMA, Anthropic Claude)
- **Identifies zombie prompts** that perform poorly based on metrics like latency, cost, semantic accuracy, and coherence
- **Provides revival suggestions** using AI-powered improvement strategies
- **Tracks performance trends** over time with spooky visualizations
- **Automates evaluation** through file monitoring and agent hooks

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Agent Hooks   │───▶│  Evaluation      │───▶│   Data Storage  │
│  (File Watch)   │    │   Pipeline       │    │ (results.json)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │◀───│   Express API    │◀───│  Revival Agent  │
│  (React/Vue)    │    │  (TypeScript)    │    │   (AI Powered)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+ (for evaluation pipeline)
- API keys for LLM providers (OpenAI, Groq, etc.)

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd prompt-graveyard
```

### 2. Start the API Server
```bash
cd server
./start.sh  # Automated setup and start
```

### 3. Set up Agent Hooks (Optional)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Set your API keys
export OPENAI_API_KEY="your-key-here"
export GROQ_API_KEY="your-key-here"

# Test the evaluation pipeline
python test_evaluation.py
```

### 4. Add Prompts for Evaluation
```bash
# Add prompts to the prompts directory
echo "Write a creative story about AI" > prompts/my-prompt.txt

# The agent hook will automatically evaluate it!
```

## 📁 Project Structure

```
prompt-graveyard/
├── 🎃 Core System
│   ├── .kiro/
│   │   ├── spec.yaml              # System configuration
│   │   ├── hooks/                 # Agent hooks for automation
│   │   └── specs/                 # Feature specifications
│   ├── evaluation/                # Python evaluation pipeline
│   │   ├── llm_providers.py       # LLM integrations
│   │   ├── metrics_calculator.py  # Performance metrics
│   │   └── revival_agent.py       # AI improvement suggestions
│   └── prompts/                   # Prompts to evaluate
│
├── 🖥️ Backend API
│   └── server/
│       ├── src/
│       │   ├── controllers/       # HTTP request handlers
│       │   ├── services/          # Business logic
│       │   ├── routes/            # API endpoints
│       │   ├── middleware/        # Custom middleware
│       │   ├── types/             # TypeScript definitions
│       │   └── utils/             # Helper functions
│       └── examples/              # API usage examples
│
├── 🎭 Frontend (Coming Soon)
│   └── client/                    # React dashboard
│
└── 📊 Data
    └── data/                      # Evaluation results and logs
```

## 🔮 Key Features

### 🧟‍♂️ Zombie Classification
Prompts are automatically classified based on performance:
- **Shambling Zombie** (0.5-0.6): Mild issues, easy to fix
- **Rotting Zombie** (0.3-0.5): Moderate issues, needs attention  
- **Skeletal Zombie** (0.0-0.3): Severe issues, major revival needed

### 📊 Comprehensive Metrics
- **Latency**: Response time across LLMs
- **Cost Efficiency**: Token usage and API costs
- **Semantic Accuracy**: How well responses match intent
- **Coherence**: Logical flow and readability
- **Creativity**: Originality and creative value

### 🧙‍♀️ AI-Powered Revival
When prompts become zombies, the system automatically:
1. Analyzes what went wrong
2. Generates 3 improvement suggestions
3. Provides reasoning for each suggestion
4. Predicts expected performance improvements

### ⚡ Automated Evaluation
- File monitoring triggers automatic evaluation
- Agent hooks process new prompts in real-time
- Results stored in JSON and vector databases
- WebSocket updates for live dashboard

## 🗺️ API Endpoints

### Prompt Management
- `GET /api/prompts` - All prompts with filtering
- `GET /api/prompts/zombies` - Zombie prompts only
- `GET /api/prompts/living` - Successful prompts
- `GET /api/prompts/stats` - Performance statistics

### Raw Results
- `GET /api/results` - Raw evaluation data
- `GET /api/results/metrics` - Aggregated analytics
- `GET /api/results/by-provider/:provider` - Provider-specific results

### Revival System
- `POST /api/revive` - Attempt to revive a zombie prompt
- `GET /api/revive/suggestions/:id` - Get improvement suggestions
- `GET /api/revive/stats` - Revival success rates

## 🎭 Example Usage

### Evaluate a Prompt
```bash
# Add a prompt file
echo "Explain quantum computing simply" > prompts/quantum.txt

# Check results via API
curl "http://localhost:3001/api/prompts/stats"
```

### Revive a Zombie Prompt
```bash
# Find zombie prompts
curl "http://localhost:3001/api/prompts/zombies"

# Get revival suggestions
curl "http://localhost:3001/api/revive/suggestions/zombie-id"

# Apply a suggestion
curl -X POST "http://localhost:3001/api/revive" \
  -H "Content-Type: application/json" \
  -d '{"prompt_id": "zombie-id", "suggestion_index": 0}'
```

## 🔧 Configuration

### LLM Providers
Configure in `.kiro/spec.yaml`:
```yaml
llm_providers:
  openai_gpt35:
    model: "gpt-3.5-turbo"
    api_key_env: "OPENAI_API_KEY"
    cost_per_token:
      input: 0.0000005
      output: 0.0000015
```

### Evaluation Metrics
```yaml
evaluation_metrics:
  semantic_accuracy:
    weight: 0.35
    scoring_method: "llm_judge"
  latency:
    weight: 0.2
    unit: "milliseconds"
```

## 🧪 Testing

### Test the API
```bash
cd server
node test-api.js
```

### Test Evaluation Pipeline
```bash
python test_evaluation.py
```

### Manual Testing
```bash
# Health check
curl "http://localhost:3001/api/health"

# Get sample results
curl "http://localhost:3001/api/results?limit=5"
```

## 🎃 Halloween Features

This project embraces its spooky theme with:
- **Themed Error Messages**: Creative, Halloween-inspired error responses
- **Spooky Logging**: Haunted timestamps and emoji-rich logs
- **Creative Naming**: Variables like `zombiePrompts`, `graveyardService`, `revivalAgent`
- **Atmospheric UI**: Dark themes with eerie colors and animations
- **Sound Effects**: Optional spooky sounds for notifications

## 🤝 Contributing

1. Fork the graveyard repository
2. Create a spooky feature branch (`git checkout -b feature/haunted-analytics`)
3. Make your cursed changes
4. Add tests for your necromancy
5. Commit with a descriptive message (`git commit -m "Add zombie resurrection spell"`)
6. Push to your branch (`git push origin feature/haunted-analytics`)
7. Open a Pull Request to the main graveyard

## 📄 License

MIT License - May your code be forever alive! 🌟

## 🎭 Acknowledgments

- Built with 🎃 for the Kiroween Hackathon
- Inspired by the eternal struggle between good prompts and zombie prompts
- Special thanks to all the AI spirits that guide our evaluations

---

*"In the digital realm where prompts roam free, some live, some die, and some become zombies... but with the right magic, even the undead can be brought back to life!"* 🧙‍♀️✨

## 🆘 Support

If you encounter any ghosts in the machine:
1. Check the [API documentation](server/examples/api-usage-examples.md)
2. Review the [troubleshooting guide](server/README.md)
3. Open an issue with the `haunted` label
4. May the spirits guide your debugging! 👻