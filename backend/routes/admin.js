import express from 'express';
import { getDatabase } from '../database/db.js';
import { validateTelegramWebApp, parseUserData } from '../utils/telegram-validator.js';

const router = express.Router();
let db = null;

// Initialize database
getDatabase().then(database => {
  db = database;
});

// Check if user is admin
function isAdmin(req, res, next) {
  const initData = req.headers['x-telegram-init-data'] || req.body.initData;
  if (!initData) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userData = parseUserData(initData);
    // Check if user is admin (you can set admin IDs in .env)
    const adminIds = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',').map(Number) : [];
    
    if (!adminIds.includes(userData.id)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    req.admin = userData;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid auth data' });
  }
}

// Get dashboard stats
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    
    const allUsers = db.prepare('SELECT * FROM users').all();
    const allGames = db.prepare('SELECT * FROM games').all();
    const allTransactions = db.prepare('SELECT * FROM transactions').all();

    const stats = {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => {
        const lastActive = u.updated_at ? new Date(u.updated_at) : new Date(u.created_at);
        const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceActive < 7;
      }).length,
      totalGames: allGames.length,
      totalWagered: allGames.reduce((sum, g) => sum + (g.bet_amount || 0), 0),
      totalWon: allGames.reduce((sum, g) => sum + (g.win_amount || 0), 0),
      totalDeposits: allTransactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      totalWithdrawals: allTransactions
        .filter(t => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      pendingWithdrawals: allTransactions
        .filter(t => t.type === 'withdrawal' && t.status === 'pending')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
    };

    stats.grossGamingRevenue = stats.totalWagered - stats.totalWon;
    stats.netRevenue = stats.totalDeposits - stats.totalWithdrawals;

    res.json({ stats });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const users = db.prepare('SELECT * FROM users').all();
    res.json({ users });
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get withdrawals queue
router.get('/withdrawals', isAdmin, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const status = req.query.status || 'pending';
    const transactions = db.prepare('SELECT * FROM transactions WHERE type = ? AND status = ?').all('withdrawal', status);
    res.json({ withdrawals: transactions });
  } catch (error) {
    console.error('Withdrawals error:', error);
    res.status(500).json({ error: 'Failed to get withdrawals' });
  }
});

// Approve withdrawal
router.post('/withdrawals/:id/approve', isAdmin, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(parseInt(req.params.id));
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Process withdrawal via Crypto Pay
    const { transferFunds } = await import('../utils/crypto-pay.js');
    const metadata = JSON.parse(transaction.metadata || '{}');
    
    // Get user telegram_id
    const user = db.prepare('SELECT telegram_id FROM users WHERE id = ?').get(transaction.user_id);
    if (!user || !user.telegram_id) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transferResult = await transferFunds(
      user.telegram_id.toString(),
      transaction.amount,
      `Withdrawal ${transaction.amount} ${transaction.currency} from AURA Casino`
    );

    if (transferResult.success) {
      db.prepare('UPDATE transactions SET status = ?, metadata = ? WHERE id = ?')
        .run('completed', JSON.stringify({ ...metadata, transfer_id: transferResult.transfer_id }), transaction.id);
      res.json({ success: true, message: 'Withdrawal processed', transfer_id: transferResult.transfer_id });
    } else {
      // Refund balance if transfer failed
      const userBalance = db.prepare('SELECT balance FROM users WHERE id = ?').get(transaction.user_id);
      if (userBalance) {
        const newBalance = (userBalance.balance || 0) + transaction.amount;
        db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, transaction.user_id);
      }
      res.status(500).json({ error: transferResult.error });
    }
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ error: 'Failed to approve withdrawal' });
  }
});

// Reject withdrawal
router.post('/withdrawals/:id/reject', isAdmin, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const { reason } = req.body;
    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(parseInt(req.params.id));
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Return funds to user
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(transaction.user_id);
    const newBalance = (user.balance || 0) + transaction.amount;
    db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, transaction.user_id);

    // Update transaction status
    db.prepare('UPDATE transactions SET status = ?, description = ? WHERE id = ?')
      .run('rejected', reason || 'Rejected by admin', transaction.id);
    
    res.json({ success: true, message: 'Withdrawal rejected' });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ error: 'Failed to reject withdrawal' });
  }
});

