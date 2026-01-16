import React, { useState, useEffect } from 'react';
import './PrivacySettings.css';
import { t } from '../utils/i18n';
import { api } from '../utils/api';
import LegalDocuments from './LegalDocuments';

function PrivacySettings({ user, initData }) {
  const [privacySettings, setPrivacySettings] = useState({
    showBalance: true,
    showStats: true,
    allowReferrals: true,
    dataSharing: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && initData) {
      fetchPrivacySettings();
    }
  }, [user, initData]);

  const fetchPrivacySettings = async () => {
    try {
      const response = await api.get('/privacy', {
        headers: { 'x-telegram-init-data': initData }
      });
      if (response.data?.settings) {
        setPrivacySettings(response.data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch privacy settings:', error);
    }
  };

  const togglePrivacy = async (key) => {
    const newSettings = {
      ...privacySettings,
      [key]: !privacySettings[key]
    };
    setPrivacySettings(newSettings);
    
    if (initData) {
      setLoading(true);
      try {
        await api.post('/privacy', {
          settings: newSettings
        }, {
          headers: { 'x-telegram-init-data': initData }
        });
      } catch (error) {
        console.error('Failed to save privacy settings:', error);
        // Revert on error
        setPrivacySettings(privacySettings);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="privacy-settings">
      <h2 className="settings-title">{t('profile.privacyTitle')}</h2>
      
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">{t('profile.showBalancePrivacy')}</span>
            <span className="setting-desc">{t('profile.showBalancePrivacyDesc')}</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.showBalance}
              onChange={() => togglePrivacy('showBalance')}
              disabled={loading}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">{t('profile.showStatsPrivacy')}</span>
            <span className="setting-desc">{t('profile.showStatsPrivacyDesc')}</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.showStats}
              onChange={() => togglePrivacy('showStats')}
              disabled={loading}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">{t('profile.allowReferrals')}</span>
            <span className="setting-desc">{t('profile.allowReferralsDesc')}</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.allowReferrals}
              onChange={() => togglePrivacy('allowReferrals')}
              disabled={loading}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-label">
            <span className="setting-name">{t('profile.dataSharing')}</span>
            <span className="setting-desc">{t('profile.dataSharingDesc')}</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.dataSharing}
              onChange={() => togglePrivacy('dataSharing')}
              disabled={loading}
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
