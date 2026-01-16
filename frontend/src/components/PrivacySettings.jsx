import React, { useState } from 'react';
import './PrivacySettings.css';
import LegalDocuments from './LegalDocuments';

function PrivacySettings({ user, initData }) {
  const [privacySettings, setPrivacySettings] = useState({
    showBalance: true,
    showStats: true,
    allowReferrals: true,
    dataSharing: false
  });

  const togglePrivacy = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="privacy-settings">
      <h2 className="settings-title">Налаштування конфіденційності</h2>
      
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">Показувати баланс</span>
            <span className="setting-desc">Дозволити іншим бачити ваш баланс</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.showBalance}
              onChange={() => togglePrivacy('showBalance')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">Показувати статистику</span>
            <span className="setting-desc">Дозволити іншим бачити вашу статистику</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.showStats}
              onChange={() => togglePrivacy('showStats')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">Дозволити реферали</span>
            <span className="setting-desc">Дозволити іншим запрошувати вас через реферальні посилання</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.allowReferrals}
              onChange={() => togglePrivacy('allowReferrals')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">Обмін даними</span>
            <span className="setting-desc">Дозволити обмін анонімними даними для покращення сервісу</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.dataSharing}
              onChange={() => togglePrivacy('dataSharing')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <LegalDocuments />
    </div>
  );
}

export default PrivacySettings;
