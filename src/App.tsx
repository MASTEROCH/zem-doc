import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { DrZem } from './components/DrZem';
import { SheetHost, ToastHost, LightboxHost } from './components/UIHost';
import { HomeScreen } from './screens/HomeScreen';
import { DepartmentsScreen } from './screens/DepartmentsScreen';
import { DepartmentScreen } from './screens/DepartmentScreen';
import { DoctorsScreen } from './screens/DoctorsScreen';
import { DoctorScreen } from './screens/DoctorScreen';
import { BookingScreen, type BookingResult } from './screens/BookingScreen';
import { ConfirmScreen } from './screens/ConfirmScreen';
import { AccountScreen } from './screens/AccountScreen';
import { ClinicScreen } from './screens/ClinicScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { toast } from './lib/ui';

const ONB_KEY = 'zem_onboarded';

export type Screen =
  | 'home' | 'departments' | 'department' | 'doctors' | 'doctor'
  | 'booking' | 'confirm' | 'account' | 'clinic';

const NAV_SCREENS: Screen[] = ['home', 'departments', 'doctors', 'account'];

function navigate(setter: () => void) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (typeof d.startViewTransition === 'function') d.startViewTransition(setter);
  else setter();
}

function initialScreen(): Screen {
  if (typeof window === 'undefined') return 'home';
  const s = new URLSearchParams(window.location.search).get('screen') as Screen | null;
  const valid: Screen[] = ['home','departments','department','doctors','doctor','booking','account','clinic'];
  return s && valid.includes(s) ? s : 'home';
}

export function App() {
  const [screen, setScreenRaw] = useState<Screen>(initialScreen);
  const [deptId, setDeptId] = useState<string>('cardio');
  const [doctorId, setDoctorId] = useState<string>('morozova-n');
  const [prefill, setPrefill] = useState<{ deptId?: string; doctorId?: string }>({});
  const [result, setResult] = useState<BookingResult | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['uzi', 'cardio']));
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (window.location.search.includes('seed=1')) return false;
    return !localStorage.getItem(ONB_KEY);
  });
  const [userName, setUserName] = useState('Гость');

  const setScreen = (s: Screen) => navigate(() => setScreenRaw(s));

  useEffect(() => { document.body.removeAttribute('data-near-bottom'); }, [screen]);
  useEffect(() => {
    function onScroll(e: Event) {
      const el = e.target as HTMLElement | null;
      if (!el || !el.classList?.contains('screen')) return;
      const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
      const near = dist < 150;
      const b = document.body;
      if (near && !b.hasAttribute('data-near-bottom')) b.setAttribute('data-near-bottom', '');
      else if (!near && b.hasAttribute('data-near-bottom')) b.removeAttribute('data-near-bottom');
    }
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', onScroll, { capture: true });
  }, []);

  const openDept = (id: string) => { setDeptId(id); setScreen('department'); };
  const openDoctor = (id: string) => { setDoctorId(id); setScreen('doctor'); };
  const openBooking = (p: { deptId?: string; doctorId?: string } = {}) => { setPrefill(p); setScreen('booking'); };

  const toggleFav = (id: string) => setFavorites((prev) => {
    const n = new Set(prev);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  function finishOnboarding(name: string) {
    localStorage.setItem(ONB_KEY, '1');
    setUserName(name || 'Гость');
    setShowOnboarding(false);
    setScreenRaw('home');
    setTimeout(() => toast(`Добро пожаловать в «Земский Доктор»${name ? ', ' + name : ''}!`, 'success'), 250);
  }

  if (showOnboarding) {
    return (
      <div className="app">
        <OnboardingScreen onComplete={finishOnboarding} onSkip={() => finishOnboarding('')} />
        <ToastHost />
      </div>
    );
  }

  const navCurrent: Screen = NAV_SCREENS.includes(screen) ? screen
    : screen === 'department' || screen === 'clinic' ? 'departments'
    : screen === 'doctor' ? 'doctors' : 'home';

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen onBook={() => openBooking()} onOpenDept={openDept} onDoctors={() => setScreen('doctors')}
          onDepartments={() => setScreen('departments')} onOpenDoctor={openDoctor} onClinic={() => setScreen('clinic')} />
      )}
      {screen === 'departments' && (
        <DepartmentsScreen onOpenDept={openDept} favorites={favorites} onToggleFav={toggleFav} />
      )}
      {screen === 'department' && (
        <DepartmentScreen deptId={deptId} onBack={() => setScreen('departments')} onBook={openBooking}
          onOpenDoctor={openDoctor} isFav={favorites.has(deptId)} onToggleFav={() => toggleFav(deptId)} />
      )}
      {screen === 'doctors' && (
        <DoctorsScreen onOpenDoctor={openDoctor} onBook={openBooking} />
      )}
      {screen === 'doctor' && (
        <DoctorScreen doctorId={doctorId} onBack={() => setScreen('doctors')} onBook={openBooking} onOpenDept={openDept} />
      )}
      {screen === 'booking' && (
        <BookingScreen prefill={prefill} onBack={() => setScreen('home')}
          onConfirm={(r) => { setResult(r); setScreen('confirm'); }} />
      )}
      {screen === 'confirm' && result && (
        <ConfirmScreen result={result} onHome={() => setScreen('home')} onAccount={() => setScreen('account')} />
      )}
      {screen === 'account' && (
        <AccountScreen userName={userName} onBook={() => openBooking()} onClinic={() => setScreen('clinic')}
          onDoctors={() => setScreen('doctors')} onDepartments={() => setScreen('departments')} />
      )}
      {screen === 'clinic' && (
        <ClinicScreen onBack={() => setScreen('home')} onBook={() => openBooking()} />
      )}

      <div className="nav-veil" aria-hidden />
      <BottomNav current={navCurrent} onChange={(s) => (s === 'booking' ? openBooking() : setScreen(s))} />

      <DrZem onBook={(d) => openBooking(d ? { deptId: d } : {})} onOpenDept={openDept}
        onDoctors={() => setScreen('doctors')} onClinic={() => setScreen('clinic')} />

      <SheetHost />
      <LightboxHost />
      <ToastHost />
    </div>
  );
}
