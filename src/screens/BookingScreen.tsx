import { useMemo, useState } from 'react';
import { TopBar } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { departments, findDept, rub } from '../data/departments';
import { doctors, doctorsByDept, findDoctor } from '../data/doctors';
import { toast } from '../lib/ui';

export type BookingResult = {
  deptTitle: string; doctorName: string; dateLabel: string; time: string; price: number; name: string;
};

const TIMES = ['09:00', '09:30', '10:00', '11:00', '11:30', '12:00', '14:00', '15:00', '15:30', '16:30', '17:00', '18:30'];
const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MO = ['янв', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function buildDays(n: number) {
  const out: { key: string; wd: string; dd: number; label: string; weekend: boolean }[] = [];
  const base = new Date();
  for (let i = 0; i < n; i++) {
    const dt = new Date(base);
    dt.setDate(base.getDate() + i);
    const wd = dt.getDay();
    out.push({
      key: dt.toISOString().slice(0, 10),
      wd: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : WD[wd],
      dd: dt.getDate(),
      label: `${WD[wd]}, ${dt.getDate()} ${MO[dt.getMonth()]}`,
      weekend: wd === 0 || wd === 6,
    });
  }
  return out;
}

export function BookingScreen({
  prefill, onBack, onConfirm,
}: { prefill: { deptId?: string; doctorId?: string }; onBack: () => void; onConfirm: (r: BookingResult) => void }) {
  const initDept = prefill.deptId ?? (prefill.doctorId ? findDoctor(prefill.doctorId)?.deptIds[0] : undefined) ?? '';
  const [step, setStep] = useState(0);
  const [deptId, setDeptId] = useState<string>(initDept);
  const [doctorId, setDoctorId] = useState<string>(prefill.doctorId ?? '');
  const [dayKey, setDayKey] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const days = useMemo(() => buildDays(14), []);
  const deptDoctors = useMemo(() => (deptId ? doctorsByDept(deptId) : doctors), [deptId]);
  const dept = deptId ? findDept(deptId) : undefined;
  const doctor = doctorId ? findDoctor(doctorId) : undefined;
  const selectedDay = days.find((d) => d.key === dayKey);
  const price = dept?.consult ?? (doctor && findDept(doctor.deptIds[0])?.consult) ?? 2000;

  const canNext = step === 0 ? !!deptId : step === 1 ? !!(dayKey && time) : !!(name && phone.length >= 6);

  function next() {
    if (!canNext) { toast('Заполните обязательные поля'); return; }
    if (step < 2) setStep(step + 1);
    else {
      onConfirm({
        deptTitle: dept?.title ?? 'Приём',
        doctorName: doctor?.name ?? 'Любой свободный врач',
        dateLabel: selectedDay?.label ?? '',
        time, price, name,
      });
    }
  }

  return (
    <div className="screen">
      <TopBar title="Онлайн-запись" onBack={() => (step === 0 ? onBack() : setStep(step - 1))} />

      {(dept || doctor || selectedDay) && (
        <div className="book-ctx">
          {dept && <span className="ctx-chip filled"><Icon name="stethoscope" size={13} className="ic" /> {dept.title}</span>}
          <span className="ctx-chip"><Icon name="user" size={13} className="ic" /> {doctor ? doctor.name.split(' ').slice(0, 2).join(' ') : 'Любой врач'}</span>
          {selectedDay && <span className="ctx-chip"><Icon name="calendar-check" size={13} className="ic" /> {selectedDay.label}{time ? `, ${time}` : ''}</span>}
        </div>
      )}
      <div className="steps">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`step-dot ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`} />
        ))}
      </div>
      <div className="section" style={{ marginTop: 12 }}>
        <div className="faint" style={{ fontSize: 12 }}>Шаг {step + 1} из 3</div>
        <h1 className="section-title" style={{ fontSize: 21, marginTop: 3 }}>
          {step === 0 ? 'Направление и врач' : step === 1 ? 'Дата и время' : 'Ваши контакты'}
        </h1>
      </div>

      {step === 0 && (
        <div className="section" style={{ marginTop: 8 }}>
          <label className="field-label">Направление</label>
          <div className="chip-row" style={{ padding: '2px 0 4px', marginInline: 0 }}>
            {departments.map((d) => (
              <button key={d.id} className={`chip ${deptId === d.id ? 'active' : ''}`}
                onClick={() => { setDeptId(d.id); if (doctorId && !d.doctorIds.includes(doctorId)) setDoctorId(''); }}>
                {d.title}
              </button>
            ))}
          </div>

          <label className="field-label" style={{ marginTop: 16 }}>Врач {dept && `· ${deptDoctors.length} доступно`}</label>
          <button className={`pick ${doctorId === '' ? 'active' : ''}`} onClick={() => setDoctorId('')}>
            <span className="pick-radio">{doctorId === '' && <Icon name="check" size={14} strokeWidth={3} />}</span>
            <span className="quick-ic navy" style={{ width: 44, height: 44 }}><Icon name="users" size={22} /></span>
            <div className="grow"><div style={{ fontWeight: 700, fontSize: 14 }}>Любой свободный врач</div><div className="faint" style={{ fontSize: 12 }}>Подберём ближайшее время</div></div>
          </button>
          {deptDoctors.map((doc) => (
            <button key={doc.id} className={`pick ${doctorId === doc.id ? 'active' : ''}`} onClick={() => setDoctorId(doc.id)}>
              <span className="pick-radio">{doctorId === doc.id && <Icon name="check" size={14} strokeWidth={3} />}</span>
              <img className="doc-photo" src={doc.photo} alt="" style={{ width: 44, height: 44 }} />
              <div className="grow">
                <div style={{ fontWeight: 700, fontSize: 14 }}>{doc.name}</div>
                <div className="faint" style={{ fontSize: 12 }}>{doc.role} · {doc.experience} лет</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="section" style={{ marginTop: 8 }}>
          <label className="field-label">Дата приёма</label>
          <div className="day-scroll">
            {days.map((d) => (
              <button key={d.key} className={`day ${dayKey === d.key ? 'active' : ''}`} onClick={() => setDayKey(d.key)}>
                <div className="dw">{d.wd}</div>
                <div className="dd">{d.dd}</div>
              </button>
            ))}
          </div>

          <label className="field-label" style={{ marginTop: 18 }}>Время {selectedDay && `· ${selectedDay.label}`}</label>
          {!dayKey ? (
            <div className="faint" style={{ fontSize: 13, padding: '12px 2px' }}>Сначала выберите дату</div>
          ) : (
            <div className="slot-grid">
              {TIMES.map((t, i) => (
                <button key={t} className={`slot ${time === t ? 'active' : ''}`} disabled={i % 5 === 3} onClick={() => setTime(t)}>{t}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="section" style={{ marginTop: 8 }}>
          <div className="field">
            <label className="field-label">Ваше имя *</label>
            <input className="input" placeholder="Иван Иванов" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Телефон *</label>
            <input className="input" type="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Комментарий</label>
            <textarea className="input" placeholder="Что беспокоит, пожелания…" />
          </div>

          <div className="card card-pad" style={{ marginTop: 4 }}>
            <div className="section-title" style={{ fontSize: 15, marginBottom: 8 }}>Ваша запись</div>
            <div className="summary-row"><span className="k">Направление</span><span className="v">{dept?.title ?? '—'}</span></div>
            <div className="summary-row"><span className="k">Врач</span><span className="v">{doctor?.name ?? 'Любой свободный'}</span></div>
            <div className="summary-row"><span className="k">Дата</span><span className="v">{selectedDay?.label}</span></div>
            <div className="summary-row"><span className="k">Время</span><span className="v">{time}</span></div>
            <div className="summary-total"><span className="k">Стоимость приёма</span><b>{rub(price)}</b></div>
          </div>
          <p className="faint center" style={{ fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
            Оплата в клинике. Администратор подтвердит запись по телефону.
          </p>
        </div>
      )}

      <div className="dock">
        <button className={`btn btn-block btn-lg ${canNext ? 'btn-primary' : 'btn-ghost'}`} onClick={next}>
          {step < 2 ? <>Далее <Icon name="arrow-right" size={18} /></> : <><Icon name="check" size={20} strokeWidth={2.6} /> Подтвердить запись</>}
        </button>
      </div>
    </div>
  );
}
