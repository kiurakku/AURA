import crypto from 'crypto';

/**
 * Provably Fair Game Engine
 */

/**
 * Generates server seed
 */
export function generateServerSeed() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generates client seed (from user input or random)
 */
export function generateClientSeed() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Creates result hash for provably fair verification
 */
export function createResultHash(serverSeed, clientSeed, nonce) {
  const data = `${serverSeed}:${clientSeed}:${nonce}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Crash game - generates multiplier
 */
export function calculateCrashMultiplier(serverSeed, clientSeed, nonce) {
  const hash = createResultHash(serverSeed, clientSeed, nonce);
  const hex = hash.substring(0, 8);
  const int = parseInt(hex, 16);
  const max = 0xFFFFFFFF;
  
  // Convert to float between 0 and 1
  const float = int / max;
  
  // Calculate multiplier (1.00 to 100.00)
  // Using formula: multiplier = 1 + (99 * (1 - float^2))
  const multiplier = 1 + (99 * (1 - Math.pow(float, 2)));
  
  // Round to 2 decimal places, minimum 1.00
  return Math.max(1.00, Math.round(multiplier * 100) / 100);
}

/**
 * Dice game - generates result (0-100)
 */
export function calculateDiceResult(serverSeed, clientSeed, nonce) {
  const hash = createResultHash(serverSeed, clientSeed, nonce);
  const hex = hash.substring(0, 8);
  const int = parseInt(hex, 16);
  const max = 0xFFFFFFFF;
  
  const float = int / max;
  return Math.floor(float * 100);
}

/**
 * Mines game - generates mine positions
 */
export function calculateMinesPositions(serverSeed, clientSeed, nonce, gridSize = 25, mineCount = 3) {
  const hash = createResultHash(serverSeed, clientSeed, nonce);
  const positions = [];
  let used = new Set();
  
  // Use hash to deterministically select mine positions
  for (let i = 0; i < mineCount; i++) {
    let pos;
    let attempts = 0;
    do {
      const hashPart = hash.substring(i * 2, (i * 2) + 8);
      const num = parseInt(hashPart, 16) % gridSize;
      pos = num;
      attempts++;
    } while (used.has(pos) && attempts < 100);
    
    used.add(pos);
    positions.push(pos);
  }
  
  return positions.sort((a, b) => a - b);
}

/**
 * Plinko game - calculates ball path and multiplier
 */
export function calculatePlinkoResult(serverSeed, clientSeed, nonce, rows = 12) {
  const hash = createResultHash(serverSeed, clientSeed, nonce);
  const path = [];
  let position = Math.floor(rows / 2);
  
  // Simulate ball falling through pegs
  for (let i = 0; i < rows; i++) {
    const hashPart = hash.substring(i * 2, (i * 2) + 2);
    const direction = parseInt(hashPart, 16) % 2; // 0 = left, 1 = right
    
    if (direction === 0 && position > 0) {
      position--;
    } else if (direction === 1 && position < rows) {
      position++;
    }
    
    path.push(position);
  }
  
  // Calculate multiplier based on final position
  const multipliers = [0.2, 0.4, 0.6, 1, 1.5, 2, 3, 5, 10, 5, 3, 2, 1.5, 1, 0.6, 0.4, 0.2];
  const multiplier = multipliers[position] || 1;
  
  return { path, position, multiplier };
}

/**
 * Applies RTP (Return to Player) adjustment
 */
export function applyRTP(result, rtp = 95) {
  const rtpFactor = rtp / 100;
  return result * rtpFactor;
}
