import { useState } from 'react';
import { TopBar } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { posts, type Post } from '../data/content';
import { openSheet, closeSheet } from '../lib/ui';

const TABS = [
  { id: 'all', label: 'Всё' },
  { id: 'news', label: 'Новости' },
  { id: 'article', label: 'Статьи' },
];

export function NewsScreen({ onBack, onBook }: { onBack: () => void; onBook: () => void }) {
  const [tab, setTab] = useState('all');
  const list = posts.filter((p) => tab === 'all' || p.kind === tab);

  function read(p: Post) {
    openSheet({
      title: p.title,
      subtitle: `${p.tag} · ${p.date}`,
      body: <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.65 }}>{p.body}</p>,
      actions: (
        <>
          <button className="btn btn-primary btn-block btn-lg" onClick={() => { closeSheet(); onBook(); }}><Icon name="calendar-check" size={20} /> Записаться на приём</button>
          <button className="btn btn-ghost btn-block" onClick={closeSheet}>Закрыть</button>
        </>
      ),
    });
  }

  return (
    <div className="screen">
      <TopBar title="Новости и статьи" onBack={onBack} />
      <div className="section" style={{ marginTop: 4 }}>
        <div className="eyebrow"><Icon name="file" size={14} /> Журнал клиники</div>
        <h1 className="section-title" style={{ fontSize: 23, marginTop: 6 }}>Новости и <span className="serif">статьи</span></h1>
      </div>

      <div className="chip-row" style={{ marginTop: 14 }}>
        {TABS.map((t) => (
          <button key={t.id} className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div className="section" style={{ marginTop: 14 }}>
        <div className="wrap-gap">
          {list.map((p) => (
            <button key={p.id} className="card card-pad" style={{ width: '100%', textAlign: 'left' }} onClick={() => read(p)}>
              <div className="row between" style={{ marginBottom: 8 }}>
                <span className={`badge ${p.kind === 'news' ? 'brand' : 'gold'}`}>{p.tag}</span>
                <span className="faint" style={{ fontSize: 11.5 }}>{p.date}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15.5, lineHeight: 1.3 }}>{p.title}</div>
              <div className="faint" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{p.excerpt}</div>
              <div className="section-link" style={{ marginTop: 10 }}>Читать <Icon name="arrow-right" size={14} /></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
