import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { findDept, departments, rub } from '../data/departments';
import { doctors, findDoctor, doctorsByDept } from '../data/doctors';
import { clinic } from '../data/clinic';
import { onOpenZem } from '../lib/zem';

/* ════════════════════════════════════════════════════════════════════
   dr.Zem — ИИ-помощник (виртуальная приёмная клиники «Земский Доктор»).
   Живая мимика (моргание/взгляд/подмигивание/эмоции), VFX-фон,
   и чат под задачи клиники: подбор врача по симптому, цены,
   подготовка к анализам, маршрут, документы, запись. Чистый SVG/CSS.
   ════════════════════════════════════════════════════════════════════ */

export type Emotion = 'idle' | 'hi' | 'think' | 'talk' | 'love' | 'wink';

export function ZemFace({ emotion = 'idle' }: { emotion?: Emotion }) {
  return (
    <div className={`zem-head emo-${emotion}`}>
      <div className="zem-orb-grad" />
      <div className="zem-orb-shade" />
      <div className="zem-orb-gloss" />
      <svg className="zem-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <path className="zem-inhead-spark" d="M20 24l1.2 3.2L24.5 28l-3.3 1.2L20 32l-1.2-3.2L15.5 28l3.3-1.2L20 24z" fill="#BE9E6F" style={{ animationDelay: '0.2s' }} />
        <path className="zem-inhead-spark" d="M82 30l.8 2.2L85 33l-2.2.8L82 36l-.8-2.2L79 33l2.2-.8L82 30z" fill="#1C8FD6" style={{ animationDelay: '1s' }} />
        <g className="zem-eyes-open">
          <g className="zem-pupils">
            <ellipse cx="37" cy="47" rx="5" ry="6.6" fill="#0C2033" />
            <ellipse cx="63" cy="47" rx="5" ry="6.6" fill="#0C2033" />
            <circle cx="39" cy="44.5" r="1.7" fill="#fff" />
            <circle cx="65" cy="44.5" r="1.7" fill="#fff" />
          </g>
        </g>
        <g className="zem-eyes-happy" stroke="#0C2033" strokeWidth="3.4" strokeLinecap="round">
          <path d="M31 49c2-5 9-5 11 0" />
          <path d="M58 49c2-5 9-5 11 0" />
        </g>
        <g className="zem-brows" stroke="#0C2033" strokeWidth="3" strokeLinecap="round">
          <path className="zem-brow l" d="M31 34c4-2 8-2 11 0" />
          <path className="zem-brow r" d="M58 34c3-2 7-2 11 0" />
        </g>
        <g className="zem-blush">
          <ellipse cx="28" cy="58" rx="6" ry="4" fill="#E8A0A0" opacity="0.6" />
          <ellipse cx="72" cy="58" rx="6" ry="4" fill="#E8A0A0" opacity="0.6" />
        </g>
        <path className="zem-mouth" d="M34 63c3 4 7 5 11 3l2-4 2 7 2-4c3 1 6 0 9-3"
          stroke="#BE9E6F" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

type Msg = { id: number; who: 'bot' | 'me'; text?: string; dept?: string; doctor?: string };
let mid = 0; const nid = () => ++mid;

const GREET = 'Здравствуйте! Я dr.Zem — виртуальная приёмная клиники «Земский Доктор» 👨‍⚕️\nПодберу врача по симптомам, подскажу цены, подготовку к анализам и маршрут. Что вас беспокоит?';
const QUICK = ['Подобрать врача', 'Записаться', 'Цены', 'Анализы', 'Часы работы', 'Как доехать'];
const SYMPTOMS = ['Болит сердце', 'Головные боли', 'Проблемы с ЖКТ', 'Женское здоровье', 'Щитовидка', 'Суставы', 'Кашель', 'Тревога и стресс'];

const SYMPTOM_MAP: Array<[string[], string]> = [
  [['сердц', 'давлен', 'аритм', 'пульс', 'стенокард', 'одышк'], 'cardio'],
  [['голов', 'мигрен', 'спин', 'невролог', 'сон', 'бессонн', 'головокруж', 'шея', 'поясниц'], 'neuro'],
  [['желуд', 'жкт', 'живот', 'изжог', 'кишеч', 'гастро', 'печен', 'тошнот', 'стул'], 'gastro'],
  [['женск', 'гинеколог', 'беремен', 'цикл', 'месячн', 'выделен'], 'gyneco'],
  [['щитов', 'диабет', 'вес', 'эндокрин', 'сахар'], 'endo'],
  [['сустав', 'артрит', 'артроз', 'ревмат', 'колен'], 'rheuma'],
  [['узи', 'ультразвук'], 'uzi'],
  [['кашель', 'дыхан', 'бронх', 'астма', 'легк', 'пневмон', 'мокрот'], 'pulmo'],
  [['вен', 'варикоз', 'сосуд', 'тромб', 'звездочк'], 'cardio-surgery'],
  [['психолог', 'тревог', 'стресс', 'депресс', 'выгоран', 'паник', 'настроен'], 'psycho'],
  [['массаж', 'реабилитац'], 'massage'],
  [['онко', 'родин', 'опухол', 'новообраз', 'маммолог', 'грудь'], 'oncology'],
  [['лазер'], 'laser'],
  [['экг', 'холтер', 'смад'], 'func-diag'],
  [['терапевт', 'справк', 'температ', 'простуд', 'орви'], 'therapy'],
  [['анализ', 'кровь', 'чек', 'биохим'], 'analyses'],
];

const PREP: Array<[string, string]> = [
  ['узи бр', 'УЗИ брюшной полости — натощак, за 6–8 ч не есть. За 2–3 дня исключить газообразующие продукты (капуста, бобовые, газировка).'],
  ['малого таз', 'УЗИ малого таза — за 1 час выпить 3–4 стакана воды и не мочиться (нужен полный мочевой пузырь).'],
  ['кров', 'Кровь сдаётся строго натощак (8–12 ч без еды, можно воду). Накануне — без жирного и алкоголя, утром до 11:00.'],
  ['гинеколог', 'К гинекологу лучше прийти на 5–7 день цикла (после менструации). За 2 дня — без интимной близости и свечей.'],
];

const norm = (t: string) => t.toLowerCase().replace(/ё/g, 'е');

function matchDept(t: string): string | null {
  for (const [keys, id] of SYMPTOM_MAP) if (keys.some((k) => t.includes(k))) return id;
  return null;
}
function matchDoctorByName(t: string) {
  return doctors.find((d) => norm(d.name).split(' ').some((p) => p.length > 3 && t.includes(p)));
}
function findService(t: string): { name: string; price: number; dept: string } | null {
  for (const d of departments) for (const s of d.services) {
    const words = norm(s.name).split(/[ ,·()]+/).filter((w) => w.length > 3);
    if (words.some((w) => t.includes(w))) return { name: s.name, price: s.price, dept: d.title };
  }
  return null;
}

function respond(raw: string): Msg[] {
  const t = norm(raw);
  const M = (o: Partial<Msg>): Msg => ({ id: nid(), who: 'bot', ...o });

  if (/(привет|здравств|добр|хай|hello)/.test(t)) return [M({ text: 'Здравствуйте! Расскажите, что беспокоит — подберу специалиста 🙂' })];
  if (/(спасибо|благодар|отлично|супер|класс|понятно)/.test(t)) return [M({ text: 'Всегда рад помочь! Крепкого здоровья 💙 Если что — я на связи.' })];

  if (/(записа|запиш|талон|попаст)/.test(t) && !/(цена|стоит|сколько)/.test(t)) {
    const d = matchDept(t);
    const dep = findDept(d || 'therapy')!;
    return [M({ text: `Открываю онлайн-запись${d ? ` на «${dep.title}»` : ''} — выберите врача и время.` }), M({ dept: dep.id })];
  }

  if (/(цена|цены|стоит|стоим|сколько|прайс|руб)/.test(t)) {
    const svc = findService(t);
    if (svc) return [M({ text: `«${svc.name}» — ${rub(svc.price)} (${svc.dept}). Записать вас?` })];
    const d = matchDept(t);
    if (d) { const dep = findDept(d)!; return [M({ text: `Приём — от ${rub(dep.consult)}. Полный прайс «${dep.title}»:` }), M({ dept: d })]; }
    return [M({ text: 'Приём специалиста — от 1 900 ₽, анализы — от 300 ₽, УЗИ — от 1 800 ₽. Назовите услугу — скажу точную цену.' })];
  }

  if (/(час|график|открыт|во сколько|выходн|суббот|воскрес)/.test(t))
    return [M({ text: `Часы работы:\n• Пн–Пт — 09:00–20:00\n• Сб–Вс — 09:00–15:00\nТелефон: ${clinic.phone}` })];

  if (/(адрес|где вы|где наход|доехат|маршрут|как найти|улиц|карт)/.test(t))
    return [M({ text: `Мы в Калининграде: ${clinic.addressShort}. Карта — в разделе «О клинике» → «Как нас найти». Телефон: ${clinic.phone}` })];

  if (/(омс|дмс|страхов|полис|документ|паспорт|снилс|что взять|что нужно)/.test(t))
    return [M({ text: 'На приём возьмите паспорт. Работаем на платной основе и по ДМС. Результаты прошлых обследований (если есть) — тоже пригодятся врачу.' })];

  if (/(подготов|натощак|как готов|можно ли есть)/.test(t)) {
    for (const [k, txt] of PREP) if (t.includes(k)) return [M({ text: txt })];
    return [M({ text: 'Подготовка зависит от исследования. Чаще: кровь — натощак, УЗИ брюшной полости — не есть 6–8 ч. Напишите, что сдаёте — уточню.' })];
  }

  const byName = matchDoctorByName(t);
  if (byName) return [M({ text: `${byName.name} — ${byName.role}, стаж ${byName.experience} лет, ★ ${byName.rating.toFixed(1)}. Ближайшее окно: ${byName.nextSlot}.` }), M({ doctor: byName.id })];

  const dept = matchDept(t);
  if (dept) {
    const dep = findDept(dept)!;
    const top = doctorsByDept(dept).sort((a, b) => b.rating - a.rating)[0];
    const out: Msg[] = [M({ text: `Похоже, вам к направлению «${dep.title}» (приём от ${rub(dep.consult)}).` }), M({ dept })];
    if (top) out.push(M({ text: `Рекомендую: ${top.name} — стаж ${top.experience} лет.` }), M({ doctor: top.id }));
    return out;
  }

  return [M({ text: 'Понял вас. Если не уверены, к кому идти — начните с приёма терапевта, он направит к нужному специалисту 🙂' }), M({ dept: 'therapy' })];
}

export function DrZem({
  onBook, onOpenDept, onOpenDoctor, onDoctors, onClinic,
}: {
  onBook: (deptId?: string) => void; onOpenDept: (id: string) => void; onOpenDoctor: (id: string) => void;
  onDoctors: () => void; onClinic: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [emotion, setEmotion] = useState<Emotion>('idle');
  const [showHi, setShowHi] = useState(false);
  const [badge, setBadge] = useState(true);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const after = (ms: number, fn: () => void) => { const id = window.setTimeout(fn, ms); timers.current.push(id); };
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  useEffect(() => {
    const t1 = window.setTimeout(() => { if (!open) { setShowHi(true); setEmotion('hi'); } }, 2200);
    const t2 = window.setTimeout(() => setEmotion('idle'), 5000);
    const t3 = window.setTimeout(() => setShowHi(false), 8500);
    const loop = window.setInterval(() => {
      if (open) return;
      setEmotion('wink'); window.setTimeout(() => setEmotion('idle'), 900);
    }, 9000);
    return () => { [t1, t2, t3].forEach(clearTimeout); clearInterval(loop); };
  }, [open]);

  useEffect(() => onOpenZem(() => openChat()), []); // eslint-disable-line
  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('zem') === '1') openChat();
    // eslint-disable-next-line
  }, []);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, typing]);

  function openChat() {
    setOpen(true); setShowHi(false); setBadge(false); setEmotion('hi');
    after(1300, () => setEmotion('idle'));
    setMsgs((m) => (m.length ? m : [{ id: nid(), who: 'bot', text: GREET }]));
  }
  function closeChat() { setOpen(false); clearTimers(); setTyping(false); setEmotion('idle'); }
  function pushMe(text: string) { setMsgs((m) => [...m, { id: nid(), who: 'me', text }]); }
  function botSay(list: Msg[], delay = 650) {
    setTyping(true); setEmotion('think');
    after(delay, () => { setTyping(false); setMsgs((m) => [...m, ...list]); setEmotion('talk'); after(1500, () => setEmotion('idle')); });
  }
  function handle(text: string) {
    pushMe(text);
    const t = norm(text);
    if (t === 'записаться') { botSay([{ id: nid(), who: 'bot', text: 'Открываю онлайн-запись 👇' }], 400); after(1000, () => { onBook(); setOpen(false); }); return; }
    if (t === 'как доехать') { botSay([{ id: nid(), who: 'bot', text: `Мы на ${clinic.addressShort}. Открываю карту и контакты.` }]); after(1300, () => { onClinic(); setOpen(false); }); return; }
    if (t === 'подобрать врача') { botSay([{ id: nid(), who: 'bot', text: 'Опишите, что беспокоит — подберу специалиста. Или откройте каталог из 25 врачей 👇' }]); return; }
    botSay(respond(text));
  }
  function send() { const t = draft.trim(); if (!t) return; setDraft(''); handle(t); }

  return (
    <>
      <button className="zem-fab" onClick={openChat} aria-label="Чат с dr.Zem">
        <div className="zem-vfx">
          <div className="zem-aura" /><div className="zem-ring" /><div className="zem-ring r2" />
          <div className="zem-spark" /><div className="zem-spark s2" /><div className="zem-spark s3" />
        </div>
        <ZemFace emotion={emotion} />
        {badge && <span className="zem-badge">1</span>}
      </button>
      {showHi && !open && (
        <div className="zem-hi" onClick={openChat}>Привет! Я <b>dr.Zem</b> 👋 Подберу врача и отвечу на вопросы</div>
      )}

      {open && (
        <>
          <div className="zem-chat-overlay" onClick={closeChat} />
          <div className="zem-chat" role="dialog" aria-modal="true" aria-label="dr.Zem">
            <div className="zem-chat-head">
              <div className="zem-chat-ava"><ZemFace emotion={emotion} /></div>
              <div>
                <div className="zem-chat-name">dr.Zem <span className="status" /></div>
                <div className="zem-chat-role">Виртуальная приёмная · онлайн</div>
              </div>
              <button className="zem-chat-close" onClick={closeChat} aria-label="Закрыть"><Icon name="x" size={18} /></button>
            </div>

            <div className="zem-body" ref={bodyRef}>
              {msgs.map((m) => {
                if (m.dept) {
                  const d = findDept(m.dept)!;
                  return (
                    <div key={m.id} className="zem-suggest">
                      <img src={d.img} alt="" />
                      <div className="grow">
                        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{d.title}</div>
                        <div className="faint" style={{ fontSize: 11.5 }}>Приём от {rub(d.consult)}</div>
                      </div>
                      <button className="btn btn-gold btn-sm" onClick={() => { onOpenDept(d.id); setOpen(false); }}>Открыть</button>
                    </div>
                  );
                }
                if (m.doctor) {
                  const doc = findDoctor(m.doctor)!;
                  return (
                    <div key={m.id} className="zem-doc-sg">
                      <img src={doc.photo} alt="" />
                      <div className="grow">
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{doc.name}</div>
                        <div className="faint" style={{ fontSize: 11 }}>{doc.role} · ★ {doc.rating.toFixed(1)}</div>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => { onOpenDoctor(doc.id); setOpen(false); }}>Профиль</button>
                    </div>
                  );
                }
                return <div key={m.id} className={`zem-msg ${m.who}`} style={{ whiteSpace: 'pre-line' }}>{m.text}</div>;
              })}
              {typing && <div className="zem-msg bot"><span className="zem-typing"><i /><i /><i /></span></div>}

              {msgs.length <= 1 && !typing && (
                <>
                  <div className="zem-quick">{QUICK.map((q) => <button key={q} className="zem-qbtn" onClick={() => handle(q)}>{q}</button>)}</div>
                  <div className="faint" style={{ fontSize: 11.5, margin: '8px 2px 2px' }}>Или выберите симптом:</div>
                  <div className="zem-quick">{SYMPTOMS.map((sx) => <button key={sx} className="zem-qbtn" style={{ background: 'var(--gold-soft)', color: 'var(--gold-deep)', borderColor: 'rgba(190,158,111,0.3)' }} onClick={() => handle(sx)}>{sx}</button>)}</div>
                </>
              )}
              {msgs.length > 1 && !typing && (
                <div className="zem-quick" style={{ marginTop: 2 }}>
                  <button className="zem-qbtn" onClick={() => { onDoctors(); setOpen(false); }}>Все врачи</button>
                  <button className="zem-qbtn" onClick={() => { onBook(); setOpen(false); }}>Записаться</button>
                  <button className="zem-qbtn" onClick={() => handle('Часы работы')}>Часы работы</button>
                </div>
              )}
            </div>

            <div className="zem-foot">
              <input className="zem-input" placeholder="Спросите: «болит сердце», «цена УЗИ»…" value={draft}
                onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
              <button className="zem-send" onClick={send} aria-label="Отправить"><Icon name="send" size={18} /></button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
