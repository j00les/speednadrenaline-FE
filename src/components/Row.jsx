import { useDispatch, useSelector } from 'react-redux';
import { getColorForCarType } from '../util';
import { useEffect, useState } from 'react';
import { socket } from '../redux/socketMiddleware';
import { deleteRun, fetchRuns } from '../redux/runSlice';

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
  const { runsByDriver, status } = useSelector((state) => state.runs);
  const [selectedRun, setSelectedRun] = useState('');

  // ✅ Fetch runs initially if not loaded
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRuns());
    }
  }, [dispatch, status]);

  // ✅ WebSocket Listener for Real-Time Run Updates
  useEffect(() => {
    socket.on('runDeleted', () => {
      dispatch(fetchRuns()); // ✅ Fetch latest runs on deletion
    });

    return () => {
      socket.off('runDeleted');
    };
  }, [dispatch]);

  // ✅ Extract runs for this driver & car
  const driverEntry = runsByDriver?.find((d) => d.name === name);
  const carEntry = driverEntry?.cars?.find((c) => c.carName === carName);
  let driverRuns = carEntry?.runs || [];

  // ✅ Ensure runs are sorted by best time dynamically
  driverRuns = [...driverRuns].sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
  const bestTime = driverRuns.length > 0 ? driverRuns[0].time : 'N/A';

  // ✅ Ensure selectedRun updates dynamically
  useEffect(() => {
    if (driverRuns.length > 0) {
      setSelectedRun(driverRuns[0].time); // ✅ Select best time by default
    }
  }, [driverRuns]);

  const handleRunSelect = (event) => {
    setSelectedRun(event.target.value);
  };

  const handleDeleteRun = async (timeToDelete) => {
    if (!timeToDelete) return;

    dispatch(deleteRun({ name, carName, time: timeToDelete }))
      .unwrap()
      .then(() => {
        const updatedRuns = driverRuns.filter((run) => run.time !== timeToDelete);
        updatedRuns.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
        setSelectedRun(updatedRuns.length > 0 ? updatedRuns[0].time : '');
      })
      .catch((error) => console.error('❌ Error deleting run:', error));
  };

  // ✅ Ensure `runsByDriver` is available before rendering UI
  if (status === 'loading' || !runsByDriver) {
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
      <td className={`flex gap-1.5 w-[13rem] p-[.8rem] items-center`}>
        <span className="text-[2.5rem] font-titillium font-medium">{POSITION}</span>
        <span className={`p-[.4rem] h-[2.7rem] ${blockColor}`}></span>
        <span className="text-[2.5rem] tracking-tight">{name}</span>
      </td>
      <td className="font-titillium text-[2.2rem] font-semibold text-center">{time}</td>
      <td className="text-[2.2rem] text-center pr-[.5rem] font-titillium font-semibold">
        {gapToFirst}
      </td>
      <td className="text-[2.2rem] text-left pl-[.9rem] font-titillium font-semibold">{carName}</td>
    </tr>
  );

  const renderInputRow = () => (
    <tr className="font-titillium uppercase">
      <td className="flex gap-1.5 w-[12rem] items-center">
        <span className="text-[1.3rem] font-titillium font-medium">{POSITION}</span>
        <span className="w-[.5rem] h-[1.6rem] my-1 bg-gray-500"></span>
        <span className="text-[1.26rem] font-semibold tracking-tight">{name}</span>
      </td>

      {/* ✅ Dropdown with Delete Button */}
      <td className="font-titillium text-[1.3rem] font-semibold text-center">
        <div className="relative inline-block w-[12rem]">
          <select
            value={selectedRun || ''}
            onChange={handleRunSelect}
            className="py-1 border rounded-md text-black w-full"
          >
            {driverRuns.length > 0 ? (
              driverRuns.map((run, index) => (
                <option key={index} value={run.time}>
                  Run {run.runNumber}: {run.time} {run.time === bestTime ? '(PB)' : ''}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No Runs Available
              </option>
            )}
          </select>

          {/* ✅ Separate Delete Button for Each Run */}
          <div className="absolute top-0 right-0 flex flex-col">
            {driverRuns.map((run) => (
              <button
                key={run.time}
                onClick={() => handleDeleteRun(run.time)}
                className="mt-1 bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-800 w-full text-xs"
              >
                ❌ Run {run.runNumber}
              </button>
            ))}
          </div>
        </div>
      </td>

      <td className="text-[1.3rem] text-center pr-[.5rem] font-titillium font-semibold">
        {gapToFirst}
      </td>

      <td className="text-[1.3rem] text-left pl-[1rem] w-[10rem] font-titillium font-semibold">
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
        {time}
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
