import { useEffect, useState } from 'react';

import Dropdown from '../components/Dropdown';
import Table from '../components/Table';
import SaveButton from '../components/SaveButton';
import { useDispatch } from 'react-redux';
import { sendRun } from '../redux/socketMiddleware';
import { DRIVETRAIN } from '../constants';

const Input = () => {
  const dispatch = useDispatch();

  const [carName, setCarName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [time, setTime] = useState('');
  const [drivetrain, setDriveTrain] = useState('');

  const handleDriverNameChange = (event) => setDriverName(event.target.value);
  const handleCarNameChange = (event) => setCarName(event.target.value);
  const handleDrivetrainChange = (event) => setDriveTrain(event.target.value);
  const handleTimeChange = (event) => setTime(event.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedDriverName = driverName.toLowerCase().trim();
    const trimmedCarName = carName.toLowerCase().trim();
    const trimmedTime = time.trim();
    const trimmedDrivetrain = drivetrain.trim();

    dispatch(
      sendRun({
        name: trimmedDriverName,
        carName: trimmedCarName,
        time: trimmedTime,
        drivetrain: trimmedDrivetrain
      })
    );

    setDriverName('');
    setCarName('');
    setTime('');
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
            options={DRIVETRAIN}
            value={'awd'}
            onChange={handleDrivetrainChange}
            id="1"
            placeholder="drivetrain"
          />
          <input
            type="number"
            id="time"
            value={time}
            onChange={handleTimeChange}
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
      <Table isInputTable />
    </div>
  );
};

export default Input;
