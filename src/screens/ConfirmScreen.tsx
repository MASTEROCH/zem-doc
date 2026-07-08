import { useEffect, useMemo } from 'react';
import { Icon } from '../components/Icon';
import { Confetti } from '../components/Confetti';
import { clinic } from '../data/clinic';
import { rub } from '../data/departments';
import { haptic } from '../lib/haptics';
import { toast } from '../lib/ui';
import type { BookingResult } from './BookingScreen';

export function ConfirmScreen({
  result, onHome, onAccount,
}: { result: BookingResult; onHome: () => void; onAccount: () => void }) {
  const num = useMemo(() => String(1000 + Math.floor(Math.random() * 9000)), []);
  useEffect(() => { haptic('success'); }, []);

  const summary = `Запись в «Земский Доктор»: ${result.deptTitle}, ${result.doctorName}, ${result.dateLabel} ${result.time}. ${clinic.addressShort}`;

  function addToCalendar() {
    const [hh, mm] = result.time.split(':');
    const start = `${result.dateKey.replace(/-/g, '')}T${hh}${mm}00`;
    const [eh] = result.time.split(':');
    const end = `${result.dateKey.replace(/-/g, '')}T${String(Number(eh) + 1).padStart(2, '0')}${mm}00`;
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Zem-Doc//RU', 'BEGIN:VEVENT',
      `DTSTART:${start}`, `DTEND:${end}`,
      `SUMMARY:Приём — ${result.deptTitle} (Земский Доктор)`,
      `DESCRIPTION:Врач: ${result.doctorName}. Приём ${rub(result.price)}. Тел: ${clinic.phone}`,
      `LOCATION:${clinic.address}`, 'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'zem-doc-priem.ics'; a.click();
    URL.revokeObjectURL(url);
    toast('Файл календаря скачан', 'success');
  }

  async function share() {
    haptic('light');
    const nav = navigator as Navigator & { share?: (d: { text: string; title?: string }) => Promise<void> };
    try {
      if (nav.share) await nav.share({ title: 'Земский Доктор', text: summary });
      else { await navigator.clipboard.writeText(summary); toast('Скопировано в буфер', 'success'); }
    } catch { /* cancelled */ }
  }

  return (
    <div className="screen">
      <div className="confirm-wrap">
        <Confetti />
        <div className="confirm-check"><Icon name="check" size={48} strokeWidth={2.6} /></div>
        <h1>Запись создана!</h1>
        <p>Администратор клиники «Земский Доктор» свяжется с вами для подтверждения.</p>

        <div className="card card-pad confirm-card" style={{ textAlign: 'left' }}>
          <div className="row between" style={{ marginBottom: 12 }}>
            <div className="doc-cat"><Icon name="calendar-check" size={13} /> Ожидает подтверждения</div>
            <div className="faint" style={{ fontSize: 12 }}>№ {num}</div>
          </div>
          <div className="summary-row"><span className="k">Направление</span><span className="v">{result.deptTitle}</span></div>
          <div className="summary-row"><span className="k">Врач</span><span className="v">{result.doctorName}</span></div>
          <div className="summary-row"><span className="k">Дата</span><span className="v">{result.dateLabel}</span></div>
          <div className="summary-row"><span className="k">Время</span><span className="v">{result.time}</span></div>
          <div className="summary-total"><span className="k">Приём</span><b>{rub(result.price)}</b></div>
        </div>

        {/* quick actions */}
        <div className="row confirm-card" style={{ gap: 10 }}>
          <button className="btn btn-outline brand" style={{ flex: 1 }} onClick={addToCalendar}>
            <Icon name="calendar-check" size={17} /> В календарь
          </button>
          <button className="btn btn-outline brand" style={{ flex: 1 }} onClick={share}>
            <Icon name="share" size={17} /> Поделиться
          </button>
        </div>

        <a className="card card-pad confirm-card row" href={`https://yandex.ru/maps/?text=${encodeURIComponent(clinic.mapQuery)}`} target="_blank" rel="noreferrer" style={{ gap: 12, width: '100%' }}>
          <span className="contact-ic"><Icon name="pin" size={20} /></span>
          <div style={{ textAlign: 'left' }} className="grow">
            <div style={{ fontWeight: 700, fontSize: 14 }}>{clinic.addressShort}</div>
            <div className="faint" style={{ fontSize: 12 }}>{clinic.phone} · открыть карту</div>
          </div>
          <Icon name="arrow-up-right" size={18} className="faint" />
        </a>

        <div style={{ width: '100%', marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary btn-block btn-lg" onClick={onAccount}>
            <Icon name="calendar-check" size={20} /> Мои записи
          </button>
          <button className="btn btn-ghost btn-block" onClick={onHome}>На главную</button>
        </div>
      </div>
    </div>
  );
}
