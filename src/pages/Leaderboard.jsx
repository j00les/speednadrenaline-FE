import { useEffect, useState } from 'react';

import { useWebSocket } from '../context/WebSocketContext';
import { leaderboardData } from '../constants';
import Table from '../components/Table';

const Leaderboard = () => {
  // const { socket } = useWebSocket();
  // const [leaderboardData, setLeaderboardData] = useState([]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.onmessage = (message) => {
  //       const data = JSON.parse(message.data);
  //       setLeaderboardData((prevData) => {
  //         const updatedData = [...prevData, data];
  //         updatedData.sort((a, b) => parseFloat(a.lapTime) - parseFloat(b.lapTime));
  //         return updatedData;
  //       });
  //     };

  //     return () => {
  //       socket.onmessage = null;
  //     };
  //   }
  // }, [socket]);

  return <Table isLeaderboardTable leaderboardData={leaderboardData} />;
};

export default Leaderboard;
