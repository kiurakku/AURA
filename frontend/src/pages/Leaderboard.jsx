import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { api } from '../utils/api';
import {
  UI,
  playerListRowTexture,
  rankLevelFromWagered,
  rankStarAsset,
} from '../constants/uiAssets';
import { t } from '../utils/i18n';

function Leaderboard({ initData }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/leaderboard?period=${period}&limit=10`);
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const medalSrc = (position) => {
    if (position === 1) return UI.rankPng1;
    if (position === 2) return UI.rankPng2;
    if (position === 3) return UI.rankPng3;
    return null;
  };

  const pageStyle = {
    '--club-panel-bg': `url(${UI.clubUserInterface})`,
  };

  return (
    <div
      className="leaderboard-page leaderboard-page--assets leaderboard-page--club fade-in"
      style={pageStyle}
    >
      <div className="leaderboard-heading">
        <img src={UI.titleLeaderboard} alt="" className="leaderboard-title-asset" decoding="async" />
        <h1 className="page-title">{t('leaderboard.title')}</h1>
        <img src={UI.trophy} alt="" className="leaderboard-trophy" decoding="async" />
      </div>

      <div className="period-selector">
        <button
          className={`period-btn ${period === 'day' ? 'active' : ''}`}
          onClick={() => setPeriod('day')}
        >
          {t('leaderboard.day')}
        </button>
        <button
          className={`period-btn ${period === 'week' ? 'active' : ''}`}
          onClick={() => setPeriod('week')}
        >
          {t('leaderboard.week')}
        </button>
        <button
          className={`period-btn ${period === 'all' ? 'active' : ''}`}
          onClick={() => setPeriod('all')}
        >
          {t('leaderboard.all')}
        </button>
      </div>

      {loading ? (
        <div className="loading-state glass-card">
          <div className="spinner"></div>
          <p>{t('leaderboard.loading')}</p>
        </div>
      ) : (
        <div className="leaderboard-list glass-card leaderboard-list--club">
          {leaderboard.length === 0 ? (
            <div className="empty-state">
              <img src={UI.trophy} alt="" className="empty-icon-img" decoding="async" />
              <p>{t('leaderboard.empty')}</p>
              <p className="empty-hint">{t('leaderboard.emptyHint')}</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={entry.user_id}
                className={`leaderboard-item leaderboard-item--texture ${index < 3 ? 'top-three' : ''}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  '--row-texture': `url(${playerListRowTexture(entry.total_won).bg})`,
                }}
              >
                <div className="leaderboard-position">
                  {medalSrc(entry.position) ? (
                    <img src={medalSrc(entry.position)} alt="" className="medal-img" decoding="async" />
                  ) : (
                    <span className="medal-num">#{entry.position}</span>
                  )}
                </div>
                <div className="leaderboard-avatar">
                  {entry.photo_url ? (
                    <img src={entry.photo_url} alt={entry.first_name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {entry.first_name?.[0] || 'U'}
                    </div>
                  )}
                  {entry.position <= 3 && (
                    <img
                      src={rankStarAsset(rankLevelFromWagered(entry.total_won))}
                      alt=""
                      className="crown-badge crown-badge--star"
                      decoding="async"
                    />
                  )}
                </div>
                <div className="leaderboard-info">
                  <div className="leaderboard-name">
                    {entry.first_name}
                    <span className="leaderboard-rank">{entry.rank}</span>
                  </div>
                  <div className="leaderboard-username">@{entry.username}</div>
                </div>
                <div className="leaderboard-winnings">
                  <div className="winnings-amount">
                    +{entry.total_won.toFixed(2)} USDT
                  </div>
                  <div className="winnings-label">{t('leaderboard.won')}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
