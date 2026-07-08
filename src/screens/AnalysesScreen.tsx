import { useState } from 'react';
import { TopBar } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { openSheet, closeSheet, toast } from '../lib/ui';

type Row = { name: string; value: string; ref: string; flag?: 'high' | 'low' };
type Lab = { id: string; name: string; date: string; status: 'ready' | 'progress'; tag: string; rows?: Row[] };

const LABS: Lab[] = [
  {
    id: 'l1', name: 'Общий анализ крови', date: '7 июля 2026', status: 'ready', tag: 'Гематология',
    rows: [
      { name: 'Гемоглобин', value: '141 г/л', ref: '120–160' },
      { name: 'Эритроциты', value: '4.7 ×10¹²/л', ref: '3.9–5.0' },
      { name: 'Лейкоциты', value: '6.2 ×10⁹/л', ref: '4.0–9.0' },
      { name: 'Тромбоциты', value: '210 ×10⁹/л', ref: '180–320' },
      { name: 'СОЭ', value: '14 мм/ч', ref: '2–15' },
    ],
  },
  {
    id: 'l2', name: 'Биохимия крови', date: '7 июля 2026', status: 'ready', tag: 'Биохимия',
    rows: [
      { name: 'Глюкоза', value: '5.9 ммоль/л', ref: '3.9–5.5', flag: 'high' },
      { name: 'Холестерин общий', value: '4.8 ммоль/л', ref: '< 5.2' },
      { name: 'АЛТ', value: '22 Ед/л', ref: '< 41' },
      { name: 'Креатинин', value: '84 мкмоль/л', ref: '62–115' },
    ],
  },
  { id: 'l3', name: 'Гормоны щитовидной железы', date: 'готовится', status: 'progress', tag: 'Эндокринология' },
];

export function AnalysesScreen({ onBack, onBook }: { onBack: () => void; onBook: () => void }) {
  const [tab, setTab] = useState<'ready' | 'progress'>('ready');
  const list = LABS.filter((l) => l.status === tab);

  function openLab(l: Lab) {
    if (l.status !== 'ready' || !l.rows) return;
    openSheet({
      title: l.name,
      subtitle: `${l.tag} · ${l.date}`,
      body: (
        <div>
          <div className="list-card" style={{ marginBottom: 4 }}>
            {l.rows.map((r) => (
              <div className="set-row" key={r.name}>
                <div className="grow">
                  <div className="set-title" style={{ fontSize: 13.5 }}>{r.name}</div>
                  <div className="set-sub">Норма: {r.ref}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: r.flag ? 'var(--warn)' : 'var(--text-primary)' }}>{r.value}</div>
                  {r.flag && <div style={{ fontSize: 10.5, color: 'var(--warn)', fontWeight: 700 }}>{r.flag === 'high' ? '↑ выше нормы' : '↓ ниже нормы'}</div>}
                </div>
              </div>
            ))}
          </div>
          <p className="faint" style={{ fontSize: 11.5, lineHeight: 1.5, marginTop: 10 }}>
            Результаты носят справочный характер. Интерпретацию даёт лечащий врач.
          </p>
        </div>
      ),
      actions: (
        <>
          <button className="btn btn-primary btn-block btn-lg" onClick={() => { closeSheet(); onBook(); }}><Icon name="calendar-check" size={20} /> Обсудить с врачом</button>
          <button className="btn btn-outline brand btn-block" onClick={() => { toast('PDF скачивается'); }}><Icon name="file" size={18} /> Скачать PDF</button>
        </>
      ),
    });
  }

  return (
    <div className="screen">
      <TopBar title="Мои анализы" onBack={onBack} />
      <div className="section" style={{ marginTop: 4 }}>
        <div className="eyebrow"><Icon name="flask" size={14} /> Лаборатория</div>
        <h1 className="section-title" style={{ fontSize: 23, marginTop: 6 }}>Мои <span className="serif">анализы</span></h1>
      </div>

      <div className="section" style={{ marginTop: 14 }}>
        <div className="segmented">
          <button className={tab === 'ready' ? 'active' : ''} onClick={() => setTab('ready')}>Готовые</button>
          <button className={tab === 'progress' ? 'active' : ''} onClick={() => setTab('progress')}>В работе</button>
        </div>
      </div>

      <div className="section" style={{ marginTop: 14 }}>
        {list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-ic"><Icon name="flask" size={30} /></div>
            <h3>{tab === 'ready' ? 'Нет готовых результатов' : 'Нет анализов в работе'}</h3>
            <p>Здесь появятся ваши результаты после сдачи анализов в клинике.</p>
          </div>
        ) : (
          <div className="wrap-gap">
            {list.map((l) => (
              <button key={l.id} className="card card-pad row between" style={{ width: '100%' }} onClick={() => openLab(l)} disabled={l.status !== 'ready'}>
                <div className="row" style={{ gap: 12 }}>
                  <span className={`quick-ic ${l.status === 'ready' ? 'teal' : 'gold'}`} style={{ width: 44, height: 44 }}>
                    <Icon name={l.status === 'ready' ? 'flask' : 'clock'} size={22} />
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{l.name}</div>
                    <div className="faint" style={{ fontSize: 12 }}>{l.tag} · {l.date}</div>
                  </div>
                </div>
                {l.status === 'ready'
                  ? <span className="badge ok">Готов</span>
                  : <span className="badge gold">В работе</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
