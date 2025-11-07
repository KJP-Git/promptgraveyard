import { useState } from 'react';
import './ZombiePromptCard.css';

interface ZombiePromptCardProps {
  zombie: any;
}

const ZombiePromptCard = ({ zombie }: ZombiePromptCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showRevival, setShowRevival] = useState(false);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'shambling_zombie': return '🧟';
      case 'rotting_zombie': return '🧟‍♂️';
      case 'skeletal_zombie': return '💀';
      default: return '👻';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'shambling_zombie': return '#ffa500';
      case 'rotting_zombie': return '#8b0000';
      case 'skeletal_zombie': return '#000000';
      default: return '#666666';
    }
  };

  return (
    <div className={`zombie-card severity-${zombie.severity}`}>
      <div className="zombie-header">
        <div className="zombie-icon">{getSeverityIcon(zombie.severity)}</div>
        <div className="zombie-info">
          <h3 className="zombie-title">Zombie Prompt</h3>
          <span 
            className="severity-badge"
            style={{ 
              backgroundColor: getSeverityColor(zombie.severity),
              boxShadow: `0 0 15px ${getSeverityColor(zombie.severity)}`
            }}
          >
            {zombie.severity.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="zombie-body">
        <div className="prompt-preview">
          <p className="prompt-text">
            {zombie.prompt_text.length > 100 
              ? `${zombie.prompt_text.substring(0, 100)}...` 
              : zombie.prompt_text}
          </p>
        </div>

        <div className="metrics-row">
          <div className="metric">
            <span className="metric-icon">🎯</span>
            <span className="metric-label">Score</span>
            <span className="metric-value">{(zombie.overall_score * 100).toFixed(0)}%</span>
          </div>
          <div className="metric">
            <span className="metric-icon">💰</span>
            <span className="metric-label">Cost</span>
            <span className="metric-value">${zombie.total_cost.toFixed(4)}</span>
          </div>
          <div className="metric">
            <span className="metric-icon">⚡</span>
            <span className="metric-label">Latency</span>
            <span className="metric-value">{zombie.avg_latency.toFixed(0)}ms</span>
          </div>
        </div>

        <div className="card-actions">
          <button 
            className="action-button details-button"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '👁️ Hide Details' : '👁️ Show Details'}
          </button>
          <button 
            className="action-button revival-button"
            onClick={() => setShowRevival(!showRevival)}
          >
            🧙‍♀️ Revival Options
          </button>
        </div>

        {showDetails && (
          <div className="details-panel">
            <h4 className="panel-title">📜 Full Prompt</h4>
            <p className="full-prompt">{zombie.prompt_text}</p>
            <div className="detail-info">
              <p><strong>Prompt ID:</strong> {zombie.prompt_id}</p>
              <p><strong>File Path:</strong> {zombie.file_path}</p>
              <p><strong>LLM Count:</strong> {zombie.llm_count}</p>
            </div>
          </div>
        )}

        {showRevival && (
          <div className="revival-panel">
            <h4 className="panel-title">🧙‍♀️ Revival Suggestions</h4>
            <p className="revival-info">
              This zombie prompt needs improvement! Click below to get AI-powered suggestions.
            </p>
            <button className="spooky-button revival-action">
              ⚡ Generate Revival Spells
            </button>
          </div>
        )}
      </div>

      <div className="zombie-footer">
        <span className="timestamp">
          ⏰ {new Date(zombie.timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ZombiePromptCard;