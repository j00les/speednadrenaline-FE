import Row from './Row';
import logo from '/sa-logo.png';

const Table = (props) => {
  const { leaderboardData, isInputTable, isLeaderboardTable } = props;

  const renderLeaderboardTable = () => (
    <div className="flex justify-center items-center py-10 font-titillium mx-auto w-[42rem]">
      <div className="w-full max-w-4xl bg-white rounded-lg">
        <div className="flex justify-center pt-8">
          <img id="sa-logo" src={logo} alt="SpeedNAdrenaline Logo" />
        </div>
        <p className="text-center text-[#ff0000] font-titillium text-[4rem] font-[700]">
          BEST TIME
        </p>
        <table className="min-w-full table-fixed text-xl whitespace-nowrap">
          <thead className="text-2xl">
            <tr className="bg-[#ff0000] text-white">
              <th className="text-center rounded-tl-[3px] rounded-bl-[3px]">POSITION</th>
              <th className="text-center pr-[2.2rem]">TIME</th>
              <th className="text-center pr-[1rem]">
                GAP TO 1<sup>st</sup>
              </th>
              <th className="text-enter rounded-tr-[3px] rounded-br-[3px] pr-[3rem]">CAR NAME</th>
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
    <div className="flex-1 max-w-lg overflow-y-auto h-[500px]">
      <table className="w-full table-auto mt-4">
        <thead>
          <tr>
            <th className="text-center bg-red-600 text-white px-4 py-2 rounded-tl-lg">Position</th>
            <th className="text-center bg-red-600 text-white px-4 py-2">Time</th>
            <th className="text-center bg-red-600 text-white px-4 py-2">Car Name</th>
            <th className="text-center bg-red-600 text-white px-4 py-2 rounded-tr-lg"></th>
          </tr>
        </thead>
        <tbody className="font-sugo-pro">
          <Row leaderboardData={leaderboardData} />
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {isLeaderboardTable && renderLeaderboardTable()}
      {isInputTable && renderInputTable()}
    </>
  );
};

export default Table;
