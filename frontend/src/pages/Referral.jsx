import React, { useState, useEffect } from 'react';
import './Referral.css';
import { api } from '../utils/api';

function Referral({ user, initData }) {
  const [referralInfo, setReferralInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const fetchReferralInfo = async () => {
    if (!initData) return;
    try {
      const response = await api.get('/referral', {
        headers: { 'x-telegram-init-data': initData }
      });
      setReferralInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch referral info:', error);
      setReferralInfo(null);
    }
  };

  const copyReferralLink = () => {
    if (referralInfo?.referral_link) {
      navigator.clipboard.writeText(referralInfo.referral_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inviteFriends = () => {
    if (referralInfo?.referral_link) {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openTelegramLink(referralInfo.referral_link);
      } else {
        copyReferralLink();
        alert('Посилання скопійовано! Поділіться ним з друзями.');
      }
    }
  };

  return (
    <div className="referral-page fade-in">
      <h1 className="page-title">👥 Реферальна програма</h1>

      {/* Hero Section */}
      <div className="referral-hero glass-card">
        <h2>Заробляйте разом з друзями!</h2>
        <p className="referral-description">
          Запрошуйте друзів і отримуйте бонус за кожного активного реферала. 
          Чим більше друзів, тим більше заробіток!
        </p>
      </div>

      {referralInfo && (
        <>
          {/* Stats */}
          <div className="referral-stats">
            <div className="stat-card glass-card">
              <div className="stat-value">{referralInfo.total_referrals || 0}</div>
              <div className="stat-label">Друзів</div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-value">{referralInfo.total_earnings?.toFixed(2) || '0.00'}</div>
              <div className="stat-label">Ваш дохід</div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-value">5%</div>
              <div className="stat-label">% від ставок</div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="referral-link-section glass-card">
            <label>Ваше реферальне посилання:</label>
            <div className="referral-link-container">
              <input
                type="text"
                className="referral-link-input"
                value={referralInfo.referral_link}
                readOnly
              />
              <button 
                className="btn btn-primary copy-btn"
                onClick={copyReferralLink}
              >
                {copied ? '✓ Скопійовано' : 'Копіювати'}
              </button>
            </div>
            <button 
              className="btn btn-primary invite-button"
              onClick={inviteFriends}
            >
              📱 Запросити друзів
            </button>
          </div>
        </>
      )}

      {/* Benefits */}
      <div className="referral-benefits glass-card">
        <h3>Як це працює?</h3>
        <ul className="benefits-list">
          <li>🎁 Ваш друг отримує бонус при реєстрації</li>
          <li>💰 Ви отримуєте % від його ставок</li>
          <li>🚀 Без обмежень на кількість рефералів</li>
          <li>💎 Виплати миттєві</li>
        </ul>
      </div>
    </div>
  );
}

export default Referral;
