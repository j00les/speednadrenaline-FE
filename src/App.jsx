import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'primeicons/primeicons.css';

import Input from './pages/Input';
import Leaderboard from './pages/Leaderboard';
import Overall from './pages/Overall';
import Result from './pages/Result';

import 'react-loading-skeleton/dist/skeleton.css';
import Fade from './components/Fade';
import QRCodePage from './pages/QRCode';
import { WebSocketProvider } from './context/WebSocketContext';
import OverallResult from './pages/OverallResult';

const App = () => {
  const [currentPage, setCurrentPage] = useState('/overall'); // Track current page
  const [shouldFade, setShouldFade] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Toggle between leaderboard and overall every 5 seconds
    const interval = setInterval(() => {
      setShouldFade(true); // Trigger fade-out
      setTimeout(() => {
        // Switch pages after the fade-out effect
        setCurrentPage((prevPage) => (prevPage === '/leaderboard' ? '/overall' : '/leaderboard'));
        setShouldFade(false); // Trigger fade-in
      }, 1000); // Wait for the fade-out to finish before switching
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <WebSocketProvider>
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
    </WebSocketProvider>
  );
};

export default App;
