import { useEffect, useRef, useState } from 'react';

/**
 * Count-up анимация числа 0 → target (премиум-приём: «оживающие» метрики).
 * Уважает prefers-reduced-motion (сразу конечное значение).
 */
export function useCountUp(target: number, duration = 1100, start = true) {
  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVal(target); return; }
    let t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // out-cubic — мягкий финиш
      setVal(target * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration, start]);

  return val;
}

/** Целое число с count-up + разделители тысяч */
export function CountUpInt({ value, duration = 1100, className, suffix = '' }: { value: number; duration?: number; className?: string; suffix?: string }) {
  const v = useCountUp(value, duration);
  return <span className={className}>{Math.round(v).toLocaleString('ru-RU')}{suffix}</span>;
}
