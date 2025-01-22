import { useEffect, useState } from 'react';
import axios from 'axios';

import Table from '../components/Table';
import { TUNNEL_BASE_URL } from '../constants';

const Result = () => {
  const [bestTimeData, setBestTimeData] = useState(null);

  useEffect(() => {
    const fetchBestTimeData = async () => {
      try {
        const {
          data: { bestTimeData }
        } = await axios.get(`${TUNNEL_BASE_URL}/api-get-best-time`);
        setBestTimeData(bestTimeData[0].drivers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBestTimeData();
  }, []);

  return <Table isResultTable leaderboardData={bestTimeData} />;
};

export default Result;
