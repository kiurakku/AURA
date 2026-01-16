import React, { useState } from 'react';
import './DiceGame.css';
import { api } from '../../utils/api';

function DiceGame({ initData, onBack, onBalanceUpdate }) {
  const [betAmount, setBetAmount] = useState(1.0);
  const [prediction, setPrediction] = useState('over');
  const [target, setTarget] = useState(50);
  const [result, setResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = async () => {
    if (isRolling) return;

    setIsRolling(true);
    setResult(null);

    // Animate dice roll
    setTimeout(async () => {
      try {
        const response = await api.post('/games/dice', {
          bet_amount: betAmount,
          prediction,
          target
        }, {
          headers: { 'x-telegram-init-data': initData }
        });

        const data = response.data;
        setResult(data);
        setIsRolling(false);
        onBalanceUpdate();

        if (data.won) {
          alert(`Ви виграли ${data.win_amount.toFixed(2)} USDT!`);
        } else {
          alert(`Ви програли. Результат: ${data.result}`);
        }
      } catch (error) {
        console.error('Dice error:', error);
        setIsRolling(false);
        alert(error.response?.data?.error || 'Помилка гри');
      }
    }, 1500);
  };

  return (
    <div className="dice-game">
      <button className="back-btn" onClick={onBack}>← Назад</button>
      
      <div className="dice-container glass-card">
        <div className="dice-display">
          {isRolling ? (
            <div className="dice-rolling">🎲</div>
          ) : result ? (
            <div className={`dice-result ${result.won ? 'won' : 'lost'}`}>
              <div className="dice-value">{result.result}</div>
              <div className="dice-status">{result.won ? 'Виграш!' : 'Програш'}</div>
            </div>
          ) : (
            <div className="dice-ready">🎲</div>
          )}
        </div>

        <div className="dice-controls">
          <div className="prediction-selector">
            <button
              className={`prediction-btn ${prediction === 'over' ? 'active' : ''}`}
              onClick={() => setPrediction('over')}
              disabled={isRolling}
            >
              Більше
            </button>
            <button
              className={`prediction-btn ${prediction === 'under' ? 'active' : ''}`}
              onClick={() => setPrediction('under')}
              disabled={isRolling}
            >
              Менше
            </button>
          </div>

          <div className="target-selector">
            <label>Цільове число: {target}</label>
            <input
              type="range"
              min="1"
              max="99"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value))}
              disabled={isRolling}
              className="target-slider"
            />
            <div className="target-display">{target}</div>
          </div>

          <div className="bet-input-group">
            <label>Сума ставки</label>
            <input
              type="number"
              className="input"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
              min="0.1"
              step="0.1"
              disabled={isRolling}
            />
          </div>

          <div className="quick-bets">
            <button 
              className="quick-bet-btn"
              onClick={() => setBetAmount(1.0)}
              disabled={isRolling}
            >1 USDT</button>
            <button 
              className="quick-bet-btn"
              onClick={() => setBetAmount(5.0)}
              disabled={isRolling}
            >5 USDT</button>
            <button 
              className="quick-bet-btn"
              onClick={() => setBetAmount(10.0)}
              disabled={isRolling}
            >10 USDT</button>
          </div>
        </div>

        <button 
          className="btn btn-primary roll-btn" 
          onClick={rollDice}
          disabled={isRolling}
        >
          {isRolling ? 'Кидок...' : 'Кинути кубик'}
        </button>
      </div>
    </div>
  );
}

export default DiceGame;
