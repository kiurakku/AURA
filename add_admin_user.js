// Скрипт для додавання адміністратора та балансу
// Використання: cd backend && node ../add_admin_user.js

import { getDatabase } from './database/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '.env') });

async function addAdminUser() {
  try {
    const db = await getDatabase();
    
    // Telegram username користувача
    const username = 'BronhoFather';
    
    // Спочатку знайдемо користувача за username (якщо він вже існує)
    let user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (!user) {
      console.log(`❌ Користувач @${username} не знайдений в базі даних.`);
      console.log('💡 Користувач повинен спочатку зареєструватися через Telegram WebApp.');
      console.log('💡 Після реєстрації запустіть цей скрипт знову.');
      return;
    }
    
    console.log(`✅ Знайдено користувача: @${username} (ID: ${user.id}, Telegram ID: ${user.telegram_id})`);
    
    // Додаємо баланс (10 BTC = 10 USDT для простоти, або можна додати окремий BTC баланс)
    const balanceToAdd = 10.0; // 10 BTC в USDT еквіваленті
    const newBalance = (user.balance || 0) + balanceToAdd;
    
    db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, user.id);
    
    // Створюємо транзакцію
    db.prepare(`
      INSERT INTO transactions (user_id, type, amount, currency, status, description, metadata)
      VALUES (?, 'admin_bonus', ?, 'USDT', 'completed', ?, ?)
    `).run(
      user.id,
      balanceToAdd,
      `Admin bonus: ${balanceToAdd} USDT (10 BTC)`,
      JSON.stringify({
        admin_action: true,
        added_at: new Date().toISOString(),
        note: 'Initial admin balance'
      })
    );
    
    // Додаємо до ADMIN_IDS
    const adminIds = process.env.ADMIN_IDS || '';
    const telegramId = user.telegram_id.toString();
    
    if (!adminIds.includes(telegramId)) {
      const newAdminIds = adminIds ? `${adminIds},${telegramId}` : telegramId;
      console.log(`\n📝 Додайте до ADMIN_IDS в fly secrets:`);
      console.log(`fly secrets set ADMIN_IDS=${newAdminIds} --app auraslots\n`);
    } else {
      console.log(`✅ Користувач вже в ADMIN_IDS`);
    }
    
    console.log(`\n✅ Готово!`);
    console.log(`   - Користувач: @${username}`);
    console.log(`   - Telegram ID: ${user.telegram_id}`);
    console.log(`   - Новий баланс: ${newBalance} USDT`);
    console.log(`   - Транзакція створена`);
    
    if (!adminIds.includes(telegramId)) {
      console.log(`\n⚠️  Не забудьте додати Telegram ID до ADMIN_IDS!`);
    }
    
  } catch (error) {
    console.error('❌ Помилка:', error);
  }
}

addAdminUser();
