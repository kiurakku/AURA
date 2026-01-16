export function shareWin(gameName, winAmount, multiplier = null) {
  if (window.Telegram?.WebApp) {
    const message = multiplier 
      ? `Я виграв ${winAmount.toFixed(2)} USDT у грі ${gameName} з множником ${multiplier.toFixed(2)}x! Приєднуйся до Aura Games!`
      : `Я виграв ${winAmount.toFixed(2)} USDT у грі ${gameName}! Приєднуйся до Aura Games!`;
    
    window.Telegram.WebApp.showPopup(
      {
        title: 'Поділитися виграшем!',
        message: message,
        buttons: [
          { id: 'share', type: 'default', text: 'Поділитися' },
          { id: 'cancel', type: 'cancel', text: 'Скасувати' }
        ]
      },
      (buttonId) => {
        if (buttonId === 'share') {
          window.Telegram.WebApp.shareUrl(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`);
        }
      }
    );
  } else {
    console.log(`Share Win: ${gameName}, Amount: ${winAmount}, Multiplier: ${multiplier}`);
    alert(`Поділитися виграшем: Я виграв ${winAmount.toFixed(2)} USDT у грі ${gameName}!`);
  }
}
