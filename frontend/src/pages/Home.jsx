import React, { useState, useEffect, useCallback } from 'react';
import './Home.css';
import { api } from '../utils/api';
import {
  UI,
  bannerMaterial,
  HOME_PROMO_BANNERS,
  gameListIcon,
  clubNoticeTitleAsset,
} from '../constants/uiAssets';
import { getLanguage, t } from '../utils/i18n';

function Home({ user }) {
  const [recentWins, setRecentWins] = useState([]);
  const [liveWins, setLiveWins] = useState([]);
  const [currentPoster, setCurrentPoster] = useState(0);
  const [noticeLang, setNoticeLang] = useState(getLanguage);

  useEffect(() => {
    const onLang = () => setNoticeLang(getLanguage());
    window.addEventListener('languagechange', onLang);
    return () => window.removeEventListener('languagechange', onLang);
  }, []);

  useEffect(() => {
    fetchRecentWins();
    const interval = setInterval(() => {
      fetchRecentWins();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentWins = async () => {
    try {
      const response = await api.get('/games/history?limit=10');
      const games = response.data?.games || [];
      const wins = games
        .filter((game) => game && game.win_amount > 0)
        .slice(0, 10);
      setRecentWins(wins);
      setLiveWins(wins.slice(0, 5));
    } catch (error) {
      setRecentWins([]);
      setLiveWins([]);
    }
  };

  const posterCount = HOME_PROMO_BANNERS.length;

  const posters = HOME_PROMO_BANNERS.map((b, i) => ({
    id: i + 1,
    image: bannerMaterial(b.file),
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posterCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [posterCount]);

  const advancePoster = useCallback(() => {
    setCurrentPoster((prev) => (prev + 1) % posterCount);
  }, [posterCount]);

  const quickGames = [
    {
      id: 'crash',
      name: 'Crash',
      color: 'purple',
      iconSrc: gameListIcon('crash'),
      tag: 'Hot',
      hint: 'Ловіть множник до вильоту ракети',
    },
    {
      id: 'mines',
      name: 'Mines',
      color: 'cyan',
      iconSrc: gameListIcon('mines'),
      tag: 'Ризик',
      hint: 'Обирайте клітинки та забирайте виграш',
    },
    {
      id: 'dice',
      name: 'Dice',
      color: 'purple',
      iconSrc: gameListIcon('dice'),
      tag: 'Швидко',
      hint: 'Киньте кості та вгадайте результат',
    },
  ];

  return (
    <div className="home home--aura home--responsive fade-in">
      <div className="home-lobby-strip" aria-hidden="true">
        <img src={UI.lobby} alt="" className="home-lobby-img" decoding="async" />
      </div>

      <div className="club-notice-row">
        <div className="club-notice-inner glass-card">
          <img
            src={clubNoticeTitleAsset(noticeLang)}
            alt=""
            className="club-notice-title-img"
            decoding="async"
          />
        </div>
      </div>

      <div className="hero-banner hero-banner--aura glass-card">
        <div
          className="poster-slider"
          role="button"
          tabIndex={0}
          onClick={advancePoster}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              advancePoster();
            }
          }}
          aria-label={t('home.bannerNext')}
        >
          {posters.map((poster, index) => (
            <div
              key={poster.id}
              className={`poster-slide ${index === currentPoster ? 'active' : ''}`}
            >
              <img src={poster.image} alt="" className="poster-bg" decoding="async" />
              <div className="poster-glow" />
            </div>
          ))}
        </div>
        <div className="poster-indicators poster-indicators--assets">
          {posters.map((_, index) => (
            <button
              type="button"
              key={index}
              className={`indicator indicator--asset ${index === currentPoster ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPoster(index);
              }}
              aria-label={`${t('home.slide')} ${index + 1}`}
            >
              <img
                src={index === currentPoster ? UI.bannerDotS : UI.bannerDotN}
                alt=""
                decoding="async"
              />
            </button>
          ))}
        </div>
      </div>

      {liveWins.length > 0 && (
        <div className="live-wins-ticker live-wins-ticker--aura glass-card">
          <div className="ticker-label ticker-label--asset">
            <img src={UI.liveFire} alt="" className="ticker-label-icon" decoding="async" />
            <span>LIVE</span>
          </div>
          <div className="ticker-content">
            {liveWins.map((win, index) => (
              <div key={index} className="ticker-item">
                <span className="ticker-user">User{win.user_id?.toString().slice(-4) || '***'}</span>
                <span className="ticker-action">виграв</span>
                <span className="ticker-amount">{win.win_amount.toFixed(2)} USDT</span>
                <span className="ticker-game">у {win.game_type}</span>
                <img
                  src={gameListIcon(win.game_type)}
                  alt=""
                  className="ticker-game-icon"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="quick-games-section">
        <div className="section-title-row">
          <img src={UI.quickPlayTitleIcon} alt="" className="section-title-asset" decoding="async" />
          <h2 className="section-title">{t('home.quickPlay')}</h2>
        </div>
        <div className="quick-games-grid">
          {quickGames.map((game) => (
            <div
              key={game.id}
              className={`quick-game-card quick-game-card--aura glass-card ${game.color}`}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'games' }));
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('navigate', { detail: 'games' }));
                }
              }}
            >
              <span className="quick-game-tag">{game.tag}</span>
              <div className="quick-game-shine" aria-hidden />
              <div className="quick-game-body">
                <div className="quick-game-icon-wrap">
                  <img src={game.iconSrc} alt="" className="quick-game-icon-img" decoding="async" />
                </div>
                <h3 className="quick-game-name">{game.name}</h3>
                <p className="quick-game-hint">{game.hint}</p>
                <span className="quick-game-cta">{t('games.play')}</span>
              </div>
              <div className="quick-game-glow" />
            </div>
          ))}
        </div>
      </div>

      <div className="neural-teaser neural-teaser--aura glass-card" role="region" aria-label={t('home.neuralTeaserAria')}>
        <div className="neural-teaser-visual">
          <img
            src="/materials/iceblocky.jpg"
            alt=""
            className="neural-teaser-img"
            decoding="async"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="neural-teaser-scrim" aria-hidden />
        </div>
        <div className="neural-teaser-copy">
          <span className="neural-teaser-badge">{t('home.neuralTeaserBadge')}</span>
          <h2 className="neural-teaser-title">{t('home.neuralTeaserTitle')}</h2>
          <p className="neural-teaser-desc">{t('home.neuralTeaserDesc')}</p>
        </div>
      </div>

      <div className="categories-section">
        <div className="section-title-row">
          <img src={UI.categorySectionIcon} alt="" className="section-title-asset section-title-asset--wide" decoding="async" />
          <h2 className="section-title">{t('home.categories')}</h2>
        </div>
        <div className="categories-grid">
          <div className="category-card category-card--aura glass-card">
            <div className="category-icon category-icon--asset">
              <img src={UI.categorySlots} alt="" decoding="async" />
            </div>
            <h3>{t('games.slots')}</h3>
            <p>Класичні та сучасні</p>
          </div>
          <div className="category-card category-card--aura glass-card">
            <div className="category-icon category-icon--asset">
              <img src={UI.iconColorgame} alt="" decoding="async" />
            </div>
            <h3>Originals</h3>
            <p>Crash, Dice, Mines</p>
          </div>
          <div className="category-card category-card--aura glass-card">
            <div className="category-icon category-icon--asset">
              <img src={UI.categoryLive} alt="" decoding="async" />
            </div>
            <h3>Live Casino</h3>
            <p>Трансляції в реальному часі</p>
          </div>
        </div>
      </div>

      {recentWins.length > 0 && (
        <div className="wins-section">
          <div className="section-title-row">
            <img src={UI.bigChipRing} alt="" className="section-title-asset" decoding="async" />
            <h2 className="section-title">{t('home.recentWins')}</h2>
          </div>
          <div className="wins-list glass-card">
            {recentWins.slice(0, 5).map((win, index) => (
              <div key={index} className="win-item slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="win-icon win-icon--asset">
                  <img src={UI.dailySparkle} alt="" decoding="async" />
                </div>
                <div className="win-details">
                  <div className="win-amount gradient-text">{win.win_amount.toFixed(2)} USDT</div>
                  <div className="win-game">{win.game_type}</div>
                </div>
                <div className="win-time">
                  {new Date(win.created_at).toLocaleTimeString(getLanguage(), { hour: '2-digit', minute: '2-digit' })}
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
