import React, { useState, useEffect, useMemo, useRef } from 'react';
import './Games.css';
import CrashGame from '../components/games/CrashGame';
import DiceGame from '../components/games/DiceGame';
import MinesGame from '../components/games/MinesGame';
import OnlineGames from './OnlineGames';
import { t } from '../utils/i18n';
import { gameCardBackground, gameListIcon, categoryTabIcon, UI, NAV } from '../constants/uiAssets';

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

  const tabsContainerRef = useRef(null);
  const tabsScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position
  const checkScrollPosition = () => {
    if (!tabsContainerRef.current || !tabsScrollRef.current) return;
    
    const container = tabsContainerRef.current;
    const scroll = tabsScrollRef.current;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < scroll.scrollWidth - container.clientWidth - 10
    );
  };

  // Scroll to active category
  const scrollToCategory = (categoryId) => {
    if (!tabsContainerRef.current || !tabsScrollRef.current) return;
    
    const container = tabsContainerRef.current;
    const scroll = tabsScrollRef.current;
    const activeTab = scroll.querySelector(`[data-category="${categoryId}"]`);
    
    if (activeTab) {
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft = container.scrollLeft;
      const tabLeft = activeTab.offsetLeft;
      const tabWidth = activeTab.offsetWidth;
      const containerWidth = container.clientWidth;
      
      // Calculate scroll position to center the tab
      const targetScroll = tabLeft - (containerWidth / 2) + (tabWidth / 2);
      
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
    
    setTimeout(checkScrollPosition, 300);
  };

  useEffect(() => {
    checkScrollPosition();
    const container = tabsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      // Auto-scroll animation (conveyor effect) - only if content overflows
      let scrollDirection = 1;
      let autoScroll = null;
      
      const startAutoScroll = () => {
        if (!container || !tabsScrollRef.current) return;
        
        const maxScroll = tabsScrollRef.current.scrollWidth - container.clientWidth;
        if (maxScroll <= 0) {
          if (autoScroll) clearInterval(autoScroll);
          return;
        }
        
        if (!autoScroll) {
          autoScroll = setInterval(() => {
            if (!container || !tabsScrollRef.current) return;
            
            const currentMaxScroll = tabsScrollRef.current.scrollWidth - container.clientWidth;
            if (currentMaxScroll <= 0) {
              clearInterval(autoScroll);
              autoScroll = null;
              return;
            }
            
            if (container.scrollLeft >= currentMaxScroll - 5) {
              scrollDirection = -1;
            } else if (container.scrollLeft <= 5) {
              scrollDirection = 1;
            }
            
            container.scrollBy({
              left: scrollDirection * 0.5,
              behavior: 'auto'
            });
          }, 30);
        }
      };
      
      // Start auto-scroll after initial render
      setTimeout(startAutoScroll, 1000);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
        if (autoScroll) clearInterval(autoScroll);
      };
    }
  }, []);

  const categories = useMemo(
    () => [
      { id: 'all', name: t('games.all') },
      { id: 'slots', name: t('games.slots') },
      { id: 'table', name: t('games.table') },
      { id: 'quick', name: t('games.quick') },
      { id: 'favorites', name: t('games.favorites') },
    ],
    [t]
  );

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
      alert(t('games.gameInProgress'));
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
    <div className="games-page games-page--aura fade-in">
      <h1 className="page-title page-title--with-asset">
        <img src={UI.table_icon} alt="" className="page-title-icon" decoding="async" />
        {t('games.title')}
      </h1>
      
      {/* Пошук */}
      <div className="games-search">
        <div className="search-input-wrapper">
          <img src={UI.filterNor} alt="" className="search-icon-img" decoding="async" />
          <input
            type="text"
            className="search-input"
            placeholder={t('games.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button"
              className="search-clear search-clear--asset"
              onClick={() => setSearchQuery('')}
              aria-label="Очистити"
            >
              <img src={UI.searchDel} alt="" decoding="async" />
            </button>
          )}
        </div>
        <button 
          type="button"
          className={`filter-toggle filter-toggle--asset ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <img src={showFilters ? UI.filterOn : UI.filterNor} alt="" className="filter-toggle-icon" decoding="async" />
          <span>{t('games.filters')}</span>
        </button>
      </div>

      {/* Розширені фільтри */}
      {showFilters && (
        <div className="games-filters glass-card">
          <div className="filter-group">
            <label className="filter-label">{t('games.gameType')}</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${gameType === 'all' ? 'active' : ''}`}
                onClick={() => setGameType('all')}
              >
                {t('games.all')}
              </button>
              <button
                className={`filter-btn ${gameType === 'solo' ? 'active' : ''}`}
                onClick={() => setGameType('solo')}
              >
                {t('games.solo')}
              </button>
              <button
                className={`filter-btn ${gameType === 'multiplayer' ? 'active' : ''}`}
                onClick={() => setGameType('multiplayer')}
              >
                {t('games.multiplayer')}
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('games.sortBy')}</label>
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">{t('games.popular')}</option>
              <option value="new">{t('games.new')}</option>
              <option value="name">{t('games.name')}</option>
            </select>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="category-tabs" ref={tabsContainerRef}>
        <div className="tabs-scroll" ref={tabsScrollRef}>
          {categories.map((category) => (
            <button
              key={category.id}
              data-category={category.id}
              className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(category.id);
                scrollToCategory(category.id);
              }}
            >
              <img
                src={categoryTabIcon(category.id)}
                alt=""
                className="tab-icon-img"
                decoding="async"
              />
              <span className="tab-name">{category.name}</span>
            </button>
          ))}
        </div>
        {canScrollLeft && (
          <div className="scroll-indicator scroll-indicator-left">
            <div className="scroll-gradient"></div>
          </div>
        )}
        {canScrollRight && (
          <div className="scroll-indicator scroll-indicator-right">
            <div className="scroll-gradient"></div>
          </div>
        )}
      </div>

      {/* Статистика фільтрів */}
      <div className="games-stats">
        <span className="games-count">
          {t('games.foundGames', { count: filteredAndSortedGames?.length || 0 })}
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
            {t('games.clearFilters')}
          </button>
        )}
      </div>

      {/* Games Grid */}
      <div className="games-grid">
        {(filteredAndSortedGames || []).map((game, index) => {
          if (!game || !game.id) return null;
          return (
            <div 
              key={game.id} 
              className={`game-card game-card--assets glass-card ${game.featured ? 'featured' : ''} ${game.isPlayable ? 'playable' : 'coming-soon'} ${game.gameType === 'multiplayer' ? 'multiplayer' : ''}`}
              style={{
                animationDelay: `${index * 0.05}s`,
                '--game-card-bg': `url(${gameCardBackground(game.id)})`,
                '--game-card-type': `url(${UI.gameCardType})`,
              }}
              onClick={() => handlePlayGame(game)}
            >
              <div className="game-card-content">
                <div className="game-card-header">
                  <div className="game-icon-wrapper">
                    <div className="game-icon game-icon--asset">
                      <img src={gameListIcon(game.id)} alt="" decoding="async" />
                    </div>
                    {game.featured && (
                      <div className="featured-badge featured-badge--asset">
                        <img src={UI.creatorTag} alt="" decoding="async" />
                      </div>
                    )}
                    {game.isNew && <div className="new-badge">NEW</div>}
                    {game.gameType === 'multiplayer' && (
                      <div className="multiplayer-badge multiplayer-badge--asset">
                        <img src={NAV.referral} alt="" decoding="async" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`favorite-btn favorite-btn--pin ${favorites.includes(game.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(game.id);
                    }}
                    aria-label="Обране"
                  >
                    <img
                      src={favorites.includes(game.id) ? UI.favoriteStarOn : UI.favoriteStarOff}
                      alt=""
                      decoding="async"
                      className="favorite-btn-img"
                    />
                  </button>
                </div>
                
                <h3 className="game-name">{game.name || 'Unknown Game'}</h3>
                <p className="game-description">{game.description || ''}</p>
                
                <div className="game-info">
                  <div className="game-stats">
                    <span className="stat-item">
                      <span className="stat-label">{t('games.popularity')}:</span>
                      <div className="popularity-bar">
                        <div 
                          className="popularity-fill" 
                          style={{ width: `${game.popularity || 0}%` }}
                        ></div>
                      </div>
                    </span>
                    <span className="stat-item">
                      <span className="stat-label">{t('games.bet')}:</span>
                      <span className="stat-value">{game.minBet || 0} - {game.maxBet || 0} USDT</span>
                    </span>
                  </div>
                </div>

                <button 
                  className={`btn ${game.isPlayable ? 'btn-primary' : 'btn-secondary'} play-btn`}
                  onClick={() => handlePlayGame(game)}
                >
                  {game.isPlayable ? t('games.play') : t('games.soon')}
                </button>
              </div>
              <div className="game-card-glow"></div>
            </div>
          );
        })}
      </div>

      {(!filteredAndSortedGames || filteredAndSortedGames.length === 0) && (
        <div className="empty-games glass-card empty-games--assets">
          <img src={UI.missionEmpty} alt="" className="empty-games-asset" decoding="async" />
          <p className="empty-text">{t('games.empty')}</p>
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
