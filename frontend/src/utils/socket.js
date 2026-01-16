import { io } from 'socket.io-client';

let socket = null;

export function initSocket(initData) {
  if (socket && socket.connected) {
    return socket;
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  // Extract base URL without /api
  const baseUrl = API_URL.replace('/api', '');
  const wsUrl = baseUrl.startsWith('https') 
    ? baseUrl.replace('https://', 'wss://')
    : baseUrl.replace('http://', 'ws://');

  socket = io(wsUrl, {
    auth: {
      initData: initData
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('🔌 WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('🔌 WebSocket disconnected');
  });

  socket.on('error', (error) => {
    console.error('🔌 WebSocket error:', error);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export default { initSocket, getSocket, disconnectSocket };
