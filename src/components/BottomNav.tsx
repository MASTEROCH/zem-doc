import { useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react';
import type { Screen } from '../App';
import { Icon, type IconName } from './Icon';

type Tab = { id: Screen; label: string; icon: IconName };

const left: Tab[] = [
  { id: 'home',        label: 'Главная',     icon: 'home' },
  { id: 'departments', label: 'Направления', icon: 'stethoscope' },
];
const right: Tab[] = [
  { id: 'doctors', label: 'Врачи',   icon: 'users' },
  { id: 'account', label: 'Кабинет', icon: 'user' },
];
const IND_W = 54;

export function BottomNav({ current, onChange }: { current: Screen; onChange: (s: Screen) => void }) {
  const navRef = useRef<HTMLElement>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState<{ x: number } | null>(null);
  const [ready, setReady] = useState(false);

  // offsetLeft/offsetWidth относительно .bottom-nav (positioned) — точно и без влияния transform
  const measure = useCallback(() => {
    const el = refs.current[current];
    if (el) setInd({ x: el.offsetLeft + (el.offsetWidth - IND_W) / 2 });
    else setInd(null);
  }, [current]);

  useLayoutEffect(() => { measure(); }, [measure]);
  useEffect(() => {
    // после первого кадра включаем transition (чтобы не «прилетал» из угла)
    const id = requestAnimationFrame(() => { measure(); setReady(true); });
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', measure); };
  }, [measure]);

  const item = (tab: Tab) => (
    <button
      key={tab.id}
      ref={(el) => { refs.current[tab.id] = el; }}
      className={`nav-item ${current === tab.id ? 'active' : ''}`}
      onClick={() => onChange(tab.id)}
      aria-current={current === tab.id ? 'page' : undefined}
    >
      <span className="nav-icon"><Icon name={tab.icon} size={22} strokeWidth={current === tab.id ? 2.3 : 1.7} /></span>
      <span className="nav-label">{tab.label}</span>
    </button>
  );

  return (
    <nav className="bottom-nav" aria-label="Навигация" ref={navRef}>
      <div
        className={`nav-indicator ${ready ? 'anim' : ''}`}
        style={ind ? { transform: `translateX(${ind.x}px)`, width: IND_W, opacity: 1 } : { opacity: 0 }}
        aria-hidden
      />
      {left.map(item)}
      <div className="nav-fab-slot">
        <button className="nav-fab" onClick={() => onChange('booking')} aria-label="Записаться на приём">
          <Icon name="calendar-check" size={24} strokeWidth={2} />
        </button>
      </div>
      {right.map(item)}
    </nav>
  );
}
