// Use JSON file database (no compilation needed)
import { getDatabase as getJsonDb, initDatabase as initJsonDb } from './db-simple.js';

export async function initDatabase() {
  return await initJsonDb();
}

export async function getDatabase() {
  const db = getJsonDb();
  
  // Create a compatible interface that mimics better-sqlite3
  return {
    prepare: (sql) => {
      return {
        get: (...params) => {
          if (sql.includes('SELECT') && sql.includes('FROM users') && sql.includes('WHERE telegram_id')) {
            return db.users.findOne({ telegram_id: params[0] });
          }
          if (sql.includes('SELECT') && sql.includes('FROM users') && sql.includes('WHERE referral_code')) {
            return db.users.findOne({ referral_code: params[0] });
          }
          if (sql.includes('SELECT balance, bonus_balance FROM users')) {
            const user = db.users.findOne({ telegram_id: params[0] });
            return user ? { balance: user.balance || 0, bonus_balance: user.bonus_balance || 0 } : null;
          }
          if (sql.includes('SELECT balance FROM users')) {
            const user = db.users.findOne({ telegram_id: params[0] });
            return user ? { balance: user.balance || 0 } : null;
          }
          if (sql.includes('SELECT privacy_settings FROM users')) {
            const user = db.users.findOne({ telegram_id: params[0] });
            return user ? { privacy_settings: user.privacy_settings || null } : null;
          }
          if (sql.includes('SELECT id FROM users') && sql.includes('WHERE telegram_id')) {
            const user = db.users.findOne({ telegram_id: params[0] });
            return user ? { id: user.id } : null;
          }
          if (sql.includes('SELECT * FROM users') && sql.includes('WHERE telegram_id')) {
            return db.users.findOne({ telegram_id: params[0] });
          }
          return null;
        },
        all: (...params) => {
          if (sql.includes('SELECT') && sql.includes('FROM games') && sql.includes('WHERE user_id')) {
            if (sql.includes('ORDER BY id DESC LIMIT 1')) {
              const games = db.games.find({ user_id: params[0] });
              return games.length > 0 ? [games.sort((a, b) => (b.id || 0) - (a.id || 0))[0]] : [];
            }
            return db.games.find({ user_id: params[0] }).slice(0, params[1] || 50);
          }
          if (sql.includes('SELECT') && sql.includes('FROM games') && sql.includes('WHERE id') && sql.includes('AND user_id')) {
            const game = db.games.findOne({ id: params[0], user_id: params[1] });
            return game ? [game] : [];
          }
          if (sql.includes('SELECT') && sql.includes('FROM transactions') && sql.includes('WHERE user_id')) {
            return db.transactions.find({ user_id: params[0] }).slice(0, params[1] || 50);
          }
          if (sql.includes('SELECT') && sql.includes('FROM referrals') && sql.includes('WHERE referrer_id')) {
            return db.referrals.find({ referrer_id: params[0] });
          }
          return [];
        },
        run: (...params) => {
          const paramsArray = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          let result = null;
          
          if (sql.includes('INSERT INTO users')) {
            if (sql.includes('referred_by')) {
              // INSERT INTO users (telegram_id, username, first_name, referral_code, referred_by) VALUES (?, ?, ?, ?, ?)
              const [telegram_id, username, first_name, referral_code, referred_by] = paramsArray;
              db.users.create({ telegram_id, username, first_name, referral_code, referred_by, balance: 0, bonus_balance: 0, is_admin: 0, is_banned: 0, total_wagered: 0, total_xp: 0, rank_id: 1, rank_name: 'Newbie' });
            } else if (sql.includes('total_wagered')) {
              // INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, referral_code, referred_by, balance, bonus_balance, total_wagered, total_xp, rank_id, rank_name) VALUES (...)
              const [telegram_id, username, first_name, last_name, photo_url, referral_code, referred_by, balance, bonus_balance, total_wagered, total_xp, rank_id, rank_name] = paramsArray;
              db.users.create({ telegram_id, username, first_name, last_name, photo_url, referral_code, referred_by, balance, bonus_balance, total_wagered, total_xp, rank_id, rank_name, is_admin: 0, is_banned: 0 });
            } else {
              // INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, referral_code) VALUES (?, ?, ?, ?, ?, ?)
              const [telegram_id, username, first_name, last_name, photo_url, referral_code] = paramsArray;
              db.users.create({ telegram_id, username, first_name, last_name, photo_url, referral_code, balance: 0, bonus_balance: 0, is_admin: 0, is_banned: 0, total_wagered: 0, total_xp: 0, rank_id: 1, rank_name: 'Newbie' });
            }
          }
          if (sql.includes('UPDATE users') && sql.includes('SET balance')) {
            const [balance, telegram_id] = paramsArray;
            db.users.update({ telegram_id }, { balance });
          }
          if (sql.includes('UPDATE users') && sql.includes('SET total_wagered')) {
            const [total_wagered, total_xp, rank_id, rank_name, telegram_id] = paramsArray;
            db.users.update({ telegram_id }, { total_wagered, total_xp, rank_id, rank_name });
          }
          if (sql.includes('SELECT * FROM users') && !sql.includes('WHERE')) {
            return db.users.findAll();
          }
          if (sql.includes('UPDATE users') && sql.includes('SET bonus_balance')) {
            // Check if it's an increment operation (bonus_balance + ?)
            if (sql.includes('bonus_balance +')) {
              // Handle increment: UPDATE users SET bonus_balance = bonus_balance + ? WHERE telegram_id = ?
              const [increment, telegram_id] = paramsArray;
              const user = db.users.findOne({ telegram_id });
              if (user) {
                db.users.update({ telegram_id }, { bonus_balance: (user.bonus_balance || 0) + increment });
              }
            } else {
              // Handle set: UPDATE users SET bonus_balance = ? WHERE telegram_id = ?
              const [bonus_balance, telegram_id] = paramsArray;
              db.users.update({ telegram_id }, { bonus_balance });
            }
          }
          if (sql.includes('UPDATE users') && sql.includes('SET username')) {
            const [username, first_name, last_name, photo_url, telegram_id] = paramsArray;
            db.users.update({ telegram_id }, { username, first_name, last_name, photo_url });
          }
          if (sql.includes('UPDATE users') && sql.includes('SET privacy_settings')) {
            const [privacy_settings, telegram_id] = paramsArray;
            db.users.update({ telegram_id }, { privacy_settings });
          }
          if (sql.includes('INSERT INTO transactions')) {
            // Check if currency is provided (6 params) or not (5 params)
            if (paramsArray.length === 6) {
              const [user_id, type, amount, currency, status, description] = paramsArray;
              db.transactions.create({ user_id, type, amount, currency: currency || 'USDT', status, description });
            } else {
              const [user_id, type, amount, status, description] = paramsArray;
              db.transactions.create({ user_id, type, amount, currency: 'USDT', status, description });
            }
          }
          if (sql.includes('INSERT INTO games')) {
            const [user_id, game_type, bet_amount, win_amount, game_data, server_seed, client_seed, result_hash] = paramsArray;
            const game = db.games.create({ user_id, game_type, bet_amount, win_amount, game_data, server_seed, client_seed, result_hash, is_provably_fair: 1 });
            result = { lastInsertRowid: game.id };
          }
          if (sql.includes('UPDATE games') && sql.includes('SET win_amount')) {
            const [win_amount, game_data, id] = paramsArray;
            // Extract user_id from WHERE clause if present
            const user_id = paramsArray.length > 3 ? paramsArray[3] : null;
            if (user_id) {
              db.games.update({ id, user_id }, { win_amount, game_data });
            }
          }
          if (sql.includes('INSERT OR IGNORE INTO referrals')) {
            const [referrer_id, referred_id] = paramsArray;
            db.referrals.create({ referrer_id, referred_id, total_earnings: 0 });
          }
        }
      };
    }
  };
}

export function closeDatabase() {
  // Nothing to close for JSON files
}
