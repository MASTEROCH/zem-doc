import { useState } from 'react';
import { Icon } from './Icon';
import { type Department, rub } from '../data/departments';
import type { Doctor } from '../data/doctors';
import type { Promo } from '../data/clinic';

export function Stars({ n = 5, size = 12 }: { n?: number; size?: number }) {
  return (
    <span className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={size} fill={i < n ? 'current' : 'none'} style={{ opacity: i < n ? 1 : 0.3 }} />
      ))}
    </span>
  );
}

/** Картинка с плавным появлением + фолбэк при ошибке загрузки */
export function ImgFade({ src, alt = '', className = '', fallback }: { src: string; alt?: string; className?: string; fallback?: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  if (err && fallback) return <>{fallback}</>;
  return (
    <img
      src={src} alt={alt}
      className={`${className} img-fade ${loaded ? 'loaded' : ''}`}
      onLoad={() => setLoaded(true)}
      onError={() => setErr(true)}
    />
  );
}

export function DeptCard({ dept, onClick }: { dept: Department; onClick: () => void }) {
  const from = Math.min(...dept.services.map((s) => s.price), dept.consult);
  return (
    <button className="dept-card" onClick={onClick} aria-label={dept.title}>
      {dept.popular && <span className="badge pop">Топ</span>}
      <ImgFade className="dept-icon" src={dept.img}
        fallback={<span className="dept-icon" style={{ display: 'grid', placeItems: 'center' }}><Icon name="pulse" size={30} style={{ color: 'var(--gold-deep)' }} /></span>} />
      <div className="dept-title">{dept.title}</div>
      <div className="dept-short">{dept.short}</div>
      <div className="dept-foot">
        <div className="dept-from">от <b>{from.toLocaleString('ru-RU')} ₽</b></div>
        <span className="dept-go"><Icon name="chevron-right" size={16} strokeWidth={2.4} /></span>
      </div>
    </button>
  );
}

export function DoctorRow({ doc, onClick }: { doc: Doctor; onClick: () => void }) {
  return (
    <button className="doc-card" onClick={onClick} style={{ display: 'block', width: '100%', textAlign: 'left' }}>
      <div className="doc-row">
        <ImgFade className="doc-photo" src={doc.photo} alt={doc.name} />
        <div className="doc-info">
          <div className="doc-name">{doc.name}</div>
          <div className="doc-role">{doc.role}</div>
          <div className="doc-meta">
            <span className="doc-rating"><Icon name="star" size={12} fill="current" /> {doc.rating.toFixed(1)}</span>
            <span className="m"><Icon name="award" size={13} /> {doc.experience} лет</span>
            <span className="doc-slot">● {doc.nextSlot}</span>
          </div>
        </div>
        <Icon name="chevron-right" size={18} className="faint" />
      </div>
    </button>
  );
}

export function DoctorMini({ doc, onClick }: { doc: Doctor; onClick: () => void }) {
  return (
    <button className="doc-card vert" onClick={onClick}>
      <ImgFade className="doc-photo" src={doc.photo} alt={doc.name} />
      <div className="doc-name" style={{ fontSize: 13.5 }}>{doc.name.split(' ').slice(0, 2).join(' ')}</div>
      <div className="doc-role" style={{ fontSize: 11.5, minHeight: 28 }}>{doc.specialties[0]}</div>
      <div className="doc-rating" style={{ justifyContent: 'center', marginTop: 6, fontSize: 12 }}>
        <Icon name="star" size={12} fill="current" /> {doc.rating.toFixed(1)}
        <span className="faint" style={{ fontWeight: 500 }}> · {doc.experience} лет</span>
      </div>
    </button>
  );
}

export function PromoCard({ p, onOpen }: { p: Promo; onOpen: (p: Promo) => void }) {
  return (
    <button className={`promo-card ${p.accent}`} onClick={() => onOpen(p)}>
      <span className="promo-spark a" /><span className="promo-spark b" />
      <span className="badge">{p.badge}</span>
      <div className="promo-title">{p.title}</div>
      <div className="promo-text">{p.text}</div>
      <div className="promo-price"><b>{rub(p.price)}</b><s>{rub(p.old)}</s></div>
    </button>
  );
}
