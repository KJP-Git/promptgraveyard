---
inclusion: always
---

# Prompt Graveyard Development Guidelines

## Creative Direction
- Embrace Halloween/spooky themes throughout the codebase with creative variable names and comments
- Use dark color schemes with accent colors: deep purples, eerie greens, blood reds, and ghostly whites
- Implement smooth, haunting animations and transitions
- Add sound effects and atmospheric elements where appropriate

## Technical Standards
- Follow React best practices with functional components and hooks
- Use TypeScript for type safety in critical evaluation logic
- Implement proper error handling with spooky-themed error messages
- Maintain clean separation between frontend, backend, and evaluation pipeline
- Use WebSockets for real-time updates of zombie status changes

## LLM Integration Patterns
- Abstract LLM providers behind a common interface
- Implement retry logic with exponential backoff for API calls
- Cache evaluation results to avoid redundant API calls
- Use environment variables for API keys and configuration

## Performance Considerations
- Batch prompt evaluations when possible
- Implement lazy loading for large prompt datasets
- Use database indexing for performance metrics queries
- Optimize React renders with proper memoization

## Testing Philosophy
- Focus on core evaluation logic and API integrations
- Mock LLM providers for consistent testing
- Test zombie classification algorithms thoroughly
- Validate performance metric calculations

## Code Style
- Use descriptive, theme-appropriate variable names (e.g., `zombiePrompts`, `graveyard`, `revivalAgent`)
- Add Halloween-themed comments and documentation
- Keep functions focused and modular
- Follow consistent naming conventions across frontend and backend