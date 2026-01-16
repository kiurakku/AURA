import TelegramBot from 'node-telegram-bot-api';
import crypto from 'crypto';
import { getDatabase } from '../database/db.js';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const webappUrl = process.env.TELEGRAM_WEBAPP_URL;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set');
}

let bot = null;

export async function initBot() {
  bot = new TelegramBot(token, { polling: true });
  const db = await getDatabase();

  // Start command
  bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const referralCode = match[1]?.trim().replace('ref_', '') || null;

    // Handle referral
    if (referralCode) {
      const referrer = db.prepare('SELECT telegram_id FROM users WHERE referral_code = ?').get(referralCode);
      if (referrer && referrer.telegram_id !== userId) {
        // Check if user exists
        let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
        if (!user) {
          // Create user with referral
          const newRefCode = crypto.randomBytes(8).toString('hex');
          db.prepare(`
            INSERT INTO users (telegram_id, username, first_name, referral_code, referred_by)
            VALUES (?, ?, ?, ?, ?)
          `).run(userId, msg.from.username, msg.from.first_name, newRefCode, referrer.telegram_id);
          
          // Create referral record
          db.prepare(`
            INSERT OR IGNORE INTO referrals (referrer_id, referred_id)
            VALUES (?, ?)
          `).run(referrer.telegram_id, userId);
          
          // Give bonus to referrer
          const referrerUser = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(referrer.telegram_id);
          if (referrerUser) {
            db.prepare(`
              UPDATE users SET bonus_balance = bonus_balance + ? WHERE telegram_id = ?
            `).run(1.0, referrer.telegram_id);
          }
        }
      }
    }

    // Create user if doesn't exist
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      const referralCode = crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO users (telegram_id, username, first_name, referral_code)
        VALUES (?, ?, ?, ?)
      `).run(userId, msg.from.username, msg.from.first_name, referralCode);
    }

    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎰 Відкрити казино',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId, 
      '🎰 *Ласкаво просимо до AURA Casino!*\n\n' +
      '🎲 Грайте в найкращі ігри\n' +
      '💰 Вигравайте реальні призи\n' +
      '🚀 Швидкі виплати\n\n' +
      'Натисніть кнопку нижче, щоб почати!',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Bonus command
  bot.onText(/\/bonus/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      return bot.sendMessage(chatId, 'Спочатку виконайте /start');
    }

    // Check if already claimed today
    const today = new Date().toISOString().split('T')[0];
    const lastBonus = db.prepare(`
      SELECT * FROM transactions 
      WHERE user_id = ? AND type = 'daily_bonus' AND date(created_at) = ?
    `).get(userId, today);

    if (lastBonus) {
      return bot.sendMessage(chatId, 
        '⏰ Ви вже отримали щоденний бонус сьогодні!\n\n' +
        'Поверніться завтра за новим бонусом 🎁'
      );
    }

    // Give bonus
    const bonusAmount = 1.0;
    db.prepare('UPDATE users SET bonus_balance = bonus_balance + ? WHERE telegram_id = ?')
      .run(bonusAmount, userId);
    
    db.prepare(`
      INSERT INTO transactions (user_id, type, amount, status, description)
      VALUES (?, 'daily_bonus', ?, 'completed', 'Daily bonus')
    `).run(userId, bonusAmount);

    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎰 Грати зараз',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId,
      `🎁 *Щоденний бонус!*\n\n` +
      `Ви отримали ${bonusAmount} USDT на бонусний баланс!\n\n` +
      `Використайте їх для гри в казино!`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,
      '📖 *Доступні команди:*\n\n' +
      '/start - Почати роботу з ботом\n' +
      '/bonus - Отримати щоденний бонус\n' +
      '/help - Показати цю довідку\n\n' +
      '🎰 Для гри використовуйте кнопку "Відкрити казино"',
      { parse_mode: 'Markdown' }
    );
  });

  // Verify command - Generate owner verification code (one-time use)
  bot.onText(/\/verify/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Check if user is admin
    const user = db.prepare('SELECT is_admin FROM users WHERE telegram_id = ?').get(userId);
    if (!user || !user.is_admin) {
      return bot.sendMessage(chatId, 
        '❌ Доступ заборонено. Ця команда доступна тільки для власника.'
      );
    }

    // Generate one-time verification code
    const verificationCode = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour
    
    // Store verification code (in settings or separate table)
    db.prepare(`
      INSERT OR REPLACE INTO settings (key, value, updated_at)
      VALUES ('owner_verification_code', ?, CURRENT_TIMESTAMP)
    `).run(JSON.stringify({
      code: verificationCode,
      expiresAt: expiresAt.toISOString(),
      used: false,
      generatedBy: userId
    }));

    bot.sendMessage(chatId,
      '✅ *Код підтвердження власника згенеровано*\n\n' +
      `🔐 Код: \`${verificationCode}\`\n\n` +
      `⏰ Дійсний до: ${expiresAt.toLocaleString('uk-UA')}\n\n` +
      '⚠️ Цей код можна використати один раз для підтвердження права власності.',
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            {
              text: '📋 Скопіювати код',
              callback_data: `copy_code_${verificationCode}`
            }
          ]]
        }
      }
    );
  });

  // Handle callback queries
  bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    bot.answerCallbackQuery(query.id);
    
    if (query.data === 'open_webapp') {
      const keyboard = {
        inline_keyboard: [[
          {
            text: '🎰 Відкрити казино',
            web_app: { url: webappUrl }
          }
        ]]
      };
      bot.sendMessage(chatId, 'Натисніть кнопку нижче, щоб відкрити казино:', {
        reply_markup: keyboard
      });
    }
  });

  console.log('✅ Telegram bot is running');
  return bot;
}

export function getBot() {
  return bot;
}

// Send notification to user
export function sendNotification(userId, message, options = {}) {
  if (!bot) return;
  
  try {
    bot.sendMessage(userId, message, options);
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}
