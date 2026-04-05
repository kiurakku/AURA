import React, { useState, useEffect } from 'react';
import './Profile.css';
import { api } from '../utils/api';
import { t, getLanguage, setLanguage } from '../utils/i18n';
import { getSettings, saveSettings, updateSetting, applySettings } from '../utils/settings';
import LanguageSelector from '../components/LanguageSelector';
import PrivacySettings from '../components/PrivacySettings';
import WalletManager from '../components/WalletManager';
import LegalDocuments from '../components/LegalDocuments';
import {
  UI,
  avatarHaloByProgress,
  avatarHaloTier,
  rankStarAsset,
  rankLevelFromWagered,
} from '../constants/uiAssets';

function Profile({ user, initData, onLanguageChange }) {
  const [gameHistory, setGameHistory] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalWins: 0,
    totalWagered: 0,
    totalWon: 0
  });
  const [userRank, setUserRank] = useState(null);
  const [cashbackInfo, setCashbackInfo] = useState(null);
  const [settings, setSettings] = useState(() => getSettings());
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  useEffect(() => {
    if (initData) {
      fetchUserRank();
      fetchCashbackInfo();
    }
  }, [initData]);

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
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(newSettings);
    saveSettings(newSettings);
    applySettings(newSettings);
  };

  const updateSettingValue = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    saveSettings(newSettings);
    applySettings(newSettings);
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
  const wagerForRank = userRank?.total_wagered ?? stats.totalWagered;
  const displayRankLevel = (() => {
    const rid = Number(userRank?.rank_id);
    if (rid >= 1 && rid <= 10) return rid;
    return rankLevelFromWagered(wagerForRank);
  })();

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
    <div className="profile-page profile-page--assets profile-page--aura fade-in">
      <div className="profile-page-heading">
        <img src={UI.profilePageMenu} alt="" className="profile-page-heading-icon" decoding="async" />
        <h1 className="page-title">{t('profile.title')}</h1>
      </div>

      {/* Profile Header */}
      <div className="profile-header profile-header--assets glass-card">
        <div className="profile-avatar-wrapper profile-avatar-wrapper--assets">
          {user?.photo_url ? (
            <img src={user.photo_url} alt={user.first_name} className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              {user?.first_name?.[0] || 'U'}
            </div>
          )}
          <img
            src={avatarHaloByProgress(stats.totalWagered)}
            alt=""
            className={`profile-avatar-halo profile-avatar-halo--t${avatarHaloTier(stats.totalWagered)}`}
            decoding="async"
          />
          <div className="profile-badge profile-badge--rank" style={{ borderColor: playerStatus.color }}>
            <img
              src={rankStarAsset(displayRankLevel)}
              alt=""
              className="rank-star-img"
              decoding="async"
            />
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
      <div className="profile-tabs profile-tabs--assets">
        <button 
          type="button"
          className={`profile-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <img src={UI.iconDataPlays} alt="" className="profile-tab-icon" decoding="async" />
          {t('profile.stats')}
        </button>
        <button 
          type="button"
          className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <img src={UI.profilePageMenu} alt="" className="profile-tab-icon" decoding="async" />
          {t('profile.settings')}
        </button>
        <button 
          type="button"
          className={`profile-tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <img src={UI.iconLock} alt="" className="profile-tab-icon" decoding="async" />
          {t('profile.privacy')}
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <>
          <div className="stats-section">
            <h2 className="settings-title">{t('profile.stats')}</h2>
            <div className="stats-grid">
              <div className="stat-card stat-card--assets glass-card">
                <div className="stat-icon stat-icon--asset"><img src={UI.iconColorgame} alt="" decoding="async" /></div>
                <div className="stat-value">{stats.totalGames}</div>
                <div className="stat-label">{t('profile.stats')}</div>
              </div>
              <div className="stat-card stat-card--assets glass-card">
                <div className="stat-icon stat-icon--asset"><img src={UI.iconChampion} alt="" decoding="async" /></div>
                <div className="stat-value">{stats.totalWins}</div>
                <div className="stat-label">Виграшів</div>
              </div>
              <div className="stat-card stat-card--assets glass-card">
                <div className="stat-icon stat-icon--asset"><img src={UI.chipIcon} alt="" decoding="async" /></div>
                <div className="stat-value">{stats.totalWagered.toFixed(2)}</div>
                <div className="stat-label">Поставлено</div>
              </div>
              <div className="stat-card stat-card--assets glass-card">
                <div className="stat-icon stat-icon--asset"><img src={UI.noticeGift} alt="" decoding="async" /></div>
                <div className="stat-value">{stats.totalWon.toFixed(2)}</div>
                <div className="stat-label">Виграно</div>
              </div>
            </div>
          </div>

          <div className="history-section">
            <h2 className="settings-title">{t('profile.history')}</h2>
            <div className="history-list glass-card">
              {gameHistory.length === 0 ? (
                <div className="empty-state empty-state--assets">
                  <img src={UI.missionEmpty} alt="" className="empty-state-img" decoding="async" />
                  <p>{t('profile.empty')}</p>
                </div>
              ) : (
                gameHistory.slice(0, 10).map((game) => (
                  <div key={game.id} className="history-item slide-in">
                    <div className="history-header">
                      <div className="history-game">{game.game_type}</div>
                      <div className="history-date">
                        <img src={UI.iconDataTime} alt="" className="history-date-icon" decoding="async" />
                        <span>{new Date(game.created_at).toLocaleString(getLanguage())}</span>
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
          
          <LanguageSelector onLanguageChange={async (lang) => {
            setLanguage(lang);
            updateSettingValue('language', lang);
            
            // Save language to server
            if (initData) {
              try {
                await api.post('/language', { language: lang }, {
                  headers: { 'x-telegram-init-data': initData }
                });
              } catch (error) {
                console.error('Failed to save language:', error);
              }
            }
            
            if (onLanguageChange) {
              onLanguageChange(lang);
            }
            // Force re-render by dispatching event
            window.dispatchEvent(new Event('languagechange'));
          }} />
          
          <div className="settings-list">
            {/* Appearance Settings */}
            <div className="settings-group">
              <h3 className="settings-group-title">{t('profile.appearance')}</h3>
              
              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">{t('profile.animations')}</span>
                  <span className="setting-desc">{t('profile.animationsDesc')}</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.animations}
                    onChange={() => toggleSetting('animations')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">{t('profile.reducedMotion')}</span>
                  <span className="setting-desc">{t('profile.reducedMotionDesc')}</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={() => toggleSetting('reducedMotion')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">{t('profile.fontSize')}</span>
                  <span className="setting-desc">{t('profile.fontSizeDesc')}</span>
                </div>
                <select
                  className="setting-select"
                  value={settings.fontSize || 'normal'}
                  onChange={(e) => updateSettingValue('fontSize', e.target.value)}
                >
                  <option value="small">{t('profile.small')}</option>
                  <option value="normal">{t('profile.normal')}</option>
                  <option value="large">{t('profile.large')}</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">{t('profile.compactMode')}</span>
                  <span className="setting-desc">{t('profile.compactModeDesc')}</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={() => toggleSetting('compactMode')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            {/* Audio & Notifications */}
            <div className="settings-group">
              <h3 className="settings-group-title">{t('profile.audioNotifications')}</h3>
              
              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">{t('profile.soundEffects')}</span>
                  <span className="setting-desc">{t('profile.soundEffectsDesc')}</span>
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
                  <span className="setting-desc">{t('profile.notificationsDesc')}</span>
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

              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">{t('profile.hapticFeedback')}</span>
                  <span className="setting-desc">{t('profile.hapticFeedbackDesc')}</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.hapticFeedback}
                    onChange={() => toggleSetting('hapticFeedback')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            {/* Game Settings */}
            <div className="settings-group">
              <h3 className="settings-group-title">{t('profile.gameSettings')}</h3>
              
              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">{t('profile.autoPlay')}</span>
                  <span className="setting-desc">{t('profile.autoPlayDesc')}</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoPlay}
                    onChange={() => toggleSetting('autoPlay')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <span className="setting-name">{t('profile.showBalance')}</span>
                  <span className="setting-desc">{t('profile.showBalanceDesc')}</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.showBalance}
                    onChange={() => toggleSetting('showBalance')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
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
