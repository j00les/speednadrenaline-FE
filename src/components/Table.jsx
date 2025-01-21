import Row from './Row';
import logo from '../assets/sa-logo-latest.png';
import { useEffect, useState } from 'react';

const Table = (props) => {
  const { leaderboardData, isInputTable, isLeaderboardTable, isResultTable } = props;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate the total pages
  const totalPages = Math.ceil(leaderboardData?.length / itemsPerPage);

  // Calculate current items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaderboardData?.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const renderLeaderboardTable = () => (
    <div className="flex justify-center items-center py-10 font-titillium mx-auto w-[42rem]">
      <div className="w-full max-w-4xl bg-white rounded-lg">
        <div className="flex justify-center pt-2 mb-4">
          <img id="sa-logo" src={logo} alt="SpeedNAdrenaline Logo" />
        </div>

        <table className="min-w-full table-fixed text-xl whitespace-nowrap">
          <thead className="text-2xl">
            <tr className="bg-[#ff0000] text-white">
              <th className="text-center rounded-tl-[3px] rounded-bl-[3px]">POSITION</th>
              <th className="text-center pr-[1rem]">TIME</th>
              <th className="text-center pr-[.2rem]">
                GAP TO 1<sup>st</sup>
              </th>
              <th className="text-enter rounded-tr-[3px] rounded-br-[3px] pr-[4rem]">CAR NAME</th>
            </tr>
          </thead>

          <tbody className="text-2xl">
            {leaderboardData.map((record, index) => (
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

  const renderInputTable = () => (
    <div className="flex justify-center items-center font-titillium mx-auto w-[42rem]">
      <div className="w-full max-w-4xl bg-white rounded-lg">
        <table className="min-w-full table-fixed text-xl whitespace-nowrap">
          <thead className="text-2xl">
            <tr className="bg-gray-700 text-white">
              <th className="text-center rounded-tl-[3px] rounded-bl-[3px]">POSITION</th>
              <th className="text-center pr-[1rem]">TIME</th>
              <th className="text-center pr-[.2rem]">
                GAP TO 1<sup>st</sup>
              </th>
              <th className="text-enter rounded-tr-[3px] rounded-br-[3px] pr-[4rem]">CAR NAME</th>
            </tr>
          </thead>
          <tbody className="text-2xl">
            {leaderboardData.map((record, index) => (
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
    <div className="flex justify-center items-center py-10 font-titillium mx-auto px-4 w-full">
      <div className="w-full max-w-4xl bg-white rounded-lg">
        {/* Logo */}
        <div className="flex justify-center pt-4 mb-2">
          <img id="sa-logo" src={logo} alt="SpeedNAdrenaline Logo" className="" />
        </div>

        {/* Responsive Table */}
        <table className="w-full text-xs sm:text-sm md:text-base table-fixed whitespace-normal">
          <thead className="text-sm sm:text-sm md:text-lg">
            <tr className="bg-[#ff0000] text-white">
              <th className="text-center rounded-tl-[3px] rounded-bl-[3px]">POSITION</th>
              <th className="text-center">TIME</th>
              <th className="text-center px-2 py-2">
                GAP TO 1<sup>st</sup>
              </th>
              <th className="text-center px-2 py-2 rounded-tr-[3px] rounded-br-[3px]">CAR NAME</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm md:text-base">
            {currentItems?.map((record, index) => (
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
