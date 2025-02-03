import { useDispatch, useSelector } from 'react-redux';
import { getColorForCarType } from '../util';
import { useEffect, useState } from 'react';
import { socket } from '../redux/socketMiddleware';
import { fetchLeaderboard } from '../redux/leaderboardSlice';

const Row = (props) => {
  const {
    record: { name, drivetrain, gapToFirst, time, carName },
    index,
    isLeaderboardRow,
    isInputRow,
    isResultRow
  } = props;

  const POSITION = index + 1;
  const blockColor = getColorForCarType(drivetrain);
  const dispatch = useDispatch();
  const { leaderboard, status } = useSelector((state) => state.leaderboard);

  // ✅ Fetch leaderboard initially if not loaded
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLeaderboard());
    }
  }, [dispatch, status]);

  // ✅ WebSocket Listener for Real-Time Updates
  useEffect(() => {
    socket.on('runAdded', () => {
      dispatch(fetchLeaderboard()); // ✅ Fetch latest leaderboard on new run
    });

    return () => {
      socket.off('runAdded');
    };
  }, [dispatch]);

  // ✅ Find the fastest time for this driver-car in the leaderboard
  const leaderboardEntry = leaderboard?.find(
    (entry) => entry.name === name && entry.carName === carName
  );
  const fastestTime = leaderboardEntry ? leaderboardEntry.time : 'N/A';

  // ✅ Ensure `leaderboard` is available before rendering UI
  if (status === 'loading' || !leaderboard) {
    return (
      <tr>
        <td colSpan="4" className="text-center">
          Loading...
        </td>
      </tr>
    );
  }

  const renderLeaderboardRow = () => (
    <tr className={`font-sugo uppercase ${POSITION % 2 === 0 ? 'bg-[#D4D4D4]' : ''}`}>
      <td className="flex gap-1.5 w-[13rem] p-[.8rem] items-center">
        <span className="text-[2.5rem] font-titillium font-medium">{POSITION}</span>
        <span className={`p-[.4rem] h-[2.7rem] ${blockColor}`}></span>
        <span className="text-[2.5rem] tracking-tight">{name}</span>
      </td>
      <td className="font-titillium text-[2.2rem] font-semibold text-center">{fastestTime}</td>
      <td className="text-[2.2rem] text-center pr-[.5rem] font-titillium font-semibold">
        {gapToFirst}
      </td>
      <td className="text-[2.2rem] text-left pl-[.9rem] font-titillium font-semibold">{carName}</td>
    </tr>
  );

  const renderInputRow = () => (
    <tr className="font-titillium uppercase">
      <td className="flex gap-1.5 w-[12rem] items-center mt-3">
        <span className="text-[1.3rem] font-titillium font-medium">{POSITION}</span>
        <span className={`w-[.5rem] h-[1.7rem] ${blockColor}`}></span>
        <span className="text-[1.26rem] font-semibold tracking-tight">{name}</span>
      </td>

      {/* ✅ Display only the fastest time */}
      <td className="font-titillium text-[1.3rem] font-semibold text-center py-2">{fastestTime}</td>

      <td className="text-[1.3rem] text-center pr-[.5rem] font-titillium font-semibold">
        {gapToFirst}
      </td>

      <td className="text-[1.3rem] text-left pl-[4rem] w-[10rem] font-titillium font-semibold">
        {carName}
      </td>
    </tr>
  );

  const renderResultRow = () => (
    <tr className={`font-sugo uppercase ${POSITION % 2 === 0 ? 'bg-[#D4D4D4]' : ''}`}>
      <td className="flex gap-[.2rem] items-center w-[13rem]">
        <span className="text-[1rem] font-titillium font-medium">{POSITION}</span>
        <span className={`w-[.4rem] my-[.2rem] h-[1.2rem] ${blockColor}`}></span>
        <span className="text-[1rem]">{name}</span>
      </td>
      <td className="font-titillium pl-[1.3rem] text-[.9rem] tracking-tighter font-semibold text-center">
        {fastestTime}
      </td>
      <td className="text-[.9rem] text-center pr-[.2rem] font-titillium font-semibold">
        {gapToFirst}
      </td>
      <td className="text-[.8rem] text-center pr-[.5rem] font-titillium font-semibold tracking-tighter">
        {carName}
      </td>
    </tr>
  );

  return (
    <>
      {isLeaderboardRow && renderLeaderboardRow()}
      {isInputRow && renderInputRow()}
      {isResultRow && renderResultRow()}
    </>
  );
};

export default Row;
