import Row from './Row';
import logo from '../assets/sa-logo-latest.png';
import { useState } from 'react';

const Table = (props) => {
  const { leaderboardData, isInputTable, isLeaderboardTable, isResultTable } = props;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate the total pages
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);

  // Calculate current items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaderboardData.slice(indexOfFirstItem, indexOfLastItem);

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
            <Row leaderboardData={leaderboardData} />
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
            <Row isInputRow leaderboardData={leaderboardData} />
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderResultTable = () => (
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
            <Row leaderboardData={currentItems} />
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-l"
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-r"
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
          >
            Next
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
