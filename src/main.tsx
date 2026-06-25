import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import {App as CapacitorApp} from '@capacitor/app';
import App from './App.tsx';
import './index.css';
import { healthBridge } from './services';

async function initApp() {
  const isNative = typeof (window as any).Capacitor !== 'undefined' &&
                   (window as any).Capacitor.isNativePlatform();

  if (isNative) {
    console.log('[App] Native platform detected — waiting for deviceready...');
    await new Promise<void>((resolve) => {
      if (typeof (window as any).device !== 'undefined') {
        resolve();
      } else {
        document.addEventListener('deviceready', () => resolve(), { once: true });
        setTimeout(resolve, 5000);
      }
    });
    await healthBridge.initialize();
    console.log('[App] HealthBridge initialized');
  } else {
    console.log('[App] Browser platform — using health simulator');
  }
}

initApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
