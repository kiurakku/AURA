import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from './database/db.js';
import { initBot } from './bot/bot.js';
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';
import gamesRoutes from './routes/games.js';
import onlineGamesRoutes from './routes/online-games.js';
import { validateTelegramWebApp, parseUserData, isAuthDataRecent } from './utils/telegram-validator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - serve frontend build
app.use(express.static(join(__dirname, '../public')));

// Materials
app.use('/materials', express.static(join(__dirname, '../public/materials')));

// API Routes
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/online-games', onlineGamesRoutes);

// Set io in online-games routes
import { setIO } from './routes/online-games.js';
if (setIO) {
  setIO(io);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend for all other routes (SPA) - must be last, after all API routes
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  // Skip health check
  if (req.path === '/health') {
    return next();
  }
  // Serve index.html for all other routes
  res.sendFile(join(__dirname, '../public/index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Not Found' });
    }
  });
});

// WebSocket authentication middleware
io.use((socket, next) => {
  const initData = socket.handshake.auth?.initData || socket.handshake.query?.initData;
  
  if (!initData) {
    return next(new Error('Missing Telegram initData'));
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return next(new Error('Bot token not configured'));
  }

  try {
    if (!validateTelegramWebApp(initData, botToken)) {
      return next(new Error('Invalid Telegram auth data'));
    }

    const userData = parseUserData(initData);
    if (!isAuthDataRecent(initData)) {
      return next(new Error('Auth data expired'));
    }

    socket.user = userData;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.user.id} (${socket.user.first_name})`);
  
  socket.on('join-room', async (roomId) => {
    try {
      socket.join(roomId);
      socket.currentRoom = roomId;
      
      // Import rooms dynamically to avoid circular dependency
      const { getRooms, getRoomPlayers } = await import('./routes/online-games.js');
      const rooms = getRooms();
      const roomPlayers = getRoomPlayers();
      
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        const players = roomPlayers.get(roomId) || [];
        
        // Notify room about new player
        io.to(roomId).emit('room-updated', {
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
            status: room.status
          }
        });
        
        // Send current room state to the joining player
        socket.emit('room-state', {
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
            game_data: room.game_data
          }
        });
      }
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    if (socket.currentRoom === roomId) {
      socket.currentRoom = null;
    }
  });

  socket.on('player-ready', async (data) => {
    try {
      const { roomId, ready } = data;
      
      // Import rooms dynamically
      const { getRooms, getRoomPlayers } = await import('./routes/online-games.js');
      const rooms = getRooms();
      const roomPlayers = getRoomPlayers();
      
      if (rooms.has(roomId)) {
        const players = roomPlayers.get(roomId) || [];
        const player = players.find(p => p.telegram_id === socket.user.id);
        
        if (player) {
          player.ready = ready;
          roomPlayers.set(roomId, players);
          
          // Notify room about ready status change
          io.to(roomId).emit('player-ready-updated', {
            telegram_id: socket.user.id,
            ready: ready
          });
        }
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to update ready status' });
    }
  });

  socket.on('game-action', async (data) => {
    try {
      const { roomId, action, actionData } = data;
      
      // Import rooms dynamically
      const { getRooms } = await import('./routes/online-games.js');
      const rooms = getRooms();
      
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        
        if (room.status === 'playing') {
          // Broadcast action to all players in room
          io.to(roomId).emit('game-action-updated', {
            telegram_id: socket.user.id,
            action: action,
            data: actionData,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to process game action' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.user.id}`);
    if (socket.currentRoom) {
      socket.leave(socket.currentRoom);
    }
  });
});

// Initialize database
initDatabase().then(async () => {
  console.log('✅ Database initialized');
  
  // Initialize Telegram bot
  await initBot();
  console.log('✅ Telegram bot initialized');
  
  // Start server
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 WebApp URL: ${process.env.TELEGRAM_WEBAPP_URL}`);
    console.log(`🔌 WebSocket server ready`);
  });
}).catch(err => {
  console.error('❌ Failed to initialize:', err);
  process.exit(1);
});

export default app;
