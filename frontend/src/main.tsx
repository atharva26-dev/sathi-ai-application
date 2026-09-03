import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { LanguageProvider } from './context/LanguageContext';
import { UserProvider } from './context/UserContext';
import { VoiceProvider } from './context/VoiceContext';
import { OfflineProvider } from './context/OfflineContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Register Service Worker for Offline PWA support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('SAATHI ServiceWorker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('SAATHI ServiceWorker registration failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <UserProvider>
          <VoiceProvider>
            <OfflineProvider>
              <AccessibilityProvider>
                <App />
              </AccessibilityProvider>
            </OfflineProvider>
          </VoiceProvider>
        </UserProvider>
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);