// Add balance to user (admin only)
router.post('/users/:userId/balance', isAdmin, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const { userId } = req.params;
    const { amount, currency = 'USDT', type = 'balance', description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ? OR telegram_id = ?').get(parseInt(userId), parseInt(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let newBalance;
    if (type === 'bonus') {
      newBalance = (user.bonus_balance || 0) + parseFloat(amount);
      db.prepare('UPDATE users SET bonus_balance = ? WHERE id = ?').run(newBalance, user.id);
    } else {
      newBalance = (user.balance || 0) + parseFloat(amount);
      db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, user.id);
    }

    // Create transaction record
    db.prepare(`
      INSERT INTO transactions (user_id, type, amount, currency, status, description, metadata)
      VALUES (?, 'admin_bonus', ?, ?, 'completed', ?, ?)
    `).run(
      user.id,
      parseFloat(amount),
      currency,
      description || `Admin bonus: ${amount} ${currency} (${type})`,
      JSON.stringify({
        admin_id: req.admin.id,
        admin_username: req.admin.username,
        bonus_type: type,
        added_at: new Date().toISOString()
      })
    );

    // Get updated user data
    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);

    res.json({
      success: true,
      message: `Balance updated successfully`,
      user: {
        id: updatedUser.id,
        telegram_id: updatedUser.telegram_id,
        username: updatedUser.username,
        balance: updatedUser.balance || 0,
        bonus_balance: updatedUser.bonus_balance || 0
      }
    });
  } catch (error) {
    console.error('Add balance error:', error);
    res.status(500).json({ error: 'Failed to add balance' });
  }
});

// Get user by ID or Telegram ID
router.get('/users/:userId', isAdmin, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const { userId } = req.params;
    
    const user = db.prepare('SELECT * FROM users WHERE id = ? OR telegram_id = ?').get(parseInt(userId), parseInt(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user transactions
    const transactions = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(user.id);
    
    // Get user games
    const games = db.prepare('SELECT * FROM games WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(user.id);

    res.json({
      user,
      transactions,
      games: games.map(g => ({
        id: g.id,
        game_type: g.game_type,
        bet_amount: g.bet_amount,
        win_amount: g.win_amount,
        created_at: g.created_at
      }))
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Search users
router.get('/users/search/:query', isAdmin, async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const { query } = req.params;
    
    const users = db.prepare(`
      SELECT * FROM users 
      WHERE telegram_id LIKE ? OR username LIKE ? OR first_name LIKE ?
      LIMIT 20
    `).all(`%${query}%`, `%${query}%`, `%${query}%`);

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    if (!db) db = await getDatabase();
    const period = req.query.period || 'all'; // all, week, day
    const limit = parseInt(req.query.limit) || 10;

    let games = db.prepare('SELECT * FROM games').all();
    
    if (period === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      games = games.filter(g => new Date(g.created_at) >= weekAgo);
    } else if (period === 'day') {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      games = games.filter(g => new Date(g.created_at) >= dayAgo);
    }

    // Calculate wins per user
    const userWins = {};
    games.forEach(game => {
      if (game.win_amount > 0) {
        if (!userWins[game.user_id]) {
          userWins[game.user_id] = { user_id: game.user_id, total_won: 0 };
        }
        userWins[game.user_id].total_won += game.win_amount;
      }
    });

    // Get user details and sort
    const leaderboard = Object.values(userWins)
      .map(entry => {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(entry.user_id);
        return {
          user_id: entry.user_id,
          username: user?.username || 'Unknown',
          first_name: user?.first_name || 'Unknown',
          photo_url: user?.photo_url,
          total_won: entry.total_won,
          rank: user?.rank_name || 'Newbie'
        };
      })
      .sort((a, b) => b.total_won - a.total_won)
      .slice(0, limit)
      .map((entry, index) => ({ ...entry, position: index + 1 }));

    res.json({ leaderboard, period });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

export default router;
