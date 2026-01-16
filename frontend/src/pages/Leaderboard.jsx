import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { api } from '../utils/api';

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

  const getPeriodLabel = () => {
    switch (period) {
      case 'day': return 'За день';
      case 'week': return 'За тиждень';
      default: return 'За весь час';
    }
  };

  const getMedal = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  return (
    <div className="leaderboard-page fade-in">
      <h1 className="page-title">🏆 Рейтинг гравців</h1>

      <div className="period-selector">
        <button
          className={`period-btn ${period === 'day' ? 'active' : ''}`}
          onClick={() => setPeriod('day')}
        >
          День
        </button>
        <button
          className={`period-btn ${period === 'week' ? 'active' : ''}`}
          onClick={() => setPeriod('week')}
        >
          Тиждень
        </button>
        <button
          className={`period-btn ${period === 'all' ? 'active' : ''}`}
          onClick={() => setPeriod('all')}
        >
          Весь час
        </button>
      </div>

      {loading ? (
        <div className="loading-state glass-card">
          <div className="spinner"></div>
          <p>Завантаження...</p>
        </div>
      ) : (
        <div className="leaderboard-list glass-card">
          {leaderboard.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <p>Поки що немає виграшів</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={entry.user_id}
                className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="leaderboard-position">
                  <span className="medal">{getMedal(entry.position)}</span>
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
                    <div className="crown-badge">👑</div>
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
                  <div className="winnings-label">Виграно</div>
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
