// Currency converter utility
// Exchange rates (updated periodically, should be fetched from API in production)
const EXCHANGE_RATES = {
  USDT: {
    USDT: 1,
    TON: 0.1, // 1 USDT = 0.1 TON (example rate, should be fetched from API)
    BTC: 0.000015 // 1 USDT = 0.000015 BTC (example rate)
  },
  TON: {
    USDT: 10, // 1 TON = 10 USDT
    TON: 1,
    BTC: 0.00015 // 1 TON = 0.00015 BTC
  },
  BTC: {
    USDT: 66666.67, // 1 BTC = 66666.67 USDT
    TON: 6666.67, // 1 BTC = 6666.67 TON
    BTC: 1
  }
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency (USDT, TON, BTC)
 * @param {string} toCurrency - Target currency (USDT, TON, BTC)
 * @returns {number} Converted amount
 */
export function convertCurrency(amount, fromCurrency, toCurrency) {
  if (!amount || amount <= 0) return 0;
  if (fromCurrency === toCurrency) return amount;
  
  const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency];
  if (!rate) {
    console.warn(`Exchange rate not found: ${fromCurrency} -> ${toCurrency}`);
    return amount;
  }
  
  return amount * rate;
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted amount
 */
export function formatCurrency(amount, currency = 'USDT') {
  if (!amount && amount !== 0) return '0.00';
  
  const decimals = currency === 'BTC' ? 8 : currency === 'TON' ? 2 : 2;
  return parseFloat(amount).toFixed(decimals);
}

/**
 * Get currency symbol/emoji
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currency) {
  const symbols = {
    USDT: '💵',
    TON: '⚡',
    BTC: '₿'
  };
  return symbols[currency] || currency;
}

/**
 * Fetch real-time exchange rates from API (placeholder)
 * In production, this should fetch from a real API
 */
export async function fetchExchangeRates() {
  try {
    // TODO: Implement real API call
    // const response = await fetch('https://api.example.com/exchange-rates');
    // const rates = await response.json();
    // return rates;
    
    // For now, return static rates
    return EXCHANGE_RATES;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return EXCHANGE_RATES;
  }
}

export default {
  convertCurrency,
  formatCurrency,
  getCurrencySymbol,
  fetchExchangeRates,
  EXCHANGE_RATES
};
