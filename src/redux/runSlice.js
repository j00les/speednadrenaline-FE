import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { formatLapTime } from '../util';

const BASE_URL = 'http://localhost:3002';

// ✅ Fetch all runs grouped by driver and car
export const fetchRuns = createAsyncThunk('runs/fetchRuns', async () => {
  const response = await axios.get(`${BASE_URL}/runs`);
  return response.data.map((driver) => ({
    ...driver,
    cars: driver.cars.map((car) => ({
      ...car,
      drivetrain: car.drivetrain,
      runs: car.runs.map((run) => ({
        ...run,
        rawTime: parseFloat(run.time),
        time: formatLapTime(run.time)
      }))
    }))
  }));
});

// ✅ Delete a specific run
export const deleteRun = createAsyncThunk('runs/deleteRun', async ({ name, carName, time }) => {
  await axios.delete(`${BASE_URL}/deleteRun`, {
    params: { name, carName, time } // ✅ Use query parameters instead of `body`
  });
  return { name, carName, time };
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
      state.runsByDriver = action.payload; // ✅ Direct update from WebSocket
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRuns.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRuns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.runsByDriver = action.payload; // ✅ Store runs with rawTime for calculations
      })
      .addCase(fetchRuns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteRun.fulfilled, (state, action) => {
        const { name, carName, time } = action.payload;
        state.runsByDriver = state.runsByDriver.map((driver) =>
          driver.name === name
            ? {
                ...driver,
                cars: driver.cars.map((car) =>
                  car.carName === carName
                    ? { ...car, runs: car.runs.filter((run) => run.time !== time) }
                    : car
                )
              }
            : driver
        );
      });
  }
});

export const { updateRuns } = runsSlice.actions;
export default runsSlice.reducer;
