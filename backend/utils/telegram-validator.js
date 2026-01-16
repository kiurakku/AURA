import crypto from 'crypto';

/**
 * Validates Telegram WebApp initData
 * @param {string} initData - Raw initData string from Telegram
 * @param {string} botToken - Telegram bot token
 * @returns {boolean} - True if valid
 */
export function validateTelegramWebApp(initData, botToken) {
  if (!initData || !botToken) {
    return false;
  }

  try {
    // Parse initData
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    // Sort parameters
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Compare hashes
    return calculatedHash === hash;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

/**
 * Parses user data from initData
 * @param {string} initData - Raw initData string
 * @returns {Object|null} - User data or null
 */
export function parseUserData(initData) {
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    
    if (!userStr) {
      return null;
    }

    const user = JSON.parse(decodeURIComponent(userStr));
    
    // Extract start_param for referral links
    const startParam = params.get('start_param') || params.get('startapp') || null;
    
    return {
      id: user.id,
      username: user.username || null,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      photo_url: user.photo_url || null,
      language_code: user.language_code || null,
      start_param: startParam
    };
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
}

/**
 * Extracts auth_date and checks if it's recent (within 24 hours)
 * @param {string} initData - Raw initData string
 * @returns {boolean} - True if auth_date is recent
 */
export function isAuthDataRecent(initData) {
  try {
    const params = new URLSearchParams(initData);
    const authDate = parseInt(params.get('auth_date'));
    
    if (!authDate) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const diff = now - authDate;
    
    // Check if auth_date is within 24 hours
    return diff < 86400;
  } catch (error) {
    return false;
  }
}
