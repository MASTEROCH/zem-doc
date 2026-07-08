import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './Icon';
import { clinic } from '../data/clinic';

/** Общий заголовок с брендом «Земский Доктор» + реакция на скролл */
export function AppHeader({
  action, onSearch, flat = false,
}: { action?: { icon: IconName; onClick: () => void; dot?: boolean; label: string }; onSearch?: () => void; flat?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const screen = ref.current?.closest('.screen') as HTMLElement | null;
    if (!screen) return;
    const onScroll = () => setScrolled(screen.scrollTop > 6);
    screen.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => screen.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header ref={ref} className={`app-header ${flat ? 'flat' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <div className="app-header-row">
        <div className="brand-lockup">
          <div className="brand-mark"><Icon name="pulse" size={22} strokeWidth={2.4} /></div>
          <div className="brand-text">
            <div className="brand-name">Земский <span className="gold">Доктор</span></div>
            <div className="brand-sub">{clinic.city} · медцентр</div>
          </div>
        </div>
        <div className="header-actions">
          {onSearch && <button className="icon-btn" onClick={onSearch} aria-label="Поиск"><Icon name="search" size={19} /></button>}
          <a className="icon-btn" href={`tel:${clinic.phoneRaw}`} aria-label="Позвонить"><Icon name="phone" size={19} /></a>
          {action && (
            <button className="icon-btn" onClick={action.onClick} aria-label={action.label}>
              <Icon name={action.icon} size={19} />
              {action.dot && <span className="dot" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/** Заголовок для детальных экранов с кнопкой «назад» */
export function TopBar({ title, onBack, right }: { title?: string; onBack: () => void; right?: React.ReactNode }) {
  return (
    <div className="topbar">
      <button className="back-btn" onClick={onBack} aria-label="Назад"><Icon name="arrow-back" size={20} /></button>
      {title && <div className="topbar-title">{title}</div>}
      <div className="grow" />
      {right}
    </div>
  );
}
