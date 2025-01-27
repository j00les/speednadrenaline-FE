import { createContext, useContext, useState, useEffect } from 'react';

import { parseLapTime, sortAndCalculateLeaderboard } from '../util';
import {
  addLeaderboardData,
  deleteIndexedDB,
  deleteRecordById,
  initializeDB,
  saveLeadeboardData
} from '../db/indexedDB';

const WebSocketContext = createContext();

const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  return {
    ...context
  };
};

const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [runsByDriver, setRunsByDriver] = useState({});

  // Initialize IndexedDB
  useEffect(() => {
    initializeDB();
    // deleteIndexedDB('SpeedNAdrenaline');
  }, []);

  //leaderboard store
  useEffect(() => {
    saveLeadeboardData(setLeaderboardData);
  }, [leaderboardData]);

  // Save `runsByDriver` to IndexedDB whenever it changes
  // useEffect(() => {
  //   if (Object.keys(runsByDriver).length > 0) {
  //     saveRunsToIndexedDB(runsByDriver);
  //   }
  // }, [runsByDriver]);

  // Save `data` (leaderboard) to IndexedDB whenever it changes

  //socket logic
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      setSocket(ws);
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      try {
        const updatedData = JSON.parse(event.data);
        const driverName = updatedData.driverName;
        const carName = updatedData.carName;
        const lapTime = updatedData.lapTime;
        const driveTrain = updatedData.driveTrain;
        const uniqueDriverCarKey = `${driverName}-${carName}`;

        setLeaderboardData((prevLeaderboard) => {
          const leaderboardMap = prevLeaderboard.reduce((acc, current) => {
            const key = `${current.name}-${current.carName}`;
            acc[key] = current;
            return acc;
          }, {});

          // Convert back to an array
          const updatedLeaderboard = sortAndCalculateLeaderboard(Object.values(leaderboardMap));

          return updatedLeaderboard;
        });

        // Update runs by driver with all lap times
        //     setRunsByDriver((prevRuns) => {
        //       const runsCopy = { ...prevRuns };

        //       if (!runsCopy[driverName]) {
        //         runsCopy[driverName] = {};
        //       }

        //       if (!runsCopy[driverName][carName]) {
        //         runsCopy[driverName][carName] = [];
        //       }

        //       const currentRunCount = runsCopy[driverName][carName].length;
        //       const nextRunNumber = currentRunCount + 1;

        //       runsCopy[driverName][carName].push({
        //         lapTime,
        //         runNumber: nextRunNumber,
        //         driveTrain: driveTrain
        //       });

        //       return runsCopy;
        //     });
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
    const shouldSendMessage = isSocketStateReady && isObject;
    const parsedMessage = JSON.stringify(message);
    const parsedJSON = JSON.parse(parsedMessage);

    if (shouldSendMessage) {
      socket.send(parsedMessage);
      addLeaderboardData(parsedJSON);
    }

    if (!shouldSendMessage) {
      console.log('WebSocket connection not ready or message is not an object');
    }
  };

  return (
    <WebSocketContext.Provider value={{ leaderboardData, sendData, runsByDriver }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { useWebSocket, WebSocketProvider };

//provider to wrap the app sot the state is available to all components
//useWebSocket hook to access the state
