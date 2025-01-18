import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sortAndCalculateLeaderboard } from '../util';
import { openDB } from 'idb';

const WebSocketContext = createContext();
const DATABASE_NAME = 'WebSocketDataDB';
const RUNS_STORE = 'runsByDriverStore';
const LEADERBOARD_STORE = 'leaderboardStore';

const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  const sortedLeaderboard = sortAndCalculateLeaderboard(context.data);

  return {
    ...context,
    data: sortedLeaderboard // Return processed leaderboard data
  };
};

const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState([]);
  const [runsByDriver, setRunsByDriver] = useState({});

  const formatGapToFirstPlace = (gapInMilliseconds) => {
    const formattedGap = (gapInMilliseconds / 1000).toFixed(3); // Convert to seconds and format to 3 decimal places
    return formattedGap.padStart(6, '0'); // Ensure the format is `00.000`
  };

  WebSocketProvider.propTypes = {
    children: PropTypes.node.isRequired
  };

  // Initialize IndexedDB
  useEffect(() => {
    const initializeDB = async () => {
      const db = await openDB(DATABASE_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(RUNS_STORE)) {
            db.createObjectStore(RUNS_STORE);
          }
          if (!db.objectStoreNames.contains(LEADERBOARD_STORE)) {
            db.createObjectStore(LEADERBOARD_STORE);
          }
        }
      });

      // Load existing data from IndexedDB for both stores
      const storedRuns = await db.get(RUNS_STORE, 'drivers');
      const storedLeaderboard = await db.get(LEADERBOARD_STORE, 'leaderboard');

      if (storedRuns) {
        setRunsByDriver(storedRuns);
      }
      if (storedLeaderboard) {
        setData(storedLeaderboard);
      }
    };

    initializeDB();
  }, []);

  // Save `runsByDriver` to IndexedDB whenever it changes
  useEffect(() => {
    const saveRunsToIndexedDB = async () => {
      const db = await openDB(DATABASE_NAME, 1);
      await db.put(RUNS_STORE, runsByDriver, 'drivers');
    };

    if (Object.keys(runsByDriver).length > 0) {
      saveRunsToIndexedDB();
    }
  }, [runsByDriver]);

  // Save `data` (leaderboard) to IndexedDB whenever it changes
  useEffect(() => {
    const saveLeaderboardToIndexedDB = async () => {
      try {
        const db = await openDB(DATABASE_NAME, 1);

        // Clear previous leaderboard entries to ensure no duplicates
        await db.clear(LEADERBOARD_STORE);

        // Save deduplicated leaderboard
        await db.put(LEADERBOARD_STORE, data, 'leaderboard');
        console.log('Leaderboard data saved to IndexedDB.');
      } catch (error) {
        console.error('Error saving leaderboard to IndexedDB:', error);
      }
    };

    if (data.length > 0) {
      saveLeaderboardToIndexedDB();
    }
  }, [data]);

  //socket logic
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const updatedData = JSON.parse(event.data);
        const driverName = updatedData.driverName;
        const carName = updatedData.carName;
        const lapTime = updatedData.lapTime;
        const uniqueDriverCarKey = `${driverName}-${carName}`;

        setData((prevLeaderboard) => {
          const leaderboardMap = prevLeaderboard.reduce((acc, current) => {
            const key = `${current.name}-${current.carName}`;
            acc[key] = current;
            return acc;
          }, {});

          // Add or update with the new data
          if (
            !leaderboardMap[uniqueDriverCarKey] ||
            lapTime < leaderboardMap[uniqueDriverCarKey].lapTime
          ) {
            leaderboardMap[uniqueDriverCarKey] = { name: driverName, carName, lapTime };
          }

          // Convert back to an array
          const updatedLeaderboard = Object.values(leaderboardMap);

          // Gap to first logic
          const firstPlaceTime = Math.min(...updatedLeaderboard.map((entry) => entry.lapTime));
          return updatedLeaderboard.map((entry) => ({
            ...entry,
            gapToFirst: formatGapToFirstPlace(entry.lapTime - firstPlaceTime)
          }));
        });

        // Update runs by driver with all lap times
        setRunsByDriver((prevRuns) => {
          const runsCopy = { ...prevRuns };

          console.log(driverName, carName, lapTime);
          if (!runsCopy[driverName]) {
            runsCopy[driverName] = {};
          }

          if (!runsCopy[driverName][carName]) {
            runsCopy[driverName][carName] = [];
          }

          runsCopy[driverName][carName].push(lapTime);
          console.log(runsCopy, '--debug runs copy');

          return runsCopy;
        });
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendData = (message) => {
    const isSocketStateReady = socket && socket.readyState === WebSocket.OPEN;
    const isObject = typeof message === 'object';

    if (isSocketStateReady) {
      if (isObject) {
        socket.send(JSON.stringify(message));
      } else {
        socket.send(message);
      }
    } else {
      console.error('WebSocket is not open. Unable to send message.');
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, data, sendData, runsByDriver }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { useWebSocket, WebSocketProvider };
