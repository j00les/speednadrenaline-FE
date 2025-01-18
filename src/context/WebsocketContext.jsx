import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sortAndCalculateLeaderboard } from '../util';

const WebSocketContext = createContext();

sortAndCalculateLeaderboard;
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
      // console.log('Message received:', event.data);
      try {
        const updatedData = JSON.parse(event.data);

        setData((prevData) => [...prevData, updatedData]);
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

  // Function to send data to the WebSocket server
  const sendData = (message) => {
    console.log(message, '--debug message');
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
    <WebSocketContext.Provider value={{ socket, data, sendData }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { useWebSocket, WebSocketProvider };
