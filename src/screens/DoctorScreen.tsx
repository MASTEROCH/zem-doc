import { useState } from 'react';
import { TopBar } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { Stars } from '../components/Cards';
import { findDoctor } from '../data/doctors';
import { findDept, rub } from '../data/departments';
import { openLightbox, openSheet, closeSheet, toast } from '../lib/ui';
import { haptic } from '../lib/haptics';

type Review = { name: string; text: string; stars: number; fresh?: boolean };
const BASE_REVIEWS: Review[] = [
  { name: 'Елена', text: 'Внимательный и грамотный врач. Всё подробно объяснил, назначил понятное лечение. Спасибо!', stars: 5 },
  { name: 'Сергей', text: 'Очень доволен приёмом — доброжелательно, профессионально, без лишних назначений.', stars: 5 },
];

function ReviewForm({ onSubmit }: { onSubmit: (r: Review) => void }) {
  const [stars, setStars] = useState(5);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  return (
    <div>
      <div className="row" style={{ justifyContent: 'center', gap: 8, padding: '6px 0 16px' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => { haptic('light'); setStars(n); }} aria-label={`${n} из 5`} style={{ padding: 4 }}>
            <Icon name="star" size={30} fill={n <= stars ? 'current' : 'none'}
              style={{ color: n <= stars ? 'var(--gold)' : 'var(--text-hint)', transition: 'transform 0.15s var(--ease-spring)', transform: n === stars ? 'scale(1.15)' : 'none' }} />
          </button>
        ))}
      </div>
      <div className="field">
        <label className="field-label">Ваше имя</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Как вас зовут" />
      </div>
      <div className="field">
        <label className="field-label">Отзыв</label>
        <textarea className="input" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Поделитесь впечатлением о приёме…" style={{ height: 'auto', paddingTop: 12 }} />
      </div>
      <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 6 }} disabled={!text.trim()}
        onClick={() => { onSubmit({ name: name.trim() || 'Пациент', text: text.trim(), stars, fresh: true }); }}>
        <Icon name="check" size={18} strokeWidth={2.6} /> Отправить отзыв
      </button>
    </div>
  );
}

export function DoctorScreen({
  doctorId, onBack, onBook, onOpenDept,
}: {
  doctorId: string; onBack: () => void;
  onBook: (p: { doctorId?: string }) => void; onOpenDept: (id: string) => void;
}) {
  const [reviews, setReviews] = useState<Review[]>(BASE_REVIEWS);
  const d = findDoctor(doctorId);
  if (!d) return null;
  const depts = d.deptIds.map(findDept).filter(Boolean);

  const leaveReview = () => openSheet({
    title: 'Оставить отзыв',
    subtitle: d.name,
    body: <ReviewForm onSubmit={(r) => { setReviews((prev) => [r, ...prev]); closeSheet(); haptic('success'); toast('Спасибо! Ваш отзыв опубликован', 'success'); }} />,
  });

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
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{d.experience} лет</div>
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
        <div className="section-title" style={{ fontSize: 18, marginBottom: 8 }}>О враче</div>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>{d.bio}</p>
      </div>

      {/* specialties */}
      <div className="section">
        <div className="section-title" style={{ fontSize: 18, marginBottom: 10 }}>Специализация</div>
        <div className="tag-wrap">
          {d.specialties.map((s) => <span className="tag" key={s}><span className="d" style={{ background: 'var(--gold)' }} /> {s}</span>)}
        </div>
      </div>

      {/* departments */}
      {depts.length > 0 && (
        <div className="section">
          <div className="section-title" style={{ fontSize: 18, marginBottom: 10 }}>Ведёт направления</div>
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

      {/* schedule */}
      <div className="section">
        <div className="section-title" style={{ fontSize: 18, marginBottom: 10 }}>График приёма</div>
        <div className="tag-wrap">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day, i) => (
            <span className="tag" key={day} style={{ opacity: i === 5 ? 0.45 : 1 }}>
              <Icon name="clock" size={13} style={{ color: 'var(--brand)' }} /> {day}
            </span>
          ))}
        </div>
        <div className="card card-pad row" style={{ gap: 12, marginTop: 12, background: 'var(--ok-soft)', border: 'none' }}>
          <Icon name="calendar-check" size={20} style={{ color: 'var(--ok)', flexShrink: 0 }} />
          <div className="grow">
            <div style={{ fontWeight: 700, fontSize: 14 }}>Ближайшее свободное окно</div>
            <div className="faint" style={{ fontSize: 12 }}>{d.nextSlot}</div>
          </div>
          <button className="btn btn-outline brand btn-sm" onClick={() => onBook({ doctorId })}>Выбрать</button>
        </div>
      </div>

      {/* education / regalia */}
      <div className="section">
        <div className="section-title" style={{ fontSize: 18, marginBottom: 10 }}>Образование и опыт</div>
        <div className="list-card">
          {[
            d.category ? `Квалификация — ${d.category}` : 'Сертифицированный специалист',
            `Стаж работы — ${d.experience} лет`,
            'Регулярное повышение квалификации, профильные конференции',
            'Индивидуальный подход, приём взрослых пациентов',
          ].map((t) => (
            <div className="contact-item" key={t}>
              <span className="menu-ic"><Icon name="award" size={18} /></span>
              <div className="grow" style={{ fontSize: 13.5, lineHeight: 1.4 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* reviews */}
      <div className="section">
        <div className="section-head" style={{ marginBottom: 10 }}>
          <div className="section-title" style={{ fontSize: 18 }}>Отзывы</div>
          <span className="faint" style={{ fontSize: 12 }}>{d.reviews} отзывов</span>
        </div>
        <div className="wrap-gap">
          {reviews.map((r, i) => (
            <div className="card card-pad" key={r.name + i} style={r.fresh ? { animation: 'reveal 0.5s var(--ease-out) both', borderColor: 'rgba(190,158,111,0.4)' } : undefined}>
              <div className="between" style={{ marginBottom: 6 }}>
                <div className="row" style={{ gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{r.name}</div>
                  {r.fresh && <span className="badge gold">Новый</span>}
                </div>
                <Stars n={r.stars} size={12} />
              </div>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{r.text}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-outline brand btn-block" style={{ marginTop: 12 }} onClick={leaveReview}>
          <Icon name="star" size={17} /> Оставить отзыв
        </button>
      </div>

      <div className="dock">
        <button className="btn btn-primary btn-block btn-lg" onClick={() => onBook({ doctorId })}>
          <Icon name="calendar-check" size={20} /> Записаться к врачу
        </button>
      </div>
    </div>
  );
}
