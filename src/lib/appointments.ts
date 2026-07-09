/**
 * Записи на приём — живой слой данных (localStorage).
 * Созданная через мастер запись появляется в Кабинете; отмена/завершение — статусы.
 */
import { useEffect, useState } from 'react';

export type ApptStatus = 'upcoming' | 'done' | 'cancelled';
export type Appointment = {
  id: string;
  deptTitle: string;
  doctorName: string;
  dateKey: string;   // YYYY-MM-DD
  dateLabel: string; // «Пн, 14 июля»
  time: string;      // «15:30»
  price: number;
  status: ApptStatus;
};

const KEY = 'zem_appointments';
const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MO = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

function fmt(dt: Date) {
  return { key: dt.toISOString().slice(0, 10), label: `${WD[dt.getDay()]}, ${dt.getDate()} ${MO[dt.getMonth()]}` };
}
function shift(days: number) { const d = new Date(); d.setDate(d.getDate() + days); return d; }

/** Демо-наполнение: одна будущая запись + история прошлых приёмов */
function seed(): Appointment[] {
  const a = fmt(shift(5)), b = fmt(shift(-18)), c = fmt(shift(-47)), d = fmt(shift(-92));
  return [
    { id: 'seed-up', deptTitle: 'Кардиология', doctorName: 'Морозова Наталья Юрьевна', dateKey: a.key, dateLabel: a.label, time: '15:30', price: 2200, status: 'upcoming' },
    { id: 'seed-d1', deptTitle: 'Терапия', doctorName: 'Козлова Ирина Владимировна', dateKey: b.key, dateLabel: b.label, time: '10:00', price: 1800, status: 'done' },
    { id: 'seed-d2', deptTitle: 'УЗИ-диагностика', doctorName: 'Смирнов Алексей Петрович', dateKey: c.key, dateLabel: c.label, time: '12:30', price: 1500, status: 'done' },
    { id: 'seed-d3', deptTitle: 'Эндокринология', doctorName: 'Волкова Елена Сергеевна', dateKey: d.key, dateLabel: d.label, time: '16:00', price: 2000, status: 'done' },
  ];
}

let cache: Appointment[] | null = null;
const listeners = new Set<() => void>();

function load(): Appointment[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Appointment[]) : seed();
  } catch { cache = seed(); }
  return cache;
}
function save(list: Appointment[]) {
  cache = list;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

export function getAppointments(): Appointment[] { return load(); }
export const upcoming = () => load().filter((a) => a.status === 'upcoming').sort((x, y) => x.dateKey.localeCompare(y.dateKey));
export const history = () => load().filter((a) => a.status !== 'upcoming').sort((x, y) => y.dateKey.localeCompare(x.dateKey));

export function addAppointment(a: Omit<Appointment, 'id' | 'status'>) {
  const list = load();
  // защита от дублей (StrictMode / повторный confirm)
  if (list.some((x) => x.status === 'upcoming' && x.dateKey === a.dateKey && x.time === a.time && x.deptTitle === a.deptTitle)) return;
  save([{ ...a, id: `ap-${Date.now().toString(36)}`, status: 'upcoming' }, ...list]);
}
export function cancelAppointment(id: string) {
  save(load().map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a)));
}

const MO_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];
/** День и месяц для плашки даты записи */
export function apptDayMonth(a: Appointment) {
  const dt = new Date(a.dateKey + 'T12:00:00');
  return { d: String(dt.getDate()), m: MO_SHORT[dt.getMonth()] };
}

/** React-хук: перерисовка при изменении записей */
export function useAppointments(): Appointment[] {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return load();
}
