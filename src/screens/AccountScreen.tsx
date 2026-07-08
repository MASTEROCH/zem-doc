import { AppHeader } from '../components/AppHeader';
import { Icon, type IconName } from '../components/Icon';
import { clinic } from '../data/clinic';
import { openSheet, toast } from '../lib/ui';

const TILES: { icon: IconName; label: string; tone: string; note: string }[] = [
  { icon: 'flask', label: 'Анализы', tone: 'teal', note: '2 готовы' },
  { icon: 'file', label: 'Документы', tone: 'brand', note: '5' },
  { icon: 'heart', label: 'Избранное', tone: 'gold', note: '2' },
];

export function AccountScreen({
  userName, onBook, onClinic, onDoctors, onDepartments,
}: {
  userName: string; onBook: () => void; onClinic: () => void;
  onDoctors: () => void; onDepartments: () => void;
}) {
  const initials = (userName || 'Г').trim().slice(0, 1).toUpperCase();

  const menu: { icon: IconName; label: string; val?: string; onClick: () => void }[] = [
    { icon: 'calendar-check', label: 'История приёмов', val: '8', onClick: () => toast('История приёмов') },
    { icon: 'stethoscope', label: 'Направления', onClick: onDepartments },
    { icon: 'users', label: 'Мои врачи', onClick: onDoctors },
    { icon: 'bell', label: 'Уведомления', val: 'Вкл', onClick: () => toast('Настройки уведомлений') },
    { icon: 'pin', label: 'О клинике и контакты', onClick: onClinic },
    { icon: 'info', label: 'Поддержка', onClick: () => openSheet({
        title: 'Поддержка',
        subtitle: 'Мы на связи в рабочее время',
        body: (
          <div className="wrap-gap">
            <a className="btn btn-primary btn-block" href={`tel:${clinic.phoneRaw}`}><Icon name="phone" size={18} /> Позвонить</a>
            <a className="btn btn-ghost btn-block" href={clinic.whatsapp} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /> WhatsApp</a>
            <a className="btn btn-ghost btn-block" href={clinic.telegram} target="_blank" rel="noreferrer"><Icon name="telegram" size={18} /> Telegram</a>
          </div>
        ),
      }) },
  ];

  return (
    <div className="screen">
      <AppHeader action={{ icon: 'settings', onClick: () => toast('Настройки'), label: 'Настройки' }} />

      {/* head */}
      <div className="acct-head">
        <div className="acct-avatar">{initials}</div>
        <div className="grow">
          <div className="acct-name">{userName === 'Гость' ? 'Пациент' : userName}</div>
          <div className="acct-sub">Пациент клиники «Земский Доктор»</div>
        </div>
        <button className="icon-btn" onClick={() => toast('Редактировать профиль')}><Icon name="pencil" size={18} /></button>
      </div>

      {/* medical card */}
      <div className="mcard reveal">
        <div className="row1">
          <div>
            <div className="mc-label">Медицинская карта</div>
            <div className="mc-no">ЗД · 2026 · 4417</div>
          </div>
          <Icon name="shield-check" size={26} style={{ color: 'var(--gold-bright)' }} />
        </div>
        <div className="mc-bonus"><b>380</b><span style={{ color: 'var(--text-on-navy-2)', fontSize: 13 }}>бонусных баллов</span></div>
        <div style={{ fontSize: 11.5, color: 'var(--text-on-navy-2)', marginTop: 8, position: 'relative' }}>
          Списывайте до 20% стоимости приёма
        </div>
      </div>

      {/* tiles */}
      <div className="section" style={{ marginTop: 16 }}>
        <div className="row" style={{ gap: 10 }}>
          {TILES.map((t) => (
            <button key={t.label} className="card" style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }} onClick={() => toast(t.label)}>
              <span className={`quick-ic ${t.tone}`}><Icon name={t.icon} size={22} /></span>
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>{t.label}</div>
              <div className="faint" style={{ fontSize: 11 }}>{t.note}</div>
            </button>
          ))}
        </div>
      </div>

      {/* upcoming appointment */}
      <div className="section" style={{ marginTop: 18 }}>
        <div className="section-head" style={{ marginBottom: 10 }}>
          <div className="section-title" style={{ fontSize: 18 }}>Мои <span className="serif">записи</span></div>
        </div>
        <div className="card appt-card">
          <div className="appt-date"><div className="d">14</div><div className="m">июля</div></div>
          <div className="appt-info">
            <div style={{ fontWeight: 700, fontSize: 14 }}>Кардиология · 15:30</div>
            <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>Морозова Наталья Юрьевна</div>
            <span className="appt-status upcoming" style={{ marginTop: 6, display: 'inline-block' }}>Подтверждена</span>
          </div>
          <button className="icon-btn" onClick={() => openSheet({
            title: 'Управление записью',
            body: <div className="faint" style={{ fontSize: 13 }}>Кардиология · 14 июля, 15:30</div>,
            actions: (
              <>
                <button className="btn btn-outline btn-block" onClick={() => { toast('Запись перенесена'); }}>Перенести</button>
                <button className="btn btn-ghost btn-block" style={{ color: 'var(--danger)' }} onClick={() => toast('Запись отменена')}>Отменить запись</button>
              </>
            ),
          })}><Icon name="pencil" size={17} /></button>
        </div>
        <button className="btn btn-outline brand btn-block" style={{ marginTop: 12 }} onClick={onBook}>
          <Icon name="plus" size={18} strokeWidth={2.4} /> Новая запись
        </button>
      </div>

      {/* menu */}
      <div className="section" style={{ marginTop: 18 }}>
        <div className="list-card">
          {menu.map((m) => (
            <button key={m.label} className="menu-item" style={{ width: '100%', textAlign: 'left' }} onClick={m.onClick}>
              <span className="menu-ic"><Icon name={m.icon} size={19} /></span>
              <span className="menu-label">{m.label}</span>
              {m.val && <span className="menu-val">{m.val}</span>}
              <Icon name="chevron-right" size={17} className="faint" />
            </button>
          ))}
        </div>
      </div>

      <div className="section" style={{ marginTop: 14 }}>
        <button className="btn btn-ghost btn-block" style={{ color: 'var(--danger)' }} onClick={() => toast('Демо: выход недоступен')}>
          <Icon name="logout" size={18} /> Выйти
        </button>
        <p className="faint center" style={{ fontSize: 11, marginTop: 12 }}>Земский Доктор · демо-прототип v1.0</p>
      </div>
    </div>
  );
}
