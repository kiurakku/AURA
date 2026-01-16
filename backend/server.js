import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from './database/db.js';
import { initBot } from './bot/bot.js';
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';
import gamesRoutes from './routes/games.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/materials', express.static(join(__dirname, '../src/materials')));

// API Routes
app.use('/api', apiRoutes);
app.use('/api/games', gamesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database
initDatabase().then(async () => {
  console.log('✅ Database initialized');
  
  // Initialize Telegram bot
  await initBot();
  console.log('✅ Telegram bot initialized');
  
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 WebApp URL: ${process.env.TELEGRAM_WEBAPP_URL}`);
  });
}).catch(err => {
  console.error('❌ Failed to initialize:', err);
  process.exit(1);
});

export default app;
