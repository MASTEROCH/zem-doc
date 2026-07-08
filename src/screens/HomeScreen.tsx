import { useRef } from 'react';
import { AppHeader } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { DeptCard, DoctorMini, PromoCard } from '../components/Cards';
import { departments } from '../data/departments';
import { doctors, findDoctor } from '../data/doctors';
import { advantages, reviews, promos, ratingSources, type Promo } from '../data/clinic';
import { rub } from '../data/departments';
import { toast, openSheet, closeSheet } from '../lib/ui';
import { openZem } from '../lib/zem';
import { ZemFace } from '../components/DrZem';
import { CountUpInt } from '../lib/useCountUp';
import { useAutoScroll } from '../lib/useAutoScroll';

const QUICK = [
  { icon: 'calendar-check', label: 'Записаться', tone: 'brand' },
  { icon: 'users', label: 'Врачи', tone: 'navy' },
  { icon: 'flask', label: 'Анализы', tone: 'teal' },
  { icon: 'phone', label: 'Позвонить', tone: 'gold' },
] as const;

export function HomeScreen({
  onBook, onOpenDept, onDoctors, onDepartments, onOpenDoctor, onClinic, onSearch,
}: {
  onBook: () => void; onOpenDept: (id: string) => void; onDoctors: () => void;
  onDepartments: () => void; onOpenDoctor: (id: string) => void; onClinic: () => void; onSearch: () => void;
}) {
  const popular = departments.filter((d) => d.popular);
  const topDoctors = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const deptRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const revRef = useRef<HTMLDivElement>(null);
  useAutoScroll(deptRef, 0.30);
  useAutoScroll(promoRef, 0.32);
  useAutoScroll(docRef, 0.28);
  useAutoScroll(revRef, 0.3);

  const quickAction = (label: string) => {
    if (label === 'Записаться') onBook();
    else if (label === 'Врачи') onDoctors();
    else if (label === 'Анализы') onOpenDept('analyses');
    else window.location.href = 'tel:+74012663030';
  };

  function openPromo(p: Promo) {
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
              <button className="zem-doc-sg" style={{ width: '100%', marginBottom: 14 }} onClick={() => { closeSheet(); onOpenDoctor(doc.id); }}>
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
          <button className="btn btn-primary btn-block btn-lg" onClick={() => { closeSheet(); onBook(); }}>
            <Icon name="calendar-check" size={20} /> Записаться · {rub(p.price)}
          </button>
          <button className="btn btn-ghost btn-block" onClick={closeSheet}>Закрыть</button>
        </>
      ),
    });
  }

  return (
    <div className="screen">
      <AppHeader onSearch={onSearch} action={{ icon: 'bell', onClick: () => toast('Уведомлений пока нет'), dot: true, label: 'Уведомления' }} />

      {/* HERO */}
      <div className="hero reveal">
        <div className="hero-card">
          <div className="hero-eyebrow"><Icon name="shield-check" size={14} /> Ваше здоровье — наш приоритет</div>
          <h1 className="hero-title">Забота о вас <span className="serif">каждый день</span></h1>
          <p className="hero-sub">Многопрофильный медцентр в Калининграде. 25 врачей, современная диагностика, запись за минуту.</p>
          <div className="hero-cta">
            <button className="btn btn-gold" onClick={onBook}><Icon name="calendar-check" size={18} /> Записаться</button>
            <button className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }} onClick={onDepartments}>Направления</button>
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

      {/* dr.Zem entry strip */}
      <div className="section" style={{ marginTop: 20 }}>
        <button className="card card-pad row" style={{ width: '100%', gap: 12, textAlign: 'left', background: 'var(--grad-tint-brand)' }} onClick={() => openZem()}>
          <span className="zem-inline"><ZemFace emotion="hi" /></span>
          <div className="grow">
            <div style={{ fontWeight: 800, fontSize: 15 }}>Спросите dr.Zem</div>
            <div className="faint" style={{ fontSize: 12.5 }}>ИИ-приёмная: подберёт врача, ответит на вопросы</div>
          </div>
          <Icon name="message" size={20} style={{ color: 'var(--brand)' }} />
        </button>
      </div>

      {/* POPULAR DEPARTMENTS */}
      <div className="section">
        <div className="section-head">
          <div className="section-title">Популярные <span className="serif">направления</span></div>
          <button className="section-link" onClick={onDepartments}>Все 16 <Icon name="chevron-right" size={14} /></button>
        </div>
      </div>
      <div className="dept-scroll edge-fade auto-scroll" ref={deptRef}>
        {[...popular, ...popular].map((d, i) => <DeptCard key={d.id + '-' + i} dept={d} onClick={() => onOpenDept(d.id)} />)}
      </div>

      {/* PROMOS — auto-marquee */}
      <div className="section" style={{ marginTop: 22 }}>
        <div className="section-head"><div className="section-title">Акции и <span className="serif">комплексы</span></div></div>
      </div>
      <div className="promo-scroll edge-fade auto-scroll" ref={promoRef}>
        {promos.map((p) => <PromoCard key={p.id} p={p} onOpen={openPromo} />)}
        {promos.map((p) => <PromoCard key={p.id + '-2'} p={p} onOpen={openPromo} />)}
      </div>

      {/* TOP DOCTORS — auto-marquee */}
      <div className="section" style={{ marginTop: 22 }}>
        <div className="section-head">
          <div className="section-title">Наши <span className="serif">врачи</span></div>
          <button className="section-link" onClick={onDoctors}>Все 25 <Icon name="chevron-right" size={14} /></button>
        </div>
      </div>
      <div className="doc-hscroll edge-fade auto-scroll" ref={docRef}>
        {[...topDoctors, ...topDoctors].map((d, i) => <DoctorMini key={d.id + '-' + i} doc={d} onClick={() => onOpenDoctor(d.id)} />)}
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

      {/* REVIEWS — auto-marquee */}
      <div className="section" style={{ marginTop: 22 }}>
        <div className="section-head"><div className="section-title">Отзывы <span className="serif">пациентов</span></div></div>
      </div>
      <div className="review-scroll edge-fade auto-scroll" ref={revRef}>
        {[...reviews, ...reviews].map((r, ri) => (
          <div className="review-card" key={r.id + '-' + ri}>
            <div className="review-top">
              <div><div className="review-who">{r.name}</div><div className="review-dept">{r.dept}</div></div>
              <span className="stars">{Array.from({ length: r.rating }).map((_, i) => <Icon key={i} name="star" size={13} fill="current" />)}</span>
            </div>
            <div className="review-text">{r.text}</div>
            <div className="review-date">{r.date}</div>
          </div>
        ))}
      </div>

      {/* CTA → dr.Zem */}
      <div className="section" style={{ marginTop: 24 }}>
        <div className="cta-banner">
          <h3>Не знаете, к какому врачу?</h3>
          <p>Спросите dr.Zem — ИИ-приёмная подберёт специалиста по симптомам за минуту.</p>
          <button className="btn btn-gold" onClick={() => openZem()}><Icon name="sparkle-ai" size={18} /> Спросить dr.Zem</button>
        </div>
      </div>

      {/* clinic link */}
      <div className="section" style={{ marginTop: 18 }}>
        <button className="card card-pad between" style={{ width: '100%' }} onClick={onClinic}>
          <div className="row" style={{ gap: 12 }}>
            <span className="contact-ic"><Icon name="info" size={20} /></span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>О клинике и контакты</div>
              <div className="faint" style={{ fontSize: 12 }}>Адрес, часы, карта, вопросы</div>
            </div>
          </div>
          <Icon name="chevron-right" size={18} className="faint" />
        </button>
      </div>
    </div>
  );
}
