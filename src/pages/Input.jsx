import { useState } from 'react';

import Dropdown from '../components/Dropdown';
import Table from '../components/Table';
import { useWebSocket } from '../context/WebSocketContext';
import SaveButton from '../components/SaveButton';
import { CAR_OPTIONS } from '../constants';

const Input = () => {
  const { leaderboardData, sendData } = useWebSocket();

  const [carName, setCarName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [lapTime, setLapTime] = useState('');
  const [driveTrain, setDriveTrain] = useState('');

  const handleCarNameChange = (event) => setCarName(event.target.value);
  const handleLapTimeChange = (event) => setLapTime(event.target.value);
  const handleDriverNameChange = (event) => setDriverName(event.target.value);
  const handleDriveTrainChange = (event) => setDriveTrain(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedCarName = carName.trim();
    const trimmedDriverName = driverName.trim();
    const trimmedLapTime = lapTime.trim();
    const trimmedDriveTrain = driveTrain.trim();

    const newRecord = {
      name: trimmedDriverName,
      time: trimmedLapTime,
      driveTrain: trimmedDriveTrain,
      carName: trimmedCarName
    };

    sendData(newRecord);

    setCarName('');
    setLapTime('');
    setDriverName('');
    setDriveTrain('');
  };

  return (
    <div className="flex justify-evenly items-start  max-h-[30rem] gap-8 max-w-screen-xl mx-auto pt-24">
      <div className="flex-1 max-w-md">
        <form id="lapForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            id="driverName"
            value={driverName}
            onChange={handleDriverNameChange}
            placeholder="Driver Name"
            required
            className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            id="carName"
            value={carName}
            onChange={handleCarNameChange}
            placeholder="car name"
            required
            className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Dropdown
            options={CAR_OPTIONS}
            value={driveTrain}
            onChange={handleDriveTrainChange}
            id="1"
            placeholder="drivetrain"
          />
          <input
            type="number"
            id="lapTime"
            value={lapTime}
            onChange={handleLapTimeChange}
            placeholder="TIME (MMDDddd)"
            required
            className="p-3  text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-gray-700 font-titillium font-semibold uppercase text-[1rem] text-white rounded cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
        <SaveButton />
      </div>
      <Table isInputTable leaderboardData={leaderboardData} />
    </div>
  );
};

export default Input;
