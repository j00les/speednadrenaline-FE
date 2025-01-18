const Row = (props) => {
  const { leaderboardData } = props;

  const getColorForCarType = (carType) => {
    let blockColor = 'bg-gray-500';

    if (carType === 'FWD') {
      blockColor = 'rounded-[3px] bg-blue-600';
    }

    if (carType === 'RWD') {
      blockColor = 'rounded-[3px] bg-[#87CEEB]';
    }

    if (carType === 'AWD') {
      blockColor = 'rounded-[3px] bg-[#FF4500]';
    }

    return blockColor;
  };

  const sortedDataByLapTime = leaderboardData
    .slice()
    .sort((a, b) => a.lapTime - b.lapTime)
    .slice(0, 21);

  return (
    <>
      {sortedDataByLapTime.map((record, index) => {
        const { driverName, lapTime, carName, carType, gapToFirst } = record;
        const position = index + 1;
        const positionMargin = position < 10 && 'ml-[.8rem]';
        const styling = position % 2 === 0 && 'bg-[#D4D4D4]';

        const blockColor = getColorForCarType(carType);

        return (
          <tr key={index} className={`font-sugo uppercase font-medium ${styling}`}>
            <td className="flex gap-1.5 mt-2  w-[11rem]">
              <span className={`text-2xl font-titillium font-medium ${positionMargin}`}>
                {position}
              </span>
              <span className={`w-[.7rem] ${blockColor}`}></span>
              <span className={`ml-1 text-3xl tracking-tight`}>{driverName}</span>
            </td>
            <td className="font-titillium font-semibold text-center pr-[2rem]">{lapTime}</td>
            <td className="text-[1.5rem] text-center pr-[1.5rem] font-titillium font-semibold">
              {gapToFirst}
            </td>
            <td className="text-[1.5rem] text-left pl-[.8rem] font-titillium font-semibold">
              {carName}
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default Row;
