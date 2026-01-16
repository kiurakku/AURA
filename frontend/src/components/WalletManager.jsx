import React, { useState, useEffect } from 'react';
import './WalletManager.css';
import { api } from '../utils/api';

function WalletManager({ user, initData }) {
  const [wallets, setWallets] = useState([]);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newWallet, setNewWallet] = useState({ type: 'TON', address: '' });

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      // TODO: Implement API endpoint
      // const response = await api.get('/wallets', {
      //   headers: { 'x-telegram-init-data': initData }
      // });
      // setWallets(response.data.wallets || []);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
    }
  };

  const addWallet = async () => {
    if (!newWallet.address) {
      alert('Введіть адресу гаманця');
      return;
    }

    if (wallets.length >= 3) {
      alert('Максимум 3 прив\'язані гаманці');
      return;
    }

    try {
      // TODO: Implement API endpoint
      // await api.post('/wallets', newWallet, {
      //   headers: { 'x-telegram-init-data': initData }
      // });
      setWallets([...wallets, { ...newWallet, id: Date.now() }]);
      setNewWallet({ type: 'TON', address: '' });
      setShowAddWallet(false);
    } catch (error) {
      console.error('Failed to add wallet:', error);
      alert('Помилка додавання гаманця');
    }
  };

  const removeWallet = async (walletId) => {
    try {
      // TODO: Implement API endpoint
      // await api.delete(`/wallets/${walletId}`, {
      //   headers: { 'x-telegram-init-data': initData }
      // });
      setWallets(wallets.filter(w => w.id !== walletId));
    } catch (error) {
      console.error('Failed to remove wallet:', error);
    }
  };

  const walletTypes = [
    { id: 'TON', name: 'TON', icon: '⚡' },
    { id: 'USDT', name: 'USDT (TRC-20)', icon: '💵' },
    { id: 'BTC', name: 'Bitcoin', icon: '₿' }
  ];

  return (
    <div className="wallet-manager glass-card">
      <div className="wallet-manager-header">
        <h3 className="wallet-manager-title">Прив'язані гаманці</h3>
        <span className="wallet-count">{wallets.length}/3</span>
      </div>

      <div className="wallets-list">
        {wallets.length === 0 ? (
          <div className="empty-wallets">
            <div className="empty-icon">💼</div>
            <p>Немає прив'язаних гаманців</p>
          </div>
        ) : (
          wallets.map((wallet) => (
            <div key={wallet.id} className="wallet-item">
              <div className="wallet-info">
                <span className="wallet-icon">
                  {walletTypes.find(t => t.id === wallet.type)?.icon || '💼'}
                </span>
                <div className="wallet-details">
                  <div className="wallet-type">{wallet.type}</div>
                  <div className="wallet-address">{wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}</div>
                </div>
              </div>
              <button 
                className="wallet-remove-btn"
                onClick={() => removeWallet(wallet.id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {wallets.length < 3 && (
        <>
          {!showAddWallet ? (
            <button 
              className="btn btn-secondary add-wallet-btn"
              onClick={() => setShowAddWallet(true)}
            >
              + Додати гаманець
            </button>
          ) : (
            <div className="add-wallet-form">
              <select
                className="input"
                value={newWallet.type}
                onChange={(e) => setNewWallet({ ...newWallet, type: e.target.value })}
              >
                {walletTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="input"
                placeholder="Введіть адресу гаманця"
                value={newWallet.address}
                onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
              />
              <div className="add-wallet-actions">
                <button className="btn btn-primary" onClick={addWallet}>
                  Додати
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddWallet(false);
                    setNewWallet({ type: 'TON', address: '' });
                  }}
                >
                  Скасувати
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WalletManager;
