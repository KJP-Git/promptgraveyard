import { useState, useEffect } from 'react';
import './App.css';
import GraveyardDashboard from './components/GraveyardDashboard';
import ZombiePromptCard from './components/ZombiePromptCard';
import StatsPanel from './components/StatsPanel';

function App() {
  const [stats, setStats] = useState<any>(null);
  const [zombies, setZombies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch graveyard stats
      const statsRes = await fetch('http://localhost:3001/api/prompts/stats');
      const statsData = await statsRes.json();
      setStats(statsData.data);

      // Fetch zombie prompts
      const zombiesRes = await fetch('http://localhost:3001/api/prompts/zombies?limit=10');
      const zombiesData = await zombiesRes.json();
      setZombies(zombiesData.data.zombies);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="skull-loader">💀</div>
        <p className="loading-text">Awakening the spirits...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="graveyard-header">
        <h1 className="spooky-title">
          🎃 Prompt Graveyard 🎃
        </h1>
        <p className="subtitle">Where prompts come to be judged... and possibly become zombies</p>
      </header>

      <StatsPanel stats={stats} />
      
      <GraveyardDashboard zombies={zombies} onRefresh={fetchData} />
    </div>
  );
}

export default App;