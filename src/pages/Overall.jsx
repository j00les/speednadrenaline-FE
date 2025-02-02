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
    <div className="w-tv-width h-tv-height mx-auto bg-gray-50 border shadow-md px-[5rem]">
      <div className="flex justify-center mt-[5rem] mb-4">
        <img id="sa-logo" src={overall} alt="SpeedNAdrenaline Logo" />
      </div>

      {/* ✅ Fastest Run Header */}
      {fastestOverallRun && (
        <div className="text-center bg-purple-600 text-white py-2 text-xl font-bold uppercase">
          Fastest Run: {fastestOverallRun.driverName} - {fastestOverallRun.carName} (Run{' '}
          {fastestOverallRun.runNumber}) - {fastestOverallRun.time}
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

                    <div className="flex justify-start gap-6 mt-2 border">
                      {[...Array(COLUMNS)].map((_, colIndex) => (
                        <div key={`col-${colIndex}`} className="flex flex-col text-right">
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
                                  className={`text-lg px-2 py-1 rounded-sm ${
                                    isGray ? 'bg-gray-200' : ''
                                  } ${isPersonalBest ? 'text-green-600 font-bold' : ''} ${
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
      ) : (
        <p className="text-center text-xl mt-4">No runs available</p>
      )}

      {/* ✅ Pagination Buttons */}
      {runsByDriver.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ◀ Previous
          </button>
          <span className="text-xl font-bold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default Overall;
