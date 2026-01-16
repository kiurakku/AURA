import express from 'express';
import crypto from 'crypto';
import { getDatabase } from '../database/db.js';
import { validateTelegramWebApp, parseUserData, isAuthDataRecent } from '../utils/telegram-validator.js';
import { 
  calculateCrashMultiplier, 
  calculateDiceResult, 
  calculateMinesPositions,
  generateServerSeed,
  generateClientSeed,
  createResultHash
} from '../utils/game-engine.js';
import { calculateRank, calculateXP, getProgressToNextRank } from '../utils/ranks.js';
import { updateUserRankAndXP } from '../utils/updateUserRank.js';

const router = express.Router();
let db = null;

// Initialize database
getDatabase().then(database => {
  db = database;
});

// Middleware to validate Telegram WebApp
function validateTelegramAuth(req, res, next) {
  const initData = req.headers['x-telegram-init-data'] || req.body.initData;
  
  if (!initData) {
    console.error('❌ Missing initData in request:', {
      headers: Object.keys(req.headers),
      hasBody: !!req.body,
      url: req.url
    });
    return res.status(401).json({ error: 'Missing Telegram initData' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('❌ Bot token not configured');
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    if (!validateTelegramWebApp(initData, botToken)) {
      console.error('❌ Invalid Telegram auth data:', {
        initDataLength: initData.length,
        hasHash: initData.includes('hash=')
      });
      return res.status(401).json({ error: 'Invalid Telegram auth data' });
    }

    const userData = parseUserData(initData);
    if (!userData) {
      console.error('❌ Failed to parse user data from initData');
      return res.status(401).json({ error: 'Failed to parse user data' });
    }

    if (!isAuthDataRecent(initData)) {
      console.error('❌ Auth data expired');
      return res.status(401).json({ error: 'Auth data expired' });
    }

    req.user = userData;
    next();
  } catch (error) {
    console.error('❌ Auth validation error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

// Auth endpoint
router.post('/auth', async (req, res) => {
  try {
    // Try to get initData from body or headers
    const initData = req.body.initData || req.headers['x-telegram-init-data'];
    
    if (!initData) {
      console.error('❌ /auth: Missing initData', {
        hasBody: !!req.body,
        hasHeaders: !!req.headers['x-telegram-init-data'],
        headers: Object.keys(req.headers)
      });
      return res.status(400).json({ error: 'Missing initData' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('❌ /auth: Bot token not configured');
      return res.status(500).json({ error: 'Bot token not configured' });
    }

    if (!validateTelegramWebApp(initData, botToken)) {
      console.error('❌ /auth: Invalid Telegram auth data');
      return res.status(401).json({ error: 'Invalid Telegram auth data' });
    }

    if (!isAuthDataRecent(initData)) {
      console.error('❌ /auth: Auth data expired');
      return res.status(401).json({ error: 'Auth data expired' });
    }

    if (!db) db = await getDatabase();
    
    const userData = parseUserData(initData);
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userData.id);

    if (!user) {
      // Create new user
      const referralCode = crypto.randomBytes(8).toString('hex');
      // Try to get referral from start_param or startapp parameter
      const params = new URLSearchParams(initData);
      const startParam = params.get('start_param') || params.get('startapp') || null;
      const referredBy = startParam?.replace('ref_', '') || null;
      
      let referrerId = null;
      if (referredBy) {
        const referrer = db.prepare('SELECT * FROM users WHERE referral_code = ?').get(referredBy);
        if (referrer) {
          referrerId = referrer.id;
        }
      }

      // Try to get photo from Telegram Bot API if not in initData
      let photoUrl = userData.photo_url;
      if (!photoUrl && process.env.TELEGRAM_BOT_TOKEN) {
        try {
          const TelegramBot = (await import('node-telegram-bot-api')).default;
          const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
          const photos = await bot.getUserProfilePhotos(userData.id, { limit: 1 });
          if (photos.total_count > 0 && photos.photos[0] && photos.photos[0][0]) {
            const fileId = photos.photos[0][0].file_id;
            const file = await bot.getFile(fileId);
            photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
          }
        } catch (error) {
          console.log('Could not fetch photo from Telegram API:', error.message);
        }
      }

      db.prepare(`
        INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, referral_code, referred_by, balance, bonus_balance, total_wagered, total_xp, rank_id, rank_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 1, 'Newbie')
      `).run(
        userData.id,
        userData.username || null,
        userData.first_name || 'User',
        userData.last_name || null,
        photoUrl || null,
        referralCode,
        referrerId
      );

      user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userData.id);
      
      // Give welcome bonus and referral bonus
      if (referrerId) {
        // Get referrer info
        const referrer = db.prepare('SELECT * FROM users WHERE id = ?').get(referrerId);
        
        if (referrer) {
          // Create referral record
          db.prepare(`
            INSERT OR IGNORE INTO referrals (referrer_id, referred_id)
            VALUES (?, ?)
          `).run(referrerId, user.id);
          
          // Give welcome bonus to new user
          const welcomeBonus = 1.0;
          db.prepare('UPDATE users SET bonus_balance = bonus_balance + ? WHERE telegram_id = ?').run(welcomeBonus, userData.id);
          
          // Create transaction for welcome bonus
          db.prepare(`
            INSERT INTO transactions (user_id, type, amount, currency, status, description)
            VALUES (?, 'welcome_bonus', ?, 'USDT', 'completed', 'Вітальний бонус за реєстрацію')
          `).run(user.id, welcomeBonus);
          
          // Award random referral bonus to referrer
          const { awardReferralBonus } = await import('../utils/referral-bonus.js');
          awardReferralBonus(db, referrerId, referrer.telegram_id);
        }
      }
    } else {
      // Update user info - get fresh photo_url from Telegram if available
      let photoUrl = userData.photo_url || user.photo_url;
      
      // Try to get photo from Telegram Bot API if not in initData
      if (!photoUrl && process.env.TELEGRAM_BOT_TOKEN) {
        try {
          const TelegramBot = (await import('node-telegram-bot-api')).default;
          const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
          const photos = await bot.getUserProfilePhotos(userData.id, { limit: 1 });
          if (photos.total_count > 0 && photos.photos[0] && photos.photos[0][0]) {
            const fileId = photos.photos[0][0].file_id;
            const file = await bot.getFile(fileId);
            photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
          }
        } catch (error) {
          console.log('Could not fetch photo from Telegram API:', error.message);
        }
      }
      
      db.prepare(`
        UPDATE users SET username = ?, first_name = ?, last_name = ?, photo_url = ?
        WHERE telegram_id = ?
      `).run(
        userData.username || user.username,
        userData.first_name || user.first_name,
        userData.last_name || user.last_name,
        photoUrl,
        userData.id
      );
      user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userData.id);
    }

    delete user.referred_by;
    res.json({ success: true, user });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get user profile
router.get('/profile', validateTelegramAuth, (req, res) => {
  try {
    if (!db) db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    delete user.referred_by;
    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Get balance
router.get('/balance', validateTelegramAuth, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const user = db.prepare('SELECT balance, bonus_balance FROM users WHERE telegram_id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      balance: user.balance || 0,
      bonus_balance: user.bonus_balance || 0,
      total: (user.balance || 0) + (user.bonus_balance || 0)
    });
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

// Play Crash game
router.post('/games/crash', validateTelegramAuth, async (req, res) => {
  try {
    const { bet_amount, auto_cashout, action, game_id, cashout_multiplier } = req.body;
    
    if (!db) db = await getDatabase();
    
    // Start new game
    if (action === 'start' || !action) {
      if (!bet_amount || bet_amount < 0.1) {
        return res.status(400).json({ error: 'Invalid bet amount' });
      }

      const user = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(req.user.id);
      if (!user || (user.balance || 0) < bet_amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Generate seeds
      const serverSeed = generateServerSeed();
      const clientSeed = generateClientSeed();
      const nonce = Date.now();
      
      // Calculate multiplier
      const multiplier = calculateCrashMultiplier(serverSeed, clientSeed, nonce);
      
      // Deduct bet immediately
      const newBalance = (user.balance || 0) - bet_amount;
      db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(newBalance, req.user.id);
      
      // Update XP and rank
      await updateUserRankAndXP(req.user.id, bet_amount);
      
      // Save game record (win_amount will be updated on cashout)
      const gameData = {
        multiplier,
        auto_cashout: auto_cashout || null,
        status: 'playing',
        win_amount: 0
      };
      
      const resultHash = createResultHash(serverSeed, clientSeed, nonce);
      db.prepare(`
        INSERT INTO games (user_id, game_type, bet_amount, win_amount, game_data, server_seed, client_seed, result_hash)
        VALUES (?, 'crash', ?, 0, ?, ?, ?, ?)
      `).run(req.user.id, bet_amount, JSON.stringify(gameData), serverSeed, clientSeed, resultHash);
      
      // Get the inserted game ID
      const insertedGames = db.prepare('SELECT * FROM games WHERE user_id = ? ORDER BY id DESC LIMIT 1').all(req.user.id);
      const gameId = insertedGames[0] ? insertedGames[0].id : null;
      
      return res.json({
        success: true,
        game_id: gameId,
        multiplier,
        new_balance: newBalance,
        server_seed: serverSeed,
        client_seed: clientSeed,
        nonce,
        result_hash: resultHash
      });
    }
    
    // Cashout
    if (action === 'cashout') {
      const games = db.prepare('SELECT * FROM games WHERE id = ? AND user_id = ?').all(game_id, req.user.id);
      const game = games[0] || null;
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      
      const gameData = JSON.parse(game.game_data || '{}');
      const actualMultiplier = cashout_multiplier || gameData.multiplier;
      const winAmount = game.bet_amount * actualMultiplier;
      
      const user = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(req.user.id);
      const newBalance = (user.balance || 0) + winAmount;
      
      db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(newBalance, req.user.id);
      
      gameData.status = 'completed';
      gameData.win_amount = winAmount;
      gameData.cashout_multiplier = actualMultiplier;
      db.prepare('UPDATE games SET win_amount = ?, game_data = ? WHERE id = ?')
        .run(winAmount, JSON.stringify(gameData), game_id);
      
      return res.json({
        success: true,
        multiplier: actualMultiplier,
        win_amount: winAmount,
        new_balance: newBalance
      });
    }
    
    res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Crash game error:', error);
    res.status(500).json({ error: 'Game failed' });
  }
});

// Play Dice game
router.post('/games/dice', validateTelegramAuth, async (req, res) => {
  try {
    const { bet_amount, prediction, target } = req.body; // prediction: 'over' or 'under', target: 1-99
    
    if (!bet_amount || bet_amount < 0.1 || !prediction || !target) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    if (!db) db = await getDatabase();
    const user = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(req.user.id);
    if (!user || (user.balance || 0) < bet_amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Generate seeds
    const serverSeed = generateServerSeed();
    const clientSeed = generateClientSeed();
    const nonce = Date.now();
    
    // Calculate result
    const result = calculateDiceResult(serverSeed, clientSeed, nonce);
    const won = (prediction === 'over' && result > target) || (prediction === 'under' && result < target);
    
    // Calculate win amount (2x for win)
    const winAmount = won ? bet_amount * 2 : 0;
    const newBalance = (user.balance || 0) - bet_amount + winAmount;
    
    db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(newBalance, req.user.id);
    
    // Update XP and rank
    await updateUserRankAndXP(req.user.id, bet_amount);
    
    // Save game record
    const gameData = { result, prediction, target, won };
    const resultHash = createResultHash(serverSeed, clientSeed, nonce);
    db.prepare(`
      INSERT INTO games (user_id, game_type, bet_amount, win_amount, game_data, server_seed, client_seed, result_hash)
      VALUES (?, 'dice', ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, bet_amount, winAmount, JSON.stringify(gameData), serverSeed, clientSeed, resultHash);
    
    res.json({
      success: true,
      result,
      won,
      win_amount: winAmount,
      new_balance: newBalance,
      server_seed: serverSeed,
      client_seed: clientSeed,
      nonce,
      result_hash: resultHash
    });
  } catch (error) {
    console.error('Dice game error:', error);
    res.status(500).json({ error: 'Game failed' });
  }
});

// Play Mines game
router.post('/games/mines', validateTelegramAuth, async (req, res) => {
  try {
    const { bet_amount, mine_count, grid_size, action, cell_index, game_id } = req.body;
    
    if (!bet_amount || bet_amount < 0.1) {
      return res.status(400).json({ error: 'Invalid bet amount' });
    }

    if (!db) db = await getDatabase();
    const user = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(req.user.id);
    if (!user || (user.balance || 0) < bet_amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Start new game
    if (action === 'start') {
      const serverSeed = generateServerSeed();
      const clientSeed = generateClientSeed();
      const nonce = Date.now();
      
      // Calculate mine positions
      const minePositions = calculateMinesPositions(serverSeed, clientSeed, nonce, grid_size || 25, mine_count || 3);
      
      // Deduct bet
      const newBalance = (user.balance || 0) - bet_amount;
      db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(newBalance, req.user.id);
      
      // Update XP and rank
      await updateUserRankAndXP(req.user.id, bet_amount);
      
      // Save game start
      const gameData = {
        mine_positions: minePositions,
        revealed: [],
        status: 'playing',
        grid_size: grid_size || 25,
        mine_count: mine_count || 3
      };
      const resultHash = createResultHash(serverSeed, clientSeed, nonce);
      db.prepare(`
        INSERT INTO games (user_id, game_type, bet_amount, win_amount, game_data, server_seed, client_seed, result_hash)
        VALUES (?, 'mines', ?, 0, ?, ?, ?, ?)
      `).run(req.user.id, bet_amount, JSON.stringify(gameData), serverSeed, clientSeed, resultHash);
      
      // Get the inserted game ID
      const insertedGame = db.prepare('SELECT * FROM games WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(req.user.id);
      const gameId = insertedGame ? insertedGame.id : null;
      
      return res.json({
        success: true,
        game_id: gameId,
        mine_count: mine_count || 3,
        grid_size: grid_size || 25,
        server_seed: serverSeed,
        client_seed: clientSeed,
        nonce,
        result_hash: resultHash,
        new_balance: newBalance
      });
    }
    
    // Reveal cell or cashout
    if (action === 'reveal' || action === 'cashout') {
      const games = db.prepare('SELECT * FROM games WHERE id = ? AND user_id = ?').all(game_id, req.user.id);
      const game = games[0] || null;
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      
      const gameData = JSON.parse(game.game_data || '{}');
      const minePositions = gameData.mine_positions || [];
      const revealed = gameData.revealed || [];
      
      if (action === 'cashout') {
        // Get grid_size and mine_count from game data
        const gridSize = gameData.grid_size || 25;
        const mineCount = gameData.mine_count || 3;
        
        // Calculate multiplier based on revealed cells
        const safeCells = gridSize - mineCount;
        const multiplier = 1 + (revealed.length * 0.1) * (1 - (mineCount / gridSize));
        const winAmount = game.bet_amount * multiplier;
        const currentUser = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(req.user.id);
        const newBalance = (currentUser.balance || 0) + winAmount;
        
        db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(newBalance, req.user.id);
        
        gameData.status = 'completed';
        gameData.win_amount = winAmount;
        gameData.multiplier = multiplier;
        db.prepare('UPDATE games SET win_amount = ?, game_data = ? WHERE id = ?')
          .run(winAmount, JSON.stringify(gameData), game_id);
        
        return res.json({
          success: true,
          won: true,
          multiplier,
          win_amount: winAmount,
          new_balance: newBalance
        });
      }
      
      // Reveal cell
      if (revealed.includes(cell_index)) {
        return res.status(400).json({ error: 'Cell already revealed' });
      }
      
      if (minePositions.includes(cell_index)) {
        // Hit a mine - game over
        gameData.status = 'lost';
        gameData.revealed = [...revealed, cell_index];
        db.prepare('UPDATE games SET game_data = ? WHERE id = ?')
          .run(JSON.stringify(gameData), game_id);
        
        const currentUser = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(req.user.id);
        return res.json({
          success: true,
          won: false,
          hit_mine: true,
          mine_positions: minePositions, // Send mine positions so client can display them
          win_amount: 0,
          new_balance: currentUser.balance || 0
        });
      }
      
      // Safe cell
      const newRevealed = [...revealed, cell_index];
      gameData.revealed = newRevealed;
      
      // Check if all safe cells revealed
      const gridSize = gameData.grid_size || 25;
      const mineCount = gameData.mine_count || 3;
      const safeCells = gridSize - mineCount;
      
      if (newRevealed.length === safeCells) {
        // Won!
        const multiplier = 1 + (newRevealed.length * 0.1) * (1 - (mineCount / gridSize));
        const winAmount = game.bet_amount * multiplier;
        const currentUser = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(req.user.id);
        const newBalance = (currentUser.balance || 0) + winAmount;
        
        db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(newBalance, req.user.id);
        
        gameData.status = 'completed';
        gameData.win_amount = winAmount;
        gameData.multiplier = multiplier;
        db.prepare('UPDATE games SET win_amount = ?, game_data = ? WHERE id = ?')
          .run(winAmount, JSON.stringify(gameData), game_id);
        
        return res.json({
          success: true,
          won: true,
          multiplier,
          win_amount: winAmount,
          new_balance: newBalance,
          all_revealed: true
        });
      }
      
      // Continue playing
      db.prepare('UPDATE games SET game_data = ? WHERE id = ?')
        .run(JSON.stringify(gameData), game_id);
      
      return res.json({
        success: true,
        revealed: newRevealed,
        safe: true,
        continue: true
      });
    }
    
    res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Mines game error:', error);
    res.status(500).json({ error: 'Game failed' });
  }
});

// Get game history
router.get('/games/history', validateTelegramAuth, (req, res) => {
  try {
    if (!db) db = getDatabase();
    const limit = parseInt(req.query.limit) || 50;
    const games = db.prepare('SELECT * FROM games WHERE user_id = ?').all(req.user.id, limit);
    
    res.json({ games: games.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// Get transactions
router.get('/transactions', validateTelegramAuth, (req, res) => {
  try {
    if (!db) db = getDatabase();
    const limit = parseInt(req.query.limit) || 50;
    const transactions = db.prepare('SELECT * FROM transactions WHERE user_id = ?').all(req.user.id, limit);
    
    res.json({ transactions: transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Get referral info
router.get('/referral', validateTelegramAuth, (req, res) => {
  try {
    if (!db) db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const referrals = db.prepare('SELECT * FROM referrals WHERE referrer_id = ?').all(user.id);
    const totalEarnings = referrals.reduce((sum, ref) => sum + (ref.total_earnings || 0), 0);
    
    const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'aurasfroxbot';
    const referralLink = `https://t.me/${botUsername}?start=ref_${user.referral_code}`;
    
    res.json({
      referral_link: referralLink,
      referral_code: user.referral_code,
      total_referrals: referrals.length,
      total_earnings: totalEarnings
    });
  } catch (error) {
    console.error('Referral error:', error);
    res.status(500).json({ error: 'Failed to get referral info' });
  }
});

// Share Win - Generate share image data
router.post('/share-win', validateTelegramAuth, async (req, res) => {
  try {
    const { game_id, win_amount, game_type } = req.body;
    
    if (!db) db = await getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'aurasfroxbot';
    const referralLink = `https://t.me/${botUsername}?start=ref_${user.referral_code}`;
    
    // Generate share data (frontend will create image)
    const shareData = {
      username: user.first_name || 'Гравець',
      win_amount: win_amount.toFixed(2),
      game_type: game_type,
      referral_link: referralLink,
      timestamp: new Date().toISOString()
    };
    
    res.json({ success: true, share_data: shareData });
  } catch (error) {
    console.error('Share win error:', error);
    res.status(500).json({ error: 'Failed to generate share data' });
  }
});

// Get cashback info
router.get('/cashback', validateTelegramAuth, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate cashback (1-5% based on rank)
    const rank = calculateRank(user.total_wagered || 0);
    const cashbackPercent = rank.cashback;
    
    // Get lost games from last week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const games = db.prepare('SELECT * FROM games WHERE user_id = ?').all(user.id);
    const lostGames = games.filter(g => 
      new Date(g.created_at) >= weekAgo && 
      g.win_amount === 0
    );
    
    const totalLost = lostGames.reduce((sum, g) => sum + (g.bet_amount || 0), 0);
    const cashbackAmount = totalLost * cashbackPercent;
    
    // Next cashback date (Monday)
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7));
    nextMonday.setHours(0, 0, 0, 0);
    
    res.json({
      cashback_percent: cashbackPercent * 100,
      total_lost: totalLost,
      cashback_amount: cashbackAmount,
      next_cashback_date: nextMonday.toISOString(),
      rank: rank.name
    });
  } catch (error) {
    console.error('Cashback error:', error);
    res.status(500).json({ error: 'Failed to get cashback info' });
  }
});

// Claim cashback
router.post('/cashback/claim', validateTelegramAuth, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if it's Monday (cashback day)
    const now = new Date();
    const isMonday = now.getDay() === 1;
    
    if (!isMonday) {
      return res.status(400).json({ error: 'Cashback доступний тільки в понеділок' });
    }

    // Calculate cashback
    const rank = calculateRank(user.total_wagered || 0);
    const cashbackPercent = rank.cashback;
    
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const games = db.prepare('SELECT * FROM games WHERE user_id = ?').all(user.id);
    const lostGames = games.filter(g => 
      new Date(g.created_at) >= weekAgo && 
      g.win_amount === 0
    );
    
    const totalLost = lostGames.reduce((sum, g) => sum + (g.bet_amount || 0), 0);
    const cashbackAmount = totalLost * cashbackPercent;
    
    if (cashbackAmount <= 0) {
      return res.status(400).json({ error: 'Немає коштів для кешбеку' });
    }

    // Add to bonus balance
    const newBonusBalance = (user.bonus_balance || 0) + cashbackAmount;
    db.prepare('UPDATE users SET bonus_balance = ? WHERE telegram_id = ?').run(newBonusBalance, req.user.id);
    
    // Create transaction
    db.prepare(`
      INSERT INTO transactions (user_id, type, amount, currency, status, description)
      VALUES (?, 'cashback', ?, 'USDT', 'completed', ?)
    `).run(user.id, cashbackAmount, `Cashback ${cashbackPercent * 100}%`);
    
    res.json({
      success: true,
      cashback_amount: cashbackAmount,
      new_bonus_balance: newBonusBalance
    });
  } catch (error) {
    console.error('Claim cashback error:', error);
    res.status(500).json({ error: 'Failed to claim cashback' });
  }
});

// Get privacy settings
router.get('/privacy', validateTelegramAuth, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    
    const user = db.prepare('SELECT privacy_settings FROM users WHERE telegram_id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const settings = user.privacy_settings ? JSON.parse(user.privacy_settings) : {
      showBalance: true,
      showStats: true,
      allowReferrals: true,
      dataSharing: false
    };
    
    res.json({ settings });
  } catch (error) {
    console.error('Privacy settings error:', error);
    res.status(500).json({ error: 'Failed to get privacy settings' });
  }
});

// Update privacy settings
router.post('/privacy', validateTelegramAuth, async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Invalid settings' });
    }
    
    if (!db) db = await getDatabase();
    
    const user = db.prepare('SELECT id FROM users WHERE telegram_id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate settings
    const validSettings = {
      showBalance: settings.showBalance !== undefined ? Boolean(settings.showBalance) : true,
      showStats: settings.showStats !== undefined ? Boolean(settings.showStats) : true,
      allowReferrals: settings.allowReferrals !== undefined ? Boolean(settings.allowReferrals) : true,
      dataSharing: settings.dataSharing !== undefined ? Boolean(settings.dataSharing) : false
    };
    
    db.prepare('UPDATE users SET privacy_settings = ? WHERE telegram_id = ?')
      .run(JSON.stringify(validSettings), req.user.id);
    
    res.json({ success: true, settings: validSettings });
  } catch (error) {
    console.error('Privacy settings update error:', error);
    res.status(500).json({ error: 'Failed to update privacy settings' });
  }
});

export default router;
