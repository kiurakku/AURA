import React, { useState, useEffect } from 'react';
import './Wallet.css';
import { api } from '../utils/api';

function Wallet({ user, initData, onBalanceUpdate }) {
  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions', {
        headers: { 'x-telegram-init-data': initData }
      });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleDeposit = () => {
    // TODO: Integrate CryptoPay or TON Connect
    alert('Функція депозиту буде доступна після налаштування платіжного шлюзу');
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress) {
      alert('Заповніть всі поля');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement withdraw API
      alert('Функція виводу буде доступна після налаштування платіжного шлюзу');
    } catch (error) {
      console.error('Withdraw error:', error);
      alert(error.response?.data?.error || 'Помилка виводу');
    } finally {
      setLoading(false);
    }
  };

  const currencies = [
    { id: 'USDT', name: 'USDT', icon: '💵', network: 'TRC-20' },
    { id: 'TON', name: 'TON', icon: '⚡', network: 'TON' },
    { id: 'BTC', name: 'BTC', icon: '₿', network: 'Bitcoin' }
  ];

  return (
    <div className="wallet-page fade-in">
      <h1 className="page-title">💰 Гаманець</h1>

      {/* Balance Card */}
      <div className="balance-card glass-card">
        <div className="balance-header">
          <span className="balance-label">Ваш баланс</span>
          <span className="balance-eye">👁️</span>
        </div>
        <div className="balance-main">
          <span className="balance-value balance-text">
            {(user?.balance || 0).toFixed(2)}
          </span>
          <span className="balance-currency">{selectedCurrency}</span>
        </div>
        {user?.bonus_balance > 0 && (
          <div className="bonus-balance">
            <span className="bonus-label">Бонусний баланс:</span>
            <span className="bonus-value">{user.bonus_balance.toFixed(2)} {selectedCurrency}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="wallet-actions">
        <button className="btn btn-primary deposit-btn" onClick={handleDeposit}>
          <span className="btn-icon">+</span>
          <span>Поповнити</span>
        </button>
        <button 
          className="btn btn-secondary withdraw-btn"
          onClick={handleWithdraw}
          disabled={loading}
        >
          <span className="btn-icon">→</span>
          <span>{loading ? 'Обробка...' : 'Вивести'}</span>
        </button>
      </div>

      {/* Currency Selection */}
      <div className="currency-selector glass-card">
        <h3 className="selector-title">Вибір валюти</h3>
        <div className="currency-grid">
          {currencies.map((currency) => (
            <button
              key={currency.id}
              className={`currency-option ${selectedCurrency === currency.id ? 'active' : ''}`}
              onClick={() => setSelectedCurrency(currency.id)}
            >
              <span className="currency-icon">{currency.icon}</span>
              <span className="currency-name">{currency.name}</span>
              <span className="currency-network">{currency.network}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Withdraw Form */}
      <div className="withdraw-section glass-card">
        <h2 className="section-title">Вивести кошти</h2>
        <div className="withdraw-form">
          <div className="form-group">
            <label>Сума ({selectedCurrency})</label>
            <input
              type="number"
              className="input"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.00"
              min="0.1"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Адреса гаманця</label>
            <input
              type="text"
              className="input"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              placeholder={`Введіть адресу ${selectedCurrency} гаманця`}
            />
          </div>
          <button 
            className="btn btn-secondary withdraw-submit-btn"
            onClick={handleWithdraw}
            disabled={loading}
          >
            {loading ? 'Обробка...' : 'Вивести'}
          </button>
        </div>
      </div>

      {/* Transactions History */}
      <div className="transactions-section">
        <h2 className="section-title">Історія транзакцій</h2>
        <div className="transactions-list glass-card">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>Немає транзакцій</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="transaction-item slide-in">
                <div className="transaction-icon">
                  {tx.type === 'deposit' ? '⬇️' : tx.type === 'withdraw' ? '⬆️' : '🎁'}
                </div>
                <div className="transaction-info">
                  <div className="transaction-type">{tx.type}</div>
                  <div className="transaction-date">
                    {new Date(tx.created_at).toLocaleDateString('uk-UA', { 
                      day: '2-digit', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className={`transaction-amount ${tx.type === 'deposit' ? 'positive' : 'negative'}`}>
                  {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.currency}
                </div>
                <div className={`transaction-status status-${tx.status}`}>
                  {tx.status === 'completed' ? '✅' : tx.status === 'pending' ? '⏳' : '❌'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;
