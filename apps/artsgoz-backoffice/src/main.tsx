import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './i18n/index';
import './styles.css';
import App from './app/app';
import { MaintenancePage } from '@base-components';
import { IS_MAINTENANCE_MODE } from './config/maintenance';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    {IS_MAINTENANCE_MODE ? <MaintenancePage /> : <App />}
  </StrictMode>,
);
