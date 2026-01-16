// Game endpoints for playing with bots (free mode)
import express from 'express';
import { getDatabase } from '../database/db.js';
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

getDatabase().then(database => {
  db = database;
});

// Play Crash with bot (free mode)
router.post('/crash/bot', async (req, res) => {
  try {
    const { bet_amount, auto_cashout } = req.body;
    
    if (!db) db = await getDatabase();
    
    // Generate seeds
    const serverSeed = generateServerSeed();
    const clientSeed = generateClientSeed();
    const nonce = Date.now();
    
    // Calculate multiplier
    const multiplier = calculateCrashMultiplier(serverSeed, clientSeed, nonce);
    
    // Simulate bot cashout (random between 1.5x and multiplier - 0.1)
    const botCashout = auto_cashout || (1.5 + Math.random() * (multiplier - 1.6));
    const actualCashout = Math.min(botCashout, multiplier - 0.1);
    
    const resultHash = createResultHash(serverSeed, clientSeed, nonce);
    
    res.json({
      success: true,
      multiplier: actualCashout,
      crashed_at: multiplier,
      bot_cashout: actualCashout,
      server_seed: serverSeed,
      client_seed: clientSeed,
      nonce,
      result_hash: resultHash
    });
  } catch (error) {
    console.error('Crash bot error:', error);
    res.status(500).json({ error: 'Game failed' });
  }
});

// Play Dice with bot (free mode)
router.post('/dice/bot', async (req, res) => {
  try {
    const { bet_amount, prediction, target } = req.body;
    
    if (!db) db = await getDatabase();
    
    // Generate seeds
    const serverSeed = generateServerSeed();
    const clientSeed = generateClientSeed();
    const nonce = Date.now();
    
    // Calculate result
    const result = calculateDiceResult(serverSeed, clientSeed, nonce);
    const won = (prediction === 'over' && result > target) || (prediction === 'under' && result < target);
    
    // Bot also plays
    const botPrediction = Math.random() > 0.5 ? 'over' : 'under';
    const botTarget = Math.floor(Math.random() * 98) + 1;
    const botWon = (botPrediction === 'over' && result > botTarget) || (botPrediction === 'under' && result < botTarget);
    
    const resultHash = createResultHash(serverSeed, clientSeed, nonce);
    
    res.json({
      success: true,
      result,
      won,
      bot_prediction: botPrediction,
      bot_target: botTarget,
      bot_won: botWon,
      server_seed: serverSeed,
      client_seed: clientSeed,
      nonce,
      result_hash: resultHash
    });
  } catch (error) {
    console.error('Dice bot error:', error);
    res.status(500).json({ error: 'Game failed' });
  }
});

// Play Mines with bot (free mode)
router.post('/mines/bot', async (req, res) => {
  try {
    const { bet_amount, mine_count, grid_size } = req.body;
    
    if (!db) db = await getDatabase();
    
    const serverSeed = generateServerSeed();
    const clientSeed = generateClientSeed();
    const nonce = Date.now();
    
    // Calculate mine positions
    const minePositions = calculateMinesPositions(serverSeed, clientSeed, nonce, grid_size || 25, mine_count || 3);
    
    // Bot reveals some cells (simulation)
    const botRevealed = [];
    const safeCells = (grid_size || 25) - (mine_count || 3);
    const botRevealCount = Math.floor(Math.random() * safeCells);
    
    for (let i = 0; i < botRevealCount; i++) {
      let cell;
      do {
        cell = Math.floor(Math.random() * (grid_size || 25));
      } while (minePositions.includes(cell) || botRevealed.includes(cell));
      botRevealed.push(cell);
    }
    
    const resultHash = createResultHash(serverSeed, clientSeed, nonce);
    
    res.json({
      success: true,
      mine_count: mine_count || 3,
      grid_size: grid_size || 25,
      bot_revealed: botRevealed,
      server_seed: serverSeed,
      client_seed: clientSeed,
      nonce,
      result_hash: resultHash
    });
  } catch (error) {
    console.error('Mines bot error:', error);
    res.status(500).json({ error: 'Game failed' });
  }
});

export default router;
