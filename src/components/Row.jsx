import { formatGapToFirstPlace, formatLapTime, getColorForCarType, parseLapTime } from '../util';
import Laptime from './Laptime';

const Row = (props) => {
  const { record, index, isLeaderboardRow, isInputRow, isResultRow } = props;

  const renderLeaderboardRow = () => {
    const { name, carType, gapToFirst, time, carName } = record;
    const position = index + 1;
    const positionMargin = position < 10 ? 'ml-[1.25rem]' : '';
    const styling = position % 2 === 0 ? 'bg-[#D4D4D4] p-[20rem]' : '';
    const blockColor = getColorForCarType(carType);

    return (
      <tr className={`font-sugo uppercase ${styling}`}>
        <td className={`flex gap-1.5 w-[13rem] p-[.8rem] items-center`}>
          <span className={`text-[2.5rem] font-titillium font-medium ${positionMargin}`}>
            {position}
          </span>
          <span className={`p-[.4rem] h-[2.7rem] ${blockColor}`}></span>
          <span className={`text-[2.5rem] tracking-tight`}>{name}</span>
        </td>
        <td className="font-titillium text-[2.2rem] font-semibold text-center">
          <Laptime isLeaderboardLaptime time={time} />
        </td>
        <td className="text-[2.2rem] text-center pr-[.5rem] font-titillium font-semibold">
          {formatGapToFirstPlace(gapToFirst)}
        </td>
        <td className="text-[2.2rem] text-left pl-[.9rem] font-titillium font-semibold">
          {carName}
        </td>
      </tr>
    );
  };

  const renderInputRow = () => {
    const { name, driveTrain, gapToFirst, time, carName } = record;

    const position = index + 1;
    const positionMargin = position < 10 ? 'ml-[.8rem]' : '';
    const styling = position % 2 === 0 ? 'bg-[#D4D4D4]' : '';
    const blockColor = getColorForCarType(driveTrain);

    return (
      <tr className={`font-titillium uppercase ${styling}`}>
        <td className={`flex gap-1.5 w-[12rem] items-center`}>
          <span className={`text-[1.3rem] font-titillium font-medium ${positionMargin}`}>
            {position}
          </span>
          <span className={`w-[.5rem] h-[1.6rem] my-1 ${blockColor}`}></span>

          <span className={`text-[1.26rem] font-semibold tracking-tight`}>{name}</span>
        </td>

        <td className="font-titillium text-[1.3rem] mr-[2rem] font-semibold text-center">
          <Laptime isInputLaptime time={time} />
        </td>

        <td className="text-[1.3rem] text-center pr-[.5rem] font-titillium font-semibold">
          {gapToFirst}
        </td>
        <td className="text-[1.3rem] text-left pl-[1rem] w-[10rem] font-titillium font-semibold">
          {carName}
        </td>
      </tr>
    );
  };

  const renderResultRow = () => {
    const { name, carType, gapToFirst, time, carName } = record;

    const position = index + 1;
    const positionMargin = position < 10 ? 'ml-[.55rem]' : '';
    const styling = position % 2 === 0 ? 'bg-[#D4D4D4]' : '';
    const blockColor = getColorForCarType(carType);

    return (
      <tr className={`font-sugo uppercase ${styling}`}>
        <td className={`flex gap-[.2rem] items-center w-[13rem]`}>
          <span className={`text-[1rem] font-titillium font-medium ${positionMargin}`}>
            {position}
          </span>
          <span className={`w-[.4rem] my-[.2rem] h-[1.2rem]  ${blockColor}`}></span>
          <span className={`text-[1rem]`}>{name}</span>
        </td>
        <td className="font-titillium pl-[1.3rem] text-[.9rem] tracking-tighter font-semibold text-center">
          <Laptime isResultLaptime time={time} />
        </td>
        <td className="text-[.9rem] text-center pr-[.2rem] font-titillium font-semibold">
          {formatGapToFirstPlace(gapToFirst)}
        </td>
        <td className="text-[.8rem] text-center pr-[.5rem] font-titillium font-semibold tracking-tighter">
          {carName}
        </td>
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
