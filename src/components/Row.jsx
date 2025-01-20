const Row = (props) => {
  const { leaderboardData, isInputRow, isResultRow, isLeaderboardRow } = props;

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

  return (
    <>
      {leaderboardData.map((record, index) => {
        const { name, lapTime, carName, carType, gapToFirst } = record;

        const position = index + 1;
        const positionMargin = position < 10 && 'ml-[.8rem]';
        const styling = position % 2 === 0 && 'bg-[#D4D4D4]';
        const blockColor = getColorForCarType(carType);
        const fontStyle = isInputRow
          ? 'font-titillium font-semibold text-[1.39rem]'
          : 'font-sugo text-[1.8rem]';
        const positionMargintop = isInputRow ? 'mt-1' : 'mt-2';

        const renderRow = () => {
          return (
            <tr key={index} className={`font-sugo  uppercase ${styling}`}>
              <td className={`flex gap-1.5 ${positionMargintop}  w-[13rem]`}>
                <span className={`text-[1.4rem] font-titillium font-medium ${positionMargin}`}>
                  {position}
                </span>
                <span className={`w-[.5rem]   ${blockColor}`}></span>
                <span className={`${fontStyle} text-[1.7rem] tracking-tight`}>{name}</span>
              </td>
              <td className="font-titillium text-[1.4rem] font-semibold text-center">{lapTime}</td>
              <td className="text-[1.4rem] text-center pr-[.5rem] font-titillium font-semibold">
                {gapToFirst}
              </td>
              <td className="text-[1.4rem] text-left pl-[.9rem] font-titillium font-semibold">
                {carName}
              </td>
            </tr>
          );
        };

        const renderResultRow = () => {
          return (
            <tr key={index} className={`font-sugo  uppercase text-[1.2rem] ${styling}`}>
              <td className={`flex gap-1.5 ${positionMargintop}  w-[13rem]`}>
                <span className={`text-[1.2rem] font-titillium font-medium ${positionMargin}`}>
                  {position}
                </span>
                <span className={`w-[.4rem] h-[1.2rem]  ${blockColor}`}></span>
                <span className={`text-[1.3rem] tracking-tight`}>{name}</span>
              </td>
              <td className="font-titillium text-[1.1rem] font-semibold text-center">{lapTime}</td>
              <td className="text-[1.1rem] text-center pr-[.5rem] font-titillium font-semibold">
                {gapToFirst}
              </td>
              <td className="text-[1rem] text-left pl-[.2rem] tracking-tighter font-titillium font-semibold">
                {carName}
              </td>
            </tr>
          );
        };

        return (
          <>
            {isLeaderboardRow && renderRow()}
            {isInputRow && renderRow()}
            {isResultRow && renderResultRow()}
          </>
        );
      })}
    </>
  );
};

export default Row;
