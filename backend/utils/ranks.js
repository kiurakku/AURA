// Rank system calculations
export const RANKS = [
  { id: 1, name: 'Newbie', icon: '🟤', turnover: 0, cashback: 0.01, color: '#CD7F32' },
  { id: 2, name: 'Gambler', icon: '⚪', turnover: 500, cashback: 0.03, color: '#C0C0C0' },
  { id: 3, name: 'High Roller', icon: '🟡', turnover: 5000, cashback: 0.05, color: '#FFD700' },
  { id: 4, name: 'Pro', icon: '💎', turnover: 10000, cashback: 0.07, color: '#B9F2FF' },
  { id: 5, name: 'Elite', icon: '👑', turnover: 25000, cashback: 0.10, color: '#FF6B9D' },
  { id: 6, name: 'Aura Legend', icon: '⭐', turnover: 50000, cashback: 0.15, color: '#FFD700' }
];

export function calculateRank(totalWagered) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalWagered >= RANKS[i].turnover) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

export function calculateXP(betAmount) {
  // $1 ставки = 1 XP
  return Math.floor(betAmount);
}

export function getNextRank(currentRank) {
  const currentIndex = RANKS.findIndex(r => r.id === currentRank.id);
  if (currentIndex < RANKS.length - 1) {
    return RANKS[currentIndex + 1];
  }
  return null;
}

export function getProgressToNextRank(currentWagered, currentRank) {
  const nextRank = getNextRank(currentRank);
  if (!nextRank) return { progress: 100, needed: 0 };
  
  const progress = ((currentWagered - currentRank.turnover) / (nextRank.turnover - currentRank.turnover)) * 100;
  const needed = nextRank.turnover - currentWagered;
  
  return {
    progress: Math.min(100, Math.max(0, progress)),
    needed: Math.max(0, needed)
  };
}
