import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3002';

// Fetch all runs grouped by driver and car
export const fetchRuns = createAsyncThunk('runs/fetchRuns', async () => {
  const response = await axios.get(`${BASE_URL}/runs`);
  return response.data;
});

const runsSlice = createSlice({
  name: 'runs',
  initialState: {
    runsByDriver: [],
    status: 'idle',
    error: null
  },
  reducers: {
    updateRuns: (state, action) => {
      state.runsByDriver = action.payload; // Update state in real-time
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRuns.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRuns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.runsByDriver = action.payload;
      })
      .addCase(fetchRuns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { updateRuns } = runsSlice.actions;
export default runsSlice.reducer;
