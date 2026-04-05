import React, { useState } from 'react';
import './MinesGame.css';
import '../../styles/gameAssetsChrome.css';
import { api } from '../../utils/api';
import { shareWin } from '../../utils/shareWin';
import { UI, gameLobbyTheme, gameListIcon } from '../../constants/uiAssets';
import { t } from '../../utils/i18n';

function MinesGame({ initData, onBack, onBalanceUpdate, botMode = false }) {
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
      if (!initData && !botMode) {
        alert(t('games.authError'));
        setLoading(false);
        return;
      }
      
      const endpoint = botMode ? '/games/mines/bot' : '/games/mines';
      const response = await api.post(endpoint, {
        bet_amount: botMode ? 0 : betAmount,
        mine_count: mineCount,
        grid_size: gridSize,
        action: 'start'
      }, {
        headers: botMode ? {} : { 'x-telegram-init-data': initData }
      });

      const data = response.data;
      if (!botMode) {
        setGameId(data.game_id);
        onBalanceUpdate();
      }
      setIsPlaying(true);
      setRevealed(new Set());
      // Mines positions are stored on server, we don't need to store them on client
      setMines([]);
      setGameResult(null);
      if (botMode && data.bot_revealed) {
        setRevealed(new Set(data.bot_revealed));
      }
      setLoading(false);
    } catch (error) {
      console.error('Start game error:', error);
      setLoading(false);
      
      // Check for insufficient balance
      if (error.response?.status === 400 && error.response?.data?.error === 'Insufficient balance') {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert(t('games.insufficientBalance'));
          window.dispatchEvent(new CustomEvent('navigate', { detail: 'wallet' }));
        } else {
          alert(t('games.insufficientBalance'));
        }
      } else {
        alert(error.response?.data?.error || t('games.minesStartError'));
      }
    }
  };

  const revealCell = async (index) => {
    if (!isPlaying || revealed.has(index) || loading || gameResult || botMode) return;

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
        alert(t('games.mineHit'));
        return;
      }

      if (data.won && data.all_revealed) {
        // Won!
        setIsPlaying(false);
        setGameResult({ won: true, multiplier: data.multiplier });
        setRevealed(prev => new Set([...prev, index]));
        onBalanceUpdate();
        alert(t('games.minesWon', { mult: data.multiplier.toFixed(2) }));
        return;
      }

      // Safe cell
      setRevealed(prev => new Set([...prev, index]));
    } catch (error) {
      console.error('Reveal cell error:', error);
      alert(error.response?.data?.error || t('games.minesRevealError'));
    } finally {
      setLoading(false);
    }
  };

  const cashout = async () => {
    if (!isPlaying || revealed.size === 0 || loading || gameResult) return;

    if (botMode) {
      const mult = calculateMultiplier();
      setIsPlaying(false);
      setGameResult({ won: true, multiplier: mult });
      alert(t('games.minesDemoCashout', { mult: mult.toFixed(2) }));
      return;
    }

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
      alert(t('games.minesCashedOut', { mult: data.multiplier.toFixed(2) }));
      // Offer to share win
      if (data.win_amount > 0 && window.confirm(t('games.shareWinConfirm'))) {
        shareWin('Mines', data.win_amount, data.multiplier);
      }
    } catch (error) {
      console.error('Cashout error:', error);
      alert(error.response?.data?.error || t('games.cashoutError'));
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
          type="button"
          key={i}
          className={`mine-cell ${isRevealed ? 'revealed' : ''} ${isMine ? 'mine' : ''} ${!isRevealed && !isMine ? 'mine-cell--hidden' : ''}`}
          onClick={() => revealCell(i)}
          disabled={!isPlaying || isRevealed || loading || gameResult || botMode}
          aria-label={
            isRevealed ? (isMine ? t('games.cellMine') : t('games.cellSafe')) : t('games.cellHidden')
          }
        >
          {isRevealed && !isMine && (
            <img src={UI.safeGem} alt="" className="mine-cell-icon" decoding="async" />
          )}
          {isMine && (
            <img src={UI.bombRed} alt="" className="mine-cell-icon mine-cell-icon--bomb" decoding="async" />
          )}
        </button>
      );
    }
    return cells;
  };

  const theme = gameLobbyTheme('mines');
  const panelStyle = {
    '--game-bg-img': `url(${theme.bodyBg})`,
    '--game-lobby-top': `url(${theme.topBar})`,
    '--game-frame-img': `url(${theme.frame})`,
    '--game-table-img': `url(${theme.table})`,
    '--asset-btn-green': `url(${UI.btnGreen})`,
    '--asset-btn-green-active': `url(${UI.btnGreenActive})`,
    '--asset-btn-blue': `url(${UI.btnBlue})`,
    '--asset-btn-yellow': `url(${UI.btnYellow})`,
    '--asset-btn-gray': `url(${UI.btnGray})`,
    '--mine-cell-tile': `url(${UI.cellHidden})`,
    '--mine-cell-tile-on': `url(${UI.cellOn})`,
  };

  return (
    <div className="mines-game game-screen--assets" style={panelStyle}>
      <button type="button" className="game-back-asset" onClick={onBack} aria-label={t('games.backAria')}>
        <img src={UI.back} alt="" decoding="async" />
      </button>

      <div className="game-lobby-strip" aria-hidden />
      <div className="game-chip-deco-row" aria-hidden>
        <img src={theme.chipL} alt="" decoding="async" />
        <img src={theme.chipR} alt="" decoding="async" />
      </div>

      <div className="mines-container game-panel-asset">
        <div className="game-title-row">
          <img src={gameListIcon('mines')} alt="" decoding="async" />
          <h2>{t('games.minesTitle')}</h2>
        </div>
        {botMode && <p className="mines-demo-hint">{t('games.minesDemoHint')}</p>}
        <div className="mines-header">
          <div className="mines-info">
            <div className="info-item">
              <span className="info-label">{t('games.minesLabel')}:</span>
              <span className="info-value">{mineCount}</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t('games.minesOpenedLabel')}:</span>
              <span className="info-value">{revealed.size}</span>
            </div>
            {gameResult && (
              <div className="info-item">
                <span className="info-label">{t('games.multiplierLabel')}:</span>
                <span className="info-value">{gameResult.multiplier.toFixed(2)}x</span>
              </div>
            )}
            {isPlaying && !gameResult && (
              <div className="info-item">
                <span className="info-label">{t('games.currentMult')}:</span>
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
            <label>{t('games.betAmount')}</label>
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
            <label>{t('games.mineSlider', { count: mineCount })}</label>
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
                type="button"
                className="asset-btn asset-btn--primary start-btn"
                onClick={startGame}
                disabled={loading}
              >
                {loading ? t('games.starting') : t('onlineGames.startGame')}
              </button>
            ) : (
              <button
                type="button"
                className="asset-btn asset-btn--warn cashout-btn"
                onClick={cashout}
                disabled={loading || revealed.size === 0 || gameResult}
              >
                {loading ? t('games.processing') : t('games.minesCashout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinesGame;
