import React, { useState, useEffect } from 'react';

import { useWebSocket } from '../context/WebsocketContext';
import { formatLapTime } from '../util';

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
    <div className="overflow-x-auto w-[42rem] mx-auto">
      <table className="min-w-full border-collapse border border-gray-300 font-titillium">
        <thead className="bg-gray-100 text-2xl">
          <tr>
            <th className="px-4 py-2 border uppercase border-gray-300 text-left">Name</th>
            <th className="px-4 py-2 border uppercase border-gray-300 text-left">times</th>
          </tr>
        </thead>
        <tbody className="text-[1.4rem] ">
          {paginatedData.map(({ driverName, cars }) => (
            <React.Fragment key={driverName}>
              {/* Driver Row */}
              <tr className="bg-gray-50">
                <td
                  colSpan="2"
                  className="px-4 py-2 border border-gray-300 font-sugo text-[1.6rem]"
                >
                  <div className="flex uppercase items-center justify-between">{driverName}</div>
                </td>
              </tr>

              {/* Expanded Rows for Cars */}
              {cars.map(({ carName, lapTimes }) => {
                return (
                  <tr key={`${driverName}-${carName}`} className="bg-gray-100">
                    <td className="px-4 py-2 border uppercase border-gray-300 pl-8">{carName}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      <ul className="list-disc pl-6">
                        {lapTimes.map(({ lapTime, runNumber }) => (
                          <li key={runNumber}>{`run ${runNumber}: ${formatLapTime(lapTime)}`}</li>
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
