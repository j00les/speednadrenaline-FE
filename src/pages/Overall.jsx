import React, { useState, useEffect } from 'react';

import { formatLapTime } from '../util';
import { useWebSocket } from '../context/WebSocketContext';

const ITEMS_PER_PAGE = 5;

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
          <tr>
            <th className="rounded-tl-[3px] rounded-bl-[3px] uppercase text-center">Name</th>
            <th className="uppercase text-center rounded-tr-[3px] rounded-br-[3px]">times</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(({ driverName, cars }) => (
            <React.Fragment key={driverName}>
              {/* Driver Row */}
              <tr className="bg-blue-600">
                <td colSpan="2" className="px-4 border border-gray-300 font-sugo text-[1.4rem]">
                  <div className="flex text-white uppercase items-center justify-between">
                    {driverName}
                  </div>
                </td>
              </tr>
              {/* Expanded Rows for Cars */}
              {cars.map(({ carName, lapTimes }, index) => {
                return (
                  <tr
                    key={`${carName}-${index}`}
                    className={index % 2 !== 0 ? 'bg-[#D4D4D4]' : 'bg-white'}
                  >
                    <td className="pl-4 border uppercase border-gray-300 pl-8">{carName}</td>
                    <td className="pl-2 border border-gray-300">
                      <ul className="list-disc pl-6 uppercase">
                        {lapTimes.map(({ lapTime, runNumber }) => (
                          <li className="text-red-500" key={runNumber}>
                            <span className="text-black italic">{`run ${runNumber} `}</span>
                            <span className="text-black font-bold ml-2">
                              {formatLapTime(lapTime)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 border ${
              currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-white text-blue-500'
            } rounded`}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border ${
              currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-white text-blue-500'
            } rounded`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Overall;
