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

  const startGame = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setRevealed(new Set());
    setMines([]);
    setGameResult(null);

    // TODO: Make API call to start game and get mine positions
    // For now, using client-side generation (should be server-side)
    const minePositions = generateMines(gridSize, mineCount);
    setMines(minePositions);
  };

  const generateMines = (size, count) => {
    const positions = [];
    const used = new Set();
    
    while (positions.length < count) {
      const pos = Math.floor(Math.random() * size);
      if (!used.has(pos)) {
        used.add(pos);
        positions.push(pos);
      }
    }
    
    return positions.sort((a, b) => a - b);
  };

  const revealCell = async (index) => {
    if (!isPlaying || revealed.has(index)) return;

    const newRevealed = new Set(revealed);
    newRevealed.add(index);
    setRevealed(newRevealed);

    if (mines.includes(index)) {
      // Hit a mine - game over
      setIsPlaying(false);
      setGameResult({ won: false, multiplier: 0 });
      onBalanceUpdate();
      alert('💣 Ви натрапили на міну! Гра закінчена.');
      return;
    }

    // Check if all safe cells are revealed
    const safeCells = gridSize - mineCount;
    if (newRevealed.size === safeCells) {
      // Won!
      setIsPlaying(false);
      const multiplier = calculateMultiplier(newRevealed.size, mineCount);
      setGameResult({ won: true, multiplier });
      onBalanceUpdate();
      alert(`🎉 Ви виграли! Множник: ${multiplier.toFixed(2)}x`);
    }
  };

  const calculateMultiplier = (revealedCount, mines) => {
    const risk = mines / gridSize;
    return 1 + (revealedCount * 0.1) * (1 - risk);
  };

  const cashout = () => {
    if (!isPlaying || revealed.size === 0) return;
    
    const multiplier = calculateMultiplier(revealed.size, mineCount);
    setIsPlaying(false);
    setGameResult({ won: true, multiplier });
    onBalanceUpdate();
    alert(`💰 Ви вивели кошти! Множник: ${multiplier.toFixed(2)}x`);
  };

  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < gridSize; i++) {
      const isRevealed = revealed.has(i);
      const isMine = mines.includes(i);
      const isGameOver = gameResult && !gameResult.won;
      
      cells.push(
        <button
          key={i}
          className={`mine-cell ${isRevealed ? 'revealed' : ''} ${isGameOver && isMine ? 'mine' : ''}`}
          onClick={() => revealCell(i)}
          disabled={!isPlaying || isRevealed}
        >
          {isRevealed && !isMine && '💎'}
          {isGameOver && isMine && '💣'}
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="mines-game">
      <button className="back-btn" onClick={onBack}>← Назад</button>
      
      <div className="mines-container glass">
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
              disabled={isPlaying}
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
              disabled={isPlaying}
              className="mine-slider"
            />
          </div>

          <div className="game-actions">
            {!isPlaying ? (
              <button className="btn btn-primary start-btn" onClick={startGame}>
                Почати гру
              </button>
            ) : (
              <button className="btn btn-secondary cashout-btn" onClick={cashout}>
                Вивести
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinesGame;
