import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3002';

// Fetch leaderboard from backend
export const fetchLeaderboard = createAsyncThunk('leaderboard/fetchLeaderboard', async () => {
  const response = await axios.get(`${BASE_URL}/leaderboard`);
  return response.data;
});

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    leaderboard: [],
    status: 'idle',
    error: null
  },
  reducers: {
    updateLeaderboard: (state, action) => {
      const newEntry = action.payload;
      if (!Array.isArray(newEntry)) {
        // If updating a single entry, find and replace the existing one
        const existingIndex = state.leaderboard.findIndex(
          (entry) => entry.name === newEntry.name && entry.carName === newEntry.carName
        );

        if (existingIndex !== -1) {
          // Overwrite if new lap time is better
          if (
            parseInt(newEntry.lapTime, 10) < parseInt(state.leaderboard[existingIndex].lapTime, 10)
          ) {
            state.leaderboard[existingIndex] = newEntry;
          }
        } else {
          // Otherwise, add a new entry
          state.leaderboard.push(newEntry);
        }
      } else {
        state.leaderboard = newEntry;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { updateLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
