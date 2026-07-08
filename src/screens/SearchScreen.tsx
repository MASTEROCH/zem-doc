import { useMemo, useRef, useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { ImgFade } from '../components/Cards';
import { departments, findDept, rub } from '../data/departments';
import { doctors } from '../data/doctors';

const norm = (t: string) => t.toLowerCase().replace(/ё/g, 'е');

export function SearchScreen({
  onBack, onOpenDept, onOpenDoctor, onBook,
}: {
  onBack: () => void; onOpenDept: (id: string) => void; onOpenDoctor: (id: string) => void;
  onBook: (p: { deptId?: string }) => void;
}) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const t = norm(q.trim());
  const res = useMemo(() => {
    if (t.length < 2) return null;
    const depts = departments.filter((d) => norm(d.title + ' ' + d.short + ' ' + d.symptoms.join(' ')).includes(t)).slice(0, 6);
    const docs = doctors.filter((d) => norm(d.name + ' ' + d.role + ' ' + d.specialties.join(' ')).includes(t)).slice(0, 6);
    const services = departments.flatMap((d) => d.services.map((s) => ({ ...s, deptId: d.id, deptTitle: d.title })))
      .filter((s) => norm(s.name).includes(t)).slice(0, 8);
    return { depts, docs, services };
  }, [t]);

  const popular = departments.filter((d) => d.popular);
  const total = res ? res.depts.length + res.docs.length + res.services.length : 0;

  return (
    <div className="screen">
      <div className="topbar">
        <button className="back-btn" onClick={onBack} aria-label="Назад"><Icon name="arrow-back" size={20} /></button>
        <div className="input row" style={{ flex: 1, gap: 10, paddingInline: 14, height: 44 }}>
          <Icon name="search" size={18} className="faint" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Врач, направление, услуга…"
            style={{ border: 'none', background: 'transparent', flex: 1, fontSize: 15, outline: 'none', height: 42 }} />
          {q && <button onClick={() => setQ('')} className="faint" aria-label="Очистить"><Icon name="x" size={18} /></button>}
        </div>
      </div>

      {/* empty query → popular */}
      {!res && (
        <div className="section" style={{ marginTop: 14 }}>
          <div className="field-label">Популярные направления</div>
          <div className="tag-wrap">
            {popular.map((d) => (
              <button className="tag" key={d.id} onClick={() => onOpenDept(d.id)}>
                <span className="d" /> {d.title}
              </button>
            ))}
          </div>
          <div className="empty-state" style={{ paddingTop: 30 }}>
            <div className="empty-ic"><Icon name="search" size={30} /></div>
            <h3>Что ищем?</h3>
            <p>Введите название направления, имя врача или услугу — например «кардиолог» или «УЗИ».</p>
          </div>
        </div>
      )}

      {res && total === 0 && (
        <div className="empty-state" style={{ paddingTop: 50 }}>
          <div className="empty-ic"><Icon name="search" size={30} /></div>
          <h3>Ничего не найдено</h3>
          <p>Попробуйте другой запрос или спросите dr.Zem — он подберёт специалиста.</p>
        </div>
      )}

      {res && total > 0 && (
        <div className="section" style={{ marginTop: 12 }}>
          {res.depts.length > 0 && (
            <>
              <div className="field-label">Направления</div>
              <div className="wrap-gap" style={{ marginBottom: 16 }}>
                {res.depts.map((d) => (
                  <button className="card card-pad row between" key={d.id} onClick={() => onOpenDept(d.id)} style={{ width: '100%' }}>
                    <div className="row" style={{ gap: 12 }}>
                      <img src={d.img} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{d.title}</div>
                        <div className="faint" style={{ fontSize: 12 }}>{d.short} · от {rub(d.consult)}</div>
                      </div>
                    </div>
                    <Icon name="chevron-right" size={18} className="faint" />
                  </button>
                ))}
              </div>
            </>
          )}

          {res.docs.length > 0 && (
            <>
              <div className="field-label">Врачи</div>
              <div className="wrap-gap" style={{ marginBottom: 16 }}>
                {res.docs.map((d) => (
                  <button className="card card-pad row between" key={d.id} onClick={() => onOpenDoctor(d.id)} style={{ width: '100%' }}>
                    <div className="row" style={{ gap: 12 }}>
                      <ImgFade className="doc-photo" src={d.photo} alt="" />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                        <div className="faint" style={{ fontSize: 12 }}>{d.role} · {d.experience} лет</div>
                      </div>
                    </div>
                    <Icon name="chevron-right" size={18} className="faint" />
                  </button>
                ))}
              </div>
            </>
          )}

          {res.services.length > 0 && (
            <>
              <div className="field-label">Услуги</div>
              <div className="list-card">
                {res.services.map((s, i) => (
                  <button className="svc-item" key={s.name + i} style={{ width: '100%', padding: '13px 16px' }} onClick={() => onOpenDept(s.deptId)}>
                    <div className="grow" style={{ textAlign: 'left' }}>
                      <div className="svc-name">{s.name}</div>
                      <div className="faint" style={{ fontSize: 11.5 }}>{s.deptTitle}</div>
                    </div>
                    <div className="svc-price">{rub(s.price)}</div>
                    <span className="btn btn-outline brand btn-sm" onClick={(e) => { e.stopPropagation(); onBook({ deptId: s.deptId }); }}>Запись</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
