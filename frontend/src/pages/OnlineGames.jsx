import React, { useState, useEffect, useRef } from 'react';
import './OnlineGames.css';
import { api } from '../utils/api';
import { initSocket, getSocket, disconnectSocket } from '../utils/socket';
import CrashGame from '../components/games/CrashGame';
import DiceGame from '../components/games/DiceGame';
import MinesGame from '../components/games/MinesGame';
import { t } from '../utils/i18n';

function OnlineGames({ user, initData, onBalanceUpdate }) {
  const [activeRooms, setActiveRooms] = useState([]);
  const [myRoom, setMyRoom] = useState(null);
  const [searching, setSearching] = useState(false);
  const [gameMode, setGameMode] = useState(null); // 'free' or 'paid'
  const [selectedGame, setSelectedGame] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (initData) {
      // Initialize WebSocket connection
      const socket = initSocket(initData);
      socketRef.current = socket;

      // Listen for room updates
      socket.on('room-created', (data) => {
        fetchActiveRooms();
      });

      socket.on('room-updated', (data) => {
        if (myRoom && myRoom.id === data.room.id) {
          setMyRoom(data.room);
        }
        fetchActiveRooms();
      });

      socket.on('player-joined', (data) => {
        if (myRoom && myRoom.id === data.room.id) {
          setMyRoom(data.room);
        }
        fetchActiveRooms();
      });

      socket.on('player-left', (data) => {
        if (myRoom && myRoom.id === data.room.id) {
          setMyRoom(data.room);
        }
        fetchActiveRooms();
      });

      socket.on('game-started', (data) => {
        if (myRoom) {
          setMyRoom(prev => ({
            ...prev,
            status: 'playing',
            game_data: data.game_data
          }));
        }
      });

      socket.on('game-finished', (data) => {
        if (myRoom) {
          setMyRoom(prev => ({
            ...prev,
            status: 'finished',
            game_data: {
              ...prev.game_data,
              winners: data.winners,
              result: data.game_result
            }
          }));
          onBalanceUpdate();
        }
      });

      socket.on('player-ready-updated', (data) => {
        if (myRoom && myRoom.id) {
          setMyRoom(prev => ({
            ...prev,
            players: prev.players.map(p => 
              p.telegram_id === data.telegram_id 
                ? { ...p, ready: data.ready }
                : p
            )
          }));
        }
      });

      socket.on('game-action-updated', (data) => {
        // Handle real-time game actions (cashout, reveal, etc.)
        if (myRoom && myRoom.id) {
          setMyRoom(prev => ({
            ...prev,
            game_data: {
              ...prev.game_data,
              player_actions: {
                ...prev.game_data?.player_actions,
                [data.telegram_id]: {
                  action: data.action,
                  data: data.data,
                  timestamp: data.timestamp
                }
              }
            }
          }));
        }
      });

      socket.on('room-state', (data) => {
        // Update room state when joining
        setMyRoom(data.room);
      });

      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
        alert(error.message || t('onlineGames.connectionError'));
      });

      // Initial fetch
      fetchActiveRooms();

      return () => {
        socket.off('room-created');
        socket.off('room-updated');
        socket.off('player-joined');
        socket.off('player-left');
        socket.off('game-started');
        socket.off('game-finished');
        socket.off('player-ready-updated');
        socket.off('game-action-updated');
        socket.off('room-state');
        socket.off('error');
      };
    }
  }, [initData]);

  const fetchActiveRooms = async () => {
    if (!initData) return;
    try {
      const response = await api.get('/online-games/rooms', {
        headers: { 'x-telegram-init-data': initData }
      });
      setActiveRooms(response.data.rooms || []);
    } catch (error) {
      setActiveRooms([]);
    }
  };

  const joinRoom = async (roomId) => {
    if (!initData) return;
    try {
      setSearching(true);
      const response = await api.post(`/online-games/rooms/${roomId}/join`, {}, {
        headers: { 'x-telegram-init-data': initData }
      });
      if (response.data.success) {
        const roomResponse = await api.get(`/online-games/rooms/${roomId}`, {
          headers: { 'x-telegram-init-data': initData }
        });
        setMyRoom(roomResponse.data.room);
        
        // Join WebSocket room
        const socket = getSocket();
        if (socket) {
          socket.emit('join-room', roomId);
        }
        
        onBalanceUpdate();
      }
    } catch (error) {
      alert(error.response?.data?.error || t('onlineGames.joinError'));
    } finally {
      setSearching(false);
    }
  };

  const createRoom = async (gameType, bet) => {
    if (!initData) return;
    try {
      setSearching(true);
      const response = await api.post('/online-games/rooms/create', { 
        game_type: gameType, 
        bet: bet,
        max_players: 4
      }, {
        headers: { 'x-telegram-init-data': initData }
      });
      if (response.data.success) {
        const roomResponse = await api.get(`/online-games/rooms/${response.data.room.id}`, {
          headers: { 'x-telegram-init-data': initData }
        });
        setMyRoom(roomResponse.data.room);
        
        // Join WebSocket room
        const socket = getSocket();
        if (socket) {
          socket.emit('join-room', response.data.room.id);
        }
        
        onBalanceUpdate();
      }
    } catch (error) {
      alert(error.response?.data?.error || t('onlineGames.createError'));
    } finally {
      setSearching(false);
    }
  };

  const playWithBot = (gameId) => {
    setGameMode('free');
    setSelectedGame(gameId);
  };

  const onlineGames = [
    { 
      id: 'crash', 
      name: 'Crash з ботом', 
      icon: '🚀', 
      description: 'Грай Crash з ботом безкоштовно',
      minBet: 0,
      maxPlayers: 2,
      theme: 'cyber',
      canPlayWithBot: true
    },
    { 
      id: 'dice', 
      name: 'Dice з ботом', 
      icon: '🎲', 
      description: 'Грай Dice з ботом безкоштовно',
      minBet: 0,
      maxPlayers: 2,
      theme: 'frost',
      canPlayWithBot: true
    },
    { 
      id: 'mines', 
      name: 'Mines з ботом', 
      icon: '💣', 
      description: 'Грай Mines з ботом безкоштовно',
      minBet: 0,
      maxPlayers: 2,
      theme: 'neon',
      canPlayWithBot: true
    },
    { 
      id: 'telegram-battle', 
      name: 'Telegram Battle', 
      icon: '⚔️', 
      description: 'Битва між гравцями в реальному часі',
      minBet: 5,
      maxPlayers: 4,
      theme: 'telegram',
      canPlayWithBot: false
    },
    { 
      id: 'cyber-crash', 
      name: 'Cyber Crash', 
      icon: '🚀', 
      description: 'Crash з іншими гравцями',
      minBet: 10,
      maxPlayers: 10,
      theme: 'cyber',
      canPlayWithBot: false
    },
    { 
      id: 'frost-dice', 
      name: 'Frost Dice', 
      icon: '❄️', 
      description: 'Dice в арктичному стилі',
      minBet: 3,
      maxPlayers: 6,
      theme: 'frost',
      canPlayWithBot: false
    },
    { 
      id: 'neon-roulette', 
      name: 'Neon Roulette', 
      icon: '🎡', 
      description: 'Рулетка з неоновими ефектами',
      minBet: 15,
      maxPlayers: 8,
      theme: 'neon',
      canPlayWithBot: false
    },
    { 
      id: 'blackjack', 
      name: 'Блекджек (Дурак)', 
      icon: '🃏', 
      description: 'Гра в дурака з іншими гравцями',
      minBet: 5,
      maxPlayers: 4,
      theme: 'cards',
      canPlayWithBot: true
    }
  ];

  // Render game component if playing with bot
  if (gameMode === 'free' && selectedGame) {
    if (selectedGame === 'crash') {
      return (
        <div>
          <button className="back-btn" onClick={() => { setGameMode(null); setSelectedGame(null); }}>
            ← Назад до онлайн ігор
          </button>
          <div className="bot-game-notice glass-card">
            <h3>🤖 Гра з ботом (безкоштовно)</h3>
            <p>Ви граєте з ботом безкоштовно. Гроші не списуються та не нараховуються.</p>
          </div>
          <CrashGame 
            initData={initData} 
            onBack={() => { setGameMode(null); setSelectedGame(null); }} 
            onBalanceUpdate={onBalanceUpdate}
            botMode={true}
          />
        </div>
      );
    }
    if (selectedGame === 'dice') {
      return (
        <div>
          <button className="back-btn" onClick={() => { setGameMode(null); setSelectedGame(null); }}>
            ← Назад до онлайн ігор
          </button>
          <div className="bot-game-notice glass-card">
            <h3>🤖 Гра з ботом (безкоштовно)</h3>
            <p>Ви граєте з ботом безкоштовно. Гроші не списуються та не нараховуються.</p>
          </div>
          <DiceGame 
            initData={initData} 
            onBack={() => { setGameMode(null); setSelectedGame(null); }} 
            onBalanceUpdate={onBalanceUpdate}
            botMode={true}
          />
        </div>
      );
    }
    if (selectedGame === 'mines') {
      return (
        <div>
          <button className="back-btn" onClick={() => { setGameMode(null); setSelectedGame(null); }}>
            ← Назад до онлайн ігор
          </button>
          <div className="bot-game-notice glass-card">
            <h3>🤖 Гра з ботом (безкоштовно)</h3>
            <p>Ви граєте з ботом безкоштовно. Гроші не списуються та не нараховуються.</p>
          </div>
          <MinesGame 
            initData={initData} 
            onBack={() => { setGameMode(null); setSelectedGame(null); }} 
            onBalanceUpdate={onBalanceUpdate}
            botMode={true}
          />
        </div>
      );
    }
  }

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
      <p className="page-subtitle">Змагайся з іншими гравцями в реальному часі або грай з ботами безкоштовно!</p>

      {/* Active Rooms */}
      {activeRooms.length > 0 && (
        <div className="active-rooms-section">
          <h2 className="section-title">Активні кімнати</h2>
          <div className="rooms-list glass-card">
            {activeRooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h3>{room.game_type === 'crash' ? '🚀 Crash' : room.game_type === 'dice' ? '🎲 Dice' : room.game_type === 'mines' ? '💣 Mines' : room.game_type}</h3>
                  <span className={`room-status-badge ${room.status}`}>
                    {room.status === 'waiting' ? 'Очікування' : room.status === 'playing' ? 'Гра' : room.status}
                  </span>
                </div>
                <div className="room-details">
                  <div className="room-detail">
                    <span>👥</span>
                    <span>{room.players}/{room.max_players}</span>
                  </div>
                  <div className="room-detail">
                    <span>💰</span>
                    <span>{room.bet} USDT</span>
                  </div>
                </div>
                <button 
                  className="btn btn-primary join-btn"
                  onClick={() => joinRoom(room.id)}
                  disabled={searching || room.players >= room.max_players || room.status !== 'waiting'}
                >
                  {room.players >= room.max_players ? 'Повна' : room.status !== 'waiting' ? 'Гра в процесі' : 'Приєднатися'}
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
                {game.canPlayWithBot ? (
                  <div className="info-item">
                    <span>🤖</span>
                    <span>Гра з ботом (безкоштовно)</span>
                  </div>
                ) : (
                  <>
                    <div className="info-item">
                      <span>Мін. ставка:</span>
                      <span>{game.minBet} USDT</span>
                    </div>
                    <div className="info-item">
                      <span>Гравців:</span>
                      <span>до {game.maxPlayers}</span>
                    </div>
                  </>
                )}
              </div>
              {game.canPlayWithBot ? (
                <button 
                  className="btn btn-primary create-room-btn"
                  onClick={() => playWithBot(game.id)}
                  disabled={searching}
                >
                  🤖 Грати з ботом
                </button>
              ) : (
                <button 
                  className="btn btn-primary create-room-btn"
                  onClick={() => createRoom(game.id, game.minBet)}
                  disabled={searching}
                >
                  Створити кімнату
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OnlineGames;
