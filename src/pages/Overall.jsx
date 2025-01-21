import React, { useState, useEffect } from 'react';

import { formatLapTime } from '../util';
import { useWebSocket } from '../context/WebSocketContext';
import overall from '../assets/run-overall.png';

const ITEMS_PER_PAGE = 4;

const Overall = () => {
  const { runsByDriver } = useWebSocket();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);

  // Transform WebSocket data for the table
  const getTransformedData = () => {
    return Object.entries(runsByDriver || {}).map(([driverName, cars]) => ({
      driverName,
      cars: Object.entries(cars).map(([carName, lapTimes]) => ({
        carName,
        lapTimes
      }))
    }));
  };

  // Paginate the transformed data
  useEffect(() => {
    const transformedData = getTransformedData();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedData(transformedData.slice(startIndex, endIndex));
  }, [runsByDriver, currentPage]);

  const totalPages = Math.ceil((Object.keys(runsByDriver || {}).length || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="overflow-x-auto w-[42rem] mx-auto py-10 text-[1rem]">
      <table className="min-w-full border-collapse table-fixed  border-gray-300 font-titillium">
        <thead className="bg-[#ff0000] text-white">
          <tr></tr>
        </thead>
        <tbody>
          {paginatedData.map(({ driverName, cars }) => (
            <React.Fragment key={driverName}>
              {/* Driver Row */}
              <tr className="">
                <td className="px-4  border-gray-300 font-sugo text-[1.2rem]">
                  <div className=" w-[10rem] flex items-center justify-between text-white uppercase bg-[#ff0000] transform -skew-x-[28deg] mt-4">
                    <span className="transform skew-x-12 ml-2">{driverName}</span>
                  </div>
                </td>
              </tr>
              {/* Expanded Rows for Cars */}
              {cars.map(({ carName, lapTimes }, index) => {
                // Find the fastest lap time
                const fastestLapTime = Math.min(
                  ...lapTimes.map(({ lapTime }) => parseFloat(lapTime))
                );

                // Helper function to chunk data into groups of 5
                const chunkArray = (array, size) => {
                  const chunks = [];
                  for (let i = 0; i < array.length; i += size) {
                    chunks.push(array.slice(i, i + size));
                  }
                  return chunks;
                };

                // Split lapTimes into chunks of 5
                const lapTimeChunks = chunkArray(lapTimes, 5);

                return (
                  <tr key={`${carName}-${index}`} className="relative">
                    <td className="pl-4 border-b uppercase border-gray-300 pl-8">{carName}</td>
                    <td className="border-b border-gray-300">
                      <div className="flex gap-4 mt-4">
                        {lapTimeChunks.map((chunk, chunkIndex) => (
                          <ul
                            key={chunkIndex}
                            className={`list-disc uppercase list-none ${
                              chunkIndex % 2 === 0 ? 'text-left' : 'text-right'
                            }`}
                          >
                            {chunk.map(({ lapTime, runNumber }) => {
                              const isGray =
                                (runNumber - 1) % 5 === 0 || // 1, 6, 11
                                (runNumber - 3) % 5 === 0 || // 3, 8, 13
                                (runNumber - 5) % 5 === 0; // 5, 10, 15

                              return (
                                <div
                                  key={runNumber}
                                  className={`${isGray ? 'bg-gray-100' : ''} p-2`}
                                >
                                  <li
                                    className={`${
                                      parseFloat(lapTime) === fastestLapTime
                                        ? 'text-green-500 font-bold'
                                        : 'text-red-500'
                                    }`}
                                  >
                                    <span className="text-black italic">{`run ${runNumber} `}</span>
                                    <span className="text-black ml-2">
                                      {formatLapTime(lapTime)}
                                    </span>
                                  </li>
                                </div>
                              );
                            })}
                          </ul>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {
        <div className="flex mx-auto w-fit mt-4">
          <button
            className="flex items-center gap-2 p-2 bg-gray-300 text-red h-fit disabled:opacity-50 text-[.7rem] mt-1 rounded-md"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="pi pi-chevron-left"></i>
          </button>
          <span className="px-2 sm:px-3 py-1 sm:py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="flex items-center gap-2 p-2 bg-gray-300 text-red h-fit disabled:opacity-50 text-[.7rem] mt-1 rounded-md"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="pi pi-chevron-right"></i>
          </button>
        </div>
      }
    </div>
  );
};

export default Overall;
