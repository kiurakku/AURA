import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Games from './pages/Games';
import Wallet from './pages/Wallet';
import Referral from './pages/Referral';
import Profile from './pages/Profile';
import { api } from './utils/api';
import { getLanguage, setLanguage } from './utils/i18n';

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState({ balance: 0, bonus_balance: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [initData, setInitData] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleNavigate = (e) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  useEffect(() => {
    // Set language from Telegram if available
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      const lang = tg.initDataUnsafe?.user?.language_code || 'uk';
      const langMap = {
        'uk': 'uk',
        'ru': 'ru',
        'en': 'en',
        'zh': 'zh',
        'de': 'de',
        'es': 'es'
      };
      const mappedLang = langMap[lang] || langMap[lang.split('-')[0]] || 'uk';
      if (mappedLang !== currentLanguage) {
        setLanguage(mappedLang);
        setCurrentLanguage(mappedLang);
      }
    }

    // Get initData from Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      const data = tg.initData;
      setInitData(data);
      
      // Authenticate user
      authenticateUser(data);
    } else {
      // Development mode - use mock data
      console.warn('Telegram WebApp not available, using mock data');
      setLoading(false);
    }
  }, []);

  const authenticateUser = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/auth', { initData: data });
      setUser(response.data.user);
      await fetchBalance(data);
    } catch (error) {
      console.error('Auth error:', error);
      alert('Помилка авторизації. Переконайтеся, що ви відкрили додаток через Telegram.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (data) => {
    try {
      const response = await api.get('/balance', {
        headers: { 'x-telegram-init-data': data }
      });
      setBalance(response.data);
    } catch (error) {
      console.error('Balance error:', error);
    }
  };

  const updateBalance = () => {
    if (initData) {
      fetchBalance(initData);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        user={user} 
        balance={balance.total} 
        onDeposit={() => setActiveTab('wallet')}
      />
      
      <main className="main-content">
        {activeTab === 'home' && <Home user={user} />}
        {activeTab === 'games' && <Games user={user} initData={initData} onBalanceUpdate={updateBalance} />}
        {activeTab === 'wallet' && <Wallet user={user} initData={initData} onBalanceUpdate={updateBalance} />}
        {activeTab === 'referral' && <Referral user={user} initData={initData} />}
        {activeTab === 'profile' && <Profile user={user} initData={initData} />}
      </main>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Головна</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          <span className="nav-icon">🎰</span>
          <span className="nav-label">Ігри</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          <span className="nav-icon">💰</span>
          <span className="nav-label">Гаманець</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'referral' ? 'active' : ''}`}
          onClick={() => setActiveTab('referral')}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-label">Реферали</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Профіль</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
