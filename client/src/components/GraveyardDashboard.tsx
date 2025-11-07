import { useState } from 'react';
import ZombiePromptCard from './ZombiePromptCard';
import './GraveyardDashboard.css';

interface GraveyardDashboardProps {
  zombies: any[];
  onRefresh: () => void;
}

const GraveyardDashboard = ({ zombies, onRefresh }: GraveyardDashboardProps) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredZombies = zombies.filter(zombie => {
    if (filter === 'all') return true;
    return zombie.severity === filter;
  });

  return (
    <div className="graveyard-dashboard">
      <div className="dashboard-header">
        <h2 className="section-title">
          🪦 The Graveyard 🪦
        </h2>
        <div className="controls">
          <select 
            className="spooky-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Zombies</option>
            <option value="shambling_zombie">Shambling 🧟</option>
            <option value="rotting_zombie">Rotting 🧟‍♂️</option>
            <option value="skeletal_zombie">Skeletal 💀</option>
          </select>
          
          <button className="spooky-button" onClick={onRefresh}>
            🔄 Refresh Graveyard
          </button>
        </div>
      </div>

      {filteredZombies.length === 0 ? (
        <div className="empty-graveyard">
          <div className="empty-icon">👻</div>
          <p className="empty-text">No zombies found in this section of the graveyard...</p>
          <p className="empty-subtext">All prompts are alive and well! ✨</p>
        </div>
      ) : (
        <div className="zombie-grid">
          {filteredZombies.map((zombie) => (
            <ZombiePromptCard key={zombie.prompt_id} zombie={zombie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GraveyardDashboard;