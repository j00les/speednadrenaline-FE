import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { updateRuns, fetchRuns } from '../redux/runSlice'; // Import fetchRuns to ensure live update
import { updateLeaderboard } from '../redux/leaderboardSlice';

const WebSocketContext = createContext(null);
const socket = io('http://localhost:3002');

const WebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const runsByDriver = useSelector((state) => state.runs.runsByDriver);

  useEffect(() => {
    socket.on('runAdded', (data) => {
      console.log('📡 Received new run data:', data);

      // Update runs and leaderboard in real-time
      dispatch(updateRuns(data.runsGrouped));
      dispatch(updateLeaderboard(data.leaderboardEntry));

      // Fetch latest runs from backend (ensures no missing data)
      dispatch(fetchRuns());
    });

    return () => {
      socket.off('runAdded');
    };
  }, [dispatch, runsByDriver]);

  const sendRun = (runData) => {
    socket.emit('addRun', runData);
  };

  return <WebSocketContext.Provider value={{ sendRun }}>{children}</WebSocketContext.Provider>;
};

// Custom Hook to Use WebSocket
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export { socket, WebSocketProvider };
