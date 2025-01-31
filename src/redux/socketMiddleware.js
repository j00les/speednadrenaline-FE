import { updateRuns, fetchRuns } from './runSlice';
import io from 'socket.io-client';

export const socket = io('http://localhost:3002');

export const webSocketMiddleware = (store) => (next) => (action) => {
  if (action.type === 'websocket/connect') {
    socket.on('runAdded', (data) => {
      console.log('📡 Received new run data:', data);

      // Update Redux store when a new run is added
      store.dispatch(updateRuns(data.runsGrouped));

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
