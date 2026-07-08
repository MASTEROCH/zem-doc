import { AppHeader } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { DeptCard, DoctorMini, PromoCard } from '../components/Cards';
import { departments } from '../data/departments';
import { doctors } from '../data/doctors';
import { advantages, reviews, promos, ratingSources } from '../data/clinic';
import { toast } from '../lib/ui';
import { CountUpInt } from '../lib/useCountUp';

const QUICK = [
  { icon: 'calendar-check', label: 'Записаться', tone: 'brand' },
  { icon: 'users', label: 'Врачи', tone: 'navy' },
  { icon: 'flask', label: 'Анализы', tone: 'teal' },
  { icon: 'phone', label: 'Позвонить', tone: 'gold' },
] as const;

export function HomeScreen({
  onBook, onOpenDept, onDoctors, onDepartments, onOpenDoctor, onClinic,
}: {
  onBook: () => void; onOpenDept: (id: string) => void; onDoctors: () => void;
  onDepartments: () => void; onOpenDoctor: (id: string) => void; onClinic: () => void;
}) {
  const popular = departments.filter((d) => d.popular);
  const topDoctors = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const quickAction = (label: string) => {
    if (label === 'Записаться') onBook();
    else if (label === 'Врачи') onDoctors();
    else if (label === 'Анализы') onOpenDept('analyses');
    else if (label === 'Позвонить') { window.location.href = 'tel:+74012663030'; }
  };

  return (
    <div className="screen">
      <AppHeader action={{ icon: 'bell', onClick: () => toast('Уведомлений пока нет'), dot: true, label: 'Уведомления' }} />

      {/* HERO */}
      <div className="hero reveal">
        <div className="hero-card">
          <div className="hero-eyebrow"><Icon name="shield-check" size={14} /> Ваше здоровье — наш приоритет</div>
          <h1 className="hero-title">Забота о вас <span className="serif">каждый день</span></h1>
          <p className="hero-sub">Многопрофильный медцентр в Калининграде. 25 врачей, современная диагностика, запись за минуту.</p>
          <div className="hero-cta">
            <button className="btn btn-gold" onClick={onBook}><Icon name="calendar-check" size={18} /> Записаться</button>
            <button className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} onClick={onDepartments}>Направления</button>
          </div>
          <div className="hero-mini-stats">
            <div><div className="v"><CountUpInt value={16} /></div><div className="l">направлений</div></div>
            <div><div className="v"><CountUpInt value={25} /></div><div className="l">врачей</div></div>
            <div><div className="v">4.9<Icon name="star" size={12} fill="current" style={{ color: 'var(--gold-bright)', marginLeft: 3 }} /></div><div className="l">рейтинг</div></div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-row reveal reveal-2">
        {QUICK.map((q) => (
          <button className="quick" key={q.label} onClick={() => quickAction(q.label)}>
            <span className={`quick-ic ${q.tone}`}><Icon name={q.icon} size={22} /></span>
            <span className="quick-label">{q.label}</span>
          </button>
        ))}
      </div>

      {/* POPULAR DEPARTMENTS */}
      <div className="section">
        <div className="section-head">
          <div className="section-title">Популярные <span className="serif">направления</span></div>
          <button className="section-link" onClick={onDepartments}>Все 16 <Icon name="chevron-right" size={14} /></button>
        </div>
      </div>
      <div className="dept-scroll">
        {popular.map((d) => <DeptCard key={d.id} dept={d} onClick={() => onOpenDept(d.id)} />)}
      </div>

      {/* PROMOS */}
      <div className="section" style={{ marginTop: 22 }}>
        <div className="section-head"><div className="section-title">Акции и <span className="serif">комплексы</span></div></div>
      </div>
      <div className="promo-scroll">
        {promos.map((p) => <PromoCard key={p.id} p={p} onBook={onBook} />)}
      </div>

      {/* TOP DOCTORS */}
      <div className="section" style={{ marginTop: 22 }}>
        <div className="section-head">
          <div className="section-title">Наши <span className="serif">врачи</span></div>
          <button className="section-link" onClick={onDoctors}>Все 25 <Icon name="chevron-right" size={14} /></button>
        </div>
      </div>
      <div className="doc-hscroll">
        {topDoctors.map((d) => <DoctorMini key={d.id} doc={d} onClick={() => onOpenDoctor(d.id)} />)}
      </div>

      {/* ADVANTAGES */}
      <div className="section" style={{ marginTop: 24 }}>
        <div className="wrap-gap">
          {advantages.map((a) => (
            <div className="card card-pad row" key={a.title} style={{ gap: 14 }}>
              <span className="quick-ic brand" style={{ width: 46, height: 46 }}><Icon name={a.icon as any} size={24} /></span>
              <div className="grow">
                <div style={{ fontWeight: 700, fontSize: 15 }}>{a.title}</div>
                <div className="faint" style={{ fontSize: 12.5, marginTop: 2, lineHeight: 1.4 }}>{a.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RATINGS */}
      <div className="section">
        <div className="card card-pad">
          <div className="between" style={{ marginBottom: 4 }}>
            <div style={{ fontWeight: 700 }}>Нам доверяют</div>
            <div className="doc-rating"><Icon name="star" size={14} fill="current" /> 4.9</div>
          </div>
          <div className="row" style={{ gap: 0, marginTop: 10, justifyContent: 'space-between' }}>
            {ratingSources.map((r) => (
              <div key={r.name} className="center" style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)' }}>{r.value}</div>
                <div className="faint" style={{ fontSize: 11 }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="section" style={{ marginTop: 22 }}>
        <div className="section-head"><div className="section-title">Отзывы <span className="serif">пациентов</span></div></div>
      </div>
      <div className="review-scroll">
        {reviews.map((r) => (
          <div className="review-card" key={r.id}>
            <div className="review-top">
              <div><div className="review-who">{r.name}</div><div className="review-dept">{r.dept}</div></div>
              <span className="stars">{Array.from({ length: r.rating }).map((_, i) => <Icon key={i} name="star" size={13} fill="current" />)}</span>
            </div>
            <div className="review-text">{r.text}</div>
            <div className="review-date">{r.date}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="section" style={{ marginTop: 24 }}>
        <div className="cta-banner">
          <h3>Не знаете, к какому врачу?</h3>
          <p>Спросите dr.Zem — наш ИИ-помощник подберёт специалиста по симптомам за минуту.</p>
          <button className="btn btn-gold" onClick={onBook}><Icon name="calendar-check" size={18} /> Записаться на приём</button>
        </div>
      </div>

      {/* footer mini */}
      <div className="section" style={{ marginTop: 18 }}>
        <button className="card card-pad between" style={{ width: '100%' }} onClick={onClinic}>
          <div className="row" style={{ gap: 12 }}>
            <span className="contact-ic"><Icon name="pin" size={20} /></span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>ул. Космонавта Леонова, 74</div>
              <div className="faint" style={{ fontSize: 12 }}>Пн–Пт 09–20 · Сб–Вс 09–15</div>
            </div>
          </div>
          <Icon name="chevron-right" size={18} className="faint" />
        </button>
      </div>
    </div>
  );
}
