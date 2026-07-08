import { Icon } from '../components/Icon';
import { Confetti } from '../components/Confetti';
import { clinic } from '../data/clinic';
import { rub } from '../data/departments';
import type { BookingResult } from './BookingScreen';

export function ConfirmScreen({
  result, onHome, onAccount,
}: { result: BookingResult; onHome: () => void; onAccount: () => void }) {
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
            <div className="faint" style={{ fontSize: 12 }}>№ {String(Math.floor(Math.random() * 9000) + 1000)}</div>
          </div>
          <div className="summary-row"><span className="k">Направление</span><span className="v">{result.deptTitle}</span></div>
          <div className="summary-row"><span className="k">Врач</span><span className="v">{result.doctorName}</span></div>
          <div className="summary-row"><span className="k">Дата</span><span className="v">{result.dateLabel}</span></div>
          <div className="summary-row"><span className="k">Время</span><span className="v">{result.time}</span></div>
          <div className="summary-total"><span className="k">Приём</span><b>{rub(result.price)}</b></div>
        </div>

        <div className="card card-pad confirm-card row" style={{ gap: 12 }}>
          <span className="contact-ic"><Icon name="pin" size={20} /></span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{clinic.addressShort}</div>
            <div className="faint" style={{ fontSize: 12 }}>{clinic.phone}</div>
          </div>
        </div>

        <div style={{ width: '100%', marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary btn-block btn-lg" onClick={onAccount}>
            <Icon name="calendar-check" size={20} /> Мои записи
          </button>
          <button className="btn btn-ghost btn-block" onClick={onHome}>На главную</button>
        </div>
      </div>
    </div>
  );
}
