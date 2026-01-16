import React, { useState } from 'react';
import './MinesGame.css';
import { api } from '../../utils/api';

function MinesGame({ initData, onBack, onBalanceUpdate }) {
  const [betAmount, setBetAmount] = useState(1.0);
  const [mineCount, setMineCount] = useState(3);
  const [gridSize] = useState(25);
  const [revealed, setRevealed] = useState(new Set());
  const [mines, setMines] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [loading, setLoading] = useState(false);

  const startGame = async () => {
    if (isPlaying || loading) return;
    
    setLoading(true);
    try {
      const response = await api.post('/games/mines', {
        bet_amount: betAmount,
        mine_count: mineCount,
        grid_size: gridSize,
        action: 'start'
      }, {
        headers: { 'x-telegram-init-data': initData }
      });

      const data = response.data;
      setGameId(data.game_id);
      setIsPlaying(true);
      setRevealed(new Set());
      // Mines positions are stored on server, we don't need to store them on client
      setMines([]);
      setGameResult(null);
      onBalanceUpdate();
    } catch (error) {
      console.error('Start game error:', error);
      alert(error.response?.data?.error || 'Помилка запуску гри');
    } finally {
      setLoading(false);
    }
  };

  const revealCell = async (index) => {
    if (!isPlaying || revealed.has(index) || loading || gameResult) return;

    setLoading(true);
    try {
      const response = await api.post('/games/mines', {
        game_id: gameId,
        action: 'reveal',
        cell_index: index
      }, {
        headers: { 'x-telegram-init-data': initData }
      });

      const data = response.data;
      
      if (data.hit_mine) {
        // Hit a mine - game over
        setIsPlaying(false);
        setGameResult({ won: false, multiplier: 0 });
        setRevealed(prev => new Set([...prev, index]));
        // Set all mine positions from server
        if (data.mine_positions) {
          setMines(data.mine_positions);
        } else {
          setMines([index]); // Fallback: at least show the hit mine
        }
        onBalanceUpdate();
        alert('💣 Ви натрапили на міну! Гра закінчена.');
        return;
      }

      if (data.won && data.all_revealed) {
        // Won!
        setIsPlaying(false);
        setGameResult({ won: true, multiplier: data.multiplier });
        setRevealed(prev => new Set([...prev, index]));
        onBalanceUpdate();
        alert(`🎉 Ви виграли! Множник: ${data.multiplier.toFixed(2)}x`);
        return;
      }

      // Safe cell
      setRevealed(prev => new Set([...prev, index]));
    } catch (error) {
      console.error('Reveal cell error:', error);
      alert(error.response?.data?.error || 'Помилка');
    } finally {
      setLoading(false);
    }
  };

  const cashout = async () => {
    if (!isPlaying || revealed.size === 0 || loading || gameResult) return;
    
    setLoading(true);
    try {
      const response = await api.post('/games/mines', {
        game_id: gameId,
        action: 'cashout'
      }, {
        headers: { 'x-telegram-init-data': initData }
      });

      const data = response.data;
      setIsPlaying(false);
      setGameResult({ won: true, multiplier: data.multiplier });
      onBalanceUpdate();
      alert(`💰 Ви вивели кошти! Множник: ${data.multiplier.toFixed(2)}x`);
    } catch (error) {
      console.error('Cashout error:', error);
      alert(error.response?.data?.error || 'Помилка виводу');
    } finally {
      setLoading(false);
    }
  };

  const calculateMultiplier = () => {
    if (revealed.size === 0) return 1.0;
    const risk = mineCount / gridSize;
    return 1 + (revealed.size * 0.1) * (1 - risk);
  };

  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < gridSize; i++) {
      const isRevealed = revealed.has(i);
      const isGameOver = gameResult && !gameResult.won;
      const isMine = mines.includes(i);
      
      cells.push(
        <button
          key={i}
          className={`mine-cell ${isRevealed ? 'revealed' : ''} ${isMine ? 'mine' : ''}`}
          onClick={() => revealCell(i)}
          disabled={!isPlaying || isRevealed || loading || gameResult}
        >
          {isRevealed && !isMine && '💎'}
          {isMine && '💣'}
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="mines-game">
      <button className="back-btn" onClick={onBack}>← Назад</button>
      
      <div className="mines-container glass-card">
        <div className="mines-header">
          <div className="mines-info">
            <div className="info-item">
              <span className="info-label">Мін:</span>
              <span className="info-value">{mineCount}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Відкрито:</span>
              <span className="info-value">{revealed.size}</span>
            </div>
            {gameResult && (
              <div className="info-item">
                <span className="info-label">Множник:</span>
                <span className="info-value">{gameResult.multiplier.toFixed(2)}x</span>
              </div>
            )}
            {isPlaying && !gameResult && (
              <div className="info-item">
                <span className="info-label">Поточний:</span>
                <span className="info-value">{calculateMultiplier().toFixed(2)}x</span>
              </div>
            )}
          </div>
        </div>

        <div className="mines-grid">
          {renderGrid()}
        </div>

        <div className="mines-controls">
          <div className="bet-input-group">
            <label>Сума ставки</label>
            <input
              type="number"
              className="input"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
              min="0.1"
              step="0.1"
              disabled={isPlaying || loading}
            />
          </div>

          <div className="mine-count-selector">
            <label>Кількість мін: {mineCount}</label>
            <input
              type="range"
              min="1"
              max="24"
              value={mineCount}
              onChange={(e) => setMineCount(parseInt(e.target.value))}
              disabled={isPlaying || loading}
              className="mine-slider"
            />
          </div>

          <div className="game-actions">
            {!isPlaying ? (
              <button 
                className="btn btn-primary start-btn" 
                onClick={startGame}
                disabled={loading}
              >
                {loading ? 'Запуск...' : 'Почати гру'}
              </button>
            ) : (
              <button 
                className="btn btn-secondary cashout-btn" 
                onClick={cashout}
                disabled={loading || revealed.size === 0 || gameResult}
              >
                {loading ? 'Обробка...' : 'Вивести'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinesGame;
