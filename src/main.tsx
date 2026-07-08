import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/global.css';
import { App } from './App';
import { installHaptics } from './lib/haptics';
import { applyTheme } from './lib/theme';

applyTheme();

// Telegram Mini App: развернуть на весь экран, если доступно
const tgApp = (window as unknown as { Telegram?: { WebApp?: { ready: () => void; expand: () => void } } }).Telegram?.WebApp;
try { tgApp?.ready(); tgApp?.expand(); } catch { /* not in Telegram */ }

installHaptics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
