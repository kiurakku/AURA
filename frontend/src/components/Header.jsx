import React from 'react';
import './Header.css';
import { UI } from '../constants/uiAssets';

function Header({ user, balance, onDeposit }) {
  return (
    <header className="header glass header--aura">
      <div className="header-content">
        <div className="header-chip-mark">
          <img src={UI.brandLogo} alt="" decoding="async" />
        </div>
        <div className="user-info">
          {user?.photo_url ? (
            <div className="avatar-wrapper">
              <img src={user.photo_url} alt={user.first_name} className="avatar" />
            </div>
          ) : (
            <div className="avatar-placeholder">
              {user?.first_name?.[0] || 'U'}
            </div>
          )}
          <div className="user-details">
            <div className="username">{user?.first_name || 'Гравець'}</div>
            <div className="balance">
              {balance.toFixed(2)} <span className="currency">USDT</span>
            </div>
          </div>
        </div>
        <button type="button" className="deposit-btn deposit-btn--asset" onClick={onDeposit} aria-label="Поповнити">
          <img src={UI.addBtn} alt="" decoding="async" />
        </button>
      </div>
    </header>
  );
}

export default Header;
