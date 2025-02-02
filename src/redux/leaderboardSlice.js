// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { formatLapTime, formatGapToFirstPlace } from '../util';

// const BASE_URL = 'http://localhost:3002';

// // ✅ Fetch leaderboard from backend
// export const fetchLeaderboard = createAsyncThunk('leaderboard/fetchLeaderboard', async () => {
//   const response = await axios.get(`${BASE_URL}/leaderboard`);
//   return response.data;
// });

// // ✅ Update leaderboard dynamically (WebSocket)
// export const updateLeaderboard = createAsyncThunk(
//   'leaderboard/updateLeaderboard',
//   async (newData, { getState }) => {
//     const existingLeaderboard = getState().leaderboard.leaderboard || [];

//     // ✅ Merge or replace existing entries
//     const updatedLeaderboard = mergeLeaderboardData(existingLeaderboard, newData);

//     return updatedLeaderboard;
//   }
// );

// const leaderboardSlice = createSlice({
//   name: 'leaderboard',
//   initialState: {
//     leaderboard: [],
//     status: 'idle',
//     error: null
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchLeaderboard.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchLeaderboard.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.leaderboard = recalculateGapToFirst(action.payload);
//       })
//       .addCase(fetchLeaderboard.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       })
//       .addCase(updateLeaderboard.fulfilled, (state, action) => {
//         state.leaderboard = recalculateGapToFirst(action.payload);
//       });
//   }
// });

// // ✅ Helper function to recalculate `gapToFirst`
// const recalculateGapToFirst = (leaderboard) => {
//   if (!leaderboard || leaderboard.length === 0) return [];

//   // ✅ Sort by best time
//   const sortedLeaderboard = [...leaderboard].sort(
//     (a, b) => parseInt(a.time, 10) - parseInt(b.time, 10)
//   );

//   // ✅ Get fastest time
//   const firstPlaceTime = parseInt(sortedLeaderboard[0].time, 10) || 0;

//   // ✅ Compute & format gap
//   return sortedLeaderboard.map((entry) => ({
//     ...entry,
//     time: formatLapTime(parseInt(entry.time, 10)), // ✅ Format time
//     gapToFirst: formatGapToFirstPlace(Math.max(0, parseInt(entry.time, 10) - firstPlaceTime)) // ✅ Format gap
//   }));
// };

// // ✅ Merging function to update leaderboard efficiently
// const mergeLeaderboardData = (existingLeaderboard, newData) => {
//   const leaderboardMap = new Map();

//   existingLeaderboard.forEach((entry) => {
//     leaderboardMap.set(`${entry.name}-${entry.carName}`, entry);
//   });

//   newData.forEach((newEntry) => {
//     const key = `${newEntry.name}-${newEntry.carName}`;
//     if (
//       !leaderboardMap.has(key) ||
//       parseInt(newEntry.time, 10) < parseInt(leaderboardMap.get(key).time, 10)
//     ) {
//       leaderboardMap.set(key, newEntry);
//     }
//   });

//   return Array.from(leaderboardMap.values());
// };

// export default leaderboardSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { formatLapTime, formatGapToFirstPlace, parseLapTime } from '../util';

const BASE_URL = 'http://localhost:3002';

// ✅ Fetch leaderboard from backend
export const fetchLeaderboard = createAsyncThunk('leaderboard/fetchLeaderboard', async () => {
  const response = await axios.get(`${BASE_URL}/leaderboard`);
  return response.data;
});

// ✅ Update leaderboard dynamically (from WebSocket)
export const updateLeaderboard = createAsyncThunk(
  'leaderboard/updateLeaderboard',
  async (newData) => newData
);

// ✅ Remove an entry from leaderboard
export const deleteLeaderboardEntry = createAsyncThunk(
  'leaderboard/deleteLeaderboardEntry',
  async ({ name, carName }) => {
    // ✅ Pass as an object
    await axios.delete(`${BASE_URL}/leaderboard`, {
      data: { name, carName } // ✅ Correct axios.delete format
    });
    return { name, carName };
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
      })
      .addCase(deleteLeaderboardEntry.fulfilled, (state, action) => {
        state.leaderboard = state.leaderboard.filter(
          (entry) =>
            !(entry.name === action.payload.name && entry.carName === action.payload.carName)
        );
      });
  }
});

// ✅ Fix Sorting and Gap Calculation
const recalculateGapToFirst = (leaderboard) => {
  if (!leaderboard || leaderboard.length === 0) return [];

  // ✅ Convert all times to raw milliseconds before sorting
  const sortedLeaderboard = [...leaderboard].sort(
    (a, b) => parseLapTime(a.time) - parseLapTime(b.time) // ✅ Corrected sorting
  );

  // ✅ Get the first-place (fastest) time in milliseconds
  const firstPlaceTimeMs =
    sortedLeaderboard.length > 0 ? parseLapTime(sortedLeaderboard[0].time) : 0;

  return sortedLeaderboard.map((entry) => {
    const entryTimeMs = parseLapTime(entry.time); // ✅ Convert current time to milliseconds
    const gap = Math.max(0, entryTimeMs - firstPlaceTimeMs); // ✅ Ensure gap is never negative

    return {
      ...entry,
      time: formatLapTime(entryTimeMs), // ✅ Format correctly
      gapToFirst: formatGapToFirstPlace(gap) // ✅ Format gap properly
    };
  });
};

export default leaderboardSlice.reducer;
