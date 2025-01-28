import { createContext, useContext, useState, useEffect } from 'react';

import { parseLapTime } from '../util';
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
        const driverName = updatedData.name;
        const carName = updatedData.carName;
        const time = updatedData.time;
        const driveTrain = updatedData.driveTrain;

        setLeaderboardData((currentLeaderboard) => {
          const leaderboardMap = {};

          // Normalize and add all existing leaderboard entries to the map
          currentLeaderboard.forEach((entry) => {
            // Normalize the name and carName for consistency (trim spaces, lowercase)
            const normalizedDriverName = entry.name.trim().toLowerCase();
            const normalizedCarName = entry.carName.trim().toLowerCase();

            const uniqueKey = `${normalizedDriverName}-${normalizedCarName}`;
            leaderboardMap[uniqueKey] = entry;
          });

          // Create the new entry from the incoming data
          if (driverName && carName && !isNaN(parseInt(time, 10))) {
            const normalizedDriverName = driverName.trim().toLowerCase();
            const normalizedCarName = carName.trim().toLowerCase();

            const uniqueKey = `${normalizedDriverName}-${normalizedCarName}`;
            const newTime = parseInt(time, 10); // Convert incoming time to a number

            // Only update if the time is faster
            if (
              !leaderboardMap[uniqueKey] ||
              newTime < parseInt(leaderboardMap[uniqueKey].time, 10)
            ) {
              const newEntry = {
                name: driverName,
                carName,
                time: String(newTime).padStart(7, '0'), // Ensure uniform format
                driveTrain
              };

              leaderboardMap[uniqueKey] = newEntry; // Update the map with the new entry
            }
          }

          // Convert map to an array, sort it by time (as a number), and return
          const updatedLeaderboard = Object.values(leaderboardMap).sort((a, b) => {
            const timeA = parseInt(a.time, 10); // Parse time as a number
            const timeB = parseInt(b.time, 10);
            return timeA - timeB;
          });

          console.log(updatedLeaderboard, '--debug ');
          return updatedLeaderboard;
        });

        // setRunsByDriver((prevRuns) => {
        //   const runsCopy = { ...prevRuns };

        //   // If driver doesn't exist, create an empty object for them
        //   if (!runsCopy[driverName]) {
        //     runsCopy[driverName] = {};
        //   }

        //   // If the car doesn't exist under the driver, create an empty array for the car's runs
        //   if (!runsCopy[driverName][carName]) {
        //     runsCopy[driverName][carName] = [];
        //   }

        //   // Get the number of previous runs for the car and calculate the next run number
        //   const currentRunCount = runsCopy[driverName][carName].length;
        //   const nextRunNumber = currentRunCount + 1;

        //   // Append the new lap data to the car's history
        //   runsCopy[driverName][carName].push({
        //     time, // Lap time
        //     runNumber: nextRunNumber, // Run number
        //     driveTrain // Drive train type (AWD, FWD, etc.)
        //   });

        //   // Save the updated data to IndexedDB
        //   updateRunsInIndexedDB(runsCopy);

        //   // Return the updated state
        //   return runsCopy;
        // });
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
      addLeaderboardData(parsedJSON, setLeaderboardData);
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

// kalo dia sama => patch  the unique key
