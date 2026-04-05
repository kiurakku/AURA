import React, { useState, useEffect, useRef } from 'react';
import './CrashGame.css';
import '../../styles/gameAssetsChrome.css';
import { api } from '../../utils/api';
import { shareWin } from '../../utils/shareWin';
import { UI, gameLobbyTheme, gameListIcon } from '../../constants/uiAssets';
import { t } from '../../utils/i18n';

function CrashGame({ initData, onBack, onBalanceUpdate, botMode = false }) {
  const [betAmount, setBetAmount] = useState(1.0);
  const [autoCashout, setAutoCashout] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.00);
  const [history, setHistory] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [crashed, setCrashed] = useState(false);
  const animationRef = useRef(null);
  const gameStartTime = useRef(null);
  const playingRef = useRef(false);
  const crashPointRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      if (!initData) return;
      const response = await api.get('/games/history?limit=20', {
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
    playingRef.current = true;
    setMultiplier(1.00);
    setCrashed(false);
    gameStartTime.current = Date.now();

    try {
      if (!initData && !botMode) {
        alert(t('games.authError'));
        setIsPlaying(false);
        playingRef.current = false;
        return;
      }
      
      // Start game on server (or bot mode)
        const endpoint = botMode ? '/games/crash/bot' : '/games/crash';
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
        playingRef.current = false;
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert(t('games.insufficientBalance'));
          // Navigate to wallet
          window.dispatchEvent(new CustomEvent('navigate', { detail: 'wallet' }));
        } else {
          alert(t('games.insufficientBalance'));
        }
        return;
      }
      
      if (!botMode) {
        setGameId(result.game_id);
        onBalanceUpdate();
      }
      // Реальний API віддає точку крашу в `multiplier`; бот — у `crashed_at` (у `multiplier` там «вихід бота»)
      const crashAt = Number(result.crashed_at ?? result.multiplier);
      crashPointRef.current = crashAt;

      // Animate multiplier (refs — щоб не зірвалось на застарілому isPlaying з замикання)
      const animate = () => {
        if (!playingRef.current) return;

        const elapsed = (Date.now() - gameStartTime.current) / 1000;
        const newMultiplier = 1.0 + elapsed * 0.1;
        setMultiplier(newMultiplier);

        if (autoCashout && newMultiplier >= autoCashout) {
          cashout(newMultiplier);
          return;
        }

        if (newMultiplier >= crashPointRef.current) {
          cancelAnimationFrame(animationRef.current);
          playingRef.current = false;
          setCrashed(true);
          setIsPlaying(false);
          setMultiplier(crashPointRef.current);
          alert(t('games.gameEnded'));
          onBalanceUpdate();
          fetchHistory();
          return;
        }

        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } catch (error) {
      console.error('Game error:', error);
      playingRef.current = false;
      setIsPlaying(false);
      setCrashed(true);
      cancelAnimationFrame(animationRef.current);
      
      // Check for insufficient balance
      if (error.response?.status === 400 && error.response?.data?.error === 'Insufficient balance') {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert(t('games.insufficientBalance'));
          window.dispatchEvent(new CustomEvent('navigate', { detail: 'wallet' }));
        } else {
          alert(t('games.insufficientBalance'));
        }
      } else {
        alert(error.response?.data?.error || t('games.gameError'));
      }
    }
  };

  const cashout = async (currentMult = null) => {
    if (botMode) {
      cancelAnimationFrame(animationRef.current);
      playingRef.current = false;
      alert(
        t('games.botCashoutFree', {
          mult: (currentMult ?? multiplier).toFixed(2),
        })
      );
      setIsPlaying(false);
      setCrashed(false);
      return;
    }
    if (!playingRef.current || !gameId) return;

    const cashoutMult = currentMult || multiplier;
    cancelAnimationFrame(animationRef.current);
    playingRef.current = false;
    setIsPlaying(false);
    
    try {
      const response = await api.post('/games/crash', {
        game_id: gameId,
        action: 'cashout',
        cashout_multiplier: cashoutMult
      }, {
        headers: { 'x-telegram-init-data': initData }
      });

      const result = response.data;
      setMultiplier(result.multiplier);
      setCrashed(false);
      onBalanceUpdate();
      fetchHistory();

      if (result.win_amount > 0) {
        alert(
          t('games.crashWon', {
            mult: result.multiplier.toFixed(2),
            amount: result.win_amount.toFixed(2),
          })
        );
        if (window.confirm(t('games.shareWinConfirm'))) {
          shareWin('Crash', result.win_amount, result.multiplier);
        }
      }
    } catch (error) {
      console.error('Cashout error:', error);
      setIsPlaying(false);
      playingRef.current = false;
      alert(error.response?.data?.error || t('games.cashoutError'));
    }
  };

  const theme = gameLobbyTheme('crash');
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
  };

  return (
    <div className="crash-game game-screen--assets" style={panelStyle}>
      <button type="button" className="game-back-asset" onClick={onBack} aria-label={t('games.backAria')}>
        <img src={UI.back} alt="" decoding="async" />
      </button>

      <div className="game-lobby-strip" aria-hidden />
      <div className="game-chip-deco-row" aria-hidden>
        <img src={theme.chipL} alt="" decoding="async" />
        <img src={theme.chipR} alt="" decoding="async" />
      </div>

      <div className="crash-container game-panel-asset">
        <div className="game-title-row">
          <img src={gameListIcon('crash')} alt="" decoding="async" />
          <h2>{t('games.crashTitle')}</h2>
        </div>
        <div className="multiplier-display">
          <div className={`multiplier-value ${isPlaying ? 'animating' : ''}`}>
            {multiplier.toFixed(2)}x
          </div>
          {autoCashout && (
            <div className="auto-cashout-indicator">
              {t('games.autoCashoutLine', { value: autoCashout })}
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
            <label>{t('games.betAmount')}</label>
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
            <label>{t('games.autoCashoutOptional')}</label>
            <input
              type="number"
              className="input"
              value={autoCashout || ''}
              onChange={(e) => setAutoCashout(e.target.value ? parseFloat(e.target.value) : null)}
              min="1.01"
              step="0.01"
              placeholder={t('games.autoCashoutPlaceholder')}
              disabled={isPlaying}
            />
          </div>

          <div className="quick-bets">
            <button
              type="button"
              className="asset-quick"
              onClick={() => setBetAmount(1.0)}
              disabled={isPlaying}
            >1 USDT</button>
            <button
              type="button"
              className="asset-quick"
              onClick={() => setBetAmount(5.0)}
              disabled={isPlaying}
            >5 USDT</button>
            <button
              type="button"
              className="asset-quick"
              onClick={() => setBetAmount(10.0)}
              disabled={isPlaying}
            >10 USDT</button>
          </div>
        </div>

        <div className="game-actions">
          {!isPlaying ? (
            <button type="button" className="asset-btn asset-btn--primary start-btn" onClick={startGame}>
              {t('games.betBtn')}
            </button>
          ) : (
            <button type="button" className="asset-btn asset-btn--warn cashout-btn" onClick={() => cashout()}>
              {t('games.cashoutBtn')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrashGame;
