import { useMemo, useState } from 'react';
import { TopBar } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { departments, rub } from '../data/departments';

export function PricesScreen({ onBack, onBook }: { onBack: () => void; onBook: (p: { deptId?: string }) => void }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(departments[0].id);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return departments;
    return departments
      .map((d) => ({ ...d, services: d.services.filter((s) => (d.title + ' ' + s.name).toLowerCase().includes(t)) }))
      .filter((d) => d.services.length > 0 || d.title.toLowerCase().includes(t));
  }, [q]);

  return (
    <div className="screen">
      <TopBar title="Прайс-лист" onBack={onBack} />
      <div className="section" style={{ marginTop: 4 }}>
        <div className="eyebrow"><Icon name="file" size={14} /> Цены клиники</div>
        <h1 className="section-title" style={{ fontSize: 23, marginTop: 6 }}>Прайс-<span className="serif">лист</span></h1>
      </div>

      <div className="section" style={{ marginTop: 14 }}>
        <div className="input row" style={{ gap: 10, paddingInline: 14 }}>
          <Icon name="search" size={18} className="faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск услуги или направления"
            style={{ border: 'none', background: 'transparent', flex: 1, fontSize: 15, outline: 'none', height: 48 }} />
          {q && <button onClick={() => setQ('')} className="faint"><Icon name="x" size={18} /></button>}
        </div>
      </div>

      <div className="section" style={{ marginTop: 14 }}>
        <div className="wrap-gap">
          {list.map((d) => {
            const isOpen = open === d.id || !!q;
            return (
              <div className="list-card" key={d.id}>
                <button className="row between" style={{ width: '100%', padding: 14, gap: 12 }}
                  onClick={() => setOpen(isOpen && !q ? null : d.id)}>
                  <div className="row" style={{ gap: 12 }}>
                    <img src={d.img} alt="" style={{ width: 38, height: 38, objectFit: 'contain' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: 14.5 }}>{d.title}</div>
                      <div className="faint" style={{ fontSize: 11.5 }}>{d.services.length} услуг · от {rub(Math.min(...d.services.map((s) => s.price)))}</div>
                    </div>
                  </div>
                  <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size={18} className="faint" />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 16px 6px' }}>
                    {d.services.map((s) => (
                      <div className="svc-item" key={s.name} style={{ padding: '12px 0' }}>
                        <div className="grow">
                          <div className="svc-name" style={{ fontSize: 13.5 }}>{s.name}</div>
                          {s.note && <div className="svc-note">{s.note}</div>}
                        </div>
                        <div className="svc-price">{rub(s.price)}</div>
                      </div>
                    ))}
                    <button className="btn btn-outline brand btn-block btn-sm" style={{ margin: '4px 0 10px' }} onClick={() => onBook({ deptId: d.id })}>
                      Записаться на «{d.title}»
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="faint center" style={{ fontSize: 11, marginTop: 16, lineHeight: 1.5 }}>
          Цены ориентировочные. Точную стоимость уточняйте у администратора.
        </p>
      </div>
    </div>
  );
}
