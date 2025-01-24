import { useEffect, useState } from 'react';
import axios from 'axios';

import Table from '../components/Table';
import { TUNNEL_BASE_URL } from '../constants';

const Result = () => {
  const [bestTimeData, setBestTimeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestTimeData = async () => {
      setLoading(true); 

      try {
        const {
          data: { bestTimeData }
        } = await axios.get(`${TUNNEL_BASE_URL}/api-get-best-time`);

        const sortedDrivers = bestTimeData[0].drivers.sort((a, b) => {
          return parseInt(a.lapTime, 10) - parseInt(b.lapTime, 10);
        });

        setBestTimeData(sortedDrivers);
      } catch (error) {
        console.error('Error fetching best time data:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchBestTimeData();
  }, []);

  return <Table isResultTable leaderboardData={bestTimeData} loading={loading} />;
};

export default Result;
