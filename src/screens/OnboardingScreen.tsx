import { useState } from 'react';
import { Icon } from '../components/Icon';
import { ZemFace } from '../components/DrZem';
import { clinic, stats } from '../data/clinic';

export function OnboardingScreen({ onComplete, onSkip }: { onComplete: (name: string) => void; onSkip: () => void }) {
  const [name, setName] = useState('');

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
        <div className="center reveal">
          <div className="zem-onb"><ZemFace emotion="hi" /></div>
          <div className="eyebrow gold" style={{ justifyContent: 'center', marginTop: 4 }}>Медицинский центр · {clinic.city}</div>
          <h1 style={{ fontSize: 30, marginTop: 12 }}>Земский <span className="serif" style={{ color: 'var(--gold-deep)' }}>Доктор</span></h1>
          <p className="muted" style={{ marginTop: 12, fontSize: 15, lineHeight: 1.55, maxWidth: '30ch', marginInline: 'auto' }}>
            Ваше здоровье — наш приоритет. Онлайн-запись к врачу, 16 направлений и экспертная диагностика в одном приложении.
          </p>
        </div>

        <div className="stat-row reveal reveal-2" style={{ marginTop: 26 }}>
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="reveal reveal-3" style={{ marginTop: 26 }}>
          <label className="field-label">Как к вам обращаться?</label>
          <input className="input" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
      </div>

      <div style={{ padding: '0 24px calc(28px + env(safe-area-inset-bottom))' }} className="reveal reveal-4">
        <button className="btn btn-primary btn-block btn-lg" onClick={() => onComplete(name)}>
          Начать <Icon name="arrow-right" size={18} />
        </button>
        <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={onSkip}>Пропустить</button>
        <p className="faint center" style={{ fontSize: 11, marginTop: 14, lineHeight: 1.5 }}>
          Нажимая «Начать», вы соглашаетесь с обработкой данных.<br />Это демо-прототип, реальная запись не создаётся.
        </p>
      </div>
    </div>
  );
}
