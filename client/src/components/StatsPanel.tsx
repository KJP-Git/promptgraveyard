import './StatsPanel.css';

interface StatsPanelProps {
  stats: any;
}

const StatsPanel = ({ stats }: StatsPanelProps) => {
  if (!stats) {
    return null;
  }

  const zombieRate = ((stats.zombie_count / stats.total_prompts) * 100).toFixed(1);

  return (
    <div className="stats-panel">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.total_prompts}</div>
          <div className="stat-label">Total Prompts</div>
        </div>

        <div className="stat-card zombie-stat">
          <div className="stat-icon">🧟‍♂️</div>
          <div className="stat-value">{stats.zombie_count}</div>
          <div className="stat-label">Zombie Prompts</div>
          <div className="stat-percentage">{zombieRate}%</div>
        </div>

        <div className="stat-card alive-stat">
          <div className="stat-icon">✨</div>
          <div className="stat-value">{stats.total_prompts - stats.zombie_count}</div>
          <div className="stat-label">Living Prompts</div>
          <div className="stat-percentage">{(100 - parseFloat(zombieRate)).toFixed(1)}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{(stats.avg_score * 100).toFixed(0)}%</div>
          <div className="stat-label">Avg Score</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">${stats.total_cost.toFixed(4)}</div>
          <div className="stat-label">Total Cost</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{stats.avg_latency.toFixed(0)}ms</div>
          <div className="stat-label">Avg Latency</div>
        </div>
      </div>

      {stats.severity_breakdown && Object.keys(stats.severity_breakdown).length > 0 && (
        <div className="severity-breakdown">
          <h3 className="breakdown-title">💀 Zombie Severity Breakdown 💀</h3>
          <div className="severity-grid">
            {Object.entries(stats.severity_breakdown).map(([severity, count]: [string, any]) => (
              <div key={severity} className={`severity-item severity-${severity}`}>
                <div className="severity-icon">
                  {severity === 'shambling_zombie' && '🧟'}
                  {severity === 'rotting_zombie' && '🧟‍♂️'}
                  {severity === 'skeletal_zombie' && '💀'}
                </div>
                <div className="severity-info">
                  <div className="severity-name">{severity.replace('_', ' ')}</div>
                  <div className="severity-count">{count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;