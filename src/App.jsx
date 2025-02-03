import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router';

import { connectWebSocket } from './redux/socketMiddleware';
import Input from './pages/Input';
import Leaderboard from './pages/Leaderboard';
import Overall from './pages/Overall';
import Result from './pages/Result';
import QRCodePage from './pages/QRCode';
import OverallResult from './pages/OverallResult';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLeaderboard, setIsLeaderboard] = useState(true);
  const [overallPage, setOverallPage] = useState(1);
  const [totalOverallPages, setTotalOverallPages] = useState(1); // ✅ Dynamically updated
  const [isFading, setIsFading] = useState(false);

  const SWITCH_INTERVAL = 3000; // ✅ 10 seconds interval

  useEffect(() => {
    dispatch(connectWebSocket()); // ✅ Start WebSocket on App Load
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true); // Start fade-out effect

      setTimeout(() => {
        if (isLeaderboard) {
          setOverallPage((prevPage) => (prevPage % totalOverallPages) + 1);
          navigate(`/overall?page=${overallPage}`);
        } else {
          navigate('/leaderboard');
        }

        setIsLeaderboard((prev) => !prev);
        setIsFading(false); // Reset fade effect
      }, 1000);
    }, SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [isLeaderboard, overallPage, totalOverallPages, navigate]);

  return (
    <div className={`transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <Routes location={location}>
        <Route path="/input" element={<Input />} />
        <Route path="/result" element={<Result />} />
        <Route path="/qrcode" element={<QRCodePage />} />
        <Route path="/overall-result" element={<OverallResult />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/overall"
          element={<Overall autoPage={overallPage} setTotalPages={setTotalOverallPages} />}
        />
      </Routes>
    </div>
  );
};

export default App;
