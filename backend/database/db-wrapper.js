// Database wrapper that tries sql.js first, falls back to JSON files
import { initDatabase as initSqlDb, getDatabase as getSqlDb, dbGet, dbAll, dbRun } from './db.js';
import { initDatabase as initJsonDb, getDatabase as getJsonDb } from './db-simple.js';

let useSql = true;
let db = null;

export async function initDatabase() {
  try {
    // Try to use sql.js
    db = await initSqlDb();
    const testDb = await getSqlDb();
    if (testDb) {
      console.log('✅ Using SQL.js database');
      useSql = true;
      return db;
    }
  } catch (error) {
    console.warn('⚠️ SQL.js failed, falling back to JSON files:', error.message);
    useSql = false;
  }
  
  // Fallback to JSON files
  db = await initJsonDb();
  console.log('✅ Using JSON file database');
  useSql = false;
  return db;
}

export function getDatabase() {
  if (useSql) {
    return getSqlDb();
  } else {
    return getJsonDb();
  }
}

// Unified database interface
export async function query(sql, params = []) {
  if (useSql) {
    const database = await getSqlDb();
    if (!database) return [];
    
    try {
      const stmt = database.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    } catch (e) {
      console.error('SQL error:', e);
      return [];
    }
  } else {
    // JSON database - convert SQL to JSON operations
    const db = getJsonDb();
    // Simple query parsing for common cases
    if (sql.includes('SELECT') && sql.includes('FROM users') && sql.includes('WHERE telegram_id')) {
      const user = db.users.findOne({ telegram_id: params[0] });
      return user ? [user] : [];
    }
    if (sql.includes('SELECT') && sql.includes('FROM users') && sql.includes('WHERE referral_code')) {
      const user = db.users.findOne({ referral_code: params[0] });
      return user ? [user] : [];
    }
    if (sql.includes('SELECT') && sql.includes('FROM transactions') && sql.includes('WHERE user_id')) {
      return db.transactions.find({ user_id: params[0] });
    }
    if (sql.includes('SELECT') && sql.includes('FROM games') && sql.includes('WHERE user_id')) {
      return db.games.find({ user_id: params[0] });
    }
    if (sql.includes('SELECT') && sql.includes('FROM referrals') && sql.includes('WHERE referrer_id')) {
      return db.referrals.find({ referrer_id: params[0] });
    }
    return [];
  }
}

export async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results[0] || null;
}

export async function execute(sql, params = []) {
  if (useSql) {
    const database = await getSqlDb();
    if (!database) return;
    try {
      dbRun(sql, params);
    } catch (e) {
      console.error('SQL execute error:', e);
    }
  } else {
    const db = getJsonDb();
    // Convert SQL INSERT/UPDATE to JSON operations
    if (sql.includes('INSERT INTO users')) {
      const [telegram_id, username, first_name, last_name, photo_url, referral_code] = params;
      return db.users.create({ telegram_id, username, first_name, last_name, photo_url, referral_code, balance: 0, bonus_balance: 0 });
    }
    if (sql.includes('UPDATE users') && sql.includes('SET balance')) {
      const [balance, telegram_id] = params;
      return db.users.update({ telegram_id }, { balance });
    }
    if (sql.includes('UPDATE users') && sql.includes('SET bonus_balance')) {
      const [bonus_balance, telegram_id] = params;
      return db.users.update({ telegram_id }, { bonus_balance });
    }
    if (sql.includes('UPDATE users') && sql.includes('SET username')) {
      const [username, first_name, last_name, photo_url, telegram_id] = params;
      return db.users.update({ telegram_id }, { username, first_name, last_name, photo_url });
    }
    if (sql.includes('INSERT INTO transactions')) {
      const [user_id, type, amount, status, description] = params;
      return db.transactions.create({ user_id, type, amount, currency: 'USDT', status, description });
    }
    if (sql.includes('INSERT INTO games')) {
      const [user_id, game_type, bet_amount, win_amount, game_data, server_seed, client_seed, result_hash] = params;
      return db.games.create({ user_id, game_type, bet_amount, win_amount, game_data, server_seed, client_seed, result_hash, is_provably_fair: 1 });
    }
    if (sql.includes('INSERT OR IGNORE INTO referrals')) {
      const [referrer_id, referred_id] = params;
      return db.referrals.create({ referrer_id, referred_id, total_earnings: 0 });
    }
  }
}

export function closeDatabase() {
  // Both implementations handle this
}
