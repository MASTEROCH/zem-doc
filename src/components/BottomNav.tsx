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

export function BottomNav({ current, onChange }: { current: Screen; onChange: (s: Screen) => void }) {
  const item = (tab: Tab) => (
    <button
      key={tab.id}
      className={`nav-item ${current === tab.id ? 'active' : ''}`}
      onClick={() => onChange(tab.id)}
      aria-current={current === tab.id ? 'page' : undefined}
    >
      <span className="nav-icon"><Icon name={tab.icon} size={22} strokeWidth={current === tab.id ? 2 : 1.7} /></span>
      <span className="nav-label">{tab.label}</span>
    </button>
  );

  return (
    <nav className="bottom-nav" aria-label="Навигация">
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
