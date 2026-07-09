import { useState } from 'react';
import { TopBar } from '../components/AppHeader';
import { Icon, type IconName } from '../components/Icon';
import { clinic } from '../data/clinic';
import { useThemePref, type ThemePref } from '../lib/theme';
import { toast, openSheet, closeSheet } from '../lib/ui';
import { haptic } from '../lib/haptics';

const THEME_OPTS: { id: ThemePref; label: string }[] = [
  { id: 'auto', label: 'Авто' }, { id: 'light', label: 'Светлая' }, { id: 'dark', label: 'Тёмная' },
];

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <button className={`switch ${on ? 'on' : ''}`} role="switch" aria-checked={on} onClick={() => { haptic('light'); onChange(!on); }} />;
}

function Toggle({ icon, title, sub, on, set }: { icon: IconName; title: string; sub?: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <div className="set-row">
      <span className="menu-ic"><Icon name={icon} size={19} /></span>
      <div className="grow"><div className="set-title">{title}</div>{sub && <div className="set-sub">{sub}</div>}</div>
      <Switch on={on} onChange={set} />
    </div>
  );
}

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [pref, setPref] = useThemePref();
  const [remind, setRemind] = useState(true);
  const [promo, setPromo] = useState(true);
  const [results, setResults] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const clearData = () => openSheet({
    title: 'Очистить данные приложения?',
    subtitle: 'Сбросятся онбординг, тема и локальные настройки. Записи в клинике не затрагиваются.',
    actions: (
      <>
        <button className="btn btn-ghost btn-block" style={{ color: 'var(--danger)' }} onClick={() => { try { localStorage.clear(); } catch { /* */ } location.href = location.pathname; }}>Очистить и перезапустить</button>
        <button className="btn btn-primary btn-block" onClick={closeSheet}>Отмена</button>
      </>
    ),
    body: null,
  });

  return (
    <div className="screen">
      <TopBar title="Настройки" onBack={onBack} />

      <div className="section" style={{ marginTop: 6 }}>
        <div className="field-label">Внешний вид</div>
        <div className="card card-pad">
          <div className="between" style={{ marginBottom: 10 }}>
            <div className="set-title">Тема оформления</div>
            <span className="faint" style={{ fontSize: 12 }}>{pref === 'auto' ? 'по системе' : pref === 'dark' ? 'тёмная' : 'светлая'}</span>
          </div>
          <div className="segmented">
            {THEME_OPTS.map((o) => (
              <button key={o.id} className={pref === o.id ? 'active' : ''} onClick={() => setPref(o.id)}>{o.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="field-label">Уведомления</div>
        <div className="list-card">
          <Toggle icon="bell" title="Напоминания о записи" sub="За день и за час до приёма" on={remind} set={setRemind} />
          <Toggle icon="gift" title="Акции и новости" sub="Выгодные комплексы и предложения" on={promo} set={setPromo} />
          <Toggle icon="flask" title="Результаты анализов" sub="Как только готовы" on={results} set={setResults} />
        </div>
      </div>

      <div className="section">
        <div className="field-label">Приложение</div>
        <div className="list-card">
          <Toggle icon="pulse" title="Тактильная отдача" sub="Вибро-отклик на действия" on={haptics} set={setHaptics} />
          <button className="menu-item" style={{ width: '100%', textAlign: 'left' }} onClick={() => toast('Русский язык')}>
            <span className="menu-ic"><Icon name="globe" size={19} /></span>
            <span className="menu-label">Язык</span>
            <span className="menu-val">Русский</span>
            <Icon name="chevron-right" size={17} className="faint" />
          </button>
          <button className="menu-item" style={{ width: '100%', textAlign: 'left', color: 'var(--danger)' }} onClick={clearData}>
            <span className="menu-ic" style={{ color: 'var(--danger)' }}><Icon name="logout" size={19} /></span>
            <span className="menu-label">Очистить данные приложения</span>
            <Icon name="chevron-right" size={17} className="faint" />
          </button>
        </div>
      </div>

      <div className="section">
        <div className="field-label">Поддержка</div>
        <div className="list-card">
          <a className="contact-item" href={`tel:${clinic.phoneRaw}`}>
            <span className="contact-ic"><Icon name="phone" size={19} /></span>
            <div className="grow"><div className="contact-k">Телефон</div><div className="contact-v">{clinic.phone}</div></div>
            <Icon name="chevron-right" size={17} className="faint" />
          </a>
          <a className="contact-item" href={clinic.whatsapp} target="_blank" rel="noreferrer">
            <span className="contact-ic"><Icon name="whatsapp" size={19} /></span>
            <div className="grow"><div className="contact-k">WhatsApp</div><div className="contact-v">Написать</div></div>
            <Icon name="chevron-right" size={17} className="faint" />
          </a>
          <a className="contact-item" href={clinic.telegram} target="_blank" rel="noreferrer">
            <span className="contact-ic"><Icon name="telegram" size={19} /></span>
            <div className="grow"><div className="contact-k">Telegram</div><div className="contact-v">Написать</div></div>
            <Icon name="chevron-right" size={17} className="faint" />
          </a>
        </div>
      </div>

      <div className="section">
        <div className="card card-pad center">
          <div className="brand-mark logo" style={{ width: 48, height: 48, margin: '0 auto 10px' }}><img src="logo-mark.svg" alt="Земский Доктор" /></div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Земский Доктор</div>
          <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>Демо-прототип · версия 1.4</div>
          <div className="faint" style={{ fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>Лицензия № Л0-39-01-001877<br />© 2026 Земский Доктор · Калининград</div>
        </div>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}
