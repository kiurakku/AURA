// Simplified database using JSON files (fallback if sql.js doesn't work)
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = process.env.DB_PATH ? dirname(process.env.DB_PATH) : join(__dirname, '../../data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const TRANSACTIONS_FILE = join(DATA_DIR, 'transactions.json');
const GAMES_FILE = join(DATA_DIR, 'games.json');
const REFERRALS_FILE = join(DATA_DIR, 'referrals.json');
const SETTINGS_FILE = join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize JSON files
function initFile(filePath, defaultValue = []) {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
  }
}

initFile(USERS_FILE, []);
initFile(TRANSACTIONS_FILE, []);
initFile(GAMES_FILE, []);
initFile(REFERRALS_FILE, []);
initFile(SETTINGS_FILE, {
  default_rtp: '95',
  min_bet: '0.1',
  max_bet: '1000',
  auto_withdraw_limit: '50',
  referral_bonus_percent: '10',
  daily_bonus_amount: '1.0'
});

// Read/Write helpers
function readJSON(filePath) {
  try {
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return Array.isArray(filePath) ? [] : {};
  }
}

function writeJSON(filePath, data) {
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Database operations
export const db = {
  users: {
    findOne: (query) => {
      const users = readJSON(USERS_FILE);
      if (query.telegram_id !== undefined) {
        return users.find(u => u.telegram_id === query.telegram_id) || null;
      }
      if (query.referral_code) {
        return users.find(u => u.referral_code === query.referral_code) || null;
      }
      return null;
    },
    findAll: (query = {}) => {
      return readJSON(USERS_FILE);
    },
    create: (data) => {
      const users = readJSON(USERS_FILE);
      const id = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
      const user = { 
        id, 
        ...data, 
        balance: data.balance || 0,
        bonus_balance: data.bonus_balance || 0,
        total_wagered: data.total_wagered || 0,
        total_xp: data.total_xp || 0,
        rank_id: data.rank_id || 1,
        rank_name: data.rank_name || 'Newbie',
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      };
      users.push(user);
      writeJSON(USERS_FILE, users);
      return user;
    },
    update: (query, data) => {
      const users = readJSON(USERS_FILE);
      const index = users.findIndex(u => {
        if (query.telegram_id !== undefined) {
          return u.telegram_id === query.telegram_id;
        }
        if (query.id !== undefined) {
          return u.id === query.id;
        }
        return false;
      });
      if (index !== -1) {
        users[index] = { ...users[index], ...data, updated_at: new Date().toISOString() };
        writeJSON(USERS_FILE, users);
        return users[index];
      }
      return null;
    }
  },
  transactions: {
    find: (query = {}) => {
      const transactions = readJSON(TRANSACTIONS_FILE);
      if (query.user_id) {
        return transactions.filter(t => t.user_id === query.user_id);
      }
      return transactions;
    },
    create: (data) => {
      const transactions = readJSON(TRANSACTIONS_FILE);
      const id = transactions.length > 0 ? Math.max(...transactions.map(t => t.id || 0)) + 1 : 1;
      const transaction = { id, ...data, created_at: new Date().toISOString() };
      transactions.push(transaction);
      writeJSON(TRANSACTIONS_FILE, transactions);
      return transaction;
    }
  },
  games: {
    find: (query = {}) => {
      const games = readJSON(GAMES_FILE);
      if (query.user_id) {
        return games.filter(g => g.user_id === query.user_id);
      }
      if (query.id && query.user_id) {
        return games.filter(g => g.id === query.id && g.user_id === query.user_id);
      }
      return games;
    },
    findOne: (query = {}) => {
      const games = readJSON(GAMES_FILE);
      if (query.id && query.user_id) {
        return games.find(g => g.id === query.id && g.user_id === query.user_id) || null;
      }
      return null;
    },
    create: (data) => {
      const games = readJSON(GAMES_FILE);
      const id = games.length > 0 ? Math.max(...games.map(g => g.id || 0)) + 1 : 1;
      const game = { id, ...data, created_at: new Date().toISOString() };
      games.push(game);
      writeJSON(GAMES_FILE, games);
      return game;
    },
    update: (query, data) => {
      const games = readJSON(GAMES_FILE);
      const index = games.findIndex(g => g.id === query.id && g.user_id === query.user_id);
      if (index !== -1) {
        games[index] = { ...games[index], ...data };
        writeJSON(GAMES_FILE, games);
        return games[index];
      }
      return null;
    }
  },
  referrals: {
    find: (query = {}) => {
      const referrals = readJSON(REFERRALS_FILE);
      if (query.referrer_id) {
        return referrals.filter(r => r.referrer_id === query.referrer_id);
      }
      return referrals;
    },
    create: (data) => {
      const referrals = readJSON(REFERRALS_FILE);
      const exists = referrals.find(r => r.referrer_id === data.referrer_id && r.referred_id === data.referred_id);
      if (exists) return exists;
      const id = referrals.length > 0 ? Math.max(...referrals.map(r => r.id || 0)) + 1 : 1;
      const referral = { id, ...data, created_at: new Date().toISOString() };
      referrals.push(referral);
      writeJSON(REFERRALS_FILE, referrals);
      return referral;
    },
    update: (query, data) => {
      const referrals = readJSON(REFERRALS_FILE);
      const index = referrals.findIndex(r => r.referrer_id === query.referrer_id && r.referred_id === query.referred_id);
      if (index !== -1) {
        referrals[index] = { ...referrals[index], ...data };
        writeJSON(REFERRALS_FILE, referrals);
        return referrals[index];
      }
      return null;
    }
  },
  settings: {
    get: (key) => {
      const settings = readJSON(SETTINGS_FILE);
      return settings[key] || null;
    },
    set: (key, value) => {
      const settings = readJSON(SETTINGS_FILE);
      settings[key] = value;
      writeJSON(SETTINGS_FILE, settings);
    }
  }
};

export async function initDatabase() {
  console.log('✅ Database initialized (JSON file system)');
  return db;
}

export function getDatabase() {
  return db;
}

export function closeDatabase() {
  // Nothing to close for JSON files
}
