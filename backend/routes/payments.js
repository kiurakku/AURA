import express from 'express';
import { getDatabase } from '../database/db.js';
import { validateTelegramWebApp, parseUserData, isAuthDataRecent } from '../utils/telegram-validator.js';
import { createInvoice, getInvoiceStatus, transferFunds, getExchangeRates } from '../utils/crypto-pay.js';

// Middleware to validate Telegram WebApp (same as in api.js)
function validateTelegramAuth(req, res, next) {
  const initData = req.headers['x-telegram-init-data'] || req.body.initData;
  
  if (!initData) {
    console.error('❌ /payments: Missing initData', {
      headers: Object.keys(req.headers),
      hasBody: !!req.body,
      url: req.url
    });
    return res.status(401).json({ error: 'Missing Telegram initData' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('❌ /payments: Bot token not configured');
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    if (!validateTelegramWebApp(initData, botToken)) {
      console.error('❌ /payments: Invalid Telegram auth data');
      return res.status(401).json({ error: 'Invalid Telegram auth data' });
    }

    const userData = parseUserData(initData);
    if (!userData) {
      console.error('❌ /payments: Failed to parse user data');
      return res.status(401).json({ error: 'Failed to parse user data' });
    }

    if (!isAuthDataRecent(initData)) {
      console.error('❌ /payments: Auth data expired');
      return res.status(401).json({ error: 'Auth data expired' });
    }

    req.user = userData;
    next();
  } catch (error) {
    console.error('❌ /payments: Auth validation error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

const router = express.Router();
let db = null;

// Initialize database
getDatabase().then(database => {
  db = database;
});

// Create deposit invoice
router.post('/deposit', validateTelegramAuth, async (req, res) => {
  try {
    const { amount, currency = 'USDT' } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount. Minimum 1 USDT' });
    }

    if (!db) db = await getDatabase();
    
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create invoice via Crypto Pay
    const invoiceResult = await createInvoice(
      amount,
      req.user.id.toString(),
      `Deposit ${amount} ${currency} to AURA Casino`
    );

    if (!invoiceResult.success) {
      return res.status(500).json({ error: invoiceResult.error });
    }

    // Save pending transaction
    const transactionId = db.prepare(`
      INSERT INTO transactions (user_id, type, amount, currency, status, description, metadata)
      VALUES (?, 'deposit', ?, ?, 'pending', ?, ?)
    `).run(
      user.id,
      amount,
      currency,
      `Deposit ${amount} ${currency}`,
      JSON.stringify({
        invoice_id: invoiceResult.invoice_id,
        pay_url: invoiceResult.pay_url,
        hash: invoiceResult.hash
      })
    ).lastInsertRowid;

    res.json({
      success: true,
      invoice_id: invoiceResult.invoice_id,
      pay_url: invoiceResult.pay_url,
      amount: invoiceResult.amount,
      currency: invoiceResult.asset,
      transaction_id: transactionId
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ error: 'Failed to create deposit' });
  }
});

// Check deposit status
router.get('/deposit/:invoiceId/status', validateTelegramAuth, async (req, res) => {
  try {
    const { invoiceId } = req.params;

    if (!db) db = await getDatabase();
    
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get invoice status from Crypto Pay
    const statusResult = await getInvoiceStatus(parseInt(invoiceId));

    if (!statusResult.success) {
      return res.status(404).json({ error: statusResult.error });
    }

    const invoice = statusResult.invoice;

    // If paid, update user balance and transaction
    if (invoice.status === 'paid' && invoice.paid_anonymously === false) {
      // Check if already processed
      const existingTransaction = db.prepare(`
        SELECT * FROM transactions 
        WHERE metadata LIKE ? AND status = 'completed'
      `).get(`%"invoice_id":${invoiceId}%`);

      if (!existingTransaction) {
        // Update balance
        const amount = parseFloat(invoice.amount);
        const newBalance = (user.balance || 0) + amount;
        db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(newBalance, req.user.id);

        // Update transaction
        db.prepare(`
          UPDATE transactions 
          SET status = 'completed', updated_at = CURRENT_TIMESTAMP
          WHERE metadata LIKE ? AND status = 'pending'
        `).run(`%"invoice_id":${invoiceId}%`);

        // Create completed transaction record
        db.prepare(`
          INSERT INTO transactions (user_id, type, amount, currency, status, description, metadata)
          VALUES (?, 'deposit', ?, 'USDT', 'completed', ?, ?)
        `).run(
          user.id,
          amount,
          `Deposit ${amount} USDT`,
          JSON.stringify({ invoice_id: invoiceId, paid_at: invoice.paid_at })
        );
      }
    }

    res.json({
      success: true,
      status: invoice.status,
      amount: invoice.amount,
      paid_at: invoice.paid_at,
      paid_anonymously: invoice.paid_anonymously
    });
  } catch (error) {
    console.error('Deposit status error:', error);
    res.status(500).json({ error: 'Failed to check deposit status' });
  }
});

// Create withdrawal request
router.post('/withdraw', validateTelegramAuth, async (req, res) => {
  try {
    const { amount, currency = 'USDT' } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount. Minimum 1 USDT' });
    }

    if (!db) db = await getDatabase();
    
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const balance = (user.balance || 0);
    if (balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create withdrawal transaction (pending admin approval)
    const transactionId = db.prepare(`
      INSERT INTO transactions (user_id, type, amount, currency, status, description, metadata)
      VALUES (?, 'withdrawal', ?, ?, 'pending', ?, ?)
    `).run(
      user.id,
      amount,
      currency,
      `Withdrawal ${amount} ${currency}`,
      JSON.stringify({
        user_telegram_id: req.user.id,
        requested_at: new Date().toISOString()
      })
    ).lastInsertRowid;

    // Reserve balance (deduct immediately)
    const newBalance = balance - amount;
    db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(newBalance, req.user.id);

    res.json({
      success: true,
      transaction_id: transactionId,
      amount: amount,
      currency: currency,
      status: 'pending',
      message: 'Withdrawal request created. Waiting for admin approval.'
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ error: 'Failed to create withdrawal' });
  }
});

// Process withdrawal (admin only - called after admin approval)
router.post('/withdraw/:transactionId/process', async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!db) db = await getDatabase();

    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(parseInt(transactionId));
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Transaction already processed' });
    }

    const metadata = JSON.parse(transaction.metadata || '{}');
    const userId = metadata.user_telegram_id;

    // Transfer funds via Crypto Pay
    const transferResult = await transferFunds(
      userId,
      transaction.amount,
      `Withdrawal ${transaction.amount} ${transaction.currency} from AURA Casino`
    );

    if (!transferResult.success) {
      // Refund balance if transfer failed
      const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(userId);
      if (user) {
        const newBalance = (user.balance || 0) + transaction.amount;
        db.prepare('UPDATE users SET balance = ? WHERE telegram_id = ?').run(newBalance, userId);
      }

      // Update transaction status
      db.prepare(`
        UPDATE transactions 
        SET status = 'failed', updated_at = CURRENT_TIMESTAMP, metadata = ?
        WHERE id = ?
      `).run(
        JSON.stringify({ ...metadata, error: transferResult.error }),
        transactionId
      );

      return res.status(500).json({ error: transferResult.error });
    }

    // Update transaction status
    db.prepare(`
      UPDATE transactions 
      SET status = 'completed', updated_at = CURRENT_TIMESTAMP, metadata = ?
      WHERE id = ?
    `).run(
      JSON.stringify({ ...metadata, transfer_id: transferResult.transfer_id }),
      transactionId
    );

    res.json({
      success: true,
      transfer_id: transferResult.transfer_id,
      message: 'Withdrawal processed successfully'
    });
  } catch (error) {
    console.error('Process withdrawal error:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

// Get exchange rates
router.get('/rates', async (req, res) => {
  try {
    const ratesResult = await getExchangeRates();

    if (!ratesResult.success) {
      return res.status(500).json({ error: ratesResult.error });
    }

    res.json({
      success: true,
      rates: ratesResult.rates
    });
  } catch (error) {
    console.error('Exchange rates error:', error);
    res.status(500).json({ error: 'Failed to get exchange rates' });
  }
});

// Webhook handler for Crypto Pay
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const payload = req.body;
    
    // Verify webhook
    if (!payload || !payload.update_id) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    console.log('📥 Crypto Pay webhook received:', payload);

    if (!db) db = await getDatabase();

    // Handle invoice paid event
    if (payload.update_type === 'invoice_paid') {
      const invoice = payload.payload;
      const invoiceId = invoice.invoice_id;
      const amount = parseFloat(invoice.amount);
      
      // Parse payload to get user ID
      let userId = null;
      try {
        const invoicePayload = JSON.parse(invoice.payload || '{}');
        userId = invoicePayload.userId;
      } catch (e) {
        console.error('Failed to parse invoice payload:', e);
      }

      if (!userId) {
        // Try to find transaction by invoice_id
        const transaction = db.prepare(`
          SELECT * FROM transactions 
          WHERE metadata LIKE ? AND status = 'pending'
        `).get(`%"invoice_id":${invoiceId}%`);

        if (transaction) {
          userId = transaction.user_id;
        }
      }

      if (userId) {
        // Check if already processed
        const existingTransaction = db.prepare(`
          SELECT * FROM transactions 
          WHERE metadata LIKE ? AND status = 'completed'
        `).get(`%"invoice_id":${invoiceId}%`);

        if (!existingTransaction) {
          const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
          if (user) {
            // Update balance
            const newBalance = (user.balance || 0) + amount;
            db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, userId);

            // Update transaction
            db.prepare(`
              UPDATE transactions 
              SET status = 'completed', updated_at = CURRENT_TIMESTAMP
              WHERE metadata LIKE ? AND status = 'pending'
            `).run(`%"invoice_id":${invoiceId}%`);

            // Create completed transaction record
            db.prepare(`
              INSERT INTO transactions (user_id, type, amount, currency, status, description, metadata)
              VALUES (?, 'deposit', ?, 'USDT', 'completed', ?, ?)
            `).run(
              userId,
              amount,
              `Deposit ${amount} USDT`,
              JSON.stringify({ invoice_id: invoiceId, paid_at: invoice.paid_at })
            );

            console.log(`✅ Deposit processed: ${amount} USDT for user ${userId}`);
          }
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
