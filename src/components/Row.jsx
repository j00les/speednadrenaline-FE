import { useEffect } from 'react';
import { formatLapTime } from '../util';

const Row = (props) => {
  const { record, index, isLeaderboardRow, isInputRow, isResultRow } = props;

  const getColorForCarType = (carType) => {
    switch (carType) {
      case 'FWD':
        return 'rounded-[3px] bg-blue-600';
      case 'RWD':
        return 'rounded-[3px] bg-[#87CEEB]';
      case 'AWD':
        return 'rounded-[3px] bg-[#FF4500]';
      default:
        return 'bg-gray-500';
    }
  };

  const renderLeaderboardRow = () => {
    const { name, carType, gapToFirst, lapTime, carName } = record;

    const position = index + 1;
    const positionMargin = position < 10 ? 'ml-[.8rem]' : '';
    const styling = position % 2 === 0 ? 'bg-[#D4D4D4]' : '';
    const blockColor = getColorForCarType(carType);

    return (
      <tr className={`font-sugo uppercase ${styling}`}>
        <td className={`flex gap-1.5 w-[13rem]`}>
          <span className={`text-[1.4rem] font-titillium font-medium ${positionMargin}`}>
            {position}
          </span>
          <span className={`w-[.5rem] ${blockColor}`}></span>
          <span className={`text-[1.7rem] tracking-tight`}>{name}</span>
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

  const renderInputRow = () => {
    const { name, carType, gapToFirst, lapTime, carName } = record;

    const position = index + 1;
    const positionMargin = position < 10 ? 'ml-[.8rem]' : '';
    const styling = position % 2 === 0 ? 'bg-[#D4D4D4]' : '';
    const blockColor = getColorForCarType(carType);

    return (
      <tr className={`font-titillium uppercase ${styling}`}>
        <td className={`flex gap-1.5 w-[12rem]`}>
          <span className={`text-[1.3rem] font-titillium font-medium ${positionMargin}`}>
            {position}
          </span>
          <span className={`w-[.5rem] ${blockColor}`}></span>
          <span className={`text-[1.26rem] font-semibold tracking-tight`}>{name}</span>
        </td>
        <td className="font-titillium text-[1.3rem] mr-[2rem] font-semibold text-center">
          {lapTime}
        </td>
        <td className="text-[1.3rem] text-center pr-[.5rem] font-titillium font-semibold">
          {gapToFirst}
        </td>
        <td className="text-[1.3rem] text-left pl-[1rem] w-[10rem] font-titillium font-semibold">
          {carName}
        </td>

        <td className="text-[1.3rem] text-left w-[2rem] font-titillium font-semibold cursor-pointer">
          <span className="pi pi-trash text-red-500 "></span>
        </td>
      </tr>
    );
  };

  const renderResultRow = () => {
    const { name, carType, gapToFirst, lapTime, carName } = record;

    const position = index + 1;
    const positionMargin = position < 10 ? 'ml-[.8rem]' : '';
    const styling = position % 2 === 0 ? 'bg-[#D4D4D4]' : '';
    const blockColor = getColorForCarType(carType);

    return (
      <tr className={`font-sugo uppercase text-[1.2rem] ${styling}`}>
        <td className={`flex gap-1.5  w-[13rem]`}>
          <span className={`text-[1.2rem] font-titillium font-medium ${positionMargin}`}>
            {position}
          </span>
          <span className={`w-[.4rem] h-[1.2rem]  ${blockColor}`}></span>
          <span className={`text-[1.4rem] tracking-tight`}>{name}</span>
        </td>
        <td className="font-titillium text-[1rem] font-semibold text-center">
          {formatLapTime(lapTime)}
        </td>
        <td className="text-[1rem] text-center pr-[.5rem] font-titillium font-semibold">
          {gapToFirst}
        </td>
        <td className="">{carName}</td>
      </tr>
    );
  };

  return (
    <>
      {isLeaderboardRow && renderLeaderboardRow()}
      {isInputRow && renderInputRow()}
      {isResultRow && renderResultRow()}
    </>
  );
};

export default Row;
