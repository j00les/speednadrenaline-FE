import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import { fetchRuns, updateRuns } from '../redux/runSlice';
import overall from '../assets/RUN_OVERALL[1].png';
import { getColorForCarType } from '../util';

const ITEMS_PER_PAGE = 4; // ✅ Show 4 drivers per page
const COLUMNS = 5; // ✅ Set number of columns
const socket = io('http://localhost:3002'); // ✅ Connect to WebSocket server

const Overall = (props) => {
  const { autoPage, setTotalPages } = props;

  const dispatch = useDispatch();
  const { runsByDriver } = useSelector((state) => state.runs);

  const [currentPage, setCurrentPage] = useState(1);
  const [fastestOverallRun, setFastestOverallRun] = useState(null);
  const [personalBestTimes, setPersonalBestTimes] = useState({});

  useEffect(() => {
    dispatch(fetchRuns());

    socket.on('runAdded', (data) => {
      dispatch(updateRuns(data.runsGrouped));
    });

    socket.on('runDeleted', () => {
      dispatch(fetchRuns());
    });

    return () => {
      socket.off('runAdded');
      socket.off('runDeleted');
    };
  }, [dispatch]);

  // ✅ Calculate `totalPages` dynamically when `runsByDriver` changes
  useEffect(() => {
    if (runsByDriver && runsByDriver.length > 0) {
      const totalPages = Math.ceil(runsByDriver.length / ITEMS_PER_PAGE);
      setTotalPages(totalPages); // ✅ Send total pages to App.js
    }
  }, [runsByDriver, setTotalPages]);

  // ✅ Sync auto-pagination with manual pagination
  useEffect(() => {
    setCurrentPage(autoPage);
  }, [autoPage]);

  useEffect(() => {
    let fastestRun = null;
    const newPersonalBestTimes = {};

    runsByDriver?.forEach((driver) => {
      driver.cars.forEach((car) => {
        let bestTime = Infinity;

        car.runs.forEach((run) => {
          if (!fastestRun || run.rawTime < fastestRun.rawTime) {
            fastestRun = {
              driverName: driver.name,
              carName: car.carName,
              runNumber: run.runNumber,
              time: run.time,
              rawTime: run.rawTime
            };
          }

          if (run.rawTime < bestTime) {
            bestTime = run.rawTime;
          }
        });

        newPersonalBestTimes[`${driver.name}-${car.carName}`] = bestTime;
      });
    });

    setFastestOverallRun(fastestRun);
    setPersonalBestTimes(newPersonalBestTimes);
  }, [runsByDriver]);

  if (!runsByDriver || runsByDriver.length === 0) {
    return <p className="text-center text-xl mt-4">Loading...</p>;
  }

  // ✅ Pagination Logic
  const totalPages = Math.ceil(runsByDriver.length / ITEMS_PER_PAGE) || 1;
  const paginatedDrivers = runsByDriver.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-tv-width h-tv-height mx-auto bg-gray-50  shadow-md px-[5rem]">
      <div className="flex justify-center mt-[5rem] mb-4">
        <img id="sa-logo" src={overall} alt="SpeedNAdrenaline Logo" />
      </div>

      {/* ✅ Fastest Run Header */}
      {fastestOverallRun && (
        <div className="flex justify-end">
          <div className="w-fit p-1 pr-3 flex items-center justify-between text-white uppercase bg-purple-600 transform -skew-x-[28deg] mt-6 items-righ">
            <span className="transform text-[1.2rem] font-bold skew-x-[28deg] ml-4">
              Fastest Run : {fastestOverallRun.driverName} - {fastestOverallRun.carName} -{' '}
              {fastestOverallRun.time}
            </span>
          </div>
        </div>
      )}

      {paginatedDrivers.length > 0 ? (
        <div className="mt-4">
          {paginatedDrivers.map((driver) => (
            <div key={`driver-${driver.name}`} className="mt-6">
              <div className="w-[15rem] p-1 flex items-center justify-between text-white uppercase bg-[rgb(255,0,0)] transform -skew-x-[28deg] mt-4">
                <span className="transform text-xl font-bold skew-x-[28deg] ml-4">
                  {driver.name}
                </span>
              </div>

              {driver.cars.map((car) => {
                const personalBest = personalBestTimes[`${driver.name}-${car.carName}`];
                const blockColor = getColorForCarType(car.drivetrain);

                return (
                  <div key={`car-${driver.name}-${car.carName}`} className="ml-8 mt-4">
                    <div>
                      <span className={`border px-2 rounded-md mr-2 ${blockColor}`}></span>
                      <span className="text-[1.3rem] font-semibold uppercase">{car.carName}</span>
                    </div>

                    <div className="flex justify-start gap-6 mt-2">
                      {[...Array(COLUMNS)].map((_, colIndex) => (
                        <div key={`col-${colIndex}`} className="flex flex-col gap-2 text-right">
                          {car.runs
                            .filter((_, index) => index % COLUMNS === colIndex)
                            .map((run) => {
                              const isGray = (run.runNumber - 1) % COLUMNS === colIndex;
                              const isFastestOverall =
                                fastestOverallRun && run.rawTime === fastestOverallRun.rawTime;
                              const isPersonalBest = personalBest && run.rawTime === personalBest;

                              return (
                                <div
                                  key={`run-${driver.name}-${car.carName}-${run.runNumber}`}
                                  className={`text-md px-2 py-1 rounded-sm border flex  gap-2 justify-between ${
                                    isGray ? 'bg-gray-200' : ''
                                  } ${isPersonalBest ? 'text-green-600 font-bold' : ''} ${
                                    isFastestOverall ? 'text-purple-600' : ''
                                  }`}
                                >
                                  <span className="uppercase font-bold">Run {run.runNumber}:</span>{' '}
                                  {run.time}
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
      ) : (
        <p className="text-center text-xl mt-4">No runs available</p>
      )}

      {/* ✅ Pagination Buttons (Fixed at Bottom) */}
      <div className="fixed bottom-0 left-0 w-full bg-white py-4 shadow-md flex justify-center items-center space-x-4">
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-xl font-bold">
          Page {currentPage} of {Math.ceil(runsByDriver.length / ITEMS_PER_PAGE)}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(runsByDriver.length / ITEMS_PER_PAGE))
            )
          }
          disabled={currentPage === Math.ceil(runsByDriver.length / ITEMS_PER_PAGE)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Overall;
