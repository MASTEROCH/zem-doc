import { useEffect, type RefObject } from 'react';

/**
 * Медленная авто-прокрутка горизонтального блока («бегущая строка» для превью).
 * Ручной скролл/касание — приоритет: пауза на взаимодействии, авто-возобновление.
 * Уважает prefers-reduced-motion (не запускается).
 */
export function useAutoScroll(ref: RefObject<HTMLElement | null>, speed = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = 0;
    let paused = false;
    let resumeAt = 0;
    let dir = 1;

    const pause = () => { paused = true; resumeAt = performance.now() + 2600; };
    const tick = (t: number) => {
      const max = el.scrollWidth - el.clientWidth;
      if (max > 4 && (!paused || t > resumeAt)) {
        paused = false;
        el.scrollLeft += speed * dir;
        if (el.scrollLeft >= max - 0.5) dir = -1;
        else if (el.scrollLeft <= 0.5) dir = 1;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const evs: (keyof HTMLElementEventMap)[] = ['pointerdown', 'touchstart', 'wheel', 'mouseenter'];
    evs.forEach((e) => el.addEventListener(e, pause, { passive: true }));
    return () => {
      cancelAnimationFrame(raf);
      evs.forEach((e) => el.removeEventListener(e, pause));
    };
  }, [ref, speed]);
}
