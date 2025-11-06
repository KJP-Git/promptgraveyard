# Auto-Evaluate Prompts Hook

## Trigger
When a new prompt file is added to the `prompts/` directory or when the API receives a new prompt submission

## Action
Automatically trigger the evaluation pipeline to:
1. Send the prompt to configured LLM providers
2. Calculate performance metrics
3. Classify as zombie if performance is poor
4. Trigger revival agent if needed
5. Update the dashboard with results

## Configuration
- Monitor file changes in `prompts/` directory
- Listen for webhook events from the API
- Rate limit to prevent overwhelming LLM providers
- Log all evaluation activities for debugging

## Expected Outcome
New prompts are automatically evaluated and appear in the graveyard dashboard without manual intervention, maintaining the real-time spooky experience.