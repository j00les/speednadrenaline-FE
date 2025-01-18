import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sortAndCalculateLeaderboard } from '../util';

const WebSocketContext = createContext();

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

          //new entry or betterlap time
          if (
            !leaderboardMap[uniqueDriverCarKey] ||
            lapTime < leaderboardMap[uniqueDriverCarKey].lapTime
          ) {
            leaderboardMap[uniqueDriverCarKey] = { name: driverName, carName, lapTime };
          }

          const updatedLeaderboard = Object.values(leaderboardMap);

          // gap to first logic
          const firstPlaceTime = Math.min(...updatedLeaderboard.map((entry) => entry.lapTime));
          const leaderboardWithGap = updatedLeaderboard.map((entry) => {
            const gap = entry.lapTime - firstPlaceTime;
            return {
              ...entry,
              gapToFirst: formatGapToFirstPlace(gap) // Add formatted gap
            };
          });

          return leaderboardWithGap;
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
