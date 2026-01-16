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
    return res.status(401).json({ error: 'Missing Telegram initData' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!validateTelegramWebApp(initData, botToken)) {
    return res.status(401).json({ error: 'Invalid Telegram initData' });
  }

  if (!isAuthDataRecent(initData)) {
    return res.status(401).json({ error: 'Auth data expired' });
  }

  const userData = parseUserData(initData);
  if (!userData) {
    return res.status(401).json({ error: 'Invalid user data' });
  }

  req.user = userData;
  req.initData = initData;
  next();
}

// Get or create user
router.post('/auth', validateTelegramAuth, async (req, res) => {
  try {
    if (!db) db = getDatabase();
    const { id, username, first_name, last_name, photo_url } = req.user;
    
    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(id);
    
    if (!user) {
      // Create new user
      const referralCode = crypto.randomBytes(8).toString('hex');
      const stmt = db.prepare(`
        INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, referral_code)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, username, first_name, last_name, photo_url, referralCode);
      user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(id);
    } else {
      // Update user info
      const stmt = db.prepare(`
        UPDATE users 
        SET username = ?, first_name = ?, last_name = ?, photo_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE telegram_id = ?
      `);
      stmt.run(username, first_name, last_name, photo_url, id);
      user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(id);
    }

    // Remove sensitive data
    if (user) {
      delete user.referred_by;
    }
    
    res.json({ user });
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
router.get('/balance', validateTelegramAuth, (req, res) => {
  try {
    if (!db) db = getDatabase();
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
router.post('/games/crash', validateTelegramAuth, (req, res) => {
  try {
    const { bet_amount, auto_cashout } = req.body;
    
    if (!bet_amount || bet_amount < 0.1) {
      return res.status(400).json({ error: 'Invalid bet amount' });
    }

    if (!db) db = getDatabase();
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
    const winAmount = auto_cashout && multiplier >= auto_cashout 
      ? bet_amount * auto_cashout 
      : bet_amount * multiplier;
    
    // Update balance
    const newBalance = (user.balance || 0) - bet_amount + winAmount;
    db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(newBalance, req.user.id);
    
    // Save game record
    const gameData = {
      multiplier,
      auto_cashout: auto_cashout || null,
      win_amount: winAmount
    };
    
    const resultHash = createResultHash(serverSeed, clientSeed, nonce);
    db.prepare(`
      INSERT INTO games (user_id, game_type, bet_amount, win_amount, game_data, server_seed, client_seed, result_hash)
      VALUES (?, 'crash', ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, bet_amount, winAmount, JSON.stringify(gameData), serverSeed, clientSeed, resultHash);
    
    res.json({
      success: true,
      multiplier,
      win_amount: winAmount,
      new_balance: newBalance,
      server_seed: serverSeed,
      client_seed: clientSeed,
      nonce,
      result_hash: resultHash
    });
  } catch (error) {
    console.error('Crash game error:', error);
    res.status(500).json({ error: 'Game failed' });
  }
});

// Play Dice game
router.post('/games/dice', validateTelegramAuth, (req, res) => {
  try {
    const { bet_amount, prediction, target } = req.body; // prediction: 'over' or 'under', target: 1-99
    
    if (!bet_amount || bet_amount < 0.1 || !prediction || !target) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    if (!db) db = getDatabase();
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

// Get game history
router.get('/games/history', validateTelegramAuth, (req, res) => {
  try {
    if (!db) db = getDatabase();
    const limit = parseInt(req.query.limit) || 50;
    const games = db.prepare(`
      SELECT * FROM games 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(req.user.id, limit);
    
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
    const transactions = db.prepare(`
      SELECT * FROM transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `).all(req.user.id, limit);
    
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
    const user = db.prepare('SELECT referral_code, referred_by FROM users WHERE telegram_id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const referrals = db.prepare(`
      SELECT * FROM referrals WHERE referrer_id = ?
    `).all(req.user.id);
    
    const totalEarnings = referrals.reduce((sum, ref) => sum + (ref.total_earnings || 0), 0);
    
    res.json({
      referral_code: user.referral_code,
      referral_link: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME || 'your_bot'}?start=ref_${user.referral_code}`,
      total_referrals: referrals.length,
      total_earnings: totalEarnings
    });
  } catch (error) {
    console.error('Referral error:', error);
    res.status(500).json({ error: 'Failed to get referral info' });
  }
});

export default router;
