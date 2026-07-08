import { useEffect, type RefObject } from 'react';

/**
 * Непрерывный плавный дрейф горизонтального блока («лёгкое движение» превью).
 * Контент дублируется 2× → бесшовный wrap на половине ширины.
 * Ручной скролл/касание в приоритете: пауза на взаимодействии + авто-возобновление.
 * Уважает prefers-reduced-motion.
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

    const pause = () => { paused = true; resumeAt = performance.now() + 2400; };
    const tick = (t: number) => {
      const half = el.scrollWidth / 2;           // контент продублирован → половина = один цикл
      if (half > 4 && (!paused || t > resumeAt)) {
        paused = false;
        el.scrollLeft += speed;
        if (el.scrollLeft >= half) el.scrollLeft -= half;   // бесшовный возврат
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
