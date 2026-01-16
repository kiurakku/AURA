import React, { useState, useEffect } from 'react';
import './Wallet.css';
import { api } from '../utils/api';
import { t } from '../utils/i18n';
import { convertCurrency, formatCurrency, getCurrencySymbol } from '../utils/currency-converter';

function Wallet({ user, initData, onBalanceUpdate }) {
  const [transactions, setTransactions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initData) {
      fetchTransactions();
    }
  }, [initData]);

  const fetchTransactions = async () => {
    if (!initData) return;
    try {
      const response = await api.get('/transactions', {
        headers: { 'x-telegram-init-data': initData }
      });
      setTransactions(response.data?.transactions || []);
    } catch (error) {
      setTransactions([]);
    }
  };

  const handleDeposit = async () => {
    const amount = prompt(t('wallet.enterDepositAmount') || 'Введіть суму депозиту (мінімум 1 USDT):');
    if (!amount || parseFloat(amount) < 1) {
      alert(t('wallet.invalidAmount') || 'Невірна сума. Мінімум 1 USDT');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/payments/deposit', {
        amount: parseFloat(amount),
        currency: 'USDT'
      }, {
        headers: { 'x-telegram-init-data': initData }
      });

      if (response.data.success) {
        // Open payment URL
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.openLink(response.data.pay_url);
        } else {
          window.open(response.data.pay_url, '_blank');
        }

        // Poll for payment status
        const checkStatus = setInterval(async () => {
          try {
            const statusResponse = await api.get(`/payments/deposit/${response.data.invoice_id}/status`, {
              headers: { 'x-telegram-init-data': initData }
            });

            if (statusResponse.data.status === 'paid') {
              clearInterval(checkStatus);
              alert(t('wallet.depositSuccess') || 'Депозит успішно поповнено!');
              onBalanceUpdate();
              fetchTransactions();
            }
          } catch (err) {
            console.error('Status check error:', err);
          }
        }, 3000);

        // Stop checking after 5 minutes
        setTimeout(() => clearInterval(checkStatus), 300000);
      }
    } catch (error) {
      alert(error.response?.data?.error || t('wallet.depositError') || 'Помилка створення депозиту');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 1) {
      alert(t('wallet.invalidAmount') || 'Невірна сума. Мінімум 1 USDT');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/payments/withdraw', {
        amount: parseFloat(withdrawAmount),
        currency: selectedCurrency
      }, {
        headers: { 'x-telegram-init-data': initData }
      });

      if (response.data.success) {
        alert(t('wallet.withdrawRequestCreated') || 'Запит на виведення створено. Очікуйте підтвердження адміністратора.');
        setWithdrawAmount('');
        setWithdrawAddress('');
        onBalanceUpdate();
        fetchTransactions();
      }
    } catch (error) {
      alert(error.response?.data?.error || t('wallet.withdrawError') || 'Помилка створення запиту на виведення');
    } finally {
      setLoading(false);
    }
  };

  const currencies = [
    { id: 'USDT', name: 'USDT', icon: '/materials/icons/usdt.png', emoji: '💵', network: 'TRC-20', type: 'crypto' },
    { id: 'TON', name: 'TON', icon: '/materials/icons/ton.png', emoji: '⚡', network: 'TON', type: 'crypto' },
    { id: 'BTC', name: 'BTC', icon: '/materials/icons/btc.png', emoji: '₿', network: 'Bitcoin', type: 'crypto' }
  ];

  const bonusCoins = [
    { 
      id: 'CHANCE', 
      name: 'Chance', 
      icon: '/materials/icons/chance.png', 
      emoji: '🎲', 
      description: 'Дає більший шанс на виграш',
      type: 'bonus',
      effect: 'Збільшує шанс виграшу'
    },
    { 
      id: 'OMEGA', 
      name: 'Omega', 
      icon: '/materials/icons/Omega.png', 
      emoji: 'Ω', 
      description: 'Примножує бонус',
      type: 'bonus',
      effect: 'Множник бонусів'
    },
    { 
      id: 'UNPL', 
      name: 'UNPL', 
      icon: '/materials/icons/unpl.png', 
      emoji: '🪙', 
      description: 'Внутрішня валюта казино та проектів ARS7',
      type: 'bonus',
      effect: 'Внутрішня валюта'
    }
  ];

  return (
    <div className="wallet-page fade-in">
      <h1 className="page-title">💰 {t('wallet.title')}</h1>

      {/* Balance Card */}
      <div className="balance-card glass-card">
        <div className="balance-header">
          <span className="balance-label">{t('wallet.balance')}</span>
          <span className="balance-eye">👁️</span>
        </div>
        <div className="balance-main">
          <span className="balance-value balance-text">
            {formatCurrency(convertCurrency(user?.balance || 0, 'USDT', selectedCurrency), selectedCurrency)}
          </span>
          <span className="balance-currency-icon">
            <img 
              src={currencies.find(c => c.id === selectedCurrency)?.icon || '/materials/icons/usdt.png'} 
              alt={selectedCurrency}
              onError={(e) => {
                if (e.target.nextSibling) {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline-block';
                }
              }}
              onLoad={(e) => {
                e.target.style.display = 'block';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'none';
                }
              }}
            />
            <span className="balance-currency-icon-fallback" style={{ display: 'none', fontSize: '24px' }}>
              {getCurrencySymbol(selectedCurrency)}
            </span>
          </span>
          <span className="balance-currency">{selectedCurrency}</span>
        </div>
        {user?.bonus_balance > 0 && (
          <div className="bonus-balance">
            <span className="bonus-label">{t('wallet.bonusBalance')}:</span>
            <span className="bonus-value">{user.bonus_balance.toFixed(2)} {selectedCurrency}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="wallet-actions">
        <button className="btn btn-primary deposit-btn" onClick={handleDeposit}>
          <span className="btn-icon">+</span>
          <span>{t('wallet.deposit')}</span>
        </button>
        <button 
          className="btn btn-secondary withdraw-btn"
          onClick={handleWithdraw}
          disabled={loading}
        >
          <span className="btn-icon">→</span>
          <span>{loading ? t('wallet.processing') : t('wallet.withdraw')}</span>
        </button>
      </div>

      {/* Currency Selection */}
      <div className="currency-selector glass-card">
        <h3 className="selector-title">{t('wallet.cryptocurrencies')}</h3>
        <div className="currency-grid">
          {currencies.map((currency) => (
            <button
              key={currency.id}
              className={`currency-option ${selectedCurrency === currency.id ? 'active' : ''}`}
              onClick={() => setSelectedCurrency(currency.id)}
            >
              <span className="currency-icon">
                <img 
                  src={currency.icon} 
                  alt={currency.name}
                  onError={(e) => {
                    if (e.target.nextSibling) {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline-block';
                    }
                  }}
                  onLoad={(e) => {
                    e.target.style.display = 'block';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'none';
                    }
                  }}
                />
                <span className="currency-icon-fallback" style={{ display: 'none', fontSize: '32px' }}>{currency.emoji}</span>
              </span>
              <span className="currency-name">{currency.name}</span>
              <span className="currency-network">{currency.network}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bonus Coins Section */}
      <div className="bonus-coins-section glass-card">
        <h3 className="selector-title">🎁 {t('wallet.bonusCoins')}</h3>
        <p className="bonus-coins-description">{t('wallet.bonusCoinsDescription')}</p>
        <div className="bonus-coins-grid">
          {bonusCoins.map((coin) => (
            <div key={coin.id} className="bonus-coin-card">
              <div className="bonus-coin-icon">
                <img 
                  src={coin.icon} 
                  alt={coin.name}
                  onError={(e) => {
                    console.error('Failed to load bonus coin icon:', coin.icon);
                    if (e.target.nextSibling) {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline-block';
                    }
                  }}
                  onLoad={(e) => {
                    e.target.style.display = 'block';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'none';
                    }
                  }}
                />
                <span className="bonus-coin-icon-fallback" style={{ display: 'none', fontSize: '48px' }}>{coin.emoji}</span>
              </div>
              <div className="bonus-coin-info">
                <h4 className="bonus-coin-name">{coin.name}</h4>
                <p className="bonus-coin-description">{coin.description}</p>
                <div className="bonus-coin-effect">
                  <span className="effect-label">Ефект:</span>
                  <span className="effect-value">{coin.effect}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Form */}
      <div className="withdraw-section glass-card">
            <h2 className="section-title">{t('wallet.withdrawSection')}</h2>
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
                <label>{t('wallet.address')}</label>
                <input
                  type="text"
                  className="input"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  placeholder={t('wallet.enterAddress', { currency: selectedCurrency })}
                />
          </div>
          <button 
            className="btn btn-secondary withdraw-submit-btn"
            onClick={handleWithdraw}
            disabled={loading}
          >
                {loading ? t('wallet.processing') : t('wallet.withdraw')}
          </button>
        </div>
      </div>

      {/* Transactions History */}
      <div className="transactions-section">
            <h2 className="section-title">{t('wallet.transactions')}</h2>
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
                  {tx.type === 'deposit' || tx.type === 'admin_bonus' ? '⬇️' : 
                   tx.type === 'withdraw' ? '⬆️' : 
                   tx.type === 'daily_bonus' ? '🎁' :
                   tx.type === 'game_win' ? '🎉' : '🎮'}
                </div>
                <div className="transaction-info">
                  <div className="transaction-type">
                    {tx.type === 'admin_bonus' ? 'Поповнення від Aura Team' :
                     tx.type === 'deposit' ? 'Поповнення' :
                     tx.type === 'withdraw' ? 'Виведення' :
                     tx.type === 'daily_bonus' ? 'Щоденний бонус' :
                     tx.type === 'game_win' ? 'Виграш' :
                     tx.type === 'game_bet' ? 'Ставка' :
                     tx.description || tx.type}
                  </div>
                  <div className="transaction-date">
                    {new Date(tx.created_at).toLocaleDateString('uk-UA', { 
                      day: '2-digit', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className={`transaction-amount ${tx.type === 'deposit' || tx.type === 'admin_bonus' || tx.type === 'daily_bonus' || tx.type === 'game_win' ? 'positive' : 'negative'}`}>
                  {(tx.type === 'deposit' || tx.type === 'admin_bonus' || tx.type === 'daily_bonus' || tx.type === 'game_win') ? '+' : '-'}{tx.amount} {tx.currency}
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
