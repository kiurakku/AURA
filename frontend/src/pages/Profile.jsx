import React, { useState, useEffect } from 'react';
import './Profile.css';
import { api } from '../utils/api';
import { t, getLanguage } from '../utils/i18n';
import LanguageSelector from '../components/LanguageSelector';
import PrivacySettings from '../components/PrivacySettings';
import WalletManager from '../components/WalletManager';
import LegalDocuments from '../components/LegalDocuments';

function Profile({ user, initData }) {
  const [gameHistory, setGameHistory] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalWins: 0,
    totalWagered: 0,
    totalWon: 0
  });
  const [userRank, setUserRank] = useState(null);
  const [cashbackInfo, setCashbackInfo] = useState(null);
  const [settings, setSettings] = useState({
    soundEffects: true,
    notifications: true,
    language: getLanguage()
  });
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchUserRank();
    fetchCashbackInfo();
  }, []);

  useEffect(() => {
    if (userRank) {
      fetchGameHistory();
    }
  }, [userRank]);

  const fetchUserRank = async () => {
    if (!initData) return;
    try {
      const response = await api.get('/profile', {
        headers: { 'x-telegram-init-data': initData }
      });
      if (response.data?.user) {
        setUserRank({
          rank_id: response.data.user.rank_id || 1,
          rank_name: response.data.user.rank_name || 'Newbie',
          total_wagered: response.data.user.total_wagered || 0,
          total_xp: response.data.user.total_xp || 0
        });
      }
    } catch (error) {
      setUserRank(null);
    }
  };

  const fetchCashbackInfo = async () => {
    if (!initData) return;
    try {
      const response = await api.get('/cashback', {
        headers: { 'x-telegram-init-data': initData }
      });
      setCashbackInfo(response.data);
    } catch (error) {
      setCashbackInfo(null);
    }
  };

  const fetchGameHistory = async () => {
    if (!initData) return;
    try {
      const response = await api.get('/games/history?limit=50', {
        headers: { 'x-telegram-init-data': initData }
      });
      const games = response.data?.games || [];
      setGameHistory(games);

      const totalGames = games.length;
      const totalWins = games.filter(g => g && g.win_amount > 0).length;
      const totalWagered = userRank?.total_wagered || games.reduce((sum, g) => sum + (g?.bet_amount || 0), 0);
      const totalWon = games.reduce((sum, g) => sum + (g?.win_amount || 0), 0);

      setStats({
        totalGames,
        totalWins,
        totalWagered,
        totalWon
      });
    } catch (error) {
      setGameHistory([]);
      setStats({
        totalGames: 0,
        totalWins: 0,
        totalWagered: 0,
        totalWon: 0
      });
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getPlayerStatus = () => {
    if (stats.totalWagered >= 50000) return { name: 'Aura Legend', icon: '⭐', color: '#FFD700' };
    if (stats.totalWagered >= 25000) return { name: 'Elite', icon: '👑', color: '#FF6B9D' };
    if (stats.totalWagered >= 10000) return { name: 'Pro', icon: '💎', color: '#B9F2FF' };
    if (stats.totalWagered >= 5000) return { name: 'High Roller', icon: '🟡', color: '#FFD700' };
    if (stats.totalWagered >= 500) return { name: 'Gambler', icon: '⚪', color: '#C0C0C0' };
    return { name: 'Newbie', icon: '🟤', color: '#CD7F32' };
  };

  const playerStatus = getPlayerStatus();
  const nextRank = stats.totalWagered >= 50000 ? null : 
    stats.totalWagered >= 25000 ? { name: 'Aura Legend', needed: 50000 - stats.totalWagered } :
    stats.totalWagered >= 10000 ? { name: 'Elite', needed: 25000 - stats.totalWagered } :
    stats.totalWagered >= 5000 ? { name: 'Pro', needed: 10000 - stats.totalWagered } :
    stats.totalWagered >= 500 ? { name: 'High Roller', needed: 5000 - stats.totalWagered } :
    { name: 'Gambler', needed: 500 - stats.totalWagered };
  
  const progressToNext = nextRank ? ((stats.totalWagered / (stats.totalWagered + nextRank.needed)) * 100) : 100;

  const openSupport = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://t.me/your_support_bot');
    } else {
      alert('Підтримка: @your_support_bot');
    }
  };

  return (
    <div className="profile-page fade-in">
      <h1 className="page-title">{t('profile.title')}</h1>

      {/* Profile Header */}
      <div className="profile-header glass-card">
        <div className="profile-avatar-wrapper">
          {user?.photo_url ? (
            <img src={user.photo_url} alt={user.first_name} className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              {user?.first_name?.[0] || 'U'}
            </div>
          )}
          <div className="profile-badge" style={{ borderColor: playerStatus.color }}>
            <span className="rank-icon">{playerStatus.icon}</span>
            <span className="rank-name">{playerStatus.name}</span>
          </div>
        </div>
        <div className="profile-info">
          <h2>{user?.first_name || 'Гравець'}</h2>
          <p className="profile-username">@{user?.username || 'username'}</p>
          <p className="profile-date">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString(getLanguage()) : 'Невідомо'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          {t('profile.stats')}
        </button>
        <button 
          className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          {t('profile.settings')}
        </button>
        <button 
          className={`profile-tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          {t('profile.privacy')}
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <>
          <div className="stats-section">
            <h2 className="settings-title">{t('profile.stats')}</h2>
            <div className="stats-grid">
              <div className="stat-card glass-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-value">{stats.totalGames}</div>
                <div className="stat-label">{t('profile.stats')}</div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">{stats.totalWins}</div>
                <div className="stat-label">Виграшів</div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">{stats.totalWagered.toFixed(2)}</div>
                <div className="stat-label">Поставлено</div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon">🎁</div>
                <div className="stat-value">{stats.totalWon.toFixed(2)}</div>
                <div className="stat-label">Виграно</div>
              </div>
            </div>
          </div>

          <div className="history-section">
            <h2 className="settings-title">{t('profile.history')}</h2>
            <div className="history-list glass-card">
              {gameHistory.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎮</div>
                  <p>{t('profile.empty')}</p>
                </div>
              ) : (
                gameHistory.slice(0, 10).map((game) => (
                  <div key={game.id} className="history-item slide-in">
                    <div className="history-header">
                      <div className="history-game">{game.game_type}</div>
                      <div className="history-date">
                        {new Date(game.created_at).toLocaleString(getLanguage())}
                      </div>
                    </div>
                    <div className="history-bet">
                      Ставка: {game.bet_amount?.toFixed(2)} USDT
                    </div>
                    <div className={`history-win ${game.win_amount > 0 ? 'positive' : 'negative'}`}>
                      {game.win_amount > 0 ? '+' : ''}{game.win_amount?.toFixed(2)} USDT
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="settings-section">
          <h2 className="settings-title">{t('profile.settings')}</h2>
          
          <LanguageSelector onLanguageChange={(lang) => setSettings(prev => ({ ...prev, language: lang }))} />
          
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-label">
                <span className="setting-name">{t('profile.soundEffects')}</span>
                <span className="setting-desc">Увімкнути звуки гри</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={() => toggleSetting('soundEffects')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-label">
                <span className="setting-name">{t('profile.notifications')}</span>
                <span className="setting-desc">Отримувати сповіщення про виграші</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => toggleSetting('notifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <WalletManager user={user} initData={initData} />

          <button className="btn btn-primary support-button" onClick={openSupport}>
            💬 {t('profile.support')}
          </button>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <PrivacySettings user={user} initData={initData} />
      )}
    </div>
  );
}

export default Profile;
