import React from 'react';
import './Header.css';

function Header({ user, balance, onDeposit }) {
  return (
    <header className="header glass">
      <div className="header-content">
        <div className="user-info">
          {user?.photo_url ? (
            <img src={user.photo_url} alt={user.first_name} className="avatar" />
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
        <button className="deposit-btn btn btn-primary" onClick={onDeposit}>
          +
        </button>
      </div>
    </header>
  );
}

export default Header;
