import React, { useState, useEffect } from 'react';
import './Games.css';
import CrashGame from '../components/games/CrashGame';
import DiceGame from '../components/games/DiceGame';
import MinesGame from '../components/games/MinesGame';
import OnlineGames from './OnlineGames';

function Games({ user, initData, onBalanceUpdate }) {
  const [activeGame, setActiveGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Усі', icon: '🎮' },
    { id: 'slots', name: 'Слоти', icon: '🎰' },
    { id: 'table', name: 'Настільні', icon: '🃏' },
    { id: 'quick', name: 'Швидкі', icon: '⚡' },
    { id: 'favorites', name: 'Вибране', icon: '⭐' }
  ];

  const allGames = [
    { id: 'crash', name: 'Crash', icon: '🚀', category: 'quick', description: 'Вгадай момент виходу', featured: true },
    { id: 'dice', name: 'Dice', icon: '🎲', category: 'quick', description: 'Більше чи менше', featured: true },
    { id: 'mines', name: 'Mines', icon: '💣', category: 'quick', description: 'Знайди всі міни', featured: true },
    { id: 'online', name: '🌐 Онлайн ігри', icon: '🌐', category: 'quick', description: 'Змагайся з іншими', featured: true, isOnline: true },
    { id: 'slots1', name: 'Starlight Slots', icon: '🎰', category: 'slots', description: 'Класичні слоти', featured: false },
    { id: 'blackjack', name: 'Neon Blackjack', icon: '🃏', category: 'table', description: '21 очко', featured: false },
    { id: 'roulette', name: 'Rouckutte', icon: '🎡', category: 'table', description: 'Рулетка', featured: false },
    { id: 'poker', name: 'Cyber Poker', icon: '🂡', category: 'table', description: 'Техаський холдем', featured: false }
  ];

  const filteredGames = activeCategory === 'all' 
    ? allGames 
    : allGames.filter(game => game.category === activeCategory);

  if (activeGame === 'crash') {
    return <CrashGame initData={initData} onBack={() => setActiveGame(null)} onBalanceUpdate={onBalanceUpdate} />;
  }

  if (activeGame === 'dice') {
    return <DiceGame initData={initData} onBack={() => setActiveGame(null)} onBalanceUpdate={onBalanceUpdate} />;
  }

  if (activeGame === 'mines') {
    return <MinesGame initData={initData} onBack={() => setActiveGame(null)} onBalanceUpdate={onBalanceUpdate} />;
  }

  if (activeGame === 'online') {
    return <OnlineGames user={user} initData={initData} onBalanceUpdate={onBalanceUpdate} />;
  }

  return (
    <div className="games-page fade-in">
      <h1 className="page-title">🎮 Бібліотека ігор</h1>
      
      {/* Category Tabs */}
      <div className="category-tabs">
        <div className="tabs-scroll">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="tab-icon">{category.icon}</span>
              <span className="tab-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="games-grid">
        {filteredGames.map((game, index) => (
          <div 
            key={game.id} 
            className={`game-card glass-card ${game.featured ? 'featured' : ''}`}
            onClick={() => {
              if (['crash', 'dice', 'mines', 'online'].includes(game.id)) {
                setActiveGame(game.id);
              } else {
                alert('Гра в розробці');
              }
            }}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="game-card-content">
              <div className="game-icon-wrapper">
                <div className="game-icon">{game.icon}</div>
                {game.featured && <div className="featured-badge">⭐</div>}
              </div>
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              <button className="btn btn-primary play-btn">Грати</button>
            </div>
            <div className="game-card-glow"></div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="empty-games glass-card">
          <div className="empty-icon">🎮</div>
          <p className="empty-text">Немає ігор у цій категорії</p>
        </div>
      )}
    </div>
  );
}

export default Games;
