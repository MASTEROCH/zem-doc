import { useMemo, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { DeptCard } from '../components/Cards';
import { departments, GROUPS } from '../data/departments';

export function DepartmentsScreen({
  onOpenDept, favorites, onToggleFav,
}: { onOpenDept: (id: string) => void; favorites: Set<string>; onToggleFav: (id: string) => void }) {
  const [group, setGroup] = useState<string>('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return departments.filter((d) => {
      if (group === 'fav' && !favorites.has(d.id)) return false;
      if (group !== 'all' && group !== 'fav' && d.group !== group) return false;
      if (!t) return true;
      return (d.title + ' ' + d.short + ' ' + d.symptoms.join(' ')).toLowerCase().includes(t);
    });
  }, [group, q, favorites]);

  return (
    <div className="screen">
      <AppHeader />
      <div className="section" style={{ marginTop: 6 }}>
        <div className="eyebrow"><Icon name="stethoscope" size={14} /> 16 направлений</div>
        <h1 className="section-title" style={{ fontSize: 24, marginTop: 6 }}>Направления <span className="serif">лечения</span></h1>
      </div>

      {/* search */}
      <div className="section" style={{ marginTop: 14 }}>
        <div className="input row" style={{ gap: 10, paddingInline: 14 }}>
          <Icon name="search" size={18} className="faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск: сердце, УЗИ, анализы…"
            style={{ border: 'none', background: 'transparent', flex: 1, fontSize: 15, outline: 'none', height: 48 }} />
          {q && <button onClick={() => setQ('')} className="faint"><Icon name="x" size={18} /></button>}
        </div>
      </div>

      {/* group chips */}
      <div className="chip-row" style={{ marginTop: 14 }}>
        {GROUPS.map((g) => (
          <button key={g.id} className={`chip ${group === g.id ? 'active' : ''}`} onClick={() => setGroup(g.id)}>{g.label}</button>
        ))}
        <button className={`chip ${group === 'fav' ? 'active' : ''}`} onClick={() => setGroup(group === 'fav' ? 'all' : 'fav')}>
          <Icon name="heart" size={14} fill={group === 'fav' ? 'current' : 'none'} /> Избранное
        </button>
      </div>

      {/* grid */}
      <div className="dept-grid" style={{ marginTop: 16 }}>
        {list.map((d) => (
          <div key={d.id} style={{ position: 'relative' }}>
            <DeptCard dept={d} onClick={() => onOpenDept(d.id)} />
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFav(d.id); }}
              aria-label="В избранное"
              style={{
                position: 'absolute', top: 10, left: 10, width: 30, height: 30, borderRadius: '50%',
                display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(6px)', border: '1px solid var(--border)', color: favorites.has(d.id) ? 'var(--danger)' : 'var(--text-faint)',
              }}
            >
              <Icon name={favorites.has(d.id) ? 'heart-filled' : 'heart'} size={15} />
            </button>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="center faint" style={{ padding: 40, fontSize: 14 }}>
          <Icon name="search" size={32} style={{ opacity: 0.4, marginBottom: 8 }} />
          <div>Ничего не найдено</div>
        </div>
      )}
    </div>
  );
}
