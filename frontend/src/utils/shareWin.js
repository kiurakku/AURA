// Share Win utility - generates share data for wins
export function generateShareData(username, winAmount, gameType, referralLink) {
  return {
    username,
    win_amount: winAmount.toFixed(2),
    game_type: gameType,
    referral_link: referralLink,
    timestamp: new Date().toISOString()
  };
}

export async function shareWin(initData, gameId, winAmount, gameType) {
  try {
    const { api } = await import('./api.js');
    const response = await api.post('/share-win', {
      game_id: gameId,
      win_amount: winAmount,
      game_type: gameType
    }, {
      headers: { 'x-telegram-init-data': initData }
    });

    const shareData = response.data.share_data;
    
    // Create share text
    const shareText = `🎉 Я виграв ${shareData.win_amount} USDT у ${shareData.game_type}!\n\n` +
      `Приєднуйся до AURA Casino та вигравай разом зі мною!\n\n` +
      `${shareData.referral_link}`;
    
    // Share via Telegram
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.switchInlineQuery(shareText, ['current_chat']);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Текст скопійовано! Поділіться ним з друзями.');
    }
    
    return shareData;
  } catch (error) {
    console.error('Share win error:', error);
    alert('Помилка при спробі поділитися виграшем');
  }
}
