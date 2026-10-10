import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { IS_MAINTENANCE_MODE } from './config/maintenance';
import { MaintenancePage } from '@base-components';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <BrowserRouter>
      {IS_MAINTENANCE_MODE ? <MaintenancePage /> : <App />}
    </BrowserRouter>
  </StrictMode>,
);
