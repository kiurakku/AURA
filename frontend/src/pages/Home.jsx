import React, { useState, useEffect } from 'react';
import './Home.css';
import { api } from '../utils/api';

function Home({ user }) {
  const [recentWins, setRecentWins] = useState([]);
  const [liveWins, setLiveWins] = useState([]);
  const [currentPoster, setCurrentPoster] = useState(0);

  useEffect(() => {
    fetchRecentWins();
    // Simulate live wins updates
    const interval = setInterval(() => {
      fetchRecentWins();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentWins = async () => {
    try {
      const response = await api.get('/games/history?limit=10');
      const wins = response.data.games
        .filter(game => game.win_amount > 0)
        .slice(0, 10);
      setRecentWins(wins);
      setLiveWins(wins.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch wins:', error);
    }
  };

  const posters = [
    { id: 1, title: 'Вітальний бонус 100%', subtitle: 'До 500 USDT', image: encodeURI('/materials/Вітальний бонус 100%.jpg') },
    { id: 2, title: 'Турнір тижня', subtitle: 'Призовий фонд 10,000 USDT', image: encodeURI('/materials/Турнір тижня.jpeg') },
    { id: 3, title: 'Джекпот', subtitle: 'Накопичено 50,000 USDT', image: encodeURI('/materials/Джекпот.jpg') },
    { id: 4, title: 'Нові ігри!', subtitle: 'Спробуй першим', image: encodeURI('/materials/AURA.jpg') },
    { id: 5, title: 'Бонус шансу', subtitle: 'Кожен день нові нагороди', image: encodeURI('/materials/chance.png') },
    { id: 6, title: 'Omega турнір', subtitle: 'Ексклюзивні призи', image: encodeURI('/materials/Omega.png') }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posters.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quickGames = [
    { id: 'crash', name: 'Crash', icon: '🚀', color: 'purple' },
    { id: 'mines', name: 'Mines', icon: '💣', color: 'cyan' },
    { id: 'dice', name: 'Dice', icon: '🎲', color: 'purple' }
  ];

  return (
    <div className="home fade-in">
      {/* Hero Banner with Carousel */}
      <div className="hero-banner glass-card">
        <div className="poster-slider">
          {posters.map((poster, index) => (
            <div 
              key={poster.id} 
              className={`poster-slide ${index === currentPoster ? 'active' : ''}`}
            >
              <img src={poster.image} alt={poster.title} className="poster-bg" />
              <div className="poster-content">
                <h2 className="poster-title">{poster.title}</h2>
                <p className="poster-subtitle">{poster.subtitle}</p>
              </div>
              <div className="poster-glow"></div>
            </div>
          ))}
        </div>
        <div className="poster-indicators">
          {posters.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentPoster ? 'active' : ''}`}
              onClick={() => setCurrentPoster(index)}
            />
          ))}
        </div>
      </div>

      {/* Live Wins Ticker */}
      {liveWins.length > 0 && (
        <div className="live-wins-ticker glass-card">
          <div className="ticker-label">🔥 LIVE</div>
          <div className="ticker-content">
            {liveWins.map((win, index) => (
              <div key={index} className="ticker-item">
                <span className="ticker-user">User{win.user_id?.toString().slice(-4) || '***'}</span>
                <span className="ticker-action">виграв</span>
                <span className="ticker-amount">{win.win_amount.toFixed(2)} USDT</span>
                <span className="ticker-game">у {win.game_type}</span>
                <span className="ticker-icon">🚀</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Games Section */}
      <div className="quick-games-section">
        <h2 className="section-title">Швидка гра</h2>
        <div className="quick-games-grid">
          {quickGames.map((game) => (
            <div 
              key={game.id} 
              className={`quick-game-card glass-card ${game.color}`}
              onClick={() => {
                const event = new CustomEvent('navigate', { detail: 'games' });
                window.dispatchEvent(event);
              }}
            >
              <div className="quick-game-icon">{game.icon}</div>
              <h3 className="quick-game-name">{game.name}</h3>
              <div className="quick-game-glow"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Categories */}
      <div className="categories-section">
        <h2 className="section-title">Категорії ігор</h2>
        <div className="categories-grid">
          <div className="category-card glass-card">
            <div className="category-icon">🎰</div>
            <h3>Слоти</h3>
            <p>Класичні та сучасні</p>
          </div>
          <div className="category-card glass-card">
            <div className="category-icon">🎲</div>
            <h3>Originals</h3>
            <p>Crash, Dice, Mines</p>
          </div>
          <div className="category-card glass-card">
            <div className="category-icon">🃏</div>
            <h3>Live Casino</h3>
            <p>Трансляції в реальному часі</p>
          </div>
        </div>
      </div>

      {/* Recent Wins List */}
      {recentWins.length > 0 && (
        <div className="wins-section">
          <h2 className="section-title">Останні виграші</h2>
          <div className="wins-list glass-card">
            {recentWins.slice(0, 5).map((win, index) => (
              <div key={index} className="win-item slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="win-icon">🎉</div>
                <div className="win-details">
                  <div className="win-amount gradient-text">{win.win_amount.toFixed(2)} USDT</div>
                  <div className="win-game">{win.game_type}</div>
                </div>
                <div className="win-time">
                  {new Date(win.created_at).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
