import React, { useState, useEffect } from 'react';
import './Tournaments.css';
import { api } from '../utils/api';
import { UI } from '../constants/uiAssets';

function Tournaments({ user, initData }) {
  const [tournaments, setTournaments] = useState([]);
  const [activeTournament, setActiveTournament] = useState(null);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      // Mock data for now - will be replaced with API
      const mockTournaments = [
        {
          id: 1,
          name: 'Турнір тижня',
          prize: 1000,
          currency: 'USDT',
          type: 'wagered',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          participants: 156,
          myPosition: 23,
          myWagered: 1250
        },
        {
          id: 2,
          name: 'Джекпот виграшів',
          prize: 500,
          currency: 'USDT',
          type: 'wins',
          startDate: new Date(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          participants: 89,
          myPosition: 5,
          myWins: 450
        }
      ];
      setTournaments(mockTournaments);
      if (mockTournaments.length > 0) {
        setActiveTournament(mockTournaments[0]);
      }
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
    }
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Завершено';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}д ${hours}г`;
    if (hours > 0) return `${hours}г ${minutes}хв`;
    return `${minutes}хв`;
  };

  return (
    <div className="tournaments-page tournaments-page--assets fade-in">
      <div className="tournaments-heading">
        <img src={UI.mttBanner} alt="" className="tournaments-banner-deco" decoding="async" />
        <img src={UI.mttLogo} alt="" className="tournaments-logo" decoding="async" />
        <h1 className="page-title">Турніри</h1>
      </div>

      <div className="tournaments-list">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className={`tournament-card glass-card ${activeTournament?.id === tournament.id ? 'active' : ''}`}
            onClick={() => setActiveTournament(tournament)}
          >
            <div className="tournament-header">
              <h3 className="tournament-name">{tournament.name}</h3>
              <div className="tournament-prize">
                <span className="prize-amount">{tournament.prize}</span>
                <span className="prize-currency">{tournament.currency}</span>
              </div>
            </div>
            
            <div className="tournament-info">
              <div className="info-item">
                <span className="info-label">Тип:</span>
                <span className="info-value">
                  {tournament.type === 'wagered' ? 'За сумою ставок' : 'За виграшами'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Учасників:</span>
                <span className="info-value">{tournament.participants}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Залишилось:</span>
                <span className="info-value">{getTimeRemaining(tournament.endDate)}</span>
              </div>
              {tournament.myPosition && (
                <div className="info-item highlight">
                  <span className="info-label">Ваша позиція:</span>
                  <span className="info-value">#{tournament.myPosition}</span>
                </div>
              )}
            </div>

            {tournament.myPosition && (
              <div className="tournament-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((tournament.participants - tournament.myPosition) / tournament.participants) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {activeTournament && (
        <div className="tournament-details glass-card">
          <h2 className="details-title">Деталі турніру</h2>
          
          <div className="details-content">
            <div className="detail-section">
              <h3>Призовий фонд</h3>
              <div className="prize-breakdown">
                <div className="prize-item">
                  <span className="prize-position">🥇 1 місце</span>
                  <span className="prize-amount">{(activeTournament.prize * 0.5).toFixed(2)} {activeTournament.currency}</span>
                </div>
                <div className="prize-item">
                  <span className="prize-position">🥈 2 місце</span>
                  <span className="prize-amount">{(activeTournament.prize * 0.3).toFixed(2)} {activeTournament.currency}</span>
                </div>
                <div className="prize-item">
                  <span className="prize-position">🥉 3 місце</span>
                  <span className="prize-amount">{(activeTournament.prize * 0.2).toFixed(2)} {activeTournament.currency}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Ваш прогрес</h3>
              <div className="my-progress">
                {activeTournament.type === 'wagered' ? (
                  <>
                    <div className="progress-stat">
                      <span>Поставлено:</span>
                      <strong>{activeTournament.myWagered?.toFixed(2) || 0} USDT</strong>
                    </div>
                    <div className="progress-stat">
                      <span>Позиція:</span>
                      <strong>#{activeTournament.myPosition || 'N/A'}</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="progress-stat">
                      <span>Виграно:</span>
                      <strong>{activeTournament.myWins?.toFixed(2) || 0} USDT</strong>
                    </div>
                    <div className="progress-stat">
                      <span>Позиція:</span>
                      <strong>#{activeTournament.myPosition || 'N/A'}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <button className="btn btn-primary tournament-join-btn">
            Участь активна
          </button>
        </div>
      )}
    </div>
  );
}

export default Tournaments;
