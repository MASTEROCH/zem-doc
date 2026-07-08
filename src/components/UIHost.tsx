import { useEffect, useRef, useState } from 'react';
import { closeSheet, closeLightbox, useLightbox, useSheet, useToasts } from '../lib/ui';
import { Icon } from './Icon';

export function LightboxHost() {
  const lb = useLightbox();
  useEffect(() => {
    if (!lb) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lb]);
  if (!lb) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={closeLightbox}>
      <button className="lightbox-close" aria-label="Закрыть" onClick={closeLightbox}>✕</button>
      <img className="lightbox-img" src={lb.src} alt={lb.caption ?? ''} onClick={(e) => e.stopPropagation()} />
      {lb.caption && <div className="lightbox-caption">{lb.caption}</div>}
    </div>
  );
}

export function ToastHost() {
  const items = useToasts();
  if (items.length === 0) return null;
  return (
    <div className="toast-host" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind ?? 'info'}`}>
          <span className="toast-ic"><Icon name={t.kind === 'success' ? 'check' : 'info'} size={15} strokeWidth={2.6} /></span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}

export function SheetHost() {
  const s = useSheet();
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y0: number; dy: number; active: boolean }>({ y0: 0, dy: 0, active: false });
  const [dy, setDy] = useState(0);

  useEffect(() => {
    if (s) {
      setDy(0);
      document.body.setAttribute('data-sheet-open', '');
      return () => document.body.removeAttribute('data-sheet-open');
    }
  }, [s]);

  function onDown(e: React.PointerEvent) {
    drag.current = { y0: e.clientY, dy: 0, active: true };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!drag.current.active) return;
    const d = Math.max(0, e.clientY - drag.current.y0);
    drag.current.dy = d;
    setDy(d);
  }
  function onUp() {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (drag.current.dy > 110) closeSheet();
    else setDy(0);
  }

  if (!s) return null;
  return (
    <>
      <div className="sheet-overlay" style={{ opacity: Math.max(0, 1 - dy / 400) }} onClick={closeSheet} />
      <div
        ref={sheetRef}
        className="sheet sheet-host"
        role="dialog" aria-modal="true"
        style={{ transform: dy ? `translate(-50%, ${dy}px)` : undefined, transition: drag.current.active ? 'none' : undefined }}
      >
        <div className="sheet-handle-hit" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <div className="sheet-handle" />
        </div>
        <h3>{s.title}</h3>
        {s.subtitle && <div className="faint" style={{ fontSize: 12, marginBottom: 6 }}>{s.subtitle}</div>}
        <div style={{ marginTop: 12 }}>{s.body}</div>
        {s.actions ? (
          <div className="sheet-actions" style={{ marginTop: 16 }}>{s.actions}</div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-ghost btn-block" onClick={closeSheet}>Закрыть</button>
          </div>
        )}
      </div>
    </>
  );
}
