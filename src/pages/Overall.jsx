import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import { fetchRuns, updateRuns } from '../redux/runSlice';
import overall from '../assets/RUN_OVERALL[1].png';

const ITEMS_PER_PAGE = 4; // ✅ Show 4 drivers per page
const COLUMNS = 5; // ✅ Set number of columns

const socket = io('http://localhost:3002'); // ✅ Connect to WebSocket server

const Overall = () => {
  const dispatch = useDispatch();
  const { runsByDriver } = useSelector((state) => state.runs);

  const [currentPage, setCurrentPage] = useState(1);
  const [fastestOverallRun, setFastestOverallRun] = useState(null);
  const [personalBestTimes, setPersonalBestTimes] = useState({});

  useEffect(() => {
    dispatch(fetchRuns());

    // ✅ Listen for WebSocket updates
    socket.on('runAdded', (data) => {
      dispatch(updateRuns(data.runsGrouped));
    });

    socket.on('runDeleted', () => {
      dispatch(fetchRuns()); // ✅ Fetch updated runs when a run is deleted
    });

    return () => {
      socket.off('runAdded'); // ✅ Cleanup WebSocket listener
      socket.off('runDeleted'); // ✅ Cleanup WebSocket listener
    };
  }, [dispatch]);

  // ✅ Watch for `runsByDriver` changes and update fastestOverallRun & personalBestTimes
  useEffect(() => {
    let fastestRun = null;
    const newPersonalBestTimes = {};

    runsByDriver?.forEach((driver) => {
      driver.cars.forEach((car) => {
        let bestTime = Infinity;

        car.runs.forEach((run) => {
          // ✅ Use `rawTime` directly instead of parsing
          const rawTime = run.rawTime;

          // ✅ Track fastest overall run
          if (!fastestRun || rawTime < fastestRun.rawTime) {
            fastestRun = {
              driverName: driver.name,
              carName: car.carName,
              runNumber: run.runNumber,
              time: run.time,
              rawTime
            };
          }

          // ✅ Track personal best for driver-car combination
          if (rawTime < bestTime) {
            bestTime = rawTime;
          }
        });

        newPersonalBestTimes[`${driver.name}-${car.carName}`] = bestTime;
      });
    });

    setFastestOverallRun(fastestRun);
    setPersonalBestTimes(newPersonalBestTimes);
  }, [runsByDriver]); // ✅ Updates dynamically when `runsByDriver` changes

  if (!runsByDriver || runsByDriver.length === 0) {
    return <p className="text-center text-xl mt-4">Loading...</p>;
  }

  // ✅ Pagination logic
  const totalPages = Math.ceil(runsByDriver.length / ITEMS_PER_PAGE) || 1;
  const paginatedDrivers = runsByDriver.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-tv-width h-tv-height mx-auto bg-gray-50 border shadow-md px-[5rem]">
      <div className="flex justify-center mt-[5rem] mb-4">
        <img id="sa-logo" src={overall} alt="SpeedNAdrenaline Logo" />
      </div>

      {/* ✅ Fastest Run Header - Updates Dynamically */}
      {fastestOverallRun && (
        <div className="text-center bg-purple-600 text-white py-2 text-xl font-bold uppercase">
          Fastest Run: {fastestOverallRun.driverName} - {fastestOverallRun.carName}
          (Run {fastestOverallRun.runNumber}) - {fastestOverallRun.time}
        </div>
      )}

      {paginatedDrivers.length > 0 ? (
        <div className="mt-4">
          {paginatedDrivers.map((driver) => (
            <div key={`driver-${driver.name}`} className="mt-6">
              <h2 className="bg-red-600 text-white py-2 px-4 uppercase text-xl font-bold">
                {driver.name}
              </h2>

              {driver.cars.map((car) => {
                const personalBest = personalBestTimes[`${driver.name}-${car.carName}`];

                return (
                  <div key={`car-${driver.name}-${car.carName}`} className="ml-8 mt-2">
                    <h3 className="text-2xl font-semibold">{car.carName}</h3>

                    {/* ✅ Runs in 5 columns using flex with alternating colors */}
                    <div className="flex justify-start gap-6 mt-2 border">
                      {[...Array(COLUMNS)].map((_, colIndex) => (
                        <div key={`col-${colIndex}`} className="flex flex-col text-right">
                          {car.runs
                            .filter((_, index) => index % COLUMNS === colIndex)
                            .map((run) => {
                              const isFastestOverall = fastestOverallRun?.rawTime === run.rawTime;
                              const isPersonalBest = personalBest === run.rawTime;

                              return (
                                <div
                                  key={`run-${driver.name}-${car.carName}-${run.runNumber}`}
                                  className={`text-lg px-2 py-1 rounded-sm ${
                                    isPersonalBest ? 'text-green-600 font-bold' : ''
                                  } ${
                                    isFastestOverall
                                      ? 'bg-purple-600 text-white font-extrabold'
                                      : ''
                                  }`}
                                >
                                  <span className="font-bold">Run {run.runNumber}:</span> {run.time}
                                </div>
                              );
                            })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Overall;
