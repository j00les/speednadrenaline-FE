import { useEffect, useState } from 'react';
import axios from 'axios';

import Table from '../components/Table';

const Result = () => {
  const [bestTimeData, setBestTimeData] = useState(null);

  useEffect(() => {
    const fetchBestTimeData = async () => {
      try {
        const {
          data: { bestTimeData }
        } = await axios.get('http://localhost:3000/api-get-best-time');
        console.log();
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
