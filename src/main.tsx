import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

const appPrefix = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/app`;
if (
  'serviceWorker' in navigator &&
  (window.location.pathname === appPrefix || window.location.pathname.startsWith(`${appPrefix}/`))
) {
  window.addEventListener('load', () => {
    const basePath = import.meta.env.BASE_URL;
    void navigator.serviceWorker
      .register(`${basePath}app/service-worker.js`, {
        scope: `${basePath}app/`,
      })
      .catch((error: unknown) => {
        console.error('payz app service worker registration failed', error);
      });
  });
}

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
