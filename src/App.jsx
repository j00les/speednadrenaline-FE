import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';

import { fetchRuns } from './redux/runSlice';
import { fetchLeaderboard } from './redux/leaderboardSlice';
import { socket, WebSocketProvider } from './provider/WebSocketProvider';
import store from './redux/store';

const RunInputPage = () => {
  const [name, setName] = useState('');
  const [carName, setCarName] = useState('');
  const [lapTime, setLapTime] = useState('');
  const [carType, setCarType] = useState('');
  const [driveTrain, setDriveTrain] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRun = {
      name,
      carName,
      lapTime,
      carType,
      driveTrain,
      time: new Date().toISOString() // Save timestamp
    };

    socket.emit('addRun', newRun);

    // Clear inputs
    setName('');
    setCarName('');
    setLapTime('');
    setCarType('');
    setDriveTrain('');
  };

  return (
    <div>
      <h1>Submit a New Run</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Driver Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Car Name:</label>
          <input
            type="text"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Lap Time (ms):</label>
          <input
            type="number"
            value={lapTime}
            onChange={(e) => setLapTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Car Type:</label>
          <input
            type="text"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Drive Train:</label>
          <input
            type="text"
            value={driveTrain}
            onChange={(e) => setDriveTrain(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Run</button>
      </form>
    </div>
  );
};

const OverallPage = () => {
  const dispatch = useDispatch();
  const { runsByDriver } = useSelector((state) => state.runs);

  useEffect(() => {
    dispatch(fetchRuns()); // Fetch once when the component loads
  }, [dispatch]);

  return (
    <div>
      <h1>Overall Runs</h1>
      {runsByDriver.length > 0 ? (
        runsByDriver?.map((driver) => (
          <div key={`driver-${driver.name}`}>
            <h2>{driver.name}</h2> {/* Driver Name */}
            {driver.cars?.map((car) => (
              <div key={`car-${driver.name}-${car.carName}`} style={{ marginLeft: '20px' }}>
                <h3>{car.carName}</h3> {/* Car Name */}
                <ul>
                  {car.runs?.map((run, index) => (
                    <li key={`run-${driver.name}-${car.carName}-${index}`}>
                      Run {run.runNumber}: {run.lapTime} ms
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const { leaderboard, status } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLeaderboard());
    }
  }, [dispatch, status]);

  return (
    <div>
      <h1>Live Leaderboard</h1>
      {leaderboard.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Driver</th>
              <th>Car</th>
              <th>Lap Time (ms)</th>
              <th>Gap to First (ms)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={`${entry.name}-${entry.carName}-${entry.lapTime}`}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.carName}</td>
                <td>{entry.lapTime}</td>
                <td>{entry.gapToFirst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <RunInputPage />
        <LeaderboardPage />
        <OverallPage />
      </WebSocketProvider>
    </Provider>
  );
};

export default App;
