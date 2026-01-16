import React, { useState, useEffect, useRef } from 'react';
import './CrashGame.css';
import { api } from '../../utils/api';
import { shareWin } from '../../utils/shareWin';

function CrashGame({ initData, onBack, onBalanceUpdate, botMode = false }) {
  const [betAmount, setBetAmount] = useState(1.0);
  const [autoCashout, setAutoCashout] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.00);
  const [history, setHistory] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [crashed, setCrashed] = useState(false);
  const [actualMultiplier, setActualMultiplier] = useState(null);
  const animationRef = useRef(null);
  const gameStartTime = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      if (!initData) return;
      const response = await api.get('/api/games/history?limit=20', {
        headers: { 'x-telegram-init-data': initData }
      });
      const crashGames = response.data.games
        .filter(g => g.game_type === 'crash')
        .slice(0, 10)
        .map(g => {
          const data = JSON.parse(g.game_data || '{}');
          return data.multiplier || data.cashout_multiplier || 1.0;
        });
      setHistory(crashGames.reverse());
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const startGame = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setMultiplier(1.00);
    setCrashed(false);
    setActualMultiplier(null);
    gameStartTime.current = Date.now();

    try {
      if (!initData && !botMode) {
        alert('Помилка авторизації');
        setIsPlaying(false);
        return;
      }
      
      // Start game on server (or bot mode)
        const endpoint = botMode ? '/api/games/crash/bot' : '/api/games/crash';
      const response = await api.post(endpoint, {
        bet_amount: botMode ? 0 : betAmount,
        auto_cashout: autoCashout,
        action: 'start'
      }, {
        headers: botMode ? {} : { 'x-telegram-init-data': initData }
      });

      const result = response.data;
      
      // Check for insufficient balance error
      if (result.error === 'Insufficient balance' || response.status === 400) {
        setIsPlaying(false);
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert(
            'Недостатньо коштів на балансі!\n\n' +
            'Мінімальна ставка: 0.1 USDT\n' +
            'Поповніть баланс, щоб продовжити гру.'
          );
          // Navigate to wallet
          window.dispatchEvent(new CustomEvent('navigate', { detail: 'wallet' }));
        } else {
          alert('Недостатньо коштів на балансі! Мінімальна ставка: 0.1 USDT');
        }
        return;
      }
      
      if (!botMode) {
        setGameId(result.game_id);
        onBalanceUpdate();
      }
      setActualMultiplier(result.multiplier || result.crashed_at);

      // Animate multiplier
      const animate = () => {
        if (!isPlaying || crashed) return;
        
        const elapsed = (Date.now() - gameStartTime.current) / 1000;
        const newMultiplier = 1.00 + (elapsed * 0.1);
        setMultiplier(newMultiplier);

        // Check auto cashout
        if (autoCashout && newMultiplier >= autoCashout) {
          cashout(newMultiplier);
          return;
        }

        // Check if reached actual multiplier
        if (newMultiplier >= result.multiplier) {
          // Crashed
          setCrashed(true);
          setIsPlaying(false);
          cancelAnimationFrame(animationRef.current);
          setMultiplier(result.multiplier);
          alert('Гра завершена');
          onBalanceUpdate();
          fetchHistory();
          return;
        }

        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } catch (error) {
      console.error('Game error:', error);
      setIsPlaying(false);
      setCrashed(true);
      cancelAnimationFrame(animationRef.current);
      
      // Check for insufficient balance
      if (error.response?.status === 400 && error.response?.data?.error === 'Insufficient balance') {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert(
            'Недостатньо коштів на балансі!\n\n' +
            'Мінімальна ставка: 0.1 USDT\n' +
            'Поповніть баланс, щоб продовжити гру.'
          );
          window.dispatchEvent(new CustomEvent('navigate', { detail: 'wallet' }));
        } else {
          alert('Недостатньо коштів на балансі! Мінімальна ставка: 0.1 USDT');
        }
      } else {
        alert(error.response?.data?.error || 'Помилка гри');
      }
    }
  };

  const cashout = async (currentMult = null) => {
    if (botMode) {
      alert(`🤖 Бот вивів на ${currentMult?.toFixed(2) || multiplier.toFixed(2)}x! (Гра безкоштовна)`);
      setIsPlaying(false);
      setCrashed(true);
      cancelAnimationFrame(animationRef.current);
      return;
    }
    if (!isPlaying || crashed || !gameId) return;
    
    const cashoutMult = currentMult || multiplier;
    cancelAnimationFrame(animationRef.current);
    setIsPlaying(false);
    setCrashed(true);
    
    try {
      const response = await api.post('/api/games/crash', {
        game_id: gameId,
        action: 'cashout',
        cashout_multiplier: cashoutMult
      }, {
        headers: { 'x-telegram-init-data': initData }
      });

      const result = response.data;
      setMultiplier(result.multiplier);
      onBalanceUpdate();
      fetchHistory();
      
      if (result.win_amount > 0) {
        alert(`💰 Ви вивели кошти! Множник: ${result.multiplier.toFixed(2)}x. Виграш: ${result.win_amount.toFixed(2)} USDT`);
        // Offer to share win
        if (window.confirm('Поділитися виграшем з друзями?')) {
          shareWin('Crash', result.win_amount, result.multiplier);
        }
      }
    } catch (error) {
      console.error('Cashout error:', error);
      alert(error.response?.data?.error || 'Помилка виводу');
    }
  };

  return (
    <div className="crash-game">
      <button className="back-btn" onClick={onBack}>← Назад</button>
      
      <div className="crash-container glass-card">
        <div className="multiplier-display">
          <div className={`multiplier-value ${isPlaying ? 'animating' : ''}`}>
            {multiplier.toFixed(2)}x
          </div>
          {autoCashout && (
            <div className="auto-cashout-indicator">
              Автовихід: {autoCashout}x
            </div>
          )}
        </div>

        <div className="crash-history">
          {history.map((mult, index) => (
            <div 
              key={index} 
              className={`history-item ${mult < 2 ? 'low' : mult > 10 ? 'high' : 'medium'}`}
            >
              {mult.toFixed(2)}x
            </div>
          ))}
        </div>

        <div className="bet-controls">
          <div className="bet-input-group">
            <label>Сума ставки</label>
            <input
              type="number"
              className="input"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
              min="0.1"
              step="0.1"
              disabled={isPlaying}
            />
          </div>

          <div className="bet-input-group">
            <label>Автовихід (опціонально)</label>
            <input
              type="number"
              className="input"
              value={autoCashout || ''}
              onChange={(e) => setAutoCashout(e.target.value ? parseFloat(e.target.value) : null)}
              min="1.01"
              step="0.01"
              placeholder="Наприклад: 2.00"
              disabled={isPlaying}
            />
          </div>

          <div className="quick-bets">
            <button 
              className="quick-bet-btn"
              onClick={() => setBetAmount(1.0)}
              disabled={isPlaying}
            >1 USDT</button>
            <button 
              className="quick-bet-btn"
              onClick={() => setBetAmount(5.0)}
              disabled={isPlaying}
            >5 USDT</button>
            <button 
              className="quick-bet-btn"
              onClick={() => setBetAmount(10.0)}
              disabled={isPlaying}
            >10 USDT</button>
          </div>
        </div>

        <div className="game-actions">
          {!isPlaying ? (
            <button className="btn btn-primary start-btn" onClick={startGame}>
              Ставка
            </button>
          ) : (
            <button className="btn btn-secondary cashout-btn" onClick={() => cashout()}>
              Вивести
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrashGame;
