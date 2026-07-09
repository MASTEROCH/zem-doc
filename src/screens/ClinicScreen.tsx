import { useState } from 'react';
import { TopBar } from '../components/AppHeader';
import { Icon, type IconName } from '../components/Icon';
import { clinic, stats, advantages, faq, aboutClinic } from '../data/clinic';

export function ClinicScreen({ onBack, onBook }: { onBack: () => void; onBook: () => void }) {
  const [open, setOpen] = useState<number | null>(0);
  const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(clinic.mapQuery)}`;

  const contacts: { icon: IconName; k: string; v: string; href?: string }[] = [
    { icon: 'phone', k: 'Телефон', v: clinic.phone, href: `tel:${clinic.phoneRaw}` },
    { icon: 'whatsapp', k: 'WhatsApp', v: 'Написать в WhatsApp', href: clinic.whatsapp },
    { icon: 'telegram', k: 'Telegram', v: 'Написать в Telegram', href: clinic.telegram },
    { icon: 'vk', k: 'ВКонтакте', v: 'vk.com/zemski_doctor', href: clinic.vk },
    { icon: 'message', k: 'E-mail', v: clinic.email, href: `mailto:${clinic.email}` },
  ];

  return (
    <div className="screen">
      <TopBar title="О клинике" onBack={onBack} />

      {/* intro */}
      <div className="section" style={{ marginTop: 4 }}>
        <div className="hero-card" style={{ padding: '22px 18px' }}>
          <div className="hero-eyebrow"><Icon name="pulse" size={14} /> {clinic.city}</div>
          <h1 className="hero-title" style={{ fontSize: 24 }}>Земский <span className="serif">Доктор</span></h1>
          <p className="hero-sub" style={{ maxWidth: '38ch' }}>{clinic.slogan}</p>
        </div>
      </div>

      {/* stats */}
      <div className="section">
        <div className="stat-row">
          {stats.map((s) => (
            <div className="stat" key={s.label}><div className="stat-value gold">{s.value}</div><div className="stat-label">{s.label}</div></div>
          ))}
        </div>
      </div>

      {/* about text */}
      <div className="section">
        <div className="section-head" style={{ marginBottom: 10 }}><div className="section-title" style={{ fontSize: 18 }}>О нас</div></div>
        <div className="card card-pad">
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>{aboutClinic.lead}</p>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>{aboutClinic.body}</p>
          <div className="row" style={{ gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-2)' }}>
            <Icon name="shield-check" size={18} style={{ color: 'var(--gold-deep)' }} />
            <div className="faint" style={{ fontSize: 12 }}>Лицензия на медицинскую деятельность {aboutClinic.license}</div>
          </div>
        </div>
        <div className="cta-banner" style={{ marginTop: 12, padding: 16 }}>
          <p style={{ margin: 0, position: 'relative' }} className="serif">«{aboutClinic.mission}»</p>
        </div>
      </div>

      {/* advantages */}
      <div className="section">
        <div className="section-head" style={{ marginBottom: 10 }}><div className="section-title" style={{ fontSize: 18 }}>Почему мы</div></div>
        <div className="wrap-gap">
          {advantages.map((a) => (
            <div className="card card-pad row" key={a.title} style={{ gap: 14 }}>
              <span className="quick-ic brand" style={{ width: 44, height: 44 }}><Icon name={a.icon as IconName} size={22} /></span>
              <div className="grow">
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{a.title}</div>
                <div className="faint" style={{ fontSize: 12.5, marginTop: 2, lineHeight: 1.4 }}>{a.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* map */}
      <div className="section">
        <div className="section-head" style={{ marginBottom: 10 }}><div className="section-title" style={{ fontSize: 18 }}>Как нас найти</div></div>
        <a className="map-wrap" href={mapUrl} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
          <div style={{
            height: 168, position: 'relative',
            background: 'linear-gradient(135deg,#dbe7f2,#eef3f8)',
            backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(14,107,168,0.12), transparent 30%), linear-gradient(90deg, transparent 49%, rgba(120,145,170,0.25) 50%, transparent 51%), linear-gradient(0deg, transparent 49%, rgba(120,145,170,0.25) 50%, transparent 51%)',
            backgroundSize: '100% 100%, 44px 44px, 44px 44px',
          }}>
            <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-100%)', color: 'var(--brand)' }}>
              <Icon name="pin" size={40} fill="current" style={{ filter: 'drop-shadow(0 6px 10px rgba(14,107,168,0.4))' }} />
            </div>
            <div className="glass" style={{ position: 'absolute', left: 12, right: 12, bottom: 12, borderRadius: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="route" size={18} style={{ color: 'var(--brand)' }} />
              <div className="grow"><div style={{ fontWeight: 700, fontSize: 13 }}>{clinic.addressShort}</div><div className="faint" style={{ fontSize: 11 }}>Открыть в Яндекс.Картах</div></div>
              <Icon name="arrow-up-right" size={18} className="faint" />
            </div>
          </div>
        </a>
      </div>

      {/* hours */}
      <div className="section">
        <div className="card card-pad">
          <div className="row" style={{ gap: 10, marginBottom: 10 }}><Icon name="clock" size={18} style={{ color: 'var(--brand)' }} /><b>Часы работы</b></div>
          {clinic.hours.map((h) => (
            <div className="summary-row" key={h.d}><span className="k">{h.d}</span><span className="v">{h.h}</span></div>
          ))}
        </div>
      </div>

      {/* contacts */}
      <div className="section">
        <div className="section-head" style={{ marginBottom: 10 }}><div className="section-title" style={{ fontSize: 18 }}>Контакты</div></div>
        <div className="list-card">
          {contacts.map((c) => (
            <a key={c.k} className="contact-item" href={c.href} target={c.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <span className="contact-ic"><Icon name={c.icon} size={19} /></span>
              <div className="grow"><div className="contact-k">{c.k}</div><div className="contact-v">{c.v}</div></div>
              <Icon name="chevron-right" size={17} className="faint" />
            </a>
          ))}
        </div>
      </div>

      {/* faq */}
      <div className="section">
        <div className="section-head" style={{ marginBottom: 10 }}><div className="section-title" style={{ fontSize: 18 }}>Частые вопросы</div></div>
        <div className="list-card">
          {faq.map((f, i) => (
            <div key={i} className={`acc-item ${open === i ? 'open' : ''}`}>
              <button className="acc-q" style={{ width: '100%', textAlign: 'left' }} onClick={() => setOpen(open === i ? null : i)}>
                <span className="grow">{f.q}</span>
                <Icon name="plus" size={18} className="ic" strokeWidth={2.4} />
              </button>
              <div className="acc-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dock">
        <button className="btn btn-primary btn-block btn-lg" onClick={onBook}><Icon name="calendar-check" size={20} /> Записаться на приём</button>
      </div>
    </div>
  );
}
