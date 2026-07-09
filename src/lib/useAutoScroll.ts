import { useEffect, type RefObject } from 'react';

/**
 * Карусель-дрейф горизонтальной ленты: непрерывное бесшовное движение.
 * Контент дублируется 2× → wrap на половине ширины.
 * Скорость — px/СЕКУНДУ (time-based): одинакова на 60/120 Гц экранах.
 * Внутренний float-аккумулятор — движение не «застревает» на округлении scrollLeft.
 * Ручное касание в приоритете: пауза + плавное авто-возобновление.
 * Уважает prefers-reduced-motion.
 */
export function useAutoScroll(ref: RefObject<HTMLElement | null>, pxPerSec = 26) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = 0;
    let last = 0;
    let pos = 0;          // float-позиция (scrollLeft округляется браузером)
    let synced = false;   // после ручного скролла пересинхронизируемся
    let paused = false;
    let resumeAt = 0;
    let vel = 0;          // текущая скорость для плавного разгона

    const pause = () => { paused = true; synced = false; resumeAt = performance.now() + 2600; };

    const tick = (t: number) => {
      if (!last) last = t;
      const dt = Math.min(t - last, 64) / 1000; // защита от фоновых вкладок
      last = t;
      const half = el.scrollWidth / 2;
      if (half > 4) {
        if (paused && t > resumeAt) { paused = false; vel = 0; }
        if (!paused) {
          if (!synced) { pos = el.scrollLeft; synced = true; }
          vel = Math.min(pxPerSec, vel + pxPerSec * dt * 1.4); // мягкий разгон ~0.7с
          pos += vel * dt;
          if (pos >= half) pos -= half;
          el.scrollLeft = pos;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const evs: (keyof HTMLElementEventMap)[] = ['pointerdown', 'touchstart', 'wheel'];
    evs.forEach((e) => el.addEventListener(e, pause, { passive: true }));
    return () => {
      cancelAnimationFrame(raf);
      evs.forEach((e) => el.removeEventListener(e, pause));
    };
  }, [ref, pxPerSec]);
}
