import { calculateRank, calculateXP } from './ranks.js';
import { getDatabase } from '../database/db.js';

export async function updateUserRankAndXP(telegramId, betAmount) {
  const db = await getDatabase();
  const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId);
  
  if (!user) return;
  
  const xpGained = calculateXP(betAmount);
  const totalWagered = (user.total_wagered || 0) + betAmount;
  const totalXP = (user.total_xp || 0) + xpGained;
  const newRank = calculateRank(totalWagered);
  
  db.prepare('UPDATE users SET total_wagered = ?, total_xp = ?, rank_id = ?, rank_name = ? WHERE telegram_id = ?')
    .run(totalWagered, totalXP, newRank.id, newRank.name, telegramId);
  
  return { newRank, totalXP, totalWagered };
}
