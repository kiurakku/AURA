import React, { useState, useEffect, useMemo } from 'react';
import './Games.css';
import CrashGame from '../components/games/CrashGame';
import DiceGame from '../components/games/DiceGame';
import MinesGame from '../components/games/MinesGame';
import OnlineGames from './OnlineGames';
import { t } from '../utils/i18n';

function Games({ user, initData, onBalanceUpdate }) {
  const [activeGame, setActiveGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [gameType, setGameType] = useState('all'); // all, solo, multiplayer
  const [sortBy, setSortBy] = useState('popular'); // popular, new, name
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('gameFavorites');
        return saved ? JSON.parse(saved) : [];
      }
    } catch (error) {
      // Ignore localStorage errors
    }
    return [];
  });

  const categories = [
    { id: 'all', name: 'Усі', icon: '🎮' },
    { id: 'slots', name: 'Слоти', icon: '🎰' },
    { id: 'table', name: 'Настільні', icon: '🃏' },
    { id: 'quick', name: 'Швидкі', icon: '⚡' },
    { id: 'favorites', name: 'Вибране', icon: '⭐' }
  ];

  const allGames = [
    // Соло ігри
    { 
      id: 'crash', 
      name: 'Crash', 
      icon: '🚀', 
      category: 'quick', 
      description: 'Вгадай момент виходу', 
      featured: true,
      gameType: 'solo',
      isPlayable: true,
      popularity: 95,
      isNew: false,
      minBet: 0.1,
      maxBet: 1000
    },
    { 
      id: 'dice', 
      name: 'Dice', 
      icon: '🎲', 
      category: 'quick', 
      description: 'Більше чи менше', 
      featured: true,
      gameType: 'solo',
      isPlayable: true,
      popularity: 90,
      isNew: false,
      minBet: 0.1,
      maxBet: 500
    },
    { 
      id: 'mines', 
      name: 'Mines', 
      icon: '💣', 
      category: 'quick', 
      description: 'Знайди всі міни', 
      featured: true,
      gameType: 'solo',
      isPlayable: true,
      popularity: 88,
      isNew: false,
      minBet: 0.1,
      maxBet: 500
    },
    { 
      id: 'plinko', 
      name: 'Plinko', 
      icon: '🎯', 
      category: 'quick', 
      description: 'Кулька падає вниз', 
      featured: false,
      gameType: 'solo',
      isPlayable: false,
      popularity: 75,
      isNew: true,
      minBet: 0.1,
      maxBet: 1000
    },
    { 
      id: 'slots1', 
      name: 'Starlight Slots', 
      icon: '🎰', 
      category: 'slots', 
      description: 'Класичні слоти', 
      featured: false,
      gameType: 'solo',
      isPlayable: false,
      popularity: 70,
      isNew: false,
      minBet: 0.5,
      maxBet: 500
    },
    { 
      id: 'slots2', 
      name: 'Neon Slots', 
      icon: '💎', 
      category: 'slots', 
      description: 'Неонові слоти', 
      featured: false,
      gameType: 'solo',
      isPlayable: false,
      popularity: 65,
      isNew: true,
      minBet: 0.5,
      maxBet: 500
    },
    { 
      id: 'blackjack', 
      name: 'Neon Blackjack', 
      icon: '🃏', 
      category: 'table', 
      description: '21 очко', 
      featured: false,
      gameType: 'solo',
      isPlayable: false,
      popularity: 80,
      isNew: false,
      minBet: 1,
      maxBet: 1000
    },
    { 
      id: 'roulette', 
      name: 'Neon Roulette', 
      icon: '🎡', 
      category: 'table', 
      description: 'Рулетка', 
      featured: false,
      gameType: 'solo',
      isPlayable: false,
      popularity: 85,
      isNew: false,
      minBet: 1,
      maxBet: 2000
    },
    { 
      id: 'poker', 
      name: 'Cyber Poker', 
      icon: '🂡', 
      category: 'table', 
      description: 'Техаський холдем', 
      featured: false,
      gameType: 'solo',
      isPlayable: false,
      popularity: 72,
      isNew: false,
      minBet: 2,
      maxBet: 5000
    },
    // Мультиплеєр ігри
    { 
      id: 'online', 
      name: 'Онлайн ігри', 
      icon: '🌐', 
      category: 'quick', 
      description: 'Змагайся з іншими', 
      featured: true,
      gameType: 'multiplayer',
      isPlayable: true,
      popularity: 92,
      isNew: false,
      minBet: 1,
      maxBet: 1000
    },
    { 
      id: 'battle', 
      name: 'Telegram Battle', 
      icon: '⚔️', 
      category: 'quick', 
      description: 'Битва між гравцями', 
      featured: true,
      gameType: 'multiplayer',
      isPlayable: false,
      popularity: 88,
      isNew: true,
      minBet: 5,
      maxBet: 500
    },
    { 
      id: 'cyber-crash', 
      name: 'Cyber Crash', 
      icon: '🚀', 
      category: 'quick', 
      description: 'Crash з іншими', 
      featured: false,
      gameType: 'multiplayer',
      isPlayable: false,
      popularity: 82,
      isNew: true,
      minBet: 1,
      maxBet: 1000
    },
    { 
      id: 'frost-dice', 
      name: 'Frost Dice', 
      icon: '❄️', 
      category: 'quick', 
      description: 'Dice в арктичному стилі', 
      featured: false,
      gameType: 'multiplayer',
      isPlayable: false,
      popularity: 78,
      isNew: true,
      minBet: 0.5,
      maxBet: 500
    },
    { 
      id: 'neon-roulette', 
      name: 'Neon Roulette PvP', 
      icon: '🎡', 
      category: 'table', 
      description: 'Рулетка з іншими', 
      featured: false,
      gameType: 'multiplayer',
      isPlayable: false,
      popularity: 75,
      isNew: false,
      minBet: 2,
      maxBet: 2000
    },
    { 
      id: 'tournament', 
      name: 'Турніри', 
      icon: '🏆', 
      category: 'quick', 
      description: 'Турнірні змагання', 
      featured: false,
      gameType: 'multiplayer',
      isPlayable: false,
      popularity: 90,
      isNew: true,
      minBet: 10,
      maxBet: 10000
    }
  ];

  const toggleFavorite = (gameId) => {
    const newFavorites = favorites.includes(gameId)
      ? favorites.filter(id => id !== gameId)
      : [...favorites, gameId];
    setFavorites(newFavorites);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gameFavorites', JSON.stringify(newFavorites));
      }
    } catch (error) {
      // Ignore localStorage errors
    }
  };

  const filteredAndSortedGames = useMemo(() => {
    try {
      if (!allGames || !Array.isArray(allGames)) {
        return [];
      }
      
      let filtered = [...allGames];

      // Пошук
      if (searchQuery) {
        filtered = filtered.filter(game => 
          game && game.name && game.description &&
          (game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Категорія
      if (activeCategory === 'favorites') {
        filtered = filtered.filter(game => game && favorites.includes(game.id));
      } else if (activeCategory !== 'all') {
        filtered = filtered.filter(game => game && game.category === activeCategory);
      }

      // Тип гри (соло/мультиплеєр)
      if (gameType !== 'all') {
        filtered = filtered.filter(game => game && game.gameType === gameType);
      }

      // Сортування
      filtered.sort((a, b) => {
        if (!a || !b) return 0;
        switch (sortBy) {
          case 'popular':
            return (b.popularity || 0) - (a.popularity || 0);
          case 'new':
            return b.isNew === a.isNew ? 0 : b.isNew ? -1 : 1;
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          default:
            return 0;
        }
      });

      return filtered;
    } catch (error) {
      return [];
    }
  }, [activeCategory, gameType, sortBy, searchQuery, favorites, allGames]);

  const handlePlayGame = (game) => {
    if (!game.isPlayable) {
      alert('Гра в розробці. Скоро буде доступна!');
      return;
    }

    if (['crash', 'dice', 'mines'].includes(game.id)) {
      setActiveGame(game.id);
    } else if (game.id === 'online') {
      setActiveGame('online');
    }
  };

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
      <h1 className="page-title">🎮 {t('games.title')}</h1>
      
      {/* Пошук */}
      <div className="games-search">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Пошук ігор..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>⚙️</span>
          <span>Фільтри</span>
        </button>
      </div>

      {/* Розширені фільтри */}
      {showFilters && (
        <div className="games-filters glass-card">
          <div className="filter-group">
            <label className="filter-label">Тип гри</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${gameType === 'all' ? 'active' : ''}`}
                onClick={() => setGameType('all')}
              >
                Усі
              </button>
              <button
                className={`filter-btn ${gameType === 'solo' ? 'active' : ''}`}
                onClick={() => setGameType('solo')}
              >
                🎯 Соло
              </button>
              <button
                className={`filter-btn ${gameType === 'multiplayer' ? 'active' : ''}`}
                onClick={() => setGameType('multiplayer')}
              >
                👥 Мультиплеєр
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Сортування</label>
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Популярність</option>
              <option value="new">Нові спочатку</option>
              <option value="name">За назвою</option>
            </select>
          </div>
        </div>
      )}

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

      {/* Статистика фільтрів */}
      <div className="games-stats">
        <span className="games-count">
          Знайдено: <strong>{filteredAndSortedGames?.length || 0}</strong> ігор
        </span>
        {(gameType !== 'all' || searchQuery) && (
          <button 
            className="clear-filters"
            onClick={() => {
              setGameType('all');
              setSearchQuery('');
              setShowFilters(false);
            }}
          >
            Очистити фільтри
          </button>
        )}
      </div>

      {/* Games Grid */}
      <div className="games-grid">
        {(filteredAndSortedGames || []).map((game, index) => (
          <div 
            key={game.id} 
            className={`game-card glass-card ${game.featured ? 'featured' : ''} ${game.isPlayable ? 'playable' : 'coming-soon'} ${game.gameType === 'multiplayer' ? 'multiplayer' : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="game-card-content">
              <div className="game-card-header">
                <div className="game-icon-wrapper">
                  <div className="game-icon">{game.icon}</div>
                  {game.featured && <div className="featured-badge">⭐</div>}
                  {game.isNew && <div className="new-badge">NEW</div>}
                  {game.gameType === 'multiplayer' && (
                    <div className="multiplayer-badge">👥</div>
                  )}
                </div>
                <button
                  className={`favorite-btn ${favorites.includes(game.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(game.id);
                  }}
                >
                  {favorites.includes(game.id) ? '❤️' : '🤍'}
                </button>
              </div>
              
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              
              <div className="game-info">
                <div className="game-stats">
                  <span className="stat-item">
                    <span className="stat-label">Популярність:</span>
                    <div className="popularity-bar">
                      <div 
                        className="popularity-fill" 
                        style={{ width: `${game.popularity}%` }}
                      ></div>
                    </div>
                  </span>
                  <span className="stat-item">
                    <span className="stat-label">Ставка:</span>
                    <span className="stat-value">{game.minBet} - {game.maxBet} USDT</span>
                  </span>
                </div>
              </div>

              <button 
                className={`btn ${game.isPlayable ? 'btn-primary' : 'btn-secondary'} play-btn`}
                onClick={() => handlePlayGame(game)}
              >
                {game.isPlayable ? '▶️ Грати' : '⏳ Скоро'}
              </button>
            </div>
            <div className="game-card-glow"></div>
          </div>
        ))}
      </div>

      {(!filteredAndSortedGames || filteredAndSortedGames.length === 0) && (
        <div className="empty-games glass-card">
          <div className="empty-icon">🎮</div>
          <p className="empty-text">Немає ігор за цими фільтрами</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setActiveCategory('all');
              setGameType('all');
              setSearchQuery('');
              setShowFilters(false);
            }}
          >
            Показати всі ігри
          </button>
        </div>
      )}
    </div>
  );
}

export default Games;
