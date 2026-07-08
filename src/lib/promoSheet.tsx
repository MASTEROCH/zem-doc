import { Icon } from '../components/Icon';
import { openSheet, closeSheet } from './ui';
import { rub } from '../data/departments';
import { findDoctor } from '../data/doctors';
import type { Promo } from '../data/clinic';

/** Красивая модалка-оффер: что входит · врач · когда · результат · Записаться */
export function openPromoSheet(p: Promo, cb: { onBook: (d?: { deptId?: string }) => void; onOpenDoctor: (id: string) => void }) {
  const doc = p.doctorId ? findDoctor(p.doctorId) : undefined;
  openSheet({
    title: p.title,
    subtitle: p.text,
    body: (
      <div>
        <div className="row" style={{ gap: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy)' }}>{rub(p.price)}</div>
          <s className="faint" style={{ fontSize: 15 }}>{rub(p.old)}</s>
          <span className="badge gold" style={{ marginLeft: 'auto' }}>{p.badge}</span>
        </div>

        <div className="field-label">Что входит</div>
        <div style={{ marginBottom: 14 }}>
          {p.includes.map((it) => (
            <div key={it} className="row" style={{ gap: 9, padding: '5px 0' }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--ok-soft)', color: 'var(--ok)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="check" size={13} strokeWidth={3} /></span>
              <span style={{ fontSize: 13.5 }}>{it}</span>
            </div>
          ))}
        </div>

        {doc && (
          <>
            <div className="field-label">Ведёт</div>
            <button className="zem-doc-sg" style={{ width: '100%', marginBottom: 14 }} onClick={() => { closeSheet(); cb.onOpenDoctor(doc.id); }}>
              <img src={doc.photo} alt="" />
              <div className="grow" style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{doc.name}</div>
                <div className="faint" style={{ fontSize: 11.5 }}>{doc.role} · стаж {doc.experience} лет</div>
              </div>
              <Icon name="chevron-right" size={18} className="faint" />
            </button>
          </>
        )}

        <div className="row" style={{ gap: 10, padding: '10px 0', borderTop: '1px solid var(--border-2)' }}>
          <Icon name="clock" size={18} style={{ color: 'var(--brand)' }} />
          <div><div className="faint" style={{ fontSize: 11 }}>Когда можно прийти</div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.when}</div></div>
        </div>
        <div className="row" style={{ gap: 10, padding: '10px 0', borderTop: '1px solid var(--border-2)' }}>
          <Icon name="award" size={18} style={{ color: 'var(--gold-deep)' }} />
          <div><div className="faint" style={{ fontSize: 11 }}>Результат</div><div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.4 }}>{p.result}</div></div>
        </div>
      </div>
    ),
    actions: (
      <>
        <button className="btn btn-primary btn-block btn-lg" onClick={() => { closeSheet(); cb.onBook({ deptId: p.deptId }); }}>
          <Icon name="calendar-check" size={20} /> Записаться · {rub(p.price)}
        </button>
        <button className="btn btn-ghost btn-block" onClick={closeSheet}>Закрыть</button>
      </>
    ),
  });
}
