import { configureStore } from '@reduxjs/toolkit';

import runsReducer from './runSlice';
import leaderboardReducer from './leaderboardSlice';

const store = configureStore({
  reducer: {
    runs: runsReducer,
    leaderboard: leaderboardReducer
  }
});

export default store;
