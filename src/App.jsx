import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router';

import { connectWebSocket, sendRun } from './redux/socketMiddleware';
import Input from './pages/Input';
import Leaderboard from './pages/Leaderboard';
import Overall from './pages/Overall';
import Result from './pages/Result';
import QRCodePage from './pages/QRCode';
import OverallResult from './pages/OverallResult';

// import { fetchRuns } from './redux/runSlice';
// import { fetchLeaderboard } from './redux/leaderboardSlice';

// const RunInputPage = () => {
//   const dispatch = useDispatch();
//   const [name, setName] = useState('');
//   const [carName, setCarName] = useState('');
//   const [lapTime, setLapTime] = useState('');
//   const [carType, setCarType] = useState('');
//   const [driveTrain, setDriveTrain] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     dispatch(
//       sendRun({
//         name,
//         carName,
//         lapTime,
//         carType,
//         driveTrain,
//         time: new Date().toISOString()
//       })
//     );

//     setName('');
//     setCarName('');
//     setLapTime('');
//     setCarType('');
//     setDriveTrain('');
//   };

//   return (
//     <div>
//       <h1>Submit a New Run</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Driver Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Car Name"
//           value={carName}
//           onChange={(e) => setCarName(e.target.value)}
//           required
//         />
//         <input
//           type="number"
//           placeholder="Lap Time (ms)"
//           value={lapTime}
//           onChange={(e) => setLapTime(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Car Type"
//           value={carType}
//           onChange={(e) => setCarType(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Drive Train"
//           value={driveTrain}
//           onChange={(e) => setDriveTrain(e.target.value)}
//           required
//         />
//         <button type="submit">Submit Run</button>
//       </form>
//     </div>
//   );
// };

// const OverallPage = () => {
//   const dispatch = useDispatch();
//   const { runsByDriver } = useSelector((state) => state.runs);

//   useEffect(() => {
//     dispatch(fetchRuns()); // Fetch once when the component loads
//   }, [dispatch]);

//   return (
//     <div>
//       <h1>Overall Runs</h1>
//       {runsByDriver.length > 0 ? (
//         runsByDriver?.map((driver) => (
//           <div key={`driver-${driver.name}`}>
//             <h2>{driver.name}</h2> {/* Driver Name */}
//             {driver.cars?.map((car) => (
//               <div key={`car-${driver.name}-${car.carName}`} style={{ marginLeft: '20px' }}>
//                 <h3>{car.carName}</h3> {/* Car Name */}
//                 <ul>
//                   {car.runs?.map((run, index) => (
//                     <li key={`run-${driver.name}-${car.carName}-${index}`}>
//                       Run {run.runNumber}: {run.lapTime} ms
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         ))
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// const LeaderboardPage = () => {
//   const dispatch = useDispatch();
//   const { leaderboard, status } = useSelector((state) => state.leaderboard);

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchLeaderboard());
//     }
//   }, [dispatch, status]);

//   return (
//     <div>
//       <h1>Live Leaderboard</h1>
//       {leaderboard.length > 0 ? (
//         <table border="1">
//           <thead>
//             <tr>
//               <th>Rank</th>
//               <th>Driver</th>
//               <th>Car</th>
//               <th>Lap Time (ms)</th>
//               <th>Gap to First (ms)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaderboard.map((entry, index) => (
//               <tr key={`${entry.name}-${entry.carName}-${entry.lapTime}`}>
//                 <td>{index + 1}</td>
//                 <td>{entry.name}</td>
//                 <td>{entry.carName}</td>
//                 <td>{entry.lapTime}</td>
//                 <td>{entry.gapToFirst}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default App;

const App = () => {
  const [currentPage, setCurrentPage] = useState('/overall'); // Track current page
  const [shouldFade, setShouldFade] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(connectWebSocket()); // ✅ Start WebSocket on App Load
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldFade(true); // Trigger fade-out
      setTimeout(() => {
        setCurrentPage((prevPage) => (prevPage === '/leaderboard' ? '/overall' : '/leaderboard'));
        setShouldFade(false); // Trigger fade-in
      }, 1000); // Wait for the fade-out to finish before switching
    }, 10000); // Switch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <Routes location={location}>
      <Route path="/input" element={<Input />} />
      <Route path="/result" element={<Result />} />
      <Route path="/qrcode" element={<QRCodePage />} />
      <Route path="/overall-result" element={<OverallResult />} />

      <Route
        path="/leaderboard"
        element={<Leaderboard />}
        // element={
        //   <Fade shouldFade={shouldFade}>
        //     {currentPage === '/leaderboard' ? <Leaderboard /> : <Overall />}
        //   </Fade>
        // }
      />

      <Route
        path="/overall"
        element={<Overall />}
        // element={
        //   <Fade shouldFade={shouldFade}>
        //     {currentPage === '/overall' ? <Overall /> : <Leaderboard />}
        //   </Fade>
        // }
      />
    </Routes>
  );
};

export default App;
