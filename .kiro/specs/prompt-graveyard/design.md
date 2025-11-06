# Design Document

## Overview

The Prompt Graveyard is a full-stack web application that combines a React frontend with a Node.js backend to create an engaging, Halloween-themed prompt evaluation experience. The system evaluates prompts across multiple LLM providers, visualizes poor performers as "zombies," and uses AI agents to suggest improvements.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Node.js Server │    │ LLM Providers   │
│                 │    │                 │    │                 │
│ - Dashboard     │◄──►│ - REST API      │◄──►│ - OpenAI GPT    │
│ - Graveyard UI  │    │ - WebSocket     │    │ - Anthropic     │
│ - Analytics     │    │ - Evaluation    │    │ - LLaMA         │
└─────────────────┘    │   Pipeline      │    └─────────────────┘
                       │ - Revival Agent │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   SQLite DB     │
                       │                 │
                       │ - Prompts       │
                       │ - Evaluations   │
                       │ - Metrics       │
                       └─────────────────┘
```

### Component Architecture

The system follows a modular architecture with clear separation of concerns:

- **Frontend Layer**: React SPA with spooky theming and real-time updates
- **API Layer**: Express.js REST API with WebSocket support
- **Business Logic Layer**: Evaluation pipeline and revival agent
- **Data Layer**: SQLite database with performance optimization
- **Integration Layer**: LLM provider abstractions and rate limiting

## Components and Interfaces

### Frontend Components

#### Core Components
- **GraveyardDashboard**: Main container component managing overall state
- **ZombiePromptCard**: Individual zombie visualization with hover effects
- **PromptSubmissionForm**: Form for adding new prompts with validation
- **PerformanceChart**: Time-series visualization using Recharts
- **RevivalSuggestions**: Display and interaction for AI-generated improvements

#### Shared Components
- **SpookyLoader**: Halloween-themed loading animations
- **ErrorTombstone**: Themed error display component
- **MetricsGauge**: Performance score visualization
- **NotificationGhost**: Toast notifications with spooky styling

### Backend Services

#### API Endpoints
```typescript
// Prompt Management
POST   /api/prompts              // Submit new prompt
GET    /api/prompts              // List all prompts
GET    /api/prompts/:id          // Get specific prompt
PUT    /api/prompts/:id/revive   // Apply revival suggestion

// Evaluation System
POST   /api/evaluate             // Trigger manual evaluation
GET    /api/evaluations/:id      // Get evaluation results
GET    /api/zombies              // Get all zombie prompts

// Analytics
GET    /api/analytics/trends     // Performance trends
GET    /api/analytics/summary    // Dashboard summary stats
```

#### Core Services
- **EvaluationService**: Orchestrates LLM evaluations and scoring
- **RevivalAgentService**: Generates improvement suggestions using Kiro
- **MetricsCalculator**: Computes performance scores and classifications
- **LLMProviderManager**: Abstracts and manages multiple LLM integrations
- **WebSocketManager**: Handles real-time updates to connected clients

### LLM Provider Interface

```typescript
interface LLMProvider {
  name: string;
  evaluate(prompt: string): Promise<EvaluationResult>;
  isAvailable(): Promise<boolean>;
  getRateLimit(): RateLimitInfo;
}

interface EvaluationResult {
  response: string;
  qualityScore: number;
  coherenceRating: number;
  responseTime: number;
  tokenCount: number;
  error?: string;
}
```

## Data Models

### Database Schema

#### Prompts Table
```sql
CREATE TABLE prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  title VARCHAR(255),
  user_id VARCHAR(100),
  status ENUM('pending', 'evaluating', 'zombie', 'revived') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Evaluations Table
