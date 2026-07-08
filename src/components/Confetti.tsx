import { useMemo } from 'react';

/**
 * Конфетти-салют для cinematic-момента (успешная запись).
 * Чистый CSS/JS, авто-скрытие, уважает prefers-reduced-motion (не рендерит).
 */
const COLORS = ['#0E6BA8', '#BE9E6F', '#12A4A4', '#D8BC90', '#1C8FD6', '#1FA971'];

export function Confetti({ count = 46 }: { count?: number }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const bits = useMemo(() => {
    if (reduce) return [];
    return Array.from({ length: count }, (_, i) => {
      const x = (Math.random() * 2 - 1) * 46;          // vw разлёт
      const rise = 42 + Math.random() * 26;            // высота взлёта
      const rot = (Math.random() * 2 - 1) * 720;
      const delay = Math.random() * 0.25;
      const dur = 1.5 + Math.random() * 1.1;
      const size = 6 + Math.random() * 7;
      const color = COLORS[i % COLORS.length];
      const round = Math.random() > 0.5;
      return { x, rise, rot, delay, dur, size, color, round, drift: (Math.random() * 2 - 1) * 14 };
    });
  }, [count, reduce]);

  if (reduce) return null;
  return (
    <div className="confetti" aria-hidden>
      {bits.map((b, i) => (
        <span
          key={i}
          className="confetti-bit"
          style={{
            // @ts-expect-error CSS custom props
            '--x': `${b.x}vw`, '--rise': `${b.rise}vh`, '--drift': `${b.drift}px`,
            '--rot': `${b.rot}deg`, '--dur': `${b.dur}s`, '--delay': `${b.delay}s`,
            width: b.size, height: b.size * (b.round ? 1 : 1.6),
            background: b.color, borderRadius: b.round ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
