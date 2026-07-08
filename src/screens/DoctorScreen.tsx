import { TopBar } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { Stars } from '../components/Cards';
import { findDoctor } from '../data/doctors';
import { findDept, rub } from '../data/departments';
import { openLightbox } from '../lib/ui';

export function DoctorScreen({
  doctorId, onBack, onBook, onOpenDept,
}: {
  doctorId: string; onBack: () => void;
  onBook: (p: { doctorId?: string }) => void; onOpenDept: (id: string) => void;
}) {
  const d = findDoctor(doctorId);
  if (!d) return null;
  const depts = d.deptIds.map(findDept).filter(Boolean);

  return (
    <div className="screen">
      <TopBar onBack={onBack} />

      <div className="section" style={{ marginTop: 2 }}>
        <div className="card card-pad reveal">
          <div className="row" style={{ gap: 16, alignItems: 'flex-start' }}>
            <img className="doc-photo lg" src={d.photo} alt={d.name} onClick={() => openLightbox(d.photo, d.name)} style={{ cursor: 'zoom-in' }} />
            <div className="grow">
              <div className="doc-name" style={{ fontSize: 18 }}>{d.name}</div>
              <div className="doc-role" style={{ fontSize: 13, marginTop: 4 }}>{d.role}</div>
              {d.category && <div className="doc-cat" style={{ marginTop: 8 }}><Icon name="award" size={13} /> {d.category}</div>}
            </div>
          </div>
          <div className="row" style={{ gap: 0, marginTop: 16, justifyContent: 'space-between' }}>
            <div className="center" style={{ flex: 1 }}>
              <div className="row" style={{ justifyContent: 'center', gap: 5 }}><Stars n={Math.round(d.rating)} size={13} /></div>
              <div className="faint" style={{ fontSize: 11, marginTop: 3 }}>{d.rating.toFixed(1)} · {d.reviews} отзывов</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
            <div className="center" style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy)' }}>{d.experience} лет</div>
              <div className="faint" style={{ fontSize: 11, marginTop: 3 }}>стаж</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
            <div className="center" style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ok)' }}>{d.nextSlot}</div>
              <div className="faint" style={{ fontSize: 11, marginTop: 3 }}>ближайшая</div>
            </div>
          </div>
        </div>
      </div>

      {/* bio */}
      <div className="section">
        <div className="section-title" style={{ fontSize: 17, marginBottom: 8 }}>О враче</div>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>{d.bio}</p>
      </div>

      {/* specialties */}
      <div className="section">
        <div className="section-title" style={{ fontSize: 17, marginBottom: 10 }}>Специализация</div>
        <div className="tag-wrap">
          {d.specialties.map((s) => <span className="tag" key={s}><span className="d" style={{ background: 'var(--gold)' }} /> {s}</span>)}
        </div>
      </div>

      {/* departments */}
      {depts.length > 0 && (
        <div className="section">
          <div className="section-title" style={{ fontSize: 17, marginBottom: 10 }}>Ведёт направления</div>
          <div className="wrap-gap">
            {depts.map((dep) => (
              <button className="card card-pad row between" key={dep!.id} onClick={() => onOpenDept(dep!.id)} style={{ width: '100%' }}>
                <div className="row" style={{ gap: 12 }}>
                  <img src={dep!.img} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{dep!.title}</div>
                    <div className="faint" style={{ fontSize: 12 }}>от {rub(dep!.consult)}</div>
                  </div>
                </div>
                <Icon name="chevron-right" size={18} className="faint" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="dock">
        <button className="btn btn-primary btn-block btn-lg" onClick={() => onBook({ doctorId })}>
          <Icon name="calendar-check" size={20} /> Записаться к врачу
        </button>
      </div>
    </div>
  );
}
