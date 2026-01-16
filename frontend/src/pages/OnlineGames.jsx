import React, { useState, useEffect } from 'react';
import './OnlineGames.css';
import { api } from '../utils/api';

function OnlineGames({ user, initData, onBalanceUpdate }) {
  const [activeRooms, setActiveRooms] = useState([]);
  const [myRoom, setMyRoom] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchActiveRooms();
    const interval = setInterval(fetchActiveRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveRooms = async () => {
    try {
      // TODO: Implement API endpoint
      // const response = await api.get('/online-games/rooms', {
      //   headers: { 'x-telegram-init-data': initData }
      // });
      // setActiveRooms(response.data.rooms || []);
      
      // Mock data
      setActiveRooms([
        { id: 1, game: 'Telegram Battle', players: 2, maxPlayers: 4, bet: 10, status: 'waiting' },
        { id: 2, game: 'Cyber Crash', players: 8, maxPlayers: 10, bet: 25, status: 'playing' },
        { id: 3, game: 'Frost Dice', players: 1, maxPlayers: 6, bet: 5, status: 'waiting' }
      ]);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const joinRoom = async (roomId) => {
    try {
      setSearching(true);
      // TODO: Implement API endpoint
      // const response = await api.post(`/online-games/join/${roomId}`, {}, {
      //   headers: { 'x-telegram-init-data': initData }
      // });
      // setMyRoom(response.data.room);
      alert('Підключення до кімнати...');
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Помилка підключення');
    } finally {
      setSearching(false);
    }
  };

  const createRoom = async (gameType, bet) => {
    try {
      setSearching(true);
      // TODO: Implement API endpoint
      // const response = await api.post('/online-games/create', { gameType, bet }, {
      //   headers: { 'x-telegram-init-data': initData }
      // });
      // setMyRoom(response.data.room);
      alert('Створення кімнати...');
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('Помилка створення кімнати');
    } finally {
      setSearching(false);
    }
  };

  const onlineGames = [
    { 
      id: 'telegram-battle', 
      name: 'Telegram Battle', 
      icon: '⚔️', 
      description: 'Битва між гравцями в реальному часі',
      minBet: 5,
      maxPlayers: 4,
      theme: 'telegram'
    },
    { 
      id: 'cyber-crash', 
      name: 'Cyber Crash', 
      icon: '🚀', 
      description: 'Crash з іншими гравцями',
      minBet: 10,
      maxPlayers: 10,
      theme: 'cyber'
    },
    { 
      id: 'frost-dice', 
      name: 'Frost Dice', 
      icon: '❄️', 
      description: 'Dice в арктичному стилі',
      minBet: 3,
      maxPlayers: 6,
      theme: 'frost'
    },
    { 
      id: 'neon-roulette', 
      name: 'Neon Roulette', 
      icon: '🎡', 
      description: 'Рулетка з неоновими ефектами',
      minBet: 15,
      maxPlayers: 8,
      theme: 'neon'
    }
  ];

  if (myRoom) {
    return (
      <div className="online-game-room">
        <button className="back-btn" onClick={() => setMyRoom(null)}>← Назад</button>
        <div className="room-info glass-card">
          <h2>{myRoom.game}</h2>
          <div className="room-players">
            Гравців: {myRoom.players}/{myRoom.maxPlayers}
          </div>
          <div className="room-bet">
            Ставка: {myRoom.bet} USDT
          </div>
          <div className="room-status">
            Статус: {myRoom.status === 'waiting' ? 'Очікування гравців...' : 'Гра в процесі'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="online-games-page fade-in">
      <h1 className="page-title">🌐 Онлайн ігри</h1>
      <p className="page-subtitle">Змагайся з іншими гравцями в реальному часі!</p>

      {/* Active Rooms */}
      {activeRooms.length > 0 && (
        <div className="active-rooms-section">
          <h2 className="section-title">Активні кімнати</h2>
          <div className="rooms-list glass-card">
            {activeRooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h3>{room.game}</h3>
                  <span className={`room-status-badge ${room.status}`}>
                    {room.status === 'waiting' ? 'Очікування' : 'Гра'}
                  </span>
                </div>
                <div className="room-details">
                  <div className="room-detail">
                    <span>👥</span>
                    <span>{room.players}/{room.maxPlayers}</span>
                  </div>
                  <div className="room-detail">
                    <span>💰</span>
                    <span>{room.bet} USDT</span>
                  </div>
                </div>
                <button 
                  className="btn btn-primary join-btn"
                  onClick={() => joinRoom(room.id)}
                  disabled={searching || room.players >= room.maxPlayers}
                >
                  {room.players >= room.maxPlayers ? 'Повна' : 'Приєднатися'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Games */}
      <div className="online-games-section">
        <h2 className="section-title">Доступні ігри</h2>
        <div className="online-games-grid">
          {onlineGames.map((game) => (
            <div key={game.id} className={`online-game-card glass-card ${game.theme}`}>
              <div className="game-icon-large">{game.icon}</div>
              <h3 className="game-name">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              <div className="game-info">
                <div className="info-item">
                  <span>Мін. ставка:</span>
                  <span>{game.minBet} USDT</span>
                </div>
                <div className="info-item">
                  <span>Гравців:</span>
                  <span>до {game.maxPlayers}</span>
                </div>
              </div>
              <button 
                className="btn btn-primary create-room-btn"
                onClick={() => createRoom(game.id, game.minBet)}
                disabled={searching}
              >
                Створити кімнату
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OnlineGames;
