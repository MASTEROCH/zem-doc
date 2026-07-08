import { useMemo, useState } from 'react';
import { TopBar } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { ImgFade } from '../components/Cards';
import { departments, findDept, rub } from '../data/departments';
import { doctors, doctorsByDept, findDoctor } from '../data/doctors';
import { toast } from '../lib/ui';
import { haptic } from '../lib/haptics';

export type BookingResult = {
  deptTitle: string; doctorName: string; dateLabel: string; dateKey: string; time: string; price: number; name: string;
};

const TIME_GROUPS = [
  { label: 'Утро', icon: 'sun' as const, times: ['09:00', '09:30', '10:00', '11:00', '11:30'] },
  { label: 'День', icon: 'clock' as const, times: ['12:00', '13:30', '14:00', '15:00'] },
  { label: 'Вечер', icon: 'clock' as const, times: ['15:30', '16:30', '17:00', '18:30', '19:00'] },
];
const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MO = ['янв', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const isBusy = (t: string) => ['11:00', '15:00', '18:30'].includes(t);

function buildDays(n: number) {
  const out: { key: string; wd: string; dd: number; mo: string; label: string; weekend: boolean }[] = [];
  const base = new Date();
  for (let i = 0; i < n; i++) {
    const dt = new Date(base); dt.setDate(base.getDate() + i);
    const wd = dt.getDay();
    out.push({
      key: dt.toISOString().slice(0, 10),
      wd: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : WD[wd],
      dd: dt.getDate(), mo: MO[dt.getMonth()],
      label: `${WD[wd]}, ${dt.getDate()} ${MO[dt.getMonth()]}`,
      weekend: wd === 0 || wd === 6,
    });
  }
  return out;
}

const STEP_TITLES = ['Выберите направление', 'Выберите врача', 'Выберите дату', 'Выберите время', 'Ваши контакты'];

export function BookingScreen({
  prefill, userName, onBack, onConfirm,
}: { prefill: { deptId?: string; doctorId?: string }; userName?: string; onBack: () => void; onConfirm: (r: BookingResult) => void }) {
  const initDept = prefill.deptId ?? (prefill.doctorId ? findDoctor(prefill.doctorId)?.deptIds[0] : undefined) ?? '';
  const initStep = prefill.doctorId ? 2 : prefill.deptId ? 1 : 0;
  const [step, setStep] = useState(initStep);
  const [maxStep, setMaxStep] = useState(initStep);
  const [deptId, setDeptId] = useState<string>(initDept);
  const [doctorId, setDoctorId] = useState<string>(prefill.doctorId ?? '');
  const [dayKey, setDayKey] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [name, setName] = useState(userName && userName !== 'Гость' ? userName : '');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [notify, setNotify] = useState(true);

  const days = useMemo(() => buildDays(14), []);
  const deptDoctors = useMemo(() => (deptId ? doctorsByDept(deptId) : doctors), [deptId]);
  const dept = deptId ? findDept(deptId) : undefined;
  const doctor = doctorId ? findDoctor(doctorId) : undefined;
  const selectedDay = days.find((d) => d.key === dayKey);
  const price = dept?.consult ?? (doctor && findDept(doctor.deptIds[0])?.consult) ?? 2000;

  const go = (s: number) => { setStep(s); setMaxStep((m) => Math.max(m, s)); };
  const advance = () => { haptic('light'); go(step + 1); };

  function pickDept(id: string) {
    setDeptId(id);
    if (doctorId && !findDept(id)?.doctorIds.includes(doctorId)) setDoctorId('');
    advance();
  }
  function pickDoctor(id: string) { setDoctorId(id); advance(); }
  function pickDay(k: string) { setDayKey(k); advance(); }
  function pickTime(t: string) { setTime(t); advance(); }

  function express() {
    haptic('medium');
    const d = deptId || 'therapy';
    setDeptId(d); setDoctorId('');
    setDayKey(days[0].key);
    setTime(TIME_GROUPS.flatMap((g) => g.times).find((t) => !isBusy(t)) || '09:00');
    go(4); setMaxStep(4);
    toast('Подобрали ближайшее окно ⚡', 'success');
  }

  const contactsOk = !!(name && phone.replace(/\D/g, '').length >= 10 && consent);

  function confirm() {
    if (name && phone.replace(/\D/g, '').length >= 10 && !consent) { toast('Подтвердите согласие на обработку данных'); return; }
    if (!contactsOk) { toast('Заполните имя и телефон'); return; }
    onConfirm({
      deptTitle: dept?.title ?? 'Приём', doctorName: doctor?.name ?? 'Любой свободный врач',
      dateLabel: selectedDay?.label ?? '', dateKey: dayKey, time, price, name,
    });
  }

  return (
    <div className="screen">
      <TopBar title="Онлайн-запись" onBack={() => (step === 0 ? onBack() : go(step - 1))} />

      <div className="steps">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`step-dot ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`} />
        ))}
      </div>

      {(deptId || doctorId || dayKey || time) && step > 0 && (
        <div className="book-ctx">
          {dept && <button className="ctx-chip filled" onClick={() => go(0)}><Icon name="stethoscope" size={13} className="ic" /> {dept.title}</button>}
          {step > 1 && <button className="ctx-chip" onClick={() => go(1)}><Icon name="user" size={13} className="ic" /> {doctor ? doctor.name.split(' ').slice(0, 2).join(' ') : 'Любой врач'}</button>}
          {selectedDay && step > 2 && <button className="ctx-chip" onClick={() => go(2)}><Icon name="calendar-check" size={13} className="ic" /> {selectedDay.wd}</button>}
          {time && step > 3 && <button className="ctx-chip" onClick={() => go(3)}><Icon name="clock" size={13} className="ic" /> {time}</button>}
        </div>
      )}

      <div className="section" style={{ marginTop: 12 }}>
        <div className="faint" style={{ fontSize: 12 }}>Шаг {step + 1} из 5</div>
        <h1 className="section-title" style={{ fontSize: 21, marginTop: 3 }}>{STEP_TITLES[step]}</h1>
      </div>

      {/* STEP 0 — direction */}
      {step === 0 && (
        <div className="section step-pane" style={{ marginTop: 8 }}>
          <button className="card card-pad row" style={{ width: '100%', gap: 12, marginBottom: 14, background: 'var(--grad-tint-gold)', border: '1px solid rgba(190,158,111,0.3)' }} onClick={express}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(155deg,var(--gold-bright),var(--gold-deep))', color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="bolt" size={22} /></span>
            <div className="grow" style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 14.5 }}>Записаться на ближайшее</div>
              <div className="faint" style={{ fontSize: 12 }}>Первое свободное окно — в один тап</div>
            </div>
            <Icon name="arrow-right" size={18} style={{ color: 'var(--gold-deep)' }} />
          </button>
          <div className="wrap-gap">
            {departments.map((d) => (
              <button key={d.id} className={`card card-pad row between ${deptId === d.id ? 'pick active' : ''}`} style={{ width: '100%' }} onClick={() => pickDept(d.id)}>
                <div className="row" style={{ gap: 12 }}>
                  <img src={d.img} alt="" style={{ width: 42, height: 42, objectFit: 'contain' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{d.title}</div>
                    <div className="faint" style={{ fontSize: 12 }}>{d.short}</div>
                  </div>
                </div>
                <div className="dept-from" style={{ textAlign: 'right' }}>от <b>{d.consult.toLocaleString('ru-RU')} ₽</b></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 — doctor */}
      {step === 1 && (
        <div className="section step-pane" style={{ marginTop: 8 }}>
          <button className={`pick ${doctorId === '' ? 'active' : ''}`} onClick={() => pickDoctor('')}>
            <span className="pick-radio">{doctorId === '' && <Icon name="check" size={14} strokeWidth={3} />}</span>
            <span className="quick-ic navy" style={{ width: 44, height: 44 }}><Icon name="users" size={22} /></span>
            <div className="grow"><div style={{ fontWeight: 700, fontSize: 14 }}>Любой свободный врач</div><div className="faint" style={{ fontSize: 12 }}>Подберём ближайшее время</div></div>
          </button>
          {deptDoctors.map((doc) => (
            <button key={doc.id} className={`pick ${doctorId === doc.id ? 'active' : ''}`} onClick={() => pickDoctor(doc.id)}>
              <span className="pick-radio">{doctorId === doc.id && <Icon name="check" size={14} strokeWidth={3} />}</span>
              <ImgFade className="doc-photo" src={doc.photo} alt="" />
              <div className="grow">
                <div style={{ fontWeight: 700, fontSize: 14 }}>{doc.name}</div>
                <div className="faint" style={{ fontSize: 12 }}>{doc.role} · {doc.experience} лет · <span style={{ color: 'var(--ok)', fontWeight: 600 }}>{doc.nextSlot}</span></div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* STEP 2 — date */}
      {step === 2 && (
        <div className="section step-pane" style={{ marginTop: 8 }}>
          <div className="slot-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {days.map((d) => (
              <button key={d.key} className={`day ${dayKey === d.key ? 'active' : ''}`} style={{ width: 'auto', height: 68, borderRadius: 16 }} onClick={() => pickDay(d.key)}>
                <div className="dw" style={{ fontSize: 10.5 }}>{d.wd}</div>
                <div className="dd">{d.dd}</div>
                <div className="dw" style={{ fontSize: 9.5, opacity: 0.7 }}>{d.mo}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 — time */}
      {step === 3 && (
        <div className="section step-pane" style={{ marginTop: 8 }}>
          <div className="wrap-gap">
            {TIME_GROUPS.map((g) => (
              <div key={g.label}>
                <div className="faint" style={{ fontSize: 11.5, margin: '2px 0 8px', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name={g.icon} size={13} /> {g.label}
                </div>
                <div className="slot-grid">
                  {g.times.map((t) => (
                    <button key={t} className={`slot ${time === t ? 'active' : ''}`} disabled={isBusy(t)} onClick={() => pickTime(t)}>{t}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4 — contacts */}
      {step === 4 && (
        <div className="section step-pane" style={{ marginTop: 8 }}>
          <div className="field">
            <label className="field-label">Ваше имя *</label>
            <input className="input" placeholder="Иван Иванов" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Телефон *</label>
            <input className="input" type="tel" inputMode="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Комментарий</label>
            <textarea className="input" placeholder="Что беспокоит, пожелания…" />
          </div>

          <div className="card card-pad" style={{ marginTop: 4 }}>
            <div className="section-title" style={{ fontSize: 15, marginBottom: 8 }}>Ваша запись</div>
            <div className="summary-row"><span className="k">Направление</span><span className="v">{dept?.title ?? '—'}</span></div>
            <div className="summary-row"><span className="k">Врач</span><span className="v">{doctor?.name ?? 'Любой свободный'}</span></div>
            <div className="summary-row"><span className="k">Дата и время</span><span className="v">{selectedDay?.label}, {time}</span></div>
            <div className="summary-total"><span className="k">Стоимость приёма</span><b>{rub(price)}</b></div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div className={`check-row ${consent ? 'on' : ''}`} onClick={() => setConsent(!consent)}>
              <span className="check-box">{consent && <Icon name="check" size={14} strokeWidth={3} />}</span>
              <span className="ct">Я согласен(а) на обработку персональных данных и принимаю <a onClick={(e) => e.stopPropagation()}>политику конфиденциальности</a> <span style={{ color: 'var(--danger)' }}>*</span></span>
            </div>
            <div className={`check-row ${notify ? 'on' : ''}`} onClick={() => setNotify(!notify)}>
              <span className="check-box">{notify && <Icon name="check" size={14} strokeWidth={3} />}</span>
              <span className="ct">Хочу получать напоминания о записи и важную информацию о приёме</span>
            </div>
          </div>
          <p className="faint center" style={{ fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>Оплата в клинике. Администратор подтвердит запись по телефону.</p>
        </div>
      )}

      {step === 4 ? (
        <div className="dock">
          <button className={`btn btn-block btn-lg ${contactsOk ? 'btn-primary' : 'btn-ghost'}`} onClick={confirm}>
            <Icon name="check" size={20} strokeWidth={2.6} /> Подтвердить запись · {rub(price)}
          </button>
        </div>
      ) : (
        <div className="dock" style={{ pointerEvents: 'none', background: 'none' }}>
          <div className="faint center" style={{ fontSize: 12 }}>
            {maxStep > step ? 'Нажмите на выбор выше, чтобы изменить' : 'Выберите вариант, чтобы продолжить'}
          </div>
        </div>
      )}
    </div>
  );
}
