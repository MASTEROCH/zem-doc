import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { findDept, rub } from '../data/departments';

/* ════════════════════════════════════════════════════════════════════
   dr.Zem — уникальный ИИ-маскот медцентра «Земский Доктор».
   Живая мимика (моргание, эмоции), VFX-фон (аврора + частицы + пульс-кольца),
   и чат-помощник, который подбирает направление и ведёт к записи.
   Полностью SVG/CSS — без внешних спрайтов.
   ════════════════════════════════════════════════════════════════════ */

export type Emotion = 'idle' | 'hi' | 'think' | 'talk' | 'love';

/** Лицо dr.Zem — переиспользуется в кнопке и в шапке чата */
export function ZemFace({ emotion = 'idle' }: { emotion?: Emotion }) {
  return (
    <div className={`zem-head emo-${emotion}`}>
      <div className="zem-specular" />
      <svg className="zem-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        {/* сияющие искры внутри стеклянной головы */}
        <path className="zem-inhead-spark" d="M20 24l1.2 3.2L24.5 28l-3.3 1.2L20 32l-1.2-3.2L15.5 28l3.3-1.2L20 24z" fill="#BE9E6F" style={{ animationDelay: '0.2s' }} />
        <path className="zem-inhead-spark" d="M82 30l.8 2.2L85 33l-2.2.8L82 36l-.8-2.2L79 33l2.2-.8L82 30z" fill="#1C8FD6" style={{ animationDelay: '1s' }} />

        {/* глаза — открытые (моргают) */}
        <g className="zem-eyes-open">
          <g className="zem-pupils">
            <ellipse cx="37" cy="47" rx="5" ry="6.6" fill="#0C2033" />
            <ellipse cx="63" cy="47" rx="5" ry="6.6" fill="#0C2033" />
            <circle cx="39" cy="44.5" r="1.7" fill="#fff" />
            <circle cx="65" cy="44.5" r="1.7" fill="#fff" />
          </g>
        </g>
        {/* глаза — счастливые дуги */}
        <g className="zem-eyes-happy" stroke="#0C2033" strokeWidth="3.4" strokeLinecap="round">
          <path d="M31 49c2-5 9-5 11 0" />
          <path d="M58 49c2-5 9-5 11 0" />
        </g>

        {/* брови */}
        <g className="zem-brows" stroke="#0C2033" strokeWidth="3" strokeLinecap="round">
          <path className="zem-brow l" d="M31 34c4-2 8-2 11 0" />
          <path className="zem-brow r" d="M58 34c3-2 7-2 11 0" />
        </g>

        {/* румянец */}
        <g className="zem-blush">
          <ellipse cx="28" cy="58" rx="6" ry="4" fill="#E8A0A0" opacity="0.6" />
          <ellipse cx="72" cy="58" rx="6" ry="4" fill="#E8A0A0" opacity="0.6" />
        </g>

        {/* рот — золотая улыбка-пульс (фирменный ЭКГ-акцент) */}
        <path className="zem-mouth" d="M34 63c3 4 7 5 11 3l2-4 2 7 2-4c3 1 6 0 9-3"
          stroke="#BE9E6F" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

type Msg = { id: number; who: 'bot' | 'me'; text?: string; suggest?: string };

let mid = 0;
const nid = () => ++mid;

const INTENTS = [
  { key: 'doctor', label: 'Подобрать врача' },
  { key: 'book', label: 'Записаться' },
  { key: 'prices', label: 'Цены и анализы' },
  { key: 'hours', label: 'Часы работы' },
  { key: 'route', label: 'Как доехать' },
];

const SYMPTOM_CHIPS = ['Болит сердце', 'Головные боли', 'Проблемы с ЖКТ', 'Женское здоровье', 'Щитовидка', 'Суставы'];

function matchDept(text: string): string | null {
  const t = text.toLowerCase();
  const map: Array<[string[], string]> = [
    [['сердц', 'давлен', 'аритм', 'пульс'], 'cardio'],
    [['голов', 'мигрен', 'спин', 'невролог', 'сон', 'головокруж'], 'neuro'],
    [['желуд', 'жкт', 'живот', 'изжог', 'кишеч', 'гастро', 'печен'], 'gastro'],
    [['женск', 'гинеколог', 'беремен', 'цикл'], 'gyneco'],
    [['щитов', 'гормон', 'диабет', 'вес', 'эндокрин'], 'endo'],
    [['сустав', 'артрит', 'артроз', 'ревмат'], 'rheuma'],
    [['узи', 'ультразвук'], 'uzi'],
    [['анализ', 'кровь', 'чек'], 'analyses'],
    [['кашель', 'дыхан', 'бронх', 'астма', 'лёгк', 'легк'], 'pulmo'],
    [['вен', 'варикоз', 'сосуд'], 'cardio-surgery'],
    [['психолог', 'тревог', 'стресс', 'депресс', 'выгоран'], 'psycho'],
    [['массаж'], 'massage'],
    [['онко', 'родин', 'опухол'], 'oncology'],
  ];
  for (const [keys, id] of map) if (keys.some((k) => t.includes(k))) return id;
  return null;
}

export function DrZem({
  onBook, onOpenDept, onDoctors, onClinic,
}: {
  onBook: (deptId?: string) => void;
  onOpenDept: (id: string) => void;
  onDoctors: () => void;
  onClinic: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [emotion, setEmotion] = useState<Emotion>('idle');
  const [showHi, setShowHi] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (ms: number, fn: () => void) => { const id = window.setTimeout(fn, ms); timers.current.push(id); };

  // Idle: occasional greeting bubble + subtle emotion shifts
  useEffect(() => {
    const hi = window.setTimeout(() => { if (!open) { setShowHi(true); setEmotion('hi'); } }, 2600);
    const hi2 = window.setTimeout(() => { setEmotion('idle'); }, 5200);
    const hi3 = window.setTimeout(() => setShowHi(false), 7000);
    const loop = window.setInterval(() => {
      if (open) return;
      setEmotion('think');
      window.setTimeout(() => setEmotion('idle'), 1400);
    }, 12000);
    return () => { clearTimeout(hi); clearTimeout(hi2); clearTimeout(hi3); clearInterval(loop); };
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  function openChat() {
    setOpen(true);
    setShowHi(false);
    setEmotion('hi');
    after(1200, () => setEmotion('idle'));
    if (msgs.length === 0) {
      setMsgs([{ id: nid(), who: 'bot', text: 'Здравствуйте! Я dr.Zem — помощник клиники «Земский Доктор» 👨‍⚕️ Помогу выбрать направление, врача или записаться на приём. Что вас беспокоит?' }]);
    }
  }
  function closeChat() { setOpen(false); clearTimers(); setTyping(false); setEmotion('idle'); }

  function botSay(items: Msg[] | (() => Msg[]), delay = 700) {
    setTyping(true);
    setEmotion('think');
    after(delay, () => {
      setTyping(false);
      const list = typeof items === 'function' ? items() : items;
      setMsgs((m) => [...m, ...list]);
      setEmotion('talk');
      after(1600, () => setEmotion('idle'));
    });
  }

  function pushMe(text: string) { setMsgs((m) => [...m, { id: nid(), who: 'me', text }]); }

  function handleIntent(key: string) {
    if (key === 'book') { pushMe('Записаться'); botSay([{ id: nid(), who: 'bot', text: 'Отлично! Открываю онлайн-запись — выберите направление, врача и удобное время.' }], 500); after(1200, () => { onBook(); setOpen(false); }); return; }
    if (key === 'doctor') { pushMe('Подобрать врача'); botSay([{ id: nid(), who: 'bot', text: 'Опишите, что беспокоит — подберу профильного специалиста. Или загляните в каталог из 25 врачей 👇' }]); return; }
    if (key === 'prices') { pushMe('Цены и анализы'); botSay([{ id: nid(), who: 'bot', text: 'Более 1000 анализов, результат в личном кабинете за 1–2 дня. Забор крови — от 300 ₽. Показать направление «Анализы»?' }, { id: nid(), who: 'bot', suggest: 'analyses' }]); return; }
    if (key === 'hours') { pushMe('Часы работы'); botSay([{ id: nid(), who: 'bot', text: 'Мы работаем:\nПн–Пт — 09:00–20:00\nСб–Вс — 09:00–15:00\nТелефон: +7 (4012) 66-30-30' }]); return; }
    if (key === 'route') { pushMe('Как доехать'); botSay([{ id: nid(), who: 'bot', text: 'Мы находимся в Калининграде, ул. Космонавта Леонова, 74. Открыть карту и контакты?' }]); after(1400, () => { onClinic(); setOpen(false); }); return; }
  }

  function handleSymptom(text: string) {
    pushMe(text);
    const id = matchDept(text);
    if (id) {
      const d = findDept(id)!;
      botSay([
        { id: nid(), who: 'bot', text: `Похоже, вам подойдёт направление «${d.title}». Приём — от ${rub(d.consult)}. Вот подходящий вариант:` },
        { id: nid(), who: 'bot', suggest: id },
      ]);
    } else {
      botSay([{ id: nid(), who: 'bot', text: 'Понял вас. Рекомендую начать с приёма терапевта — он направит к нужному специалисту. Показать?' }, { id: nid(), who: 'bot', suggest: 'therapy' }]);
    }
  }

  function send() {
    const t = draft.trim();
    if (!t) return;
    setDraft('');
    handleSymptom(t);
  }

  const emo = open ? emotion : emotion;

  return (
    <>
      <button className="zem-fab" onClick={openChat} aria-label="Открыть чат с dr.Zem">
        <div className="zem-vfx">
          <div className="zem-aura" />
          <div className="zem-ring" />
          <div className="zem-ring r2" />
          <div className="zem-spark" />
          <div className="zem-spark s2" />
          <div className="zem-spark s3" />
        </div>
        <ZemFace emotion={emo} />
      </button>
      {showHi && !open && (
        <div className="zem-hi" onClick={openChat}>
          Привет! Я <b>dr.Zem</b> 👋
        </div>
      )}

      {open && (
        <>
          <div className="zem-chat-overlay" onClick={closeChat} />
          <div className="zem-chat" role="dialog" aria-modal="true" aria-label="dr.Zem">
            <div className="zem-chat-head">
              <div className="zem-chat-ava"><ZemFace emotion={emotion} /></div>
              <div>
                <div className="zem-chat-name">dr.Zem <span className="status" /></div>
                <div className="zem-chat-role">ИИ-помощник · онлайн</div>
              </div>
              <button className="zem-chat-close" onClick={closeChat} aria-label="Закрыть"><Icon name="x" size={18} /></button>
            </div>

            <div className="zem-body" ref={bodyRef}>
              {msgs.map((m) => {
                if (m.suggest) {
                  const d = findDept(m.suggest)!;
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
                return (
                  <div key={m.id} className={`zem-msg ${m.who}`} style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                );
              })}
              {typing && (
                <div className="zem-msg bot"><span className="zem-typing"><i /><i /><i /></span></div>
              )}

              {msgs.length <= 1 && !typing && (
                <>
                  <div className="zem-quick">
                    {INTENTS.map((i) => (
                      <button key={i.key} className="zem-qbtn" onClick={() => handleIntent(i.key)}>{i.label}</button>
                    ))}
                  </div>
                  <div className="faint" style={{ fontSize: 11.5, margin: '8px 2px 2px' }}>Или выберите симптом:</div>
                  <div className="zem-quick">
                    {SYMPTOM_CHIPS.map((s) => (
                      <button key={s} className="zem-qbtn" style={{ background: 'var(--gold-soft)', color: 'var(--gold-deep)', borderColor: 'rgba(190,158,111,0.3)' }} onClick={() => handleSymptom(s)}>{s}</button>
                    ))}
                  </div>
                </>
              )}

              {msgs.length > 1 && !typing && (
                <div className="zem-quick" style={{ marginTop: 2 }}>
                  <button className="zem-qbtn" onClick={() => { onDoctors(); setOpen(false); }}>Все врачи</button>
                  <button className="zem-qbtn" onClick={() => { onBook(); setOpen(false); }}>Записаться</button>
                  <button className="zem-qbtn" onClick={() => handleIntent('hours')}>Часы работы</button>
                </div>
              )}
            </div>

            <div className="zem-foot">
              <input
                className="zem-input"
                placeholder="Опишите, что беспокоит…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button className="zem-send" onClick={send} aria-label="Отправить"><Icon name="send" size={18} /></button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
