import { Routes, Route } from 'react-router-dom';

import Input from './pages/Input';
import Leaderboard from './pages/Leaderboard';
import Overall from './pages/Overall';

import { WebSocketProvider } from './context/WebSocketContext';

const App = () => {
  return (
    <WebSocketProvider>
      <Routes>
        <Route path="/input" element={<Input />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/overall" element={<Overall />} />
      </Routes>
    </WebSocketProvider>
  );
};

export default App;
