/* Тактильная отдача: Telegram Mini App HapticFeedback + вибро-фолбэк. */
type TG = {
  HapticFeedback?: {
    impactOccurred: (s: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (t: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
};
function tg(): TG | undefined {
  return (window as unknown as { Telegram?: { WebApp?: TG } }).Telegram?.WebApp;
}

export function haptic(kind: 'light' | 'medium' | 'heavy' | 'select' | 'success' | 'warning' | 'error' = 'light') {
  try {
    const hf = tg()?.HapticFeedback;
    if (hf) {
      if (kind === 'select') hf.selectionChanged();
      else if (kind === 'success' || kind === 'warning' || kind === 'error') hf.notificationOccurred(kind);
      else hf.impactOccurred(kind);
      return;
    }
    // fallback
    const v = (navigator as Navigator & { vibrate?: (n: number | number[]) => boolean }).vibrate;
    if (v) v(kind === 'success' ? [8, 40, 12] : kind === 'heavy' ? 18 : kind === 'medium' ? 12 : 6);
  } catch { /* no-op */ }
}

/** Глобально: лёгкий отклик на нажатие любой кнопки/интерактива. */
export function installHaptics() {
  if (typeof document === 'undefined') return;
  document.addEventListener('pointerdown', (e) => {
    const t = (e.target as HTMLElement)?.closest('button, a, .chip, .pick, .slot, .day, .nav-item, .check-row');
    if (!t) return;
    const strong = t.classList.contains('nav-fab') || t.classList.contains('zem-fab');
    haptic(strong ? 'medium' : 'light');
  }, { passive: true, capture: true });
}
