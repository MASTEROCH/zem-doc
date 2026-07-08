/** Центр уведомлений — sheet со списком (напоминание о приёме, анализы, акция). */
import { Icon, type IconName } from '../components/Icon';
import { openSheet, closeSheet } from './ui';
import { upcoming } from './appointments';

type Notif = { icon: IconName; tone: string; title: string; sub: string; when: string; onTap?: () => void };

export function openNotifications(opts: { onAnalyses?: () => void; onAccount?: () => void } = {}) {
  const up = upcoming()[0];
  const items: Notif[] = [
    ...(up ? [{
      icon: 'calendar-check' as IconName, tone: 'brand',
      title: `Приём: ${up.deptTitle} · ${up.time}`,
      sub: `${up.dateLabel} · ${up.doctorName}. Возьмите паспорт и полис.`,
      when: 'напоминание',
      onTap: opts.onAccount && (() => { closeSheet(); opts.onAccount!(); }),
    }] : []),
    {
      icon: 'flask', tone: 'teal',
      title: 'Результаты анализов готовы',
      sub: 'Общий анализ крови и биохимия — уже в приложении.',
      when: 'сегодня',
      onTap: opts.onAnalyses && (() => { closeSheet(); opts.onAnalyses!(); }),
    },
    {
      icon: 'gift', tone: 'gold',
      title: 'Чек-ап «Здоровое сердце» −20%',
      sub: 'Комплексная проверка сердца по специальной цене до конца месяца.',
      when: 'вчера',
    },
    {
      icon: 'shield-check', tone: 'ok',
      title: 'Добро пожаловать!',
      sub: 'Бонусная программа активна: списывайте до 20% стоимости приёма.',
      when: 'ранее',
    },
  ];

  openSheet({
    title: 'Уведомления',
    subtitle: `${items.length} новых`,
    body: (
      <div className="wrap-gap" style={{ gap: 10 }}>
        {items.map((n) => (
          <button key={n.title} className="card card-pad row notif-item" style={{ width: '100%', gap: 12, textAlign: 'left', alignItems: 'flex-start' }}
            onClick={n.onTap} disabled={!n.onTap}>
            <span className={`quick-ic ${n.tone}`} style={{ width: 40, height: 40, flex: 'none' }}><Icon name={n.icon} size={20} /></span>
            <div className="grow">
              <div className="between" style={{ gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{n.title}</div>
                <span className="faint" style={{ fontSize: 10.5, flex: 'none' }}>{n.when}</span>
              </div>
              <div className="faint" style={{ fontSize: 12, lineHeight: 1.45, marginTop: 3 }}>{n.sub}</div>
            </div>
            {n.onTap && <Icon name="chevron-right" size={16} className="faint" style={{ marginTop: 10 }} />}
          </button>
        ))}
      </div>
    ),
    actions: <button className="btn btn-ghost btn-block" onClick={closeSheet}>Закрыть</button>,
  });
}
