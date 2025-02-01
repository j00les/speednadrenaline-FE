// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import io from 'socket.io-client';

// import { fetchRuns, updateRuns } from '../redux/runSlice';
// import overall from '../assets/RUN_OVERALL[1].png';

// const ITEMS_PER_PAGE = 4; // ✅ Show 4 drivers per page
// const COLUMNS = 5; // ✅ Set number of columns

// const socket = io('http://localhost:3002'); // ✅ Connect to WebSocket server

// const Overall = () => {
//   const dispatch = useDispatch();
//   const { runsByDriver } = useSelector((state) => state.runs);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [fastestOverallRun, setFastestOverallRun] = useState(null);

//   useEffect(() => {
//     dispatch(fetchRuns());

//     // ✅ Listen for WebSocket updates
//     socket.on('runAdded', (data) => {
//       dispatch(updateRuns(data.runsGrouped));
//     });

//     return () => {
//       socket.off('runAdded'); // ✅ Cleanup WebSocket listener
//     };
//   }, [dispatch]);

//   // ✅ Watch for `runsByDriver` changes and update `fastestOverallRun` immediately
//   useEffect(() => {
//     let fastestRun = null;

//     runsByDriver?.forEach((driver) => {
//       driver.cars?.forEach((car) => {
//         car.runs?.forEach((run) => {
//           const rawTime = parseFloat(run.time);
//           if (!fastestRun || rawTime < fastestRun.rawTime) {
//             fastestRun = {
//               driverName: driver.name,
//               carName: car.carName,
//               runNumber: run.runNumber,
//               time: run.time,
//               rawTime
//             };
//           }
//         });
//       });
//     });

//     setFastestOverallRun(fastestRun);
//   }, [runsByDriver]); // ✅ Updates dynamically when `runsByDriver` changes

//   if (!runsByDriver || runsByDriver.length === 0) {
//     return <p className="text-center text-xl mt-4">Loading...</p>;
//   }

//   // ✅ Pagination logic
//   const totalPages = Math.ceil(runsByDriver.length / ITEMS_PER_PAGE) || 1;
//   const paginatedDrivers = runsByDriver.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <div className="w-tv-width h-tv-height mx-auto bg-gray-50 border shadow-md px-[5rem]">
//       <div className="flex justify-center mt-[5rem] mb-4">
//         <img id="sa-logo" src={overall} alt="SpeedNAdrenaline Logo" />
//       </div>

//       {/* ✅ Fastest Run Header - Updates Dynamically */}
//       {fastestOverallRun && (
//         <div className="text-center bg-purple-600 text-white py-2 text-xl font-bold uppercase">
//           Fastest Run: {fastestOverallRun.driverName} - {fastestOverallRun.carName}
//           (Run {fastestOverallRun.runNumber}) - {fastestOverallRun.time}
//         </div>
//       )}

//       {paginatedDrivers?.length > 0 ? (
//         <div className="mt-4">
//           {paginatedDrivers.map((driver) => (
//             <div key={`driver-${driver.name}`} className="mt-6">
//               {/* ✅ Driver Name Header */}
//               <h2 className="bg-red-600 text-white py-2 px-4 uppercase text-xl font-bold">
//                 {driver.name}
//               </h2>

//               {driver.cars.map((car) => (
//                 <div key={`car-${driver.name}-${car.carName}`} className="ml-8 mt-2">
//                   {/* ✅ Car Name Header */}
//                   <h3 className="text-2xl font-semibold">{car.carName}</h3>

//                   {/* ✅ Runs in 5 columns using flex with alternating colors */}
//                   <div className="flex justify-start gap-6 mt-2 border">
//                     {[...Array(COLUMNS)].map((_, colIndex) => (
//                       <div key={`col-${colIndex}`} className="flex flex-col text-right">
//                         {car.runs
//                           .filter((_, index) => index % COLUMNS === colIndex)
//                           .map((run) => {
//                             const isGray = (run.runNumber - 1) % COLUMNS === colIndex;
//                             const isFastestOverall =
//                               fastestOverallRun &&
//                               parseFloat(run.time) === fastestOverallRun.rawTime;

//                             return (
//                               <div
//                                 key={`run-${driver.name}-${car.carName}-${run.runNumber}`}
//                                 className={`text-lg px-2 py-1 rounded-sm ${
//                                   isGray ? 'bg-gray-200' : ''
//                                 } ${
//                                   isFastestOverall ? 'bg-purple-600 text-white font-extrabold' : ''
//                                 }`}
//                               >
//                                 <span className="font-bold">Run {run.runNumber}:</span> {run.time}
//                               </div>
//                             );
//                           })}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-xl mt-4">No runs available</p>
//       )}

//       {/* ✅ Pagination Controls */}
//       {runsByDriver.length > ITEMS_PER_PAGE && (
//         <div className="flex justify-center mt-6 space-x-4">
//           <button
//             className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             ◀ Previous
//           </button>
//           <span className="text-xl font-bold">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//           >
//             Next ▶
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Overall;

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

    return () => {
      socket.off('runAdded'); // ✅ Cleanup WebSocket listener
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
          const rawTime = parseFloat(run.time);

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
              {/* ✅ Driver Name Header */}
              <h2 className="bg-red-600 text-white py-2 px-4 uppercase text-xl font-bold">
                {driver.name}
              </h2>

              {driver.cars.map((car) => {
                const personalBest = personalBestTimes[`${driver.name}-${car.carName}`];

                return (
                  <div key={`car-${driver.name}-${car.carName}`} className="ml-8 mt-2">
                    {/* ✅ Car Name Header */}
                    <h3 className="text-2xl font-semibold">{car.carName}</h3>

                    {/* ✅ Runs in 5 columns using flex with alternating colors */}
                    <div className="flex justify-start gap-6 mt-2 border">
                      {[...Array(COLUMNS)].map((_, colIndex) => (
                        <div key={`col-${colIndex}`} className="flex flex-col text-right">
                          {car.runs
                            .filter((_, index) => index % COLUMNS === colIndex)
                            .map((run) => {
                              const isGray = (run.runNumber - 1) % COLUMNS === colIndex;
                              const isFastestOverall =
                                fastestOverallRun &&
                                parseFloat(run.time) === fastestOverallRun.rawTime;
                              const isPersonalBest =
                                personalBest && parseFloat(run.time) === personalBest;

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

      {/* ✅ Pagination Controls */}
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
