// Online games endpoints (multiplayer rooms)
import express from 'express';
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

// In-memory room storage (in production, use Redis)
const rooms = new Map();
const roomPlayers = new Map(); // roomId -> [player1, player2, ...]

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
  if (!botToken) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    if (!validateTelegramWebApp(initData, botToken)) {
      return res.status(401).json({ error: 'Invalid Telegram auth data' });
    }

    const userData = parseUserData(initData);
    if (!isAuthDataRecent(initData)) {
      return res.status(401).json({ error: 'Auth data expired' });
    }

    req.user = userData;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}

// Get active rooms
router.get('/rooms', validateTelegramAuth, async (req, res) => {
  try {
    const { game_type } = req.query;
    
    const activeRooms = Array.from(rooms.values())
      .filter(room => {
        if (game_type && room.game_type !== game_type) return false;
        if (room.status === 'finished' || room.status === 'cancelled') return false;
        return true;
      })
      .map(room => {
        const players = roomPlayers.get(room.id) || [];
        return {
          id: room.id,
          game_type: room.game_type,
          bet: room.bet,
          players: players.length,
          max_players: room.max_players,
          status: room.status,
          created_at: room.created_at
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ rooms: activeRooms });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get rooms' });
  }
});

// Create room
router.post('/rooms/create', validateTelegramAuth, async (req, res) => {
  try {
    const { game_type, bet, max_players = 2 } = req.body;
    
    if (!game_type || !['crash', 'dice', 'mines'].includes(game_type)) {
      return res.status(400).json({ error: 'Invalid game type' });
    }

    if (!bet || bet < 0) {
      return res.status(400).json({ error: 'Invalid bet amount' });
    }

    if (!db) db = await getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check balance for paid games
    if (bet > 0 && (user.balance || 0) < bet) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const room = {
      id: roomId,
      game_type: game_type,
      bet: bet,
      max_players: max_players,
      status: 'waiting',
      created_by: req.user.id,
      created_at: new Date().toISOString(),
      game_data: null
    };

    rooms.set(roomId, room);
    roomPlayers.set(roomId, [{
      user_id: user.id,
      telegram_id: req.user.id,
      username: user.first_name || 'Player',
      balance: user.balance || 0,
      ready: false
    }]);

    res.json({ 
      success: true, 
      room: {
        id: room.id,
        game_type: room.game_type,
        bet: room.bet,
        players: 1,
        max_players: room.max_players,
        status: room.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Join room
router.post('/rooms/:roomId/join', validateTelegramAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    if (!rooms.has(roomId)) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = rooms.get(roomId);
    const players = roomPlayers.get(roomId) || [];

    if (room.status !== 'waiting') {
      return res.status(400).json({ error: 'Room is not accepting players' });
    }

    if (players.length >= room.max_players) {
      return res.status(400).json({ error: 'Room is full' });
    }

    if (!db) db = await getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already in room
    if (players.some(p => p.telegram_id === req.user.id)) {
      return res.status(400).json({ error: 'Already in room' });
    }

    // Check balance for paid games
    if (room.bet > 0 && (user.balance || 0) < room.bet) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    players.push({
      user_id: user.id,
      telegram_id: req.user.id,
      username: user.first_name || 'Player',
      balance: user.balance || 0,
      ready: false
    });

    roomPlayers.set(roomId, players);

    res.json({ 
      success: true, 
      room: {
        id: room.id,
        game_type: room.game_type,
        bet: room.bet,
        players: players.length,
        max_players: room.max_players,
        status: room.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Leave room
router.post('/rooms/:roomId/leave', validateTelegramAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    if (!rooms.has(roomId)) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const players = roomPlayers.get(roomId) || [];
    const playerIndex = players.findIndex(p => p.telegram_id === req.user.id);

    if (playerIndex === -1) {
      return res.status(400).json({ error: 'Not in room' });
    }

    players.splice(playerIndex, 1);
    roomPlayers.set(roomId, players);

    // If room creator left and room is empty, delete room
    const room = rooms.get(roomId);
    if (players.length === 0 && room.created_by === req.user.id) {
      rooms.delete(roomId);
      roomPlayers.delete(roomId);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave room' });
  }
});

// Start game in room
router.post('/rooms/:roomId/start', validateTelegramAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    if (!rooms.has(roomId)) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = rooms.get(roomId);
    const players = roomPlayers.get(roomId) || [];

    if (room.created_by !== req.user.id) {
      return res.status(403).json({ error: 'Only room creator can start game' });
    }

    if (room.status !== 'waiting') {
      return res.status(400).json({ error: 'Game already started' });
    }

    if (players.length < 1) {
      return res.status(400).json({ error: 'Not enough players' });
    }

    // Deduct bets
    if (!db) db = await getDatabase();
    for (const player of players) {
      if (room.bet > 0) {
        const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(player.user_id);
        if (user && (user.balance || 0) >= room.bet) {
          const newBalance = (user.balance || 0) - room.bet;
          db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, player.user_id);
          player.balance = newBalance;
        }
      }
    }

    // Generate game result
    const serverSeed = generateServerSeed();
    const clientSeed = generateClientSeed();
    const nonce = Date.now();
    
    let gameResult;
    if (room.game_type === 'crash') {
      const multiplier = calculateCrashMultiplier(serverSeed, clientSeed, nonce);
      gameResult = { multiplier, crashed_at: multiplier };
    } else if (room.game_type === 'dice') {
      const result = calculateDiceResult(serverSeed, clientSeed, nonce);
      gameResult = { result };
    } else if (room.game_type === 'mines') {
      const minePositions = calculateMinesPositions(serverSeed, clientSeed, nonce, 25, 3);
      gameResult = { mine_positions: minePositions, grid_size: 25, mine_count: 3 };
    }

    const resultHash = createResultHash(serverSeed, clientSeed, nonce);

    room.status = 'playing';
    room.game_data = {
      server_seed: serverSeed,
      client_seed: clientSeed,
      nonce,
      result_hash: resultHash,
      result: gameResult,
      started_at: new Date().toISOString()
    };

    rooms.set(roomId, room);

    res.json({ 
      success: true, 
      game_data: room.game_data,
      players: players.map(p => ({
        telegram_id: p.telegram_id,
        username: p.username
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// Get room status
router.get('/rooms/:roomId', validateTelegramAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    if (!rooms.has(roomId)) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = rooms.get(roomId);
    const players = roomPlayers.get(roomId) || [];

    res.json({ 
      room: {
        id: room.id,
        game_type: room.game_type,
        bet: room.bet,
        players: players.map(p => ({
          telegram_id: p.telegram_id,
          username: p.username,
          ready: p.ready
        })),
        max_players: room.max_players,
        status: room.status,
        game_data: room.game_data,
        created_at: room.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get room' });
  }
});

// Submit game result (for multiplayer games where players make decisions)
router.post('/rooms/:roomId/submit', validateTelegramAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { action, data } = req.body; // action: 'cashout', 'reveal', etc.
    
    if (!rooms.has(roomId)) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = rooms.get(roomId);
    const players = roomPlayers.get(roomId) || [];
    const player = players.find(p => p.telegram_id === req.user.id);

    if (!player) {
      return res.status(400).json({ error: 'Not in room' });
    }

    if (room.status !== 'playing') {
      return res.status(400).json({ error: 'Game not in progress' });
    }

    // Process action based on game type
    if (!room.game_data.player_actions) {
      room.game_data.player_actions = {};
    }

    room.game_data.player_actions[req.user.id] = { action, data, timestamp: new Date().toISOString() };
    rooms.set(roomId, room);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit action' });
  }
});

// Finish game and distribute winnings
router.post('/rooms/:roomId/finish', validateTelegramAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    if (!rooms.has(roomId)) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = rooms.get(roomId);
    const players = roomPlayers.get(roomId) || [];

    if (room.status !== 'playing') {
      return res.status(400).json({ error: 'Game not in progress' });
    }

    if (!db) db = await getDatabase();

    // Calculate winnings based on game type and player actions
    const winners = [];
    const gameData = room.game_data;
    const playerActions = gameData.player_actions || {};

    if (room.game_type === 'crash') {
      const multiplier = gameData.result.multiplier;
      for (const player of players) {
        const action = playerActions[player.telegram_id];
        if (action && action.action === 'cashout' && action.data.cashout_multiplier <= multiplier) {
          const winAmount = room.bet * action.data.cashout_multiplier;
          const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(player.user_id);
          const newBalance = (user.balance || 0) + winAmount;
          db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, player.user_id);
          
          winners.push({
            telegram_id: player.telegram_id,
            username: player.username,
            win_amount: winAmount
          });
        }
      }
    } else if (room.game_type === 'dice') {
      const result = gameData.result.result;
      for (const player of players) {
        const action = playerActions[player.telegram_id];
        if (action && action.data) {
          const { prediction, target } = action.data;
          const won = (prediction === 'over' && result > target) || (prediction === 'under' && result < target);
          if (won) {
            const winAmount = room.bet * 2;
            const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(player.user_id);
            const newBalance = (user.balance || 0) + winAmount;
            db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, player.user_id);
            
            winners.push({
              telegram_id: player.telegram_id,
              username: player.username,
              win_amount: winAmount
            });
          }
        }
      }
    }

    room.status = 'finished';
    room.game_data.winners = winners;
    rooms.set(roomId, room);

    // Clean up after 1 hour
    setTimeout(() => {
      rooms.delete(roomId);
      roomPlayers.delete(roomId);
    }, 3600000);

    res.json({ 
      success: true, 
      winners,
      game_result: gameData.result
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to finish game' });
  }
});

export default router;
