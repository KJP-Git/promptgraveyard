# 🎃 Prompt Graveyard API 🎃

A spooky Express.js API server that serves evaluation results from the Prompt Graveyard system. This Halloween-themed API provides endpoints for managing prompt evaluations, zombie classification, and revival suggestions.

## 🧟‍♂️ Features

- **Prompt Management**: Retrieve and filter prompt evaluation results
- **Zombie Classification**: Identify poorly performing prompts that need revival
- **Revival System**: Get AI-powered suggestions to improve zombie prompts
- **Spooky Theming**: Halloween-themed responses, error messages, and logging
- **TypeScript**: Full type safety with comprehensive type definitions
- **Rate Limiting**: Protect against API abuse with spooky error messages
- **Comprehensive Logging**: Track all API interactions with haunted timestamps

## 🚀 Quick Start

### Installation

```bash
cd server
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## 🗺️ API Endpoints

### Prompts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/prompts` | Get all prompts with filtering and pagination |
| `GET` | `/api/prompts/stats` | Get graveyard statistics |
| `GET` | `/api/prompts/zombies` | Get zombie prompts only |
| `GET` | `/api/prompts/living` | Get living (successful) prompts |
| `GET` | `/api/prompts/:id` | Get specific prompt by ID |

### Revival Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/revive` | Attempt to revive a zombie prompt |
| `GET` | `/api/revive/stats` | Get revival statistics |
| `GET` | `/api/revive/suggestions/:promptId` | Get revival suggestions |
| `GET` | `/api/revive/history/:promptId` | Get revival history |
| `POST` | `/api/revive/save-improved/:revivalId` | Save improved prompt |

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/` | API welcome and documentation |
| `GET` | `/api/health` | Health check endpoint |

## 📊 Query Parameters

### Filtering (for `/api/prompts` and `/api/prompts/zombies`)

- `is_zombie`: boolean - Filter by zombie status
- `severity`: string - Filter by zombie severity level
- `min_score`: number - Minimum overall score
- `max_score`: number - Maximum overall score
- `date_from`: string - Filter from date (ISO format)
- `date_to`: string - Filter to date (ISO format)
- `llm_provider`: string - Filter by LLM provider

### Pagination

- `page`: number - Page number (default: 1)
- `limit`: number - Items per page (default: 20, max: 100)
- `sort_by`: string - Sort field (timestamp, score, cost, latency)
- `sort_order`: string - Sort order (asc, desc)

## 🧟‍♂️ Example Requests

### Get All Zombie Prompts

```bash
curl "http://localhost:3001/api/prompts/zombies?page=1&limit=10&severity=rotting_zombie"
```

### Revive a Zombie Prompt

```bash
curl -X POST "http://localhost:3001/api/revive" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt_id": "abc123",
    "suggestion_index": 0,
    "user_feedback": "This suggestion looks promising!"
  }'
```

### Get Graveyard Statistics

```bash
curl "http://localhost:3001/api/prompts/stats"
```

## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── promptsController.ts
│   │   └── revivalController.ts
│   ├── services/            # Business logic
│   │   ├── graveyardService.ts
│   │   └── revivalService.ts
│   ├── routes/              # Route definitions
│   │   ├── promptsRoutes.ts
│   │   ├── revivalRoutes.ts
│   │   └── index.ts
│   ├── middleware/          # Custom middleware
│   │   └── spookyMiddleware.ts
│   ├── types/               # TypeScript definitions
│   │   └── graveyard.ts
│   ├── utils/               # Helper utilities
│   │   └── apiHelpers.ts
│   └── server.ts            # Main server file
├── dist/                    # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🎭 Response Format

All API responses follow this spooky format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "🎃 Spooky success message",
  "timestamp": "2024-11-06T00:00:00.000Z",
  "request_id": "ghost-1234-1699228800000"
}
```

Error responses:

```json
{
  "success": false,
  "error": "💀 Spooky error message",
  "timestamp": "2024-11-06T00:00:00.000Z",
  "request_id": "zombie-5678-1699228800000"
}
```

## 🔧 Configuration

The API can be configured through environment variables:

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `DATA_PATH`: Path to data directory
- `API_RATE_LIMIT_MAX_REQUESTS`: Rate limit per window
- `CORS_ORIGIN`: Allowed CORS origins

## 🧪 Testing

```bash
npm test
```

## 🎃 Spooky Features

- **Halloween Theming**: All responses include spooky emojis and themed messages
- **Spooky Headers**: Custom headers with Halloween quotes and version info
- **Haunted Logging**: Request/response logging with spooky timestamps
- **Zombie Classification**: Automatic identification of poorly performing prompts
- **Revival Magic**: AI-powered suggestions to improve zombie prompts
- **Error Tombstones**: Creative error messages with appropriate HTTP status codes

## 📚 Dependencies

- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Joi**: Request validation
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API protection
- **Compression**: Response compression

## 🤝 Contributing

1. Fork the repository
2. Create a spooky feature branch
3. Make your haunted changes
4. Add tests for your necromancy
5. Submit a pull request to the graveyard

## 📄 License

MIT License - May your code be forever alive! 🌟

---

*Built with 🎃 by the Kiroween Hackathon Team*