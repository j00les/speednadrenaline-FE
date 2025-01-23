import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { formatLapTime, getColorForCarType } from '../util';
import { TUNNEL_BASE_URL } from '../constants';

import overall from '../assets/RUN_OVERALL[1].png';

const ITEMS_PER_PAGE = 4;

const OverallResult = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [runsByDriver, setRunsByDriver] = useState(null);

  const totalPages = Math.ceil((runsByDriver?.length || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Paginate the data whenever `runsByDriver` or `currentPage` changes
  useEffect(() => {
    if (runsByDriver) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setPaginatedData(runsByDriver.slice(startIndex, endIndex));
    }
  }, [runsByDriver, currentPage]);

  useEffect(() => {
    const fetchOverallData = async () => {
      try {
        // Fetch data from the backend
        const {
          data: { data }
        } = await axios.get(`${TUNNEL_BASE_URL}/api-get-overall`);
        setRunsByDriver(data);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(`${TUNNEL_BASE_URL}/api-get-overall`);

    fetchOverallData();
  }, []);

  return (
    <div className="overflow-x-auto w-[20rem] mx-auto py-10 text-[1rem]">
      <div className="flex justify-center pt-2 mb-4">
        <img id="sa-logo" src={overall} alt="SpeedNAdrenaline Logo" />
      </div>
      <table className="w-[20rem] border-collapse table-fixed border-gray-300 font-titillium">
        <thead className="bg-[#ff0000] text-white">
          <tr></tr>
        </thead>
        <tbody>
          {paginatedData.map(({ driverName, cars }) => (
            <React.Fragment key={driverName}>
              {/* Driver Row */}
              <tr className="">
                <td className="px-4 border-gray-300 font-bernard text-[1.2rem]">
                  <div className="w-[10rem] flex items-center justify-between text-white uppercase bg-[#ff0000] transform -skew-x-[28deg] mt-4">
                    <span className="transform skew-x-[28deg] ml-4">{driverName}</span>
                  </div>
                </td>
              </tr>
              {/* Expanded Rows for Cars */}
              {cars.map(({ carName, lapTimes }, index) => {
                const carType = lapTimes[0]?.carType || 'Unknown';

                // Find the fastest lap time
                const fastestLapTime = Math.min(
                  ...lapTimes.map(({ lapTime }) => parseFloat(lapTime))
                );

                return (
                  <tr key={`${carName}-${index}`}>
                    <td className="border-b pl-4 w-[1rem] uppercase font-bold border-gray-300">
                      <div className="flex gap-2 items-center">
                        <span className={`h-[1.1rem] px-2 ${getColorForCarType(carType)}`}></span>
                        <span>{carName}</span>
                      </div>
                    </td>
                    <td className="border-b border-gray-300">
                      {/* Vertical scrollable container */}
                      <div className="flex flex-col gap-2 py-4 max-h-[12rem] overflow-y-auto">
                        {lapTimes.map(({ lapTime, runNumber }) => {
                          const isGray = runNumber % 2 !== 0;

                          return (
                            <div
                              key={runNumber}
                              className={`${isGray ? 'bg-gray-200' : ''} rounded-sm px-2 py-1`}
                            >
                              <span
                                className={`${
                                  parseFloat(lapTime) === fastestLapTime
                                    ? 'text-green-600'
                                    : 'text-black'
                                }`}
                              >
                                <span className="text-black whitespace-nowrap uppercase">{`run ${runNumber}`}</span>
                                <span className="ml-2 font-bold">{formatLapTime(lapTime)}</span>
                              </span>
                            </div>
                          );
                        })}
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
    </div>
  );
};

export default OverallResult;
