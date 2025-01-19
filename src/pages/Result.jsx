import { useWebSocket } from '../context/WebSocketContext';
import Table from '../components/Table';

const Result = () => {
  const { data: leaderboardData } = useWebSocket();

  return <Table isResultTable leaderboardData={leaderboardData} />;
};

export default Result;
