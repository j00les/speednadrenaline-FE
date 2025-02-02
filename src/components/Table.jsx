import Skeleton from 'react-loading-skeleton';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Row from './Row';
import logo from '../assets/sa-logo-latest.png';
import { fetchLeaderboard, updateLeaderboard } from '../redux/leaderboardSlice';
import { socket } from '../redux/socketMiddleware';
import { fetchRuns, updateRuns } from '../redux/runSlice';
import { formatLapTime } from '../util';

const Table = (props) => {
  const dispatch = useDispatch();
  const { isInputTable, isLeaderboardTable, isResultTable, loading } = props;
  const { leaderboard } = useSelector((state) => state.leaderboard);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalPages = Math.ceil(leaderboard?.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaderboard?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    dispatch(fetchLeaderboard());
    dispatch(fetchRuns());

    socket.on('runAdded', (data) => {
      dispatch(updateLeaderboard(data.leaderboardEntry));
      dispatch(updateRuns(data.runsGrouped));
    });

    socket.on('runDeleted', (data) => {
      dispatch(updateLeaderboard(data.leaderboardEntry));
      dispatch(updateRuns(data.runsGrouped));
    });

    return () => {
      socket.off('runAdded');
      socket.off('runDeleted');
    };
  }, [dispatch]);

  const renderLeaderboardTable = () => {
    const top20Data = leaderboard.slice(0, 20);
    return (
      <div className="w-tv-width h-tv-height mx-auto bg-gray-50 border shadow-md flex flex-col items-center justify-between px-[5rem]">
        <div className="bg-white rounded-lg mx-auto">
          <div className="flex justify-center pt-2 mb-4">
            <img id="sa-logo" src={logo} alt="SpeedNAdrenaline Logo" />
          </div>

          <table className="min-w-full table-fixed text-xl whitespace-nowrap">
            <thead className="text-3xl">
              <tr className="bg-[#ff0000] text-white py-2">
                <th className="text-center rounded-tl-[3px] rounded-bl-[3px]">POSITION</th>
                <th className="text-center pr-[1rem]">TIME</th>
                <th className="text-center pr-[.2rem]">
                  GAP TO 1<sup>st</sup>
                </th>
                <th className="text-enter rounded-tr-[3px] rounded-br-[3px] pr-[4rem]">CAR NAME</th>
              </tr>
            </thead>

            <tbody className="text-2xl">
              {top20Data.map((record, index) => (
                <Row
                  key={`${record.name}-${record.carName}-${index}`}
                  record={record}
                  index={index}
                  isLeaderboardRow
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderInputTable = () => (
    <div className="flex justify-center items-center font-titillium mx-auto overflow-auto">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-y-auto max-h-[30rem]">
        <table className="w-full table-fixed text-xl whitespace-nowrap">
          <thead className="text-[1.4rem] sticky top-0 bg-gray-700 z-10">
            <tr className="bg-gray-700 text-white">
              <th className="text-center">POSITION</th>
              <th className="text-center pr-[1rem]">TIME</th>
              <th className="text-center pr-[.2rem]">
                GAP TO 1<sup>st</sup>
              </th>
              <th className="text-center pr-[2rem]">CAR NAME</th>
            </tr>
          </thead>
          <tbody className="text-2xl">
            {leaderboard.map((record, index) => (
              <Row
                key={`${record.name}-${record.carName}-${index}`}
                record={record}
                index={index}
                isInputRow
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderResultTable = () => (
    <div className="flex justify-center items-center  font-titillium mx-auto px-4 w-full">
      <div className="w-full max-w-4xl bg-white rounded-lg">
        <div className="flex justify-center pt-4 mb-2">
          {loading ? (
            <Skeleton width={390} height={80} />
          ) : (
            <img id="sa-logo" src={logo} alt="SpeedNAdrenaline Logo" className="" />
          )}
        </div>

        <table className="w-full text-xs sm:text-sm md:text-base table-fixed whitespace-normal">
          <thead className="text-sm sm:text-sm md:text-lg">
            <tr className="bg-[#ff0000] text-white">
              <th className="text-center rounded-tl-[3px] rounded-bl-[3px]">POSITION</th>
              <th className="text-center pl-[1.4rem]">TIME</th>
              <th className="text-center">
                GAP TO 1<sup>st</sup>
              </th>
              <th className="text-center rounded-tr-[3px] rounded-br-[3px]">CAR NAME</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm md:text-base">
            {loading
              ? Array.from({ length: 10 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`}>
                    <td className="text-center py-2">
                      <Skeleton width={80} height={20} />
                    </td>
                    <td className="text-center py-2">
                      <Skeleton width={80} height={20} />
                    </td>
                    <td className="text-center py-2">
                      <Skeleton width={80} height={20} />
                    </td>
                    <td className="text-center py-2">
                      <Skeleton width={80} height={20} />
                    </td>
                  </tr>
                ))
              : currentItems?.map((record, index) => (
                  <Row
                    key={`${record.name}-${record.carName}-${index}`}
                    record={record}
                    index={index + indexOfFirstItem}
                    isResultRow
                  />
                ))}
          </tbody>
        </table>

        <div className="flex mx-auto w-fit mt-4">
          {loading ? (
            <Skeleton width={120} height={30} />
          ) : (
            <>
              <button
                className="flex items-center gap-2 p-2 bg-gray-300 text-red h-fit disabled:opacity-50 text-[.7rem] mt-1 rounded-md"
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
              >
                <i className="pi pi-chevron-left"></i>
              </button>
              <span className="px-2 sm:px-3 py-1 sm:py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="flex items-center gap-2 p-2 bg-gray-300 text-red h-fit disabled:opacity-50 text-[.7rem] mt-1 rounded-md"
                onClick={() => handlePageChange('next')}
                disabled={currentPage === totalPages}
              >
                <i className="pi pi-chevron-right"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isLeaderboardTable && renderLeaderboardTable()}
      {isInputTable && renderInputTable()}
      {isResultTable && renderResultTable()}
    </>
  );
};

export default Table;
