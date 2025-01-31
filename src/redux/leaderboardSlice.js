import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { formatLapTime, formatGapToFirstPlace } from '../util';

const BASE_URL = 'http://localhost:3002';

// ✅ Fetch leaderboard from backend
export const fetchLeaderboard = createAsyncThunk('leaderboard/fetchLeaderboard', async () => {
  const response = await axios.get(`${BASE_URL}/leaderboard`);
  return response.data;
});

// ✅ Update leaderboard dynamically (from WebSocket)
export const updateLeaderboard = createAsyncThunk(
  'leaderboard/updateLeaderboard',
  async (newData) => {
    return newData;
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    leaderboard: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaderboard = recalculateGapToFirst(action.payload);
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = recalculateGapToFirst(action.payload);
      });
  }
});

// ✅ Helper function to recalculate `gapToFirst` every time the leaderboard updates
const recalculateGapToFirst = (leaderboard) => {
  if (!leaderboard || leaderboard.length === 0) return [];

  // ✅ Sort leaderboard by best time (ascending order)
  const sortedLeaderboard = [...leaderboard].sort(
    (a, b) => parseInt(a.time, 10) - parseInt(b.time, 10)
  );

  // ✅ Get first place time (fastest time)
  const firstPlaceTime = parseInt(sortedLeaderboard[0].time, 10) || 0;

  // ✅ Recalculate `gapToFirst` for each entry
  return sortedLeaderboard.map((entry) => ({
    ...entry,
    time: formatLapTime(parseInt(entry.time, 10)), // ✅ Format lap time
    gapToFirst: formatGapToFirstPlace(Math.max(0, parseInt(entry.time, 10) - firstPlaceTime)) // ✅ Compute & format gap
  }));
};

export default leaderboardSlice.reducer;
