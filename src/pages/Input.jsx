import { useState } from 'react';

import Dropdown from '../components/Dropdown';
import Table from '../components/Table';
import { useWebSocket } from '../context/WebsocketContext';

const Input = () => {
  const { data: leaderboardData, sendData } = useWebSocket(); // Get leaderboardData from context
  const CAR_OPTIONS = ['FWD', 'AWD', 'RWD'];

  const [carName, setCarName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [lapTime, setLapTime] = useState('');
  const [carType, setCarType] = useState('');

  const handleCarNameChange = (event) => setCarName(event.target.value);
  const handleLapTimeChange = (event) => setLapTime(event.target.value);
  const handleDriverNameChange = (event) => setDriverName(event.target.value);
  const handleCarTypeChange = (event) => setCarType(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newRecord = {
      driverName,
      lapTime,
      carName,
      carType,
      gapToFirst: 'gap'
    };

    sendData(newRecord); // Send new record to the WebSocket context

    setCarName('');
    setLapTime('');
    setDriverName('');
    setCarType('');
  };

  return (
    <div className="flex justify-evenly items-start gap-8 max-w-screen-xl mx-auto pt-24">
      <div className="flex-1 max-w-md">
        <form id="lapForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            id="driverName"
            value={driverName}
            onChange={handleDriverNameChange}
            placeholder="Enter Driver Name"
            required
            className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            id="carName"
            value={carName}
            onChange={handleCarNameChange}
            placeholder="Enter car name"
            required
            className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Dropdown
            options={CAR_OPTIONS}
            value={carType}
            onChange={handleCarTypeChange}
            id="1"
            placeholder="Select Car Type"
          />
          <input
            type="number"
            id="lapTime"
            value={lapTime}
            onChange={handleLapTimeChange}
            placeholder="Enter lap time (MMDDddd)"
            required
            className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
      <Table isInputTable leaderboardData={leaderboardData} />
    </div>
  );
};

export default Input;
