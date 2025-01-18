import Row from './Row';
import logo from '../assets/sa-logo-latest.png';

const Table = (props) => {
  const { leaderboardData, isInputTable, isLeaderboardTable } = props;

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

  return (
    <>
      {isLeaderboardTable && renderLeaderboardTable()}
      {isInputTable && renderInputTable()}
    </>
  );
};

export default Table;
