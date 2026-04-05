import React, { useState } from 'react';
import './DiceGame.css';
import '../../styles/gameAssetsChrome.css';
import { api } from '../../utils/api';
import { UI, gameLobbyTheme, gameListIcon } from '../../constants/uiAssets';
import { t } from '../../utils/i18n';

function DiceGame({ initData, onBack, onBalanceUpdate, botMode = false }) {
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
        if (!initData && !botMode) {
          alert(t('games.authError'));
          setIsRolling(false);
          return;
        }
        
        const endpoint = botMode ? '/games/dice/bot' : '/games/dice';
        const response = await api.post(endpoint, {
          bet_amount: botMode ? 0 : betAmount,
          prediction,
          target
        }, {
          headers: botMode ? {} : { 'x-telegram-init-data': initData }
        });

        const data = response.data;
        
        // Check for insufficient balance error
        if (data.error === 'Insufficient balance' || response.status === 400) {
          setIsRolling(false);
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(t('games.insufficientBalance'));
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'wallet' }));
          } else {
            alert(t('games.insufficientBalance'));
          }
          return;
        }
        
        setResult(data);
        setIsRolling(false);
        if (!botMode) {
          onBalanceUpdate();
        }

        if (botMode) {
          alert(
            t('games.diceBotLine', {
              result: data.result,
              youStatus: data.won ? t('games.wonShort') : t('games.lostShort'),
              botStatus: data.bot_won ? t('games.wonShort') : t('games.lostShort'),
            })
          );
        } else {
          if (data.won) {
            alert(t('games.diceWon', { amount: data.win_amount.toFixed(2) }));
          } else {
            alert(t('games.diceLost', { result: data.result }));
          }
        }
      } catch (error) {
        console.error('Dice error:', error);
        setIsRolling(false);
        
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
    }, 1500);
  };

  const theme = gameLobbyTheme('dice');
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
    <div className="dice-game game-screen--assets" style={panelStyle}>
      <button type="button" className="game-back-asset" onClick={onBack} aria-label={t('games.backAria')}>
        <img src={UI.back} alt="" decoding="async" />
      </button>

      <div className="game-lobby-strip" aria-hidden />
      <div className="game-chip-deco-row" aria-hidden>
        <img src={theme.chipL} alt="" decoding="async" />
        <img src={theme.chipR} alt="" decoding="async" />
      </div>

      <div className="dice-container game-panel-asset game-panel-asset--compact">
        <div className="game-title-row">
          <img src={gameListIcon('dice')} alt="" decoding="async" />
          <h2>{t('games.diceTitle')}</h2>
        </div>
        <div className="dice-display">
          {isRolling ? (
            <div className="dice-rolling dice-rolling--asset">
              <img src={UI.diceFace} alt="" className="dice-spin-img" />
            </div>
          ) : result ? (
            <div className={`dice-result ${result.won ? 'won' : 'lost'}`}>
              <div className="dice-value dice-value--framed">{result.result}</div>
              <div className="dice-status">
                {result.won ? t('games.diceWinStatus') : t('games.diceLoseStatus')}
              </div>
            </div>
          ) : (
            <div className="dice-ready dice-ready--asset">
              <img src={UI.diceFace} alt="" decoding="async" />
            </div>
          )}
        </div>

        <div className="dice-controls">
          <div className="prediction-selector">
            <button
              type="button"
              className={`prediction-btn prediction-btn--asset ${prediction === 'over' ? 'active' : ''}`}
              onClick={() => setPrediction('over')}
              disabled={isRolling}
            >
              {t('games.diceOver')}
            </button>
            <button
              type="button"
              className={`prediction-btn prediction-btn--asset ${prediction === 'under' ? 'active' : ''}`}
              onClick={() => setPrediction('under')}
              disabled={isRolling}
            >
              {t('games.diceUnder')}
            </button>
          </div>

          <div className="target-selector">
            <label>{t('games.diceTarget', { value: target })}</label>
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
            <label>{t('games.betAmount')}</label>
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
              type="button"
              className="asset-quick"
              onClick={() => setBetAmount(1.0)}
              disabled={isRolling}
            >1 USDT</button>
            <button
              type="button"
              className="asset-quick"
              onClick={() => setBetAmount(5.0)}
              disabled={isRolling}
            >5 USDT</button>
            <button
              type="button"
              className="asset-quick"
              onClick={() => setBetAmount(10.0)}
              disabled={isRolling}
            >10 USDT</button>
          </div>
        </div>

        <button
          type="button"
          className="asset-btn asset-btn--primary roll-btn"
          onClick={rollDice}
          disabled={isRolling}
        >
          {isRolling ? t('games.diceRolling') : t('games.diceRoll')}
        </button>
      </div>
    </div>
  );
}

export default DiceGame;
