import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { PrimeReactProvider } from 'primereact/api';

import App from './App.jsx';

import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <PrimeReactProvider value={{}}>
      <App />
    </PrimeReactProvider>
  </BrowserRouter>
);
