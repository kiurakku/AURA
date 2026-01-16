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
  // Use polling with error handling to prevent conflicts during deployments
  bot = new TelegramBot(token, { 
    polling: {
      interval: 300,
      autoStart: true,
      params: {
        timeout: 10
      }
    }
  });
  
  // Handle polling errors gracefully - ignore 409 conflicts during deployments
  bot.on('polling_error', (error) => {
    // Ignore 409 conflicts (multiple instances) - they're expected during deployments
    // This happens when old and new instances run simultaneously during Fly.io deployments
    if (error.code === 'ETELEGRAM' && error.response?.body?.error_code === 409) {
      // Silently ignore - this is normal during deployments
      return;
    }
    // Log other errors
    console.error('❌ Polling error:', error.message);
  });
  
  const db = await getDatabase();

  // Helper function to get rank icon
  function getRankIcon(rankName) {
    const icons = {
      'Newbie': '🟤',
      'Gambler': '⚪',
      'High Roller': '🟡',
      'Pro': '💎',
      'Elite': '👑',
      'Aura Legend': '⭐'
    };
    return icons[rankName] || '🟤';
  }

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
          
          // Award random referral bonus to referrer
          const referrerUser = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(referrer.telegram_id);
          if (referrerUser) {
            const { awardReferralBonus } = await import('../utils/referral-bonus.js');
            awardReferralBonus(db, referrerUser.id, referrer.telegram_id);
          }
        }
      }
    }

    // Create user if doesn't exist
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      const referralCode = crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO users (telegram_id, username, first_name, referral_code, balance, bonus_balance, total_wagered, total_xp, rank_id, rank_name)
        VALUES (?, ?, ?, ?, 0, 0, 0, 0, 1, 'Newbie')
      `).run(userId, msg.from.username, msg.from.first_name, referralCode);
      user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    }

    // Get user stats
    const balance = (user.balance || 0).toFixed(2);
    const bonusBalance = (user.bonus_balance || 0).toFixed(2);
    const totalWagered = (user.total_wagered || 0).toFixed(2);
    const rankName = user.rank_name || 'Newbie';
    const rankIcon = getRankIcon(rankName);
    
    // Get recent transactions count
    const recentTransactions = db.prepare(`
      SELECT COUNT(*) as count FROM transactions 
      WHERE user_id = ? AND created_at > datetime('now', '-7 days')
    `).get(user.id);
    const transactionCount = recentTransactions?.count || 0;

    // Get total games count
    const totalGames = db.prepare(`
      SELECT COUNT(*) as count FROM games WHERE user_id = ?
    `).get(user.id);
    const gamesCount = totalGames?.count || 0;

    // Build welcome message based on user language
    const lang = msg.from.language_code || 'uk';
    const messages = {
      uk: {
        welcome: '🎰 *Ласкаво просимо до AURA Casino!*',
        balance: 'Баланс',
        bonus: 'Бонусний баланс',
        rank: 'Ранг',
        stats: 'Статистика',
        history: 'Історія',
        settings: 'Налаштування',
        openCasino: '🎰 Відкрити казино'
      },
      ru: {
        welcome: '🎰 *Добро пожаловать в AURA Casino!*',
        balance: 'Баланс',
        bonus: 'Бонусный баланс',
        rank: 'Ранг',
        stats: 'Статистика',
        history: 'История',
        settings: 'Настройки',
        openCasino: '🎰 Открыть казино'
      },
      en: {
        welcome: '🎰 *Welcome to AURA Casino!*',
        balance: 'Balance',
        bonus: 'Bonus Balance',
        rank: 'Rank',
        stats: 'Statistics',
        history: 'History',
        settings: 'Settings',
        openCasino: '🎰 Open Casino'
      }
    };
    
    const t = messages[lang] || messages['uk'];
    
    const welcomeText = `${t.welcome}\n\n` +
      `👤 *${user.first_name || 'Гравець'}*\n\n` +
      `${t.balance}: *${balance} USDT*\n` +
      `${t.bonus}: *${bonusBalance} USDT*\n` +
      `${t.rank}: *${rankIcon} ${rankName}*\n` +
      `🎮 Ігор: *${gamesCount}*\n` +
      `💸 Ставок: *${totalWagered} USDT*\n` +
      `📜 Транзакцій (7 днів): *${transactionCount}*`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: t.openCasino, web_app: { url: webappUrl } }
        ],
        [
          { text: `💰 ${t.balance}`, callback_data: 'show_balance' },
          { text: `📊 ${t.stats}`, callback_data: 'show_stats' }
        ],
        [
          { text: `⭐ ${t.rank}`, callback_data: 'show_rank' },
          { text: `📜 ${t.history}`, callback_data: 'show_history' }
        ],
        [
          { text: `⚙️ ${t.settings}`, callback_data: 'show_settings' }
        ]
      ]
    };

    // Send photo with message
    const baseUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://auraslots.fly.dev';
    const photoPath = process.env.START_PHOTO_URL || `${baseUrl}/materials/Start.jpeg`;
    
    try {
      // Try to send photo first
      await bot.sendPhoto(chatId, photoPath, {
        caption: welcomeText,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
      console.log('✅ Photo sent successfully:', photoPath);
    } catch (error) {
      // If photo fails, send text only
      console.log('⚠️ Failed to send photo, sending text only:', error.message);
      console.log('Photo path was:', photoPath);
      bot.sendMessage(chatId, welcomeText, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    }
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
    const keyboard = {
      inline_keyboard: [[
        { text: '🎰 Відкрити казино', web_app: { url: webappUrl } }
      ]]
    };
    bot.sendMessage(chatId,
      '📖 *Доступні команди:*\n\n' +
      '💰 *Фінанси:*\n' +
      '/balance - Перевірити баланс\n' +
      '/deposit - Поповнити баланс\n' +
      '/withdraw - Вивести кошти\n' +
      '/history - Історія транзакцій\n\n' +
      '🎮 *Ігри та статистика:*\n' +
      '/games - Список ігор\n' +
      '/stats - Ваша статистика\n' +
      '/rank - Інформація про ранг\n' +
      '/leaderboard - Таблиця лідерів\n\n' +
      '🎁 *Бонуси та реферали:*\n' +
      '/bonus - Щоденний бонус\n' +
      '/referral - Реферальна програма\n' +
      '/cashback - Інформація про кешбек\n\n' +
      'ℹ️ *Інформація:*\n' +
      '/rules - Правила гри\n' +
      '/faq - Часті питання\n' +
      '/support - Підтримка\n\n' +
      '🎰 Для гри використовуйте кнопку нижче',
      { 
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Balance command
  bot.onText(/\/balance/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      return bot.sendMessage(chatId, 'Спочатку виконайте /start');
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
      '💰 *Ваш баланс:*\n\n' +
      `💵 Основний: ${(user.balance || 0).toFixed(2)} USDT\n` +
      `🎁 Бонусний: ${(user.bonus_balance || 0).toFixed(2)} USDT\n` +
      `📊 Загальний: ${((user.balance || 0) + (user.bonus_balance || 0)).toFixed(2)} USDT\n\n` +
      `🏆 Ранг: ${user.rank_name || 'Newbie'}\n` +
      `📈 Поставлено: ${(user.total_wagered || 0).toFixed(2)} USDT`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Referral command
  bot.onText(/\/referral/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      return bot.sendMessage(chatId, 'Спочатку виконайте /start');
    }

    const referralLink = `https://t.me/${bot.options.username || 'aurasfroxbot'}?start=ref_${user.referral_code}`;
    const referrals = db.prepare('SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ?').get(userId);
    const referralCount = referrals?.count || 0;

    const keyboard = {
      inline_keyboard: [[
        {
          text: '📋 Скопіювати посилання',
          callback_data: `copy_ref_${user.referral_code}`
        },
        {
          text: '📤 Поділитися',
          switch_inline_query: `Приєднуйся до AURA Casino та отримуй бонуси! ${referralLink}`
        }
      ], [
        {
          text: '🎰 Відкрити казино',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId,
      '👥 *Реферальна програма*\n\n' +
      `🔗 Ваше посилання:\n\`${referralLink}\`\n\n` +
      `👤 Запрошено друзів: ${referralCount}\n` +
      `💰 Зароблено: ${(user.bonus_balance || 0).toFixed(2)} USDT\n\n` +
      '💡 За кожного друга, який грає, ви отримуєте бонус!',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Stats command
  bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      return bot.sendMessage(chatId, 'Спочатку виконайте /start');
    }

    const games = db.prepare('SELECT * FROM games WHERE user_id = ?').all(user.id);
    const totalGames = games.length;
    const totalWins = games.filter(g => g.win_amount > 0).length;
    const totalWagered = user.total_wagered || 0;
    const totalWon = games.reduce((sum, g) => sum + (g.win_amount || 0), 0);
    const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0;

    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎰 Грати зараз',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId,
      '📊 *Ваша статистика:*\n\n' +
      `🎮 Всього ігор: ${totalGames}\n` +
      `🏆 Виграшів: ${totalWins} (${winRate}%)\n` +
      `💰 Поставлено: ${totalWagered.toFixed(2)} USDT\n` +
      `🎁 Виграно: ${totalWon.toFixed(2)} USDT\n` +
      `📈 Чистий прибуток: ${(totalWon - totalWagered).toFixed(2)} USDT\n\n` +
      `🏆 Ранг: ${user.rank_name || 'Newbie'}\n` +
      `⭐ XP: ${user.total_xp || 0}`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Deposit command
  bot.onText(/\/deposit/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      return bot.sendMessage(chatId, 'Спочатку виконайте /start');
    }

    const keyboard = {
      inline_keyboard: [[
        {
          text: '💳 Поповнити баланс',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId,
      '💳 *Поповнення балансу*\n\n' +
      'Для поповнення балансу відкрийте казино та перейдіть у розділ "Гаманець".\n\n' +
      'Підтримувані валюти:\n' +
      '• USDT (TRC-20)\n' +
      '• TON\n' +
      '• BTC\n\n' +
      'Мінімальна сума поповнення: 1 USDT',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Withdraw command
  bot.onText(/\/withdraw/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      return bot.sendMessage(chatId, 'Спочатку виконайте /start');
    }

    const totalBalance = (user.balance || 0) + (user.bonus_balance || 0);
    const keyboard = {
      inline_keyboard: [[
        {
          text: '💸 Вивести кошти',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId,
      '💸 *Виведення коштів*\n\n' +
      `💰 Доступно для виведення: ${totalBalance.toFixed(2)} USDT\n\n` +
      'Для виведення коштів відкрийте казино та перейдіть у розділ "Гаманець".\n\n' +
      'Мінімальна сума виведення: 5 USDT\n' +
      'Час обробки: від 5 хвилин до 24 годин',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Games command
  bot.onText(/\/games/, async (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎰 Відкрити казино',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId,
      '🎮 *Доступні ігри:*\n\n' +
      '🚀 *Crash* - Вгадай момент виходу\n' +
      '🎲 *Dice* - Більше чи менше\n' +
      '💣 *Mines* - Знайди всі міни\n\n' +
      '🌐 *Онлайн ігри:*\n' +
      '⚔️ Telegram Battle\n' +
      '🃏 Блекджек (Дурак)\n' +
      '🚀 Cyber Crash\n' +
      '❄️ Frost Dice\n' +
      '🎡 Neon Roulette\n\n' +
      'Всі ігри використовують Provably Fair алгоритм для чесності!',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Rank command
  bot.onText(/\/rank/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      return bot.sendMessage(chatId, 'Спочатку виконайте /start');
    }

    const rankIcon = getRankIcon(user.rank_name || 'Newbie');
    const totalWagered = user.total_wagered || 0;
    
    // Calculate next rank
    const ranks = [
      { name: 'Newbie', turnover: 0, cashback: 1 },
      { name: 'Gambler', turnover: 500, cashback: 3 },
      { name: 'High Roller', turnover: 5000, cashback: 5 },
      { name: 'Pro', turnover: 10000, cashback: 7 },
      { name: 'Elite', turnover: 25000, cashback: 10 },
      { name: 'Aura Legend', turnover: 50000, cashback: 15 }
    ];
    
    let currentRankIndex = 0;
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (totalWagered >= ranks[i].turnover) {
        currentRankIndex = i;
        break;
      }
    }
    
    const currentRank = ranks[currentRankIndex];
    const nextRank = currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : null;
    const neededForNext = nextRank ? nextRank.turnover - totalWagered : 0;
    const progress = nextRank ? ((totalWagered - currentRank.turnover) / (nextRank.turnover - currentRank.turnover) * 100).toFixed(1) : 100;

    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎰 Грати зараз',
          web_app: { url: webappUrl }
        }
      ]]
    };

    let rankText = `⭐ *Ваш ранг:* ${rankIcon} *${user.rank_name || 'Newbie'}*\n\n`;
    rankText += `💰 Поставлено: ${totalWagered.toFixed(2)} USDT\n`;
    rankText += `💎 Кешбек: ${currentRank.cashback}%\n`;
    rankText += `⭐ XP: ${user.total_xp || 0}\n\n`;
    
    if (nextRank) {
      rankText += `📈 *До наступного рангу:*\n`;
      rankText += `${nextRank.name} - залишилось ${neededForNext.toFixed(2)} USDT\n`;
      rankText += `Прогрес: ${progress}%`;
    } else {
      rankText += `🏆 Ви досягли максимального рангу!`;
    }

    bot.sendMessage(chatId, rankText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  });

  // Leaderboard command
  bot.onText(/\/leaderboard/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      return bot.sendMessage(chatId, 'Спочатку виконайте /start');
    }

    // Get top 10 users by total_wagered
    const topUsers = db.prepare(`
      SELECT telegram_id, first_name, username, total_wagered, rank_name, total_xp
      FROM users
      ORDER BY total_wagered DESC
      LIMIT 10
    `).all();

    let leaderboardText = '🏆 *Таблиця лідерів*\n\n';
    leaderboardText += 'Топ-10 гравців за сумою ставок:\n\n';

    topUsers.forEach((u, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      const rankIcon = getRankIcon(u.rank_name || 'Newbie');
      const name = u.first_name || u.username || 'Гравець';
      leaderboardText += `${medal} ${rankIcon} ${name}\n`;
      leaderboardText += `   💰 ${(u.total_wagered || 0).toFixed(2)} USDT | ⭐ ${u.total_xp || 0} XP\n\n`;
    });

    // Find user position
    const userPosition = db.prepare(`
      SELECT COUNT(*) + 1 as position
      FROM users
      WHERE total_wagered > ?
    `).get(user.total_wagered || 0);

    leaderboardText += `\n📍 Ваша позиція: #${userPosition?.position || '?'}`;

    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎰 Грати зараз',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId, leaderboardText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  });

  // History command
  bot.onText(/\/history/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      return bot.sendMessage(chatId, 'Спочатку виконайте /start');
    }

    const transactions = db.prepare(`
      SELECT * FROM transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `).all(user.id);

    if (transactions.length === 0) {
      return bot.sendMessage(chatId,
        '📜 *Історія транзакцій*\n\n' +
        'У вас поки немає транзакцій.\n\n' +
        'Поповніть баланс або почніть грати!',
        { parse_mode: 'Markdown' }
      );
    }

    let historyText = '📜 *Останні транзакції:*\n\n';
    transactions.forEach((tx, index) => {
      const date = new Date(tx.created_at).toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
      const amount = parseFloat(tx.amount || 0).toFixed(2);
      const type = tx.type === 'deposit' ? '💵 Поповнення' :
                   tx.type === 'withdraw' ? '💸 Виведення' :
                   tx.type === 'admin_bonus' ? '🎁 Поповнення від Aura Team' :
                   tx.type === 'daily_bonus' ? '🎁 Щоденний бонус' :
                   tx.type === 'game_win' ? '🎉 Виграш' :
                   tx.type === 'game_bet' ? '🎮 Ставка' : '📝 Інше';
      const status = tx.status === 'completed' ? '✅' : tx.status === 'pending' ? '⏳' : '❌';
      const sign = (tx.type === 'deposit' || tx.type === 'admin_bonus' || tx.type === 'daily_bonus' || tx.type === 'game_win') ? '+' : '-';
      historyText += `${index + 1}. ${type} ${status}\n   ${sign}${amount} ${tx.currency || 'USDT'}\n   ${date}\n\n`;
    });

    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎰 Відкрити казино',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId, historyText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  });

  // Cashback command
  bot.onText(/\/cashback/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
    if (!user) {
      return bot.sendMessage(chatId, 'Спочатку виконайте /start');
    }

    const rankIcon = getRankIcon(user.rank_name || 'Newbie');
    const totalWagered = user.total_wagered || 0;
    
    // Calculate cashback rate based on rank
    let cashbackRate = 1;
    if (totalWagered >= 50000) cashbackRate = 15;
    else if (totalWagered >= 25000) cashbackRate = 10;
    else if (totalWagered >= 10000) cashbackRate = 7;
    else if (totalWagered >= 5000) cashbackRate = 5;
    else if (totalWagered >= 500) cashbackRate = 3;
    else cashbackRate = 1;

    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎰 Відкрити казино',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId,
      `💎 *Кешбек система*\n\n` +
      `Ваш ранг: ${rankIcon} ${user.rank_name || 'Newbie'}\n` +
      `Поточна ставка кешбеку: *${cashbackRate}%*\n\n` +
      `Кешбек нараховується щопонеділка від суми програних коштів за минулий тиждень.\n\n` +
      `Рівні кешбеку:\n` +
      `🟤 Newbie - 1%\n` +
      `⚪ Gambler - 3%\n` +
      `🟡 High Roller - 5%\n` +
      `💎 Pro - 7%\n` +
      `👑 Elite - 10%\n` +
      `⭐ Aura Legend - 15%`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Rules command
  bot.onText(/\/rules/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎰 Відкрити казино',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId,
      '📜 *Правила AURA Casino*\n\n' +
      '1️⃣ *Вік:*\n' +
      'Вам має бути 18+ років для гри\n\n' +
      '2️⃣ *Бонусна політика:*\n' +
      '• Wagering x35: Будь-який бонус має бути проставлений 35 разів перед виводом\n' +
      '• Anti-Abuse: Створення мульти-акаунтів веде до блокування\n\n' +
      '3️⃣ *Ліміти:*\n' +
      '• Мінімальний вивід: 5 USDT\n' +
      '• Час обробки: від 5 хвилин до 24 годин\n' +
      '• Максимальний вивід за 24 години: 10,000 USDT\n\n' +
      '4️⃣ *Provably Fair:*\n' +
      'Всі ігри використовують Provably Fair алгоритм для перевірки чесності\n\n' +
      '5️⃣ *Відповідальність:*\n' +
      'Грайте відповідально. Казино не несе відповідальності за залежність від азартних ігор.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // FAQ command
  bot.onText(/\/faq/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
      inline_keyboard: [[
        {
          text: '🎰 Відкрити казино',
          web_app: { url: webappUrl }
        },
        {
          text: '💬 Підтримка',
          url: 'https://t.me/your_support_bot'
        }
      ]]
    };

    bot.sendMessage(chatId,
      '❓ *Часті питання (FAQ)*\n\n' +
      '❓ *Як поповнити баланс?*\n' +
      'Відкрийте казино → Гаманець → Поповнити. Підтримуються USDT, TON, BTC.\n\n' +
      '❓ *Як вивести кошти?*\n' +
      'Відкрийте казино → Гаманець → Вивести. Мінімум 5 USDT.\n\n' +
      '❓ *Що таке Provably Fair?*\n' +
      'Це система, яка дозволяє перевірити чесність кожної гри через хеш.\n\n' +
      '❓ *Як працює реферальна система?*\n' +
      'Запрошуйте друзів через ваше реферальне посилання. За кожного друга ви отримуєте бонус!\n\n' +
      '❓ *Як отримати щоденний бонус?*\n' +
      'Виконайте команду /bonus один раз на день.\n\n' +
      '❓ *Що таке кешбек?*\n' +
      'Повернення відсотка від програних коштів. Нараховується щопонеділка.\n\n' +
      '❓ *Як підвищити ранг?*\n' +
      'Ранг залежить від суми ставок. Більше грайте, щоб підвищити ранг!\n\n' +
      '💬 Якщо у вас є інші питання, зверніться до підтримки.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
    );
  });

  // Support command
  bot.onText(/\/support/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
      inline_keyboard: [[
        {
          text: '💬 Написати в підтримку',
          url: 'https://t.me/your_support_bot'
        },
        {
          text: '🎰 Відкрити казино',
          web_app: { url: webappUrl }
        }
      ]]
    };

    bot.sendMessage(chatId,
      '💬 *Підтримка AURA Casino*\n\n' +
      'Якщо у вас виникли питання або проблеми:\n\n' +
      '📧 Email: support@auraslots.com\n' +
      '💬 Telegram: @your_support_bot\n' +
      '⏰ Час роботи: 24/7\n\n' +
      'Ми завжди готові допомогти!',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }
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
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    
    bot.answerCallbackQuery(query.id);
    
    if (data === 'open_webapp') {
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
    } else if (data.startsWith('copy_ref_')) {
      const refCode = data.replace('copy_ref_', '');
      const referralLink = `https://t.me/${bot.options.username || 'aurasfroxbot'}?start=ref_${refCode}`;
      bot.sendMessage(chatId, 
        `📋 *Посилання скопійовано!*\n\n` +
        `Ваше реферальне посилання:\n\`${referralLink}\`\n\n` +
        `Поділіться ним з друзями!`,
        { parse_mode: 'Markdown' }
      );
    } else if (data.startsWith('copy_code_')) {
      const code = data.replace('copy_code_', '');
      bot.sendMessage(chatId,
        `📋 *Код скопійовано!*\n\n` +
        `Код підтвердження:\n\`${code}\``,
        { parse_mode: 'Markdown' }
      );
    } else if (data === 'show_balance') {
      const userId = query.from.id;
      const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
      if (user) {
        bot.sendMessage(chatId,
          `💰 *Ваш баланс:*\n\n` +
          `💵 Основний: *${(user.balance || 0).toFixed(2)} USDT*\n` +
          `🎁 Бонусний: *${(user.bonus_balance || 0).toFixed(2)} USDT*\n` +
          `📊 Загальний: *${((user.balance || 0) + (user.bonus_balance || 0)).toFixed(2)} USDT*`,
          { parse_mode: 'Markdown' }
        );
      }
    } else if (data === 'show_stats') {
      const userId = query.from.id;
      const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
      if (user) {
        const games = db.prepare('SELECT * FROM games WHERE user_id = ?').all(user.id);
        const totalGames = games.length;
        const totalWins = games.filter(g => g.win_amount > 0).length;
        const totalWon = games.reduce((sum, g) => sum + (g.win_amount || 0), 0);
        const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0;
        
        bot.sendMessage(chatId,
          `📊 *Ваша статистика:*\n\n` +
          `🎮 Всього ігор: *${totalGames}*\n` +
          `🏆 Виграшів: *${totalWins}* (${winRate}%)\n` +
          `💰 Поставлено: *${(user.total_wagered || 0).toFixed(2)} USDT*\n` +
          `🎁 Виграно: *${totalWon.toFixed(2)} USDT*\n` +
          `📈 Чистий прибуток: *${(totalWon - (user.total_wagered || 0)).toFixed(2)} USDT*\n` +
          `⭐ XP: *${user.total_xp || 0}*`,
          { parse_mode: 'Markdown' }
        );
      }
    } else if (data === 'show_rank') {
      const userId = query.from.id;
      const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
      if (user) {
        const rankIcon = getRankIcon(user.rank_name || 'Newbie');
        bot.sendMessage(chatId,
          `⭐ *Ваш ранг:*\n\n` +
          `🏆 ${rankIcon} *${user.rank_name || 'Newbie'}*\n` +
          `💰 Поставлено: *${(user.total_wagered || 0).toFixed(2)} USDT*\n` +
          `⭐ XP: *${user.total_xp || 0}*`,
          { parse_mode: 'Markdown' }
        );
      }
    } else if (data === 'show_history') {
      const userId = query.from.id;
      const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
      if (user) {
        const transactions = db.prepare(`
          SELECT * FROM transactions 
          WHERE user_id = ? 
          ORDER BY created_at DESC 
          LIMIT 10
        `).all(user.id);
        
        if (transactions.length === 0) {
          bot.sendMessage(chatId, '📜 *Історія транзакцій:*\n\nНемає транзакцій', { parse_mode: 'Markdown' });
        } else {
          let historyText = '📜 *Останні транзакції:*\n\n';
          transactions.forEach((tx, index) => {
            const date = new Date(tx.created_at).toLocaleDateString('uk-UA');
            const amount = parseFloat(tx.amount || 0).toFixed(2);
            const type = tx.type === 'deposit' ? '💵 Поповнення' : 
                        tx.type === 'withdraw' ? '💸 Виведення' :
                        tx.type === 'admin_bonus' ? '🎁 Поповнення від Aura Team' :
                        tx.type === 'daily_bonus' ? '🎁 Щоденний бонус' :
                        tx.type === 'game_win' ? '🎉 Виграш' :
                        tx.type === 'game_bet' ? '🎮 Ставка' : '📝 Інше';
            const status = tx.status === 'completed' ? '✅' : tx.status === 'pending' ? '⏳' : '❌';
            historyText += `${index + 1}. ${type} ${status}\n   ${amount} ${tx.currency || 'USDT'}\n   ${date}\n\n`;
          });
          bot.sendMessage(chatId, historyText, { parse_mode: 'Markdown' });
        }
      }
    } else if (data === 'show_settings') {
      const userId = query.from.id;
      const lang = query.from.language_code || 'uk';
      const languages = {
        uk: { name: 'Українська', code: 'uk' },
        ru: { name: 'Русский', code: 'ru' },
        en: { name: 'English', code: 'en' }
      };
      
      const keyboard = {
        inline_keyboard: [
          [
            { text: '🇺🇦 Українська', callback_data: 'set_lang_uk' },
            { text: '🇷🇺 Русский', callback_data: 'set_lang_ru' },
            { text: '🇬🇧 English', callback_data: 'set_lang_en' }
          ],
          [
            { text: '🎰 Відкрити казино', web_app: { url: webappUrl } }
          ]
        ]
      };
      
      bot.sendMessage(chatId,
        `⚙️ *Налаштування:*\n\n` +
        `🌐 Мова інтерфейсу\n` +
        `Поточна мова: ${languages[lang]?.name || 'Українська'}\n\n` +
        `Оберіть мову:`,
        { parse_mode: 'Markdown', reply_markup: keyboard }
      );
    } else if (data.startsWith('set_lang_')) {
      const lang = data.replace('set_lang_', '');
      bot.sendMessage(chatId,
        `✅ Мову змінено на ${lang === 'uk' ? '🇺🇦 Українська' : lang === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English'}\n\n` +
        `Мова зберігається в WebApp. Відкрийте казино для застосування.`,
        { parse_mode: 'Markdown' }
      );
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