```sql
CREATE TABLE evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prompt_id INTEGER REFERENCES prompts(id),
  provider VARCHAR(50) NOT NULL,
  response TEXT,
  quality_score DECIMAL(3,2),
  coherence_rating DECIMAL(3,2),
  response_time INTEGER,
  token_count INTEGER,
  error_message TEXT,
  evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Revival Suggestions Table
```sql
CREATE TABLE revival_suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prompt_id INTEGER REFERENCES prompts(id),
  suggested_prompt TEXT NOT NULL,
  reasoning TEXT,
  improvement_score DECIMAL(3,2),
  status ENUM('pending', 'applied', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### TypeScript Interfaces

```typescript
interface Prompt {
  id: number;
  content: string;
  title?: string;
  userId?: string;
  status: 'pending' | 'evaluating' | 'zombie' | 'revived';
  averageScore?: number;
  evaluations: Evaluation[];
  revivalSuggestions: RevivalSuggestion[];
  createdAt: Date;
  updatedAt: Date;
}

interface PerformanceMetrics {
  averageQuality: number;
  averageCoherence: number;
  averageResponseTime: number;
  successRate: number;
  zombieClassification: boolean;
}
```

## Error Handling

### Frontend Error Handling
- **Network Errors**: Display spooky error tombstones with retry options
- **Validation Errors**: Inline form validation with Halloween-themed messages
- **Loading States**: Skeleton screens with ghostly animations
- **Fallback UI**: Error boundaries with themed fallback components

### Backend Error Handling
- **LLM Provider Failures**: Graceful degradation with partial results
- **Rate Limiting**: Queue management with exponential backoff
- **Database Errors**: Transaction rollback and error logging
- **Validation Errors**: Structured error responses with clear messages

### Error Recovery Strategies
- **Retry Logic**: Exponential backoff for transient failures
- **Circuit Breaker**: Prevent cascade failures from LLM providers
- **Graceful Degradation**: Continue operation with reduced functionality
- **User Feedback**: Clear error communication with suggested actions

## Testing Strategy

### Frontend Testing
- **Component Tests**: React Testing Library for UI components
- **Integration Tests**: Test user workflows and API interactions
- **Visual Tests**: Snapshot testing for spooky theme consistency
- **Accessibility Tests**: Ensure Halloween theme doesn't impact usability

### Backend Testing
- **Unit Tests**: Core evaluation logic and metrics calculations
- **Integration Tests**: Database operations and LLM provider mocks
- **API Tests**: Endpoint functionality and error handling
- **Performance Tests**: Load testing for evaluation pipeline

### End-to-End Testing
- **User Journeys**: Complete prompt submission to revival workflow
- **Real-time Features**: WebSocket functionality and live updates
- **Cross-browser**: Ensure spooky animations work across browsers
- **Mobile Responsiveness**: Graveyard visualization on mobile devices

### Test Data Strategy
- **Mock LLM Responses**: Consistent test data for evaluation logic
- **Seed Data**: Halloween-themed sample prompts for development
- **Performance Scenarios**: Test data for various zombie classifications
- **Edge Cases**: Malformed prompts and provider failures

## Performance Considerations

### Frontend Optimization
- **Lazy Loading**: Code splitting for dashboard components
- **Virtual Scrolling**: Handle large numbers of zombie prompts
- **Memoization**: Prevent unnecessary re-renders of expensive components
- **Asset Optimization**: Compress Halloween-themed images and animations

### Backend Optimization
- **Database Indexing**: Optimize queries for performance metrics
- **Caching Strategy**: Redis for frequently accessed evaluation results
- **Connection Pooling**: Efficient database connection management
- **Rate Limiting**: Prevent LLM provider quota exhaustion

### Real-time Performance
- **WebSocket Optimization**: Efficient message broadcasting
- **Debouncing**: Prevent excessive evaluation triggers
- **Background Processing**: Queue system for evaluation pipeline
- **Memory Management**: Cleanup of completed evaluation tasks

## Security Considerations

### API Security
- **Input Validation**: Sanitize all prompt submissions
- **Rate Limiting**: Prevent abuse of evaluation endpoints
- **API Key Management**: Secure storage of LLM provider credentials
- **CORS Configuration**: Restrict cross-origin requests appropriately

### Data Protection
- **Prompt Privacy**: Option to mark prompts as private
- **Audit Logging**: Track all evaluation and revival activities
- **Data Retention**: Configurable cleanup of old evaluation data
- **Encryption**: Secure storage of sensitive prompt content