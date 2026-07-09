import { TopBar } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { DoctorRow } from '../components/Cards';
import { findDept, rub } from '../data/departments';
import { doctorsByDept } from '../data/doctors';

export function DepartmentScreen({
  deptId, onBack, onBook, onOpenDoctor, isFav, onToggleFav,
}: {
  deptId: string; onBack: () => void; onBook: (p: { deptId?: string }) => void;
  onOpenDoctor: (id: string) => void; isFav: boolean; onToggleFav: () => void;
}) {
  const d = findDept(deptId);
  if (!d) return null;
  const docs = doctorsByDept(deptId);

  return (
    <div className="screen">
      <TopBar onBack={onBack} right={
        <button className="back-btn" onClick={onToggleFav} aria-label="В избранное" style={{ color: isFav ? 'var(--danger)' : 'var(--text-secondary)' }}>
          <Icon name={isFav ? 'heart-filled' : 'heart'} size={19} />
        </button>
      } />

      {/* hero */}
      <div className="dept-hero reveal">
        <div className="eyebrow gold" style={{ justifyContent: 'center' }}>Направление</div>
        <img className="dept-hero-icon" src={d.img} alt="" />
        <h1>{d.title}</h1>
        <p className="lead">{d.intro}</p>
      </div>

      {/* when to come */}
      <div className="section">
        <div className="section-head" style={{ marginBottom: 10 }}><div className="section-title" style={{ fontSize: 18 }}>Когда обращаться</div></div>
        <div className="tag-wrap">
          {d.symptoms.map((s) => (
            <span className="tag" key={s}><span className="d" /> {s}</span>
          ))}
        </div>
      </div>

      {/* services / prices */}
      <div className="section">
        <div className="section-head" style={{ marginBottom: 10 }}>
          <div className="section-title" style={{ fontSize: 18 }}>Услуги и цены</div>
          <span className="faint" style={{ fontSize: 12 }}>{d.services.length} услуг</span>
        </div>
        <div className="list-card">
          {d.services.map((s) => (
            <div className="svc-item" key={s.name}>
              <div className="grow">
                <div className="svc-name">{s.name}</div>
                {s.note && <div className="svc-note">{s.note}</div>}
              </div>
              <div className="svc-price">{rub(s.price)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* doctors */}
      {docs.length > 0 && (
        <div className="section">
          <div className="section-head" style={{ marginBottom: 10 }}>
            <div className="section-title" style={{ fontSize: 18 }}>Врачи направления</div>
            <span className="faint" style={{ fontSize: 12 }}>{docs.length}</span>
          </div>
          <div className="wrap-gap">
            {docs.map((doc) => <DoctorRow key={doc.id} doc={doc} onClick={() => onOpenDoctor(doc.id)} />)}
          </div>
        </div>
      )}

      {/* info note */}
      <div className="section">
        <div className="card card-pad row" style={{ gap: 12, background: 'var(--brand-soft)', border: 'none' }}>
          <Icon name="info" size={20} style={{ color: 'var(--brand)', flexShrink: 0 }} />
          <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
            Не уверены, нужна ли эта услуга? Спросите <b>dr.Zem</b> или начните с приёма терапевта.
          </div>
        </div>
      </div>

      {/* dock CTA */}
      <div className="dock">
        <button className="btn btn-primary btn-block btn-lg" onClick={() => onBook({ deptId })}>
          <Icon name="calendar-check" size={20} /> Записаться · от {rub(d.consult)}
        </button>
      </div>
    </div>
  );
}
