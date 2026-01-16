import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Games from './pages/Games';
import Wallet from './pages/Wallet';
import Referral from './pages/Referral';
import Profile from './pages/Profile';
import { api } from './utils/api';
import { getLanguage, setLanguage, t } from './utils/i18n';
import { applySettings } from './utils/settings';

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState({ balance: 0, bonus_balance: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [initData, setInitData] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(getLanguage());
  const [languageKey, setLanguageKey] = useState(0); // Force re-render on language change


  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = () => {
      setCurrentLanguage(getLanguage());
      setLanguageKey(prev => prev + 1);
    };
    
    // Listen for navigation events from Home page and games
    const handleNavigate = (event) => {
      if (event.detail === 'games') {
        setActiveTab('games');
      } else if (event.detail === 'wallet') {
        setActiveTab('wallet');
      }
    };
    
    window.addEventListener('languagechange', handleLanguageChange);
    window.addEventListener('navigate', handleNavigate);
    
    // Apply settings on mount
    applySettings();
    
    // Set language from Telegram if available
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      const lang = tg.initDataUnsafe?.user?.language_code || 'en';
      const langMap = {
        'uk': 'uk',
        'ru': 'ru',
        'en': 'en',
        'zh': 'zh',
        'de': 'de',
        'es': 'es'
      };
      const mappedLang = langMap[lang] || langMap[lang.split('-')[0]] || 'en';
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
      
      if (!data) {
        console.error('❌ Telegram WebApp initData is empty!');
        setLoading(false);
        return;
      }
      
      // Store initData globally for API interceptor
      window.__TELEGRAM_INIT_DATA__ = data;
      setInitData(data);
      
      console.log('✅ Telegram WebApp initialized, initData length:', data.length);
      
      // Authenticate user
      authenticateUser(data);
    } else {
      console.warn('⚠️ Telegram WebApp not available - running in dev mode');
      // Development mode - use mock data
      setLoading(false);
    }
    
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
      window.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  const authenticateUser = async (data) => {
    try {
      setLoading(true);
      console.log('🔐 Authenticating user...');
      console.log('📤 Sending request to /api/auth');
      console.log('📋 initData length:', data?.length || 0);
      
      const response = await api.post('/auth', { initData: data }, {
        headers: { 'x-telegram-init-data': data }
      });
      
      console.log('📥 Auth response:', response.data);
      
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        console.log('✅ User authenticated:', response.data.user.first_name);
        await fetchBalance(data);
      } else {
        console.error('❌ Auth failed:', response.data);
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert('Помилка авторизації: ' + (response.data.error || 'Невідома помилка'));
        }
      }
    } catch (error) {
      console.error('❌ Auth error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Show error to user in production
      if (window.Telegram?.WebApp) {
        const errorMsg = error.response?.data?.error || error.message || 'Помилка авторизації';
        window.Telegram.WebApp.showAlert(`Помилка авторизації: ${errorMsg}. Перезавантажте додаток.`);
      }
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
      // Balance error - set default balance
      setBalance({ balance: 0, bonus_balance: 0, total: 0 });
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
    <ErrorBoundary>
      <div className="app">
        <Header 
          user={user} 
          balance={balance.total} 
          onDeposit={() => setActiveTab('wallet')}
        />
        
        <main className="main-content">
          <ErrorBoundary>
            {activeTab === 'home' && <Home key={languageKey} user={user} initData={initData} onBalanceUpdate={updateBalance} />}
            {activeTab === 'games' && <Games key={languageKey} user={user} initData={initData} onBalanceUpdate={updateBalance} />}
            {activeTab === 'wallet' && <Wallet key={languageKey} user={user} initData={initData} onBalanceUpdate={updateBalance} />}
            {activeTab === 'referral' && <Referral key={languageKey} user={user} initData={initData} />}
            {activeTab === 'profile' && <Profile key={languageKey} user={user} initData={initData} onLanguageChange={(lang) => { setCurrentLanguage(lang); setLanguageKey(prev => prev + 1); }} />}
          </ErrorBoundary>
        </main>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">{t('nav.home')}</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          <span className="nav-icon">🎰</span>
          <span className="nav-label">{t('nav.games')}</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          <span className="nav-icon">💰</span>
          <span className="nav-label">{t('nav.wallet')}</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'referral' ? 'active' : ''}`}
          onClick={() => setActiveTab('referral')}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-label">{t('nav.referral')}</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">{t('nav.profile')}</span>
        </button>
      </nav>
      </div>
    </ErrorBoundary>
  );
}

export default App;
