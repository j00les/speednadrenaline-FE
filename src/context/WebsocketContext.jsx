import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const WebSocketContext = createContext();

const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState([]);

  WebSocketProvider.propTypes = {
    children: PropTypes.node.isRequired
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000'); // Replace with your WebSocket server address

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      try {
        const updatedData = JSON.parse(event.data);
        console.log('Parsed data:', updatedData);
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

  return <WebSocketContext.Provider value={{ socket, data }}>{children}</WebSocketContext.Provider>;
};

export { useWebSocket, WebSocketProvider };
