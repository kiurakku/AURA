// Bot messages translations
export const botMessages = {
  uk: {
    startRequired: 'Спочатку виконайте /start',
    bonusAlreadyClaimed: '⏰ Ви вже отримали щоденний бонус сьогодні!\n\nПоверніться завтра за новим бонусом 🎁',
    bonusReceived: (amount) => `🎁 *Щоденний бонус!*\n\nВи отримали ${amount} USDT на бонусний баланс!\n\nВикористайте їх для гри в казино!`,
    playNow: '🎰 Грати зараз',
    balance: (main, bonus, total, rank, wagered) => `💰 *Ваш баланс:*\n\n💵 Основний: ${main} USDT\n🎁 Бонусний: ${bonus} USDT\n📊 Загальний: ${total} USDT\n\n🏆 Ранг: ${rank}\n📈 Поставлено: ${wagered} USDT`,
    referral: (link, count, earned) => `👥 *Реферальна програма*\n\n🔗 Ваше посилання:\n\`${link}\`\n\n👤 Запрошено друзів: ${count}\n💰 Зароблено: ${earned} USDT\n\n💡 За кожного друга, який грає, ви отримуєте бонус!`,
    stats: (games, wins, winRate, wagered, won, profit, rank, xp) => `📊 *Ваша статистика:*\n\n🎮 Всього ігор: ${games}\n🏆 Виграшів: ${wins} (${winRate}%)\n💰 Поставлено: ${wagered} USDT\n🎁 Виграно: ${won} USDT\n📈 Чистий прибуток: ${profit} USDT\n\n🏆 Ранг: ${rank}\n⭐ XP: ${xp}`,
    deposit: '💳 *Поповнення балансу*\n\nДля поповнення балансу відкрийте казино та перейдіть у розділ "Гаманець".\n\nПідтримувані валюти:\n• USDT (TRC-20)\n• TON\n• BTC\n\nМінімальна сума поповнення: 1 USDT',
    withdraw: '💸 *Виведення коштів*\n\nДля виведення коштів відкрийте казино та перейдіть у розділ "Гаманець".\n\nМінімальна сума виведення: 1 USDT\n\nВиводи обробляються автоматично (до 24 годин для сум до 50 USDT).',
    games: '🎮 *Доступні ігри:*\n\n🚀 *Crash* - Вгадай момент виходу\n🎲 *Dice* - Більше чи менше\n💣 *Mines* - Знайди всі міни\n\n🌐 *Онлайн ігри:*\n⚔️ Telegram Battle\n🃏 Блекджек (Дурак)\n🚀 Cyber Crash\n❄️ Frost Dice\n🎡 Neon Roulette\n\nВсі ігри використовують Provably Fair алгоритм для чесності!',
    openCasino: '🎰 Відкрити казино',
    depositButton: '💳 Поповнити баланс',
    copyLink: '📋 Скопіювати посилання',
    share: '📤 Поділитися',
    languageChanged: (langName) => `✅ Мову змінено на ${langName}\n\nМова збережена і буде використовуватися в боті та додатку.`,
    currentLanguage: (langName) => `Поточна мова: ${langName}`,
    selectLanguage: 'Оберіть мову:',
    settings: '⚙️ *Налаштування:*\n\n🌐 Мова інтерфейсу',
    rank: (rankIcon, rankName, wagered, cashback, xp, nextRank, needed, progress) => {
      let text = `⭐ *Ваш ранг:* ${rankIcon} *${rankName}*\n\n`;
      text += `💰 Поставлено: ${wagered} USDT\n`;
      text += `💎 Кешбек: ${cashback}%\n`;
      text += `⭐ XP: ${xp}\n\n`;
      if (nextRank) {
        text += `📈 *До наступного рангу:*\n`;
        text += `${nextRank} - залишилось ${needed} USDT\n`;
        text += `Прогрес: ${progress}%`;
      } else {
        text += `🏆 Ви досягли максимального рангу!`;
      }
      return text;
    },
    leaderboard: (topUsers, userPosition) => {
      let text = '🏆 *Таблиця лідерів*\n\nТоп-10 гравців за сумою ставок:\n\n';
      topUsers.forEach((u, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        text += `${medal} ${u.rankIcon} ${u.name}\n`;
        text += `   💰 ${u.wagered} USDT | ⭐ ${u.xp} XP\n\n`;
      });
      text += `\n📍 Ваша позиція: #${userPosition}`;
      return text;
    },
    historyEmpty: '📜 *Історія транзакцій*\n\nУ вас поки немає транзакцій.\n\nПоповніть баланс або почніть грати!',
    history: (transactions) => {
      let text = '📜 *Останні транзакції:*\n\n';
      transactions.forEach((tx, index) => {
        text += `${index + 1}. ${tx.type} ${tx.status}\n`;
        text += `   ${tx.sign}${tx.amount} ${tx.currency}\n`;
        text += `   ${tx.date}\n\n`;
      });
      return text;
    },
    cashback: (rankIcon, rankName, rate) => `💎 *Кешбек система*\n\nВаш ранг: ${rankIcon} ${rankName}\nПоточна ставка кешбеку: *${rate}%*\n\nКешбек нараховується щопонеділка від суми програних коштів за минулий тиждень.\n\nРівні кешбеку:\n🟤 Newbie - 1%\n⚪ Gambler - 3%\n🟡 High Roller - 5%\n💎 Pro - 7%\n👑 Elite - 10%\n⭐ Aura Legend - 15%`
  },
  ru: {
    startRequired: 'Сначала выполните /start',
    bonusAlreadyClaimed: '⏰ Вы уже получили ежедневный бонус сегодня!\n\nВернитесь завтра за новым бонусом 🎁',
    bonusReceived: (amount) => `🎁 *Ежедневный бонус!*\n\nВы получили ${amount} USDT на бонусный баланс!\n\nИспользуйте их для игры в казино!`,
    playNow: '🎰 Играть сейчас',
    balance: (main, bonus, total, rank, wagered) => `💰 *Ваш баланс:*\n\n💵 Основной: ${main} USDT\n🎁 Бонусный: ${bonus} USDT\n📊 Общий: ${total} USDT\n\n🏆 Ранг: ${rank}\n📈 Поставлено: ${wagered} USDT`,
    referral: (link, count, earned) => `👥 *Реферальная программа*\n\n🔗 Ваша ссылка:\n\`${link}\`\n\n👤 Приглашено друзей: ${count}\n💰 Заработано: ${earned} USDT\n\n💡 За каждого друга, который играет, вы получаете бонус!`,
    stats: (games, wins, winRate, wagered, won, profit, rank, xp) => `📊 *Ваша статистика:*\n\n🎮 Всего игр: ${games}\n🏆 Выигрышей: ${wins} (${winRate}%)\n💰 Поставлено: ${wagered} USDT\n🎁 Выиграно: ${won} USDT\n📈 Чистая прибыль: ${profit} USDT\n\n🏆 Ранг: ${rank}\n⭐ XP: ${xp}`,
    deposit: '💳 *Пополнение баланса*\n\nДля пополнения баланса откройте казино и перейдите в раздел "Кошелек".\n\nПоддерживаемые валюты:\n• USDT (TRC-20)\n• TON\n• BTC\n\nМинимальная сумма пополнения: 1 USDT',
    withdraw: '💸 *Вывод средств*\n\nДля вывода средств откройте казино и перейдите в раздел "Кошелек".\n\nМинимальная сумма вывода: 1 USDT\n\nВыводы обрабатываются автоматически (до 24 часов для сумм до 50 USDT).',
    games: '🎮 *Доступные игры:*\n\n🚀 *Crash* - Угадай момент выхода\n🎲 *Dice* - Больше или меньше\n💣 *Mines* - Найди все мины\n\n🌐 *Онлайн игры:*\n⚔️ Telegram Battle\n🃏 Блекджек (Дурак)\n🚀 Cyber Crash\n❄️ Frost Dice\n🎡 Neon Roulette\n\nВсе игры используют Provably Fair алгоритм для честности!',
    openCasino: '🎰 Открыть казино',
    depositButton: '💳 Пополнить баланс',
    copyLink: '📋 Скопировать ссылку',
    share: '📤 Поделиться',
    languageChanged: (langName) => `✅ Язык изменен на ${langName}\n\nЯзык сохранен и будет использоваться в боте и приложении.`,
    currentLanguage: (langName) => `Текущий язык: ${langName}`,
    selectLanguage: 'Выберите язык:',
    settings: '⚙️ *Настройки:*\n\n🌐 Язык интерфейса',
    rank: (rankIcon, rankName, wagered, cashback, xp, nextRank, needed, progress) => {
      let text = `⭐ *Ваш ранг:* ${rankIcon} *${rankName}*\n\n`;
      text += `💰 Поставлено: ${wagered} USDT\n`;
      text += `💎 Кешбек: ${cashback}%\n`;
      text += `⭐ XP: ${xp}\n\n`;
      if (nextRank) {
        text += `📈 *До следующего ранга:*\n`;
        text += `${nextRank} - осталось ${needed} USDT\n`;
        text += `Прогресс: ${progress}%`;
      } else {
        text += `🏆 Вы достигли максимального ранга!`;
      }
      return text;
    },
    leaderboard: (topUsers, userPosition) => {
      let text = '🏆 *Таблица лидеров*\n\nТоп-10 игроков по сумме ставок:\n\n';
      topUsers.forEach((u, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        text += `${medal} ${u.rankIcon} ${u.name}\n`;
        text += `   💰 ${u.wagered} USDT | ⭐ ${u.xp} XP\n\n`;
      });
      text += `\n📍 Ваша позиция: #${userPosition}`;
      return text;
    },
    historyEmpty: '📜 *История транзакций*\n\nУ вас пока нет транзакций.\n\nПополните баланс или начните играть!',
    history: (transactions) => {
      let text = '📜 *Последние транзакции:*\n\n';
      transactions.forEach((tx, index) => {
        text += `${index + 1}. ${tx.type} ${tx.status}\n`;
        text += `   ${tx.sign}${tx.amount} ${tx.currency}\n`;
        text += `   ${tx.date}\n\n`;
      });
      return text;
    },
    cashback: (rankIcon, rankName, rate) => `💎 *Кешбек система*\n\nВаш ранг: ${rankIcon} ${rankName}\nТекущая ставка кешбека: *${rate}%*\n\nКешбек начисляется каждый понедельник от суммы проигранных средств за прошлую неделю.\n\nУровни кешбека:\n🟤 Newbie - 1%\n⚪ Gambler - 3%\n🟡 High Roller - 5%\n💎 Pro - 7%\n👑 Elite - 10%\n⭐ Aura Legend - 15%`
  },
  en: {
    startRequired: 'Please run /start first',
    bonusAlreadyClaimed: '⏰ You have already claimed today\'s daily bonus!\n\nCome back tomorrow for a new bonus 🎁',
    bonusReceived: (amount) => `🎁 *Daily Bonus!*\n\nYou received ${amount} USDT on your bonus balance!\n\nUse them to play in the casino!`,
    playNow: '🎰 Play Now',
    balance: (main, bonus, total, rank, wagered) => `💰 *Your Balance:*\n\n💵 Main: ${main} USDT\n🎁 Bonus: ${bonus} USDT\n📊 Total: ${total} USDT\n\n🏆 Rank: ${rank}\n📈 Wagered: ${wagered} USDT`,
    referral: (link, count, earned) => `👥 *Referral Program*\n\n🔗 Your link:\n\`${link}\`\n\n👤 Friends invited: ${count}\n💰 Earned: ${earned} USDT\n\n💡 For each friend who plays, you get a bonus!`,
    stats: (games, wins, winRate, wagered, won, profit, rank, xp) => `📊 *Your Statistics:*\n\n🎮 Total games: ${games}\n🏆 Wins: ${wins} (${winRate}%)\n💰 Wagered: ${wagered} USDT\n🎁 Won: ${won} USDT\n📈 Net profit: ${profit} USDT\n\n🏆 Rank: ${rank}\n⭐ XP: ${xp}`,
    deposit: '💳 *Deposit*\n\nTo deposit funds, open the casino and go to the "Wallet" section.\n\nSupported currencies:\n• USDT (TRC-20)\n• TON\n• BTC\n\nMinimum deposit: 1 USDT',
    withdraw: '💸 *Withdraw*\n\nTo withdraw funds, open the casino and go to the "Wallet" section.\n\nMinimum withdrawal: 1 USDT\n\nWithdrawals are processed automatically (within 24 hours for amounts up to 50 USDT).',
    games: '🎮 *Available Games:*\n\n🚀 *Crash* - Guess the exit moment\n🎲 *Dice* - More or less\n💣 *Mines* - Find all mines\n\n🌐 *Online Games:*\n⚔️ Telegram Battle\n🃏 Blackjack (Durak)\n🚀 Cyber Crash\n❄️ Frost Dice\n🎡 Neon Roulette\n\nAll games use Provably Fair algorithm for fairness!',
    openCasino: '🎰 Open Casino',
    depositButton: '💳 Deposit',
    copyLink: '📋 Copy Link',
    share: '📤 Share',
    languageChanged: (langName) => `✅ Language changed to ${langName}\n\nLanguage saved and will be used in bot and app.`,
    currentLanguage: (langName) => `Current language: ${langName}`,
    selectLanguage: 'Select language:',
    settings: '⚙️ *Settings:*\n\n🌐 Interface Language',
    rank: (rankIcon, rankName, wagered, cashback, xp, nextRank, needed, progress) => {
      let text = `⭐ *Your Rank:* ${rankIcon} *${rankName}*\n\n`;
      text += `💰 Wagered: ${wagered} USDT\n`;
      text += `💎 Cashback: ${cashback}%\n`;
      text += `⭐ XP: ${xp}\n\n`;
      if (nextRank) {
        text += `📈 *To Next Rank:*\n`;
        text += `${nextRank} - ${needed} USDT left\n`;
        text += `Progress: ${progress}%`;
      } else {
        text += `🏆 You've reached the maximum rank!`;
      }
      return text;
    },
    leaderboard: (topUsers, userPosition) => {
      let text = '🏆 *Leaderboard*\n\nTop 10 players by total wagered:\n\n';
      topUsers.forEach((u, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        text += `${medal} ${u.rankIcon} ${u.name}\n`;
        text += `   💰 ${u.wagered} USDT | ⭐ ${u.xp} XP\n\n`;
      });
      text += `\n📍 Your position: #${userPosition}`;
      return text;
    },
    historyEmpty: '📜 *Transaction History*\n\nYou have no transactions yet.\n\nDeposit funds or start playing!',
    history: (transactions) => {
      let text = '📜 *Recent Transactions:*\n\n';
      transactions.forEach((tx, index) => {
        text += `${index + 1}. ${tx.type} ${tx.status}\n`;
        text += `   ${tx.sign}${tx.amount} ${tx.currency}\n`;
        text += `   ${tx.date}\n\n`;
      });
      return text;
    },
    cashback: (rankIcon, rankName, rate) => `💎 *Cashback System*\n\nYour rank: ${rankIcon} ${rankName}\nCurrent cashback rate: *${rate}%*\n\nCashback is credited every Monday from the amount lost in the previous week.\n\nCashback levels:\n🟤 Newbie - 1%\n⚪ Gambler - 3%\n🟡 High Roller - 5%\n💎 Pro - 7%\n👑 Elite - 10%\n⭐ Aura Legend - 15%`
  }
};

export function getBotMessage(lang, key, ...args) {
  const messages = botMessages[lang] || botMessages['uk'];
  const message = messages[key];
  
  if (typeof message === 'function') {
    return message(...args);
  }
  
  return message || key;
}

export default { botMessages, getBotMessage };
