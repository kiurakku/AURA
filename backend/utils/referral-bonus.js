// Referral bonus system
// Random bonus distribution for referrers when a new user registers

/**
 * Calculate and award random referral bonus to referrer
 * @param {Object} db - Database instance
 * @param {number} referrerId - ID of the referrer
 * @param {number} referrerTelegramId - Telegram ID of the referrer
 * @returns {Object} Bonus information
 */
export function awardReferralBonus(db, referrerId, referrerTelegramId) {
  const random = Math.random() * 100; // 0-100
  
  let bonus = null;
  let description = '';
  let currency = 'USDT';
  let amount = 0;
  
  // Chance: 5% шанс отримати 1 монету, 95% шанс отримати 2 монети
  if (random < 5) {
    // 5% шанс - 1 монета Chance
    bonus = 'CHANCE';
    amount = 1;
    currency = 'CHANCE';
    description = 'Реферальний бонус: 1 монета Chance';
  } else if (random < 10) {
    // 5% шанс - 2 монети Chance
    bonus = 'CHANCE';
    amount = 2;
    currency = 'CHANCE';
    description = 'Реферальний бонус: 2 монети Chance';
  } else if (random < 30) {
    // 20% шанс - 0.5 монети Omega
    bonus = 'OMEGA';
    amount = 0.5;
    currency = 'OMEGA';
    description = 'Реферальний бонус: 0.5 монети Omega';
  } else if (random < 70) {
    // 40% шанс - 0.002 монети UNPL
    bonus = 'UNPL';
    amount = 0.002;
    currency = 'UNPL';
    description = 'Реферальний бонус: 0.002 монети UNPL';
  } else if (random < 85) {
    // 15% шанс - 0.002 USDT
    bonus = 'USDT';
    amount = 0.002;
    currency = 'USDT';
    description = 'Реферальний бонус: 0.002 USDT';
  } else if (random < 95) {
    // 10% шанс - 0.002 TON
    bonus = 'TON';
    amount = 0.002;
    currency = 'TON';
    description = 'Реферальний бонус: 0.002 TON';
  } else {
    // 5% шанс - 0.000002 BTC
    bonus = 'BTC';
    amount = 0.000002;
    currency = 'BTC';
    description = 'Реферальний бонус: 0.000002 BTC';
  }
  
  // Get referrer user
  const referrer = db.prepare('SELECT * FROM users WHERE id = ? OR telegram_id = ?').get(referrerId, referrerTelegramId);
  if (!referrer) {
    console.error('Referrer not found:', referrerId, referrerTelegramId);
    return null;
  }
  
  // Update balance based on currency type
  if (currency === 'USDT') {
    const newBalance = (referrer.balance || 0) + amount;
    db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, referrer.id);
  } else if (currency === 'TON' || currency === 'BTC') {
    // For TON and BTC, we'll store in a separate field or metadata
    // For now, convert to USDT equivalent and add to balance
    const usdtEquivalent = currency === 'TON' ? amount * 10 : amount * 66666.67; // Approximate rates
    const newBalance = (referrer.balance || 0) + usdtEquivalent;
    db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, referrer.id);
  } else {
    // For bonus coins (CHANCE, OMEGA, UNPL), add to bonus_balance
    const newBonusBalance = (referrer.bonus_balance || 0) + amount;
    db.prepare('UPDATE users SET bonus_balance = ? WHERE id = ?').run(newBonusBalance, referrer.id);
  }
  
  // Create transaction record
  db.prepare(`
    INSERT INTO transactions (user_id, type, amount, currency, status, description)
    VALUES (?, 'referral_bonus', ?, ?, 'completed', ?)
  `).run(referrer.id, amount, currency, description);
  
  return {
    bonus,
    amount,
    currency,
    description
  };
}

export default {
  awardReferralBonus
};
