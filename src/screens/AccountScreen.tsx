import { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { Icon, type IconName } from '../components/Icon';
import { clinic } from '../data/clinic';
import { openSheet, closeSheet, toast } from '../lib/ui';
import { openZem } from '../lib/zem';
import { useAppointments, upcoming, history, cancelAppointment, type Appointment } from '../lib/appointments';
import { haptic } from '../lib/haptics';
import { formatRuPhone } from '../lib/phone';

const MO_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];
function apptDate(a: Appointment) {
  const dt = new Date(a.dateKey + 'T12:00:00');
  return { d: String(dt.getDate()), m: MO_SHORT[dt.getMonth()] };
}

const DOCS = [
  { name: 'Заключение кардиолога', sub: 'Морозова Н. Ю.', tag: 'PDF · 214 КБ' },
  { name: 'Общий анализ крови', sub: 'лаборатория', tag: 'PDF · 96 КБ' },
  { name: 'Биохимия крови', sub: 'лаборатория', tag: 'PDF · 88 КБ' },
  { name: 'УЗИ брюшной полости — протокол', sub: 'Смирнов А. П.', tag: 'PDF · 310 КБ' },
  { name: 'Справка для налогового вычета', sub: 'бухгалтерия', tag: 'PDF · 52 КБ' },
];

