import { useEffect } from 'react';
import { formatLapTime, parseLapTime } from '../util';

const Laptime = (props) => {
  const { isInputLaptime, isResultLaptime, isLeaderboardLaptime, time } = props;

  const formattedLaptime = () => {
    const result = formatLapTime(parseLapTime(time));

    return result;
  };

  const renderInputLaptimes = () => <>{formattedLaptime()}</>;
  const renderLeaderboardLaptimes = () => <>{formattedLaptime()}</>;
  const renderResultLaptimes = () => <>{formattedLaptime()}</>;

  return (
    <>
      {isInputLaptime && renderInputLaptimes()}
      {isResultLaptime && renderResultLaptimes()}
      {isLeaderboardLaptime && renderLeaderboardLaptimes()}
    </>
  );
};

export default Laptime;
