import { TopBar } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { promos } from '../data/clinic';
import { rub } from '../data/departments';
import { openPromoSheet } from '../lib/promoSheet';

export function PromotionsScreen({
  onBack, onBook, onOpenDoctor,
}: { onBack: () => void; onBook: (p?: { deptId?: string }) => void; onOpenDoctor: (id: string) => void }) {
  return (
    <div className="screen">
      <TopBar title="Акции и комплексы" onBack={onBack} />
      <div className="section" style={{ marginTop: 4 }}>
        <div className="eyebrow gold"><Icon name="gift" size={14} /> Выгодные предложения</div>
        <h1 className="section-title" style={{ fontSize: 23, marginTop: 6 }}>Акции и <span className="serif">комплексы</span></h1>
      </div>

      <div className="section" style={{ marginTop: 14 }}>
        <div className="wrap-gap">
          {promos.map((p) => (
            <button key={p.id} className={`promo-card ${p.accent}`} style={{ width: '100%' }} onClick={() => openPromoSheet(p, { onBook, onOpenDoctor })}>
              <span className="badge">{p.badge}</span>
              <div className="promo-title" style={{ fontSize: 19 }}>{p.title}</div>
              <div className="promo-text">{p.text}</div>
              <div className="promo-price"><b>{rub(p.price)}</b><s>{rub(p.old)}</s></div>
              <div className="row" style={{ gap: 6, marginTop: 12, opacity: 0.92, fontSize: 12.5, fontWeight: 600 }}>
                Подробнее <Icon name="arrow-right" size={15} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