export function AccountScreen({
  userName, onSetName, favCount, onBook, onClinic, onDoctors, onDepartments, onFavorites, onPrices, onNews, onPromotions, onSettings, onAnalyses,
}: {
  userName: string; onSetName: (n: string) => void; favCount: number;
  onBook: () => void; onClinic: () => void; onDoctors: () => void; onDepartments: () => void;
  onFavorites: () => void; onPrices: () => void; onNews: () => void; onPromotions: () => void; onSettings: () => void; onAnalyses: () => void;
}) {
  const [phone, setPhone] = useState('');
  useAppointments(); // подписка: список записей всегда актуален
  const ups = upcoming();
  const past = history().filter((a) => a.status === 'done');
  const displayName = userName === 'Гость' ? 'Пациент' : userName;
  const initials = displayName.trim().slice(0, 1).toUpperCase();

  const editProfile = () => openSheet({
    title: 'Редактировать профиль',
    body: <EditProfile name={displayName} phone={phone} onSave={(n, p) => { onSetName(n); setPhone(p); }} />,
  });

  const openHistory = () => openSheet({
    title: 'История приёмов',
    subtitle: `${past.length} завершённых визитов`,
    body: (
      <div className="wrap-gap" style={{ gap: 10 }}>
        {past.map((a) => (
          <div className="card card-pad row" key={a.id} style={{ gap: 12 }}>
            <span className="quick-ic navy" style={{ width: 42, height: 42, flex: 'none' }}><Icon name="check" size={20} /></span>
            <div className="grow">
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{a.deptTitle}</div>
              <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>{a.dateLabel} · {a.time} · {a.doctorName}</div>
            </div>
            <span className="badge ok" style={{ flex: 'none' }}>Завершён</span>
          </div>
        ))}
      </div>
    ),
    actions: (
      <button className="btn btn-primary btn-block btn-lg" onClick={() => { closeSheet(); onBook(); }}>
        <Icon name="calendar-check" size={20} /> Записаться снова
      </button>
    ),
  });

  const openDocuments = () => openSheet({
    title: 'Мои документы',
    subtitle: 'Заключения, результаты, справки',
    body: (
      <div className="list-card">
        {DOCS.map((d) => (
          <button key={d.name} className="menu-item" style={{ width: '100%', textAlign: 'left' }} onClick={() => toast(`«${d.name}» — PDF скачивается`, 'success')}>
            <span className="menu-ic"><Icon name="file" size={18} /></span>
            <div className="grow">
              <div className="menu-label" style={{ fontSize: 13.5 }}>{d.name}</div>
              <div className="faint" style={{ fontSize: 11.5 }}>{d.sub}</div>
            </div>
            <span className="menu-val" style={{ fontSize: 11 }}>{d.tag}</span>
          </button>
        ))}
      </div>
    ),
    actions: <button className="btn btn-ghost btn-block" onClick={closeSheet}>Закрыть</button>,
  });

  const manageAppt = (a: Appointment) => openSheet({
    title: 'Управление записью',
    body: <div className="faint" style={{ fontSize: 13 }}>{a.deptTitle} · {a.dateLabel}, {a.time} · {a.doctorName}</div>,
    actions: (
      <>
        <button className="btn btn-outline brand btn-block" onClick={() => { closeSheet(); onBook(); toast('Выберите новую дату — старую запись отменит администратор'); }}>Перенести</button>
        <button className="btn btn-ghost btn-block" style={{ color: 'var(--danger)' }} onClick={() => { haptic('medium'); cancelAppointment(a.id); closeSheet(); toast('Запись отменена', 'success'); }}>Отменить запись</button>
      </>
    ),
  });

  const tiles = [
    { icon: 'flask' as IconName, label: 'Анализы', tone: 'teal', note: '2 готовы', onClick: onAnalyses },
    { icon: 'file' as IconName, label: 'Документы', tone: 'brand', note: String(DOCS.length), onClick: openDocuments },
    { icon: 'heart' as IconName, label: 'Избранное', tone: 'gold', note: String(favCount), onClick: onFavorites },
  ];

  const menu: { icon: IconName; label: string; val?: string; onClick: () => void }[] = [
    { icon: 'calendar-check', label: 'История приёмов', val: String(past.length), onClick: openHistory },
    { icon: 'flask', label: 'Мои анализы', val: '2', onClick: onAnalyses },
    { icon: 'file', label: 'Прайс-лист', onClick: onPrices },
    { icon: 'gift', label: 'Акции и комплексы', onClick: onPromotions },
    { icon: 'stethoscope', label: 'Направления', onClick: onDepartments },
    { icon: 'users', label: 'Врачи', onClick: onDoctors },
    { icon: 'bell', label: 'Новости и статьи', onClick: onNews },
    { icon: 'info', label: 'О клинике и контакты', onClick: onClinic },
    { icon: 'sparkle-ai', label: 'Спросить dr.Zem', onClick: () => openZem() },
  ];

  return (
    <div className="screen">
      <AppHeader action={{ icon: 'settings', onClick: onSettings, label: 'Настройки' }} />

      <div className="acct-head">
        <div className="acct-avatar">{initials}</div>
        <div className="grow">
          <div className="acct-name">{displayName}</div>
          <div className="acct-sub">{phone || 'Пациент клиники «Земский Доктор»'}</div>
        </div>
        <button className="icon-btn" onClick={editProfile} aria-label="Редактировать"><Icon name="pencil" size={18} /></button>
      </div>

      <div className="mcard reveal">
        <div className="row1">
          <div>
            <div className="mc-label">Медицинская карта</div>
            <div className="mc-no">ЗД · 2026 · 4417</div>
          </div>
          <Icon name="shield-check" size={26} style={{ color: 'var(--gold-bright)' }} />
        </div>
        <div className="mc-bonus"><b>380</b><span style={{ color: 'var(--text-on-navy-2)', fontSize: 13 }}>бонусных баллов</span></div>
        <div style={{ fontSize: 11.5, color: 'var(--text-on-navy-2)', marginTop: 8, position: 'relative' }}>Списывайте до 20% стоимости приёма</div>
      </div>

      <div className="section" style={{ marginTop: 16 }}>
        <div className="row" style={{ gap: 10 }}>
          {tiles.map((t) => (
            <button key={t.label} className="card" style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }} onClick={t.onClick}>
              <span className={`quick-ic ${t.tone}`}><Icon name={t.icon} size={22} /></span>
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>{t.label}</div>
              <div className="faint" style={{ fontSize: 11 }}>{t.note}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="section" style={{ marginTop: 18 }}>
        <div className="section-head" style={{ marginBottom: 10 }}>
          <div className="section-title" style={{ fontSize: 18 }}>Мои <span className="serif">записи</span></div>
        </div>
        {ups.length === 0 ? (
          <div className="empty-state" style={{ padding: '22px 16px' }}>
            <div className="empty-ic"><Icon name="calendar-check" size={26} /></div>
            <h3>Пока нет записей</h3>
            <p>Запишитесь к врачу — займёт меньше минуты.</p>
          </div>
        ) : (
          <div className="wrap-gap" style={{ gap: 10 }}>
            {ups.map((a, i) => {
              const dm = apptDate(a);
              return (
                <div className="card appt-card" key={a.id}>
                  <div className="appt-date"><div className="d">{dm.d}</div><div className="m">{dm.m}</div></div>
                  <div className="appt-info">
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{a.deptTitle} · {a.time}</div>
                    <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>{a.doctorName}</div>
                    <span className="appt-status upcoming" style={{ marginTop: 6, display: 'inline-block' }}>{i === 0 && a.id === 'seed-up' ? 'Подтверждена' : 'Ожидает подтверждения'}</span>
                  </div>
                  <button className="icon-btn" aria-label="Управление записью" onClick={() => manageAppt(a)}><Icon name="pencil" size={17} /></button>
                </div>
              );
            })}
          </div>
        )}
        <button className="btn btn-outline brand btn-block" style={{ marginTop: 12 }} onClick={onBook}>
          <Icon name="plus" size={18} strokeWidth={2.4} /> Новая запись
        </button>
      </div>

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
        <a className="btn btn-outline brand btn-block" href={`tel:${clinic.phoneRaw}`}><Icon name="phone" size={18} /> {clinic.phone}</a>
        <button className="btn btn-ghost btn-block" style={{ color: 'var(--danger)', marginTop: 10 }} onClick={() => toast('Демо: выход недоступен')}>
          <Icon name="logout" size={18} /> Выйти
        </button>
        <p className="faint center" style={{ fontSize: 11, marginTop: 12 }}>Земский Доктор · демо-прототип v1.4</p>
      </div>
    </div>
  );
}

function EditProfile({ name, phone, onSave }: { name: string; phone: string; onSave: (n: string, p: string) => void }) {
  const [n, setN] = useState(name);
  const [p, setP] = useState(phone);
  return (
    <div>
      <div className="field">
        <label className="field-label">Имя</label>
        <input className="input" value={n} onChange={(e) => setN(e.target.value)} placeholder="Ваше имя" />
      </div>
      <div className="field">
        <label className="field-label">Телефон</label>
        <input className="input" type="tel" inputMode="tel" value={p} onChange={(e) => setP(formatRuPhone(e.target.value))} placeholder="+7 (___) ___-__-__" />
      </div>
      <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 6 }}
        onClick={() => { onSave(n.trim() || 'Пациент', p.trim()); closeSheet(); toast('Профиль обновлён', 'success'); }}>
        <Icon name="check" size={18} strokeWidth={2.6} /> Сохранить
      </button>
    </div>
  );
}
