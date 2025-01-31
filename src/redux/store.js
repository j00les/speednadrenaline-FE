import { configureStore } from '@reduxjs/toolkit';

import runsReducer from './runSlice';
import leaderboardReducer from './leaderboardSlice';
import { webSocketMiddleware } from './socketMiddleware';

const store = configureStore({
  reducer: {
    runs: runsReducer,
    leaderboard: leaderboardReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(webSocketMiddleware) // Add WebSocket Middleware
});

export default store;
