import { updateRuns, fetchRuns } from './runSlice';
import { updateLeaderboard } from './leaderboardSlice';
import io from 'socket.io-client';

const socket = io('http://localhost:3002');

export const webSocketMiddleware = (store) => (next) => (action) => {
  if (action.type === 'websocket/connect') {
    socket.on('runAdded', (data) => {
      console.log('📡 Received new run data:', data);

      // Update Redux store when a new run is added
      store.dispatch(updateRuns(data.runsGrouped));
      store.dispatch(updateLeaderboard(data.leaderboardEntry));

      // Fetch latest runs from backend (to ensure data is up-to-date)
      store.dispatch(fetchRuns());
    });

    console.log('✅ WebSocket Connected');
  }

  if (action.type === 'websocket/sendRun') {
    socket.emit('addRun', action.payload);
  }

  return next(action);
};

// Action Creators for WebSocket
export const connectWebSocket = () => ({ type: 'websocket/connect' });
export const sendRun = (runData) => ({ type: 'websocket/sendRun', payload: runData });
