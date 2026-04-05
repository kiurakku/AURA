// Helper function to get user language from database or Telegram
export function getUserLanguage(db, telegramId, telegramLanguageCode = 'uk') {
  try {
    const user = db.prepare('SELECT language FROM users WHERE telegram_id = ?').get(telegramId);
    return user?.language || telegramLanguageCode || 'uk';
  } catch (error) {
    console.error('Error getting user language:', error);
    return telegramLanguageCode || 'uk';
  }
}

export default getUserLanguage;
