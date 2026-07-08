import { Icon, type IconName } from './Icon';
import { clinic } from '../data/clinic';

/** Общий заголовок с брендом «Земский Доктор» */
export function AppHeader({
  action, flat = false,
}: { action?: { icon: IconName; onClick: () => void; dot?: boolean; label: string }; flat?: boolean }) {
  return (
    <header className={`app-header ${flat ? 'flat' : ''}`}>
      <div className="app-header-row">
        <div className="brand-lockup">
          <div className="brand-mark"><Icon name="pulse" size={22} strokeWidth={2.4} /></div>
          <div className="brand-text">
            <div className="brand-name">Земский <span className="gold">Доктор</span></div>
            <div className="brand-sub">{clinic.city} · медцентр</div>
          </div>
        </div>
        <div className="header-actions">
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
