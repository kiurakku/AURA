import React, { useState, useEffect, useRef } from 'react';
import './CrashGame.css';
import { api } from '../../utils/api';

function CrashGame({ initData, onBack, onBalanceUpdate }) {
  const [betAmount, setBetAmount] = useState(1.0);
  const [autoCashout, setAutoCashout] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.00);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/games/history?limit=20', {
        headers: { 'x-telegram-init-data': initData }
      });
      const crashGames = response.data.games
        .filter(g => g.game_type === 'crash')
        .slice(0, 10)
        .map(g => {
          const data = JSON.parse(g.game_data || '{}');
          return data.multiplier || 1.0;
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

    // Animate multiplier
    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newMultiplier = 1.00 + (elapsed * 0.1);
      setMultiplier(newMultiplier);

      if (newMultiplier < 100) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animate();

    // Make API call after animation
    setTimeout(async () => {
      try {
        const response = await api.post('/games/crash', {
          bet_amount: betAmount,
          auto_cashout: autoCashout
        }, {
          headers: { 'x-telegram-init-data': initData }
        });

        const result = response.data;
        setMultiplier(result.multiplier);
        setIsPlaying(false);
        onBalanceUpdate();
        fetchHistory();
        
        if (result.win_amount > 0) {
          alert(`Ви виграли ${result.win_amount.toFixed(2)} USDT!`);
        }
      } catch (error) {
        console.error('Game error:', error);
        setIsPlaying(false);
        alert(error.response?.data?.error || 'Помилка гри');
      }
    }, 2000);
  };

  const cashout = () => {
    if (!isPlaying) return;
    cancelAnimationFrame(animationRef.current);
    // Cashout logic handled by API
  };

  return (
    <div className="crash-game">
      <button className="back-btn" onClick={onBack}>← Назад</button>
      
      <div className="crash-container glass">
        <div className="multiplier-display">
          <div className="multiplier-value">{multiplier.toFixed(2)}x</div>
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
            <button className="btn btn-secondary cashout-btn" onClick={cashout}>
              Вивести
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrashGame;
