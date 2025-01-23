import React, { useState, useEffect } from 'react';

import { formatLapTime, getColorForCarType } from '../util';
import { useWebSocket } from '../context/WebSocketContext';
import overall from '../assets/RUN_OVERALL[1].png';

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
        carType: lapTimes[0].carType,
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
    <div className="overflow-x-auto w-full mx-auto mt-[10rem] px-[5rem] text-[1rem]">
      <div className="flex justify-center pt-2 mb-4">
        <img id="sa-logo" src={overall} alt="SpeedNAdrenaline Logo" />
      </div>
      <table className="min-w-full border-collapse table-fixed  border-gray-300 font-titillium">
        <thead className="bg-[#ff0000] text-white">
          <tr></tr>
        </thead>
        <tbody>
          {paginatedData.map(({ driverName, cars }) => (
            <React.Fragment key={driverName}>
              {/* Driver Row */}
              <tr className="">
                <td className="px-4 border-gray-300 font-bernard text-[1.5rem]">
                  <div className="w-[10rem] flex items-center justify-between text-white uppercase bg-[rgb(255,0,0)] transform -skew-x-[28deg] mt-4">
                    <span className="transform skew-x-[28deg] ml-4">{driverName}</span>
                  </div>
                </td>
              </tr>
              {/* Expanded Rows for Cars */}
              {cars.map(({ carName, lapTimes, carType }, index) => {
                // Find the fastest lap time
                const fastestLapTime = Math.min(
                  ...lapTimes.map(({ lapTime }) => parseFloat(lapTime))
                );

                const chunkArrayIntoColumns = (array, columnCount) => {
                  const columnChunks = Array.from({ length: columnCount }, () => []);
                  array.forEach((item, i) => {
                    columnChunks[i % columnCount].push(item);
                  });
                  return columnChunks;
                };

                // Split lapTimes into 3 columns
                const lapTimeColumns = chunkArrayIntoColumns(lapTimes, 3);

                return (
                  <tr key={`${carName}-${index}`}>
                    <td className="border-b pl-4 w-[1rem] uppercase font-bold border-gray-300">
                      <div className="flex gap-2 items-center">
                        <span className={` h-[1.1rem] px-2 ${getColorForCarType(carType)}`}></span>
                        <span className="text-xl">{carName}</span>
                      </div>
                    </td>
                    <td className="border-b border-gray-300">
                      <div className="flex gap-2 py-4">
                        {lapTimeColumns.map((column, columnIndex) => (
                          <ul key={columnIndex} className="list-none text-left flex flex-col gap-2">
                            {column.map(({ lapTime, runNumber }) => {
                              const isGray =
                                (runNumber - 1) % 6 === 0 || // 1, 7, 13, ..
                                (runNumber - 2) % 6 === 0 || // 2, 8, 14, ...
                                (runNumber - 3) % 6 === 0; // 3, 9, 15, ...

                              return (
                                <div
                                  key={runNumber}
                                  className={`${isGray ? 'bg-gray-200' : ''} rounded-sm px-1`}
                                >
                                  <li
                                    className={`${
                                      parseFloat(lapTime) === fastestLapTime
                                        ? 'text-green-600'
                                        : 'text-black'
                                    }`}
                                  >
                                    <span className="text-black text-xl whitespace-nowrap uppercase">{`run ${runNumber} `}</span>
                                    <span className="ml-2 text-xl font-bold">
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
          <span className="px-2 sm:px-3 py-1 sm:py-2 ">
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
