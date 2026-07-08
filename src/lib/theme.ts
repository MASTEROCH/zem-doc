import { useEffect, useState } from 'react';

export type ThemePref = 'auto' | 'light' | 'dark';
const KEY = 'zem_theme';

export function getThemePref(): ThemePref {
  if (typeof localStorage === 'undefined') return 'light';
  return (localStorage.getItem(KEY) as ThemePref) || 'light';
}

function resolve(pref: ThemePref): 'light' | 'dark' {
  if (pref === 'auto') return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return pref;
}

export function applyTheme(pref: ThemePref = getThemePref()) {
  const mode = resolve(pref);
  document.documentElement.dataset.theme = mode;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', mode === 'dark' ? '#0A1420' : '#F4F7FB');
}

const listeners = new Set<(p: ThemePref) => void>();
export function setThemePref(pref: ThemePref) {
  try { localStorage.setItem(KEY, pref); } catch { /* ignore */ }
  applyTheme(pref);
  listeners.forEach((l) => l(pref));
}

export function useThemePref(): [ThemePref, (p: ThemePref) => void] {
  const [p, setP] = useState<ThemePref>(getThemePref);
  useEffect(() => {
    listeners.add(setP);
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onSys = () => { if (getThemePref() === 'auto') applyTheme('auto'); };
    mq?.addEventListener?.('change', onSys);
    return () => { listeners.delete(setP); mq?.removeEventListener?.('change', onSys); };
  }, []);
  return [p, setThemePref];
}
