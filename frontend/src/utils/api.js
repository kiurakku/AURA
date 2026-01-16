import axios from 'axios';

// Use relative URL in production, absolute in development
// In production, API is on the same domain, so use /api prefix
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add initData
api.interceptors.request.use((config) => {
  // Try to get initData from multiple sources
  let initData = config.initData;
  
  if (!initData && window.Telegram?.WebApp) {
    initData = window.Telegram.WebApp.initData;
  }
  
  // If still no initData, try to get from global state or localStorage
  if (!initData && window.__TELEGRAM_INIT_DATA__) {
    initData = window.__TELEGRAM_INIT_DATA__;
  }
  
  if (initData) {
    config.headers['x-telegram-init-data'] = initData;
  } else {
    console.warn('⚠️ No initData available for request:', config.url);
  }
  
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Unauthorized - Check initData:', {
        hasTelegram: !!window.Telegram?.WebApp,
        hasInitData: !!window.Telegram?.WebApp?.initData,
        url: error.config?.url
      });
    }
    return Promise.reject(error);
  }
);

export default api;
