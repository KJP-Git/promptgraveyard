#!/bin/bash

# 🎃 Prompt Graveyard API Startup Script 🎃

echo "🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃"
echo "       🏚️  STARTING PROMPT GRAVEYARD API  🏚️"
echo "🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃👻🎃"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "💀 Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "💀 Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if we're in the server directory
if [ ! -f "package.json" ]; then
    echo "💀 Please run this script from the server directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "💀 Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. You may want to customize it."
else
    echo "✅ .env file exists"
fi

# Create data directory if it doesn't exist
if [ ! -d "../data" ]; then
    echo "📁 Creating data directory..."
    mkdir -p ../data
    echo "✅ Data directory created"
else
    echo "✅ Data directory exists"
fi

# Check if results.json exists, create sample if not
if [ ! -f "../data/results.json" ]; then
    echo "📄 Creating sample results.json file..."
    cat > ../data/results.json << 'EOF'
{"prompt_id":"sample-001","file_path":"prompts/sample.txt","prompt_text":"Write a creative story about a haunted AI","timestamp":"2024-11-06T12:00:00.000Z","llm_responses":{"openai_gpt35":{"response":"Once upon a time, there was a haunted AI named CodeGhost...","latency_ms":1500,"cost_usd":0.003,"timestamp":"2024-11-06T12:00:00.000Z","model":"gpt-3.5-turbo"}},"metrics":{"semantic_accuracy":{"value":0.85,"normalized_score":0.8,"category":"good","weight":0.35}},"zombie_status":{"is_zombie":false,"overall_score":0.75,"severity":"alive","visual_theme":"healthy","revival_priority":"none","failed_critical_metrics":[],"reason":"Performance within acceptable range"},"revival_suggestions":[]}
EOF
    echo "✅ Sample results.json created"
else
    echo "✅ Results file exists"
fi

echo ""
echo "🚀 Starting the Prompt Graveyard API server..."
echo "📍 Server will be available at: http://localhost:3001"
echo "📚 API documentation: http://localhost:3001/api"
echo ""
echo "🧙‍♀️ To test the API, run: node test-api.js (in another terminal)"
echo ""

# Start the development server
npm run dev