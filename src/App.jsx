import { Routes, Route } from 'react-router-dom';

import { WebSocketProvider } from './context/WebSocketContext';
import Input from './pages/Input';
import Leaderboard from './pages/Leaderboard';

const App = () => {
  return (
    <WebSocketProvider>
      <Routes>
        <Route path="/input" element={<Input />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </WebSocketProvider>
  );
};

export default App;
