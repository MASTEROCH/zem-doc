import { useMemo, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { DoctorRow } from '../components/Cards';
import { doctors } from '../data/doctors';

export function DoctorsScreen({
  onOpenDoctor, onBook,
}: { onOpenDoctor: (id: string) => void; onBook: (p: { doctorId?: string }) => void }) {
  const [spec, setSpec] = useState('Все');
  const [q, setQ] = useState('');

  const specs = useMemo(() => {
    const count = new Map<string, number>();
    doctors.forEach((d) => d.specialties.forEach((s) => count.set(s, (count.get(s) ?? 0) + 1)));
    const sorted = [...count.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s);
    return ['Все', ...sorted];
  }, []);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return doctors.filter((d) => {
      if (spec !== 'Все' && !d.specialties.includes(spec)) return false;
      if (!t) return true;
      return (d.name + ' ' + d.role + ' ' + d.specialties.join(' ')).toLowerCase().includes(t);
    });
  }, [spec, q]);

  return (
    <div className="screen">
      <AppHeader />
      <div className="section" style={{ marginTop: 6 }}>
        <div className="eyebrow"><Icon name="users" size={14} /> {doctors.length} специалистов</div>
        <h1 className="section-title" style={{ fontSize: 23, marginTop: 6 }}>Наши <span className="serif">врачи</span></h1>
      </div>

      <div className="section" style={{ marginTop: 14 }}>
        <div className="input row" style={{ gap: 10, paddingInline: 14 }}>
          <Icon name="search" size={18} className="faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Имя врача или специальность"
            style={{ border: 'none', background: 'transparent', flex: 1, fontSize: 15, outline: 'none', height: 48 }} />
          {q && <button onClick={() => setQ('')} className="faint"><Icon name="x" size={18} /></button>}
        </div>
      </div>

      <div className="chip-row" style={{ marginTop: 14 }}>
        {specs.map((s) => (
          <button key={s} className={`chip ${spec === s ? 'active' : ''}`} onClick={() => setSpec(s)}>{s}</button>
        ))}
      </div>

      <div className="section" style={{ marginTop: 14 }}>
        <div className="faint" style={{ fontSize: 12, marginBottom: 10 }}>{list.length} врачей</div>
        <div className="wrap-gap">
          {list.map((d) => <DoctorRow key={d.id} doc={d} onClick={() => onOpenDoctor(d.id)} />)}
        </div>
      </div>

      {list.length === 0 && (
        <div className="empty-state">
          <div className="empty-ic"><Icon name="search" size={32} /></div>
          <h3>Врачи не найдены</h3>
          <p>Попробуйте изменить запрос или выбрать другую специальность.</p>
        </div>
      )}
    </div>
  );
}
