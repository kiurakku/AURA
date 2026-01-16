import axios from 'axios';
import crypto from 'crypto';

const CRYPTO_PAY_API_URL = 'https://pay.crypt.bot/api';
const CRYPTO_PAY_TOKEN = process.env.CRYPTO_PAY_TOKEN;

if (!CRYPTO_PAY_TOKEN) {
  console.warn('⚠️ CRYPTO_PAY_TOKEN not set. Payment features will not work.');
}

/**
 * Create invoice for deposit
 * @param {number} amount - Amount in USDT
 * @param {string} userId - User Telegram ID
 * @param {string} description - Invoice description
 * @returns {Promise<Object>} Invoice data
 */
export async function createInvoice(amount, userId, description = 'Deposit to AURA Casino') {
  try {
    const response = await axios.post(`${CRYPTO_PAY_API_URL}/createInvoice`, {
      asset: 'USDT',
      amount: amount.toString(),
      description: description,
      paid_btn_name: 'open',
      paid_btn_url: `https://t.me/your_bot?start=deposit_${userId}`,
      payload: JSON.stringify({ userId, type: 'deposit' })
    }, {
      headers: {
        'Crypto-Pay-API-Token': CRYPTO_PAY_TOKEN
      }
    });

    if (response.data.ok) {
      return {
        success: true,
        invoice_id: response.data.result.invoice_id,
        pay_url: response.data.result.pay_url,
        hash: response.data.result.hash,
        asset: response.data.result.asset,
        amount: response.data.result.amount,
        status: response.data.result.status
      };
    }

    return {
      success: false,
      error: response.data.error?.description || 'Failed to create invoice'
    };
  } catch (error) {
    console.error('Crypto Pay createInvoice error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create invoice'
    };
  }
}

/**
 * Get invoice status
 * @param {number} invoiceId - Invoice ID
 * @returns {Promise<Object>} Invoice status
 */
export async function getInvoiceStatus(invoiceId) {
  try {
    const response = await axios.get(`${CRYPTO_PAY_API_URL}/getInvoices`, {
      params: {
        invoice_ids: invoiceId
      },
      headers: {
        'Crypto-Pay-API-Token': CRYPTO_PAY_TOKEN
      }
    });

    if (response.data.ok && response.data.result.items.length > 0) {
      return {
        success: true,
        invoice: response.data.result.items[0]
      };
    }

    return {
      success: false,
      error: 'Invoice not found'
    };
  } catch (error) {
    console.error('Crypto Pay getInvoiceStatus error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get invoice status'
    };
  }
}

/**
 * Transfer funds to user (for withdrawals)
 * @param {string} userId - User Telegram ID
 * @param {number} amount - Amount in USDT
 * @param {string} description - Transfer description
 * @returns {Promise<Object>} Transfer result
 */
export async function transferFunds(userId, amount, description = 'Withdrawal from AURA Casino') {
  try {
    const response = await axios.post(`${CRYPTO_PAY_API_URL}/transfer`, {
      user_id: parseInt(userId),
      asset: 'USDT',
      amount: amount.toString(),
      spend_id: `withdrawal_${userId}_${Date.now()}`,
      comment: description
    }, {
      headers: {
        'Crypto-Pay-API-Token': CRYPTO_PAY_TOKEN
      }
    });

    if (response.data.ok) {
      return {
        success: true,
        transfer_id: response.data.result.transfer_id,
        status: response.data.result.status
      };
    }

    return {
      success: false,
      error: response.data.error?.description || 'Failed to transfer funds'
    };
  } catch (error) {
    console.error('Crypto Pay transferFunds error:', error);
    return {
      success: false,
      error: error.message || 'Failed to transfer funds'
    };
  }
}

/**
 * Get exchange rates
 * @returns {Promise<Object>} Exchange rates
 */
export async function getExchangeRates() {
  try {
    const response = await axios.get(`${CRYPTO_PAY_API_URL}/getExchangeRates`, {
      headers: {
        'Crypto-Pay-API-Token': CRYPTO_PAY_TOKEN
      }
    });

    if (response.data.ok) {
      return {
        success: true,
        rates: response.data.result
      };
    }

    return {
      success: false,
      error: 'Failed to get exchange rates'
    };
  } catch (error) {
    console.error('Crypto Pay getExchangeRates error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get exchange rates'
    };
  }
}

/**
 * Verify webhook signature
 * @param {Object} payload - Webhook payload
 * @param {string} signature - Webhook signature
 * @returns {boolean} True if valid
 */
export function verifyWebhookSignature(payload, signature) {
  // Crypto Pay doesn't use signatures, but we can verify the payload structure
  return payload && payload.update_id && payload.update_type;
}
