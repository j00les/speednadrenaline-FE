import { useWebSocket } from '../context/WebSocketContext';
import Table from '../components/Table';

const Leaderboard = () => {
  const { data: leaderboardData } = useWebSocket();

  return <Table isLeaderboardTable leaderboardData={leaderboardData} />;
};

export default Leaderboard;
