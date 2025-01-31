import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { PrimeReactProvider } from 'primereact/api';
import { Provider } from 'react-redux';

import App from './App.jsx';
import './index.css';
import store from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <PrimeReactProvider value={{}}>
        <App />
      </PrimeReactProvider>
    </BrowserRouter>
  </Provider>
);
