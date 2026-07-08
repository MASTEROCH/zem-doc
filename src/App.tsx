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
import { PricesScreen } from './screens/PricesScreen';
import { NewsScreen } from './screens/NewsScreen';
import { PromotionsScreen } from './screens/PromotionsScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AnalysesScreen } from './screens/AnalysesScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { toast } from './lib/ui';

const ONB_KEY = 'zem_onboarded';

export type Screen =
  | 'home' | 'departments' | 'department' | 'doctors' | 'doctor'
  | 'booking' | 'confirm' | 'account' | 'clinic' | 'prices' | 'news' | 'promotions' | 'search' | 'settings' | 'analyses';

const TAB_SCREENS: Screen[] = ['home', 'departments', 'doctors', 'account'];

const DEPTH: Record<Screen, number> = {
  home: 0, departments: 0, doctors: 0, account: 0,
  department: 1, doctor: 1, booking: 1, clinic: 1, prices: 1, news: 1, promotions: 1, search: 1, settings: 1, analyses: 1, confirm: 2,
};

function navigate(dir: 'fwd' | 'back', setter: () => void) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (typeof d.startViewTransition === 'function') {
    document.documentElement.dataset.dir = dir;
    d.startViewTransition(setter);
  } else setter();
}

function initialScreen(): Screen {
  if (typeof window === 'undefined') return 'home';
  const s = new URLSearchParams(window.location.search).get('screen') as Screen | null;
  const valid: Screen[] = ['home', 'departments', 'department', 'doctors', 'doctor', 'booking', 'account', 'clinic', 'prices', 'news', 'promotions', 'search', 'settings', 'analyses'];
  return s && valid.includes(s) ? s : 'home';
}

export function App() {
  const [screen, setScreenRaw] = useState<Screen>(initialScreen);
  const [deptId, setDeptId] = useState<string>('cardio');
  const [deptGroup, setDeptGroup] = useState<string>('all');
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

  const setScreen = (s: Screen) => navigate(DEPTH[s] < DEPTH[screen] ? 'back' : 'fwd', () => setScreenRaw(s));

  useEffect(() => {
    document.body.removeAttribute('data-near-bottom');
    document.body.toggleAttribute('data-tab', TAB_SCREENS.includes(screen));
  }, [screen]);
  useEffect(() => {
    function onScroll(e: Event) {
      const el = e.target as HTMLElement | null;
      if (!el || !el.classList?.contains('screen')) return;
      const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
      const near = dist < 120;
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
  const openDepartments = (group = 'all') => { setDeptGroup(group); setScreen('departments'); };

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

  const isTab = TAB_SCREENS.includes(screen);
  const navCurrent: Screen = isTab ? screen : 'home';

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen onBook={() => openBooking()} onOpenDept={openDept} onDoctors={() => setScreen('doctors')}
          onDepartments={() => openDepartments()} onOpenDoctor={openDoctor} onClinic={() => setScreen('clinic')} onSearch={() => setScreen('search')}
          onAnalyses={() => setScreen('analyses')} onAccount={() => setScreen('account')} />
      )}
      {screen === 'departments' && (
        <DepartmentsScreen onOpenDept={openDept} favorites={favorites} onToggleFav={toggleFav} initialGroup={deptGroup} />
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
        <BookingScreen prefill={prefill} userName={userName} onBack={() => setScreen('home')}
          onConfirm={(r) => { setResult(r); setScreen('confirm'); }} />
      )}
      {screen === 'confirm' && result && (
        <ConfirmScreen result={result} onHome={() => setScreen('home')} onAccount={() => setScreen('account')} />
      )}
      {screen === 'account' && (
        <AccountScreen userName={userName} onSetName={setUserName} favCount={favorites.size}
          onBook={() => openBooking()} onClinic={() => setScreen('clinic')} onDoctors={() => setScreen('doctors')}
          onDepartments={() => openDepartments()} onFavorites={() => openDepartments('fav')}
          onPrices={() => setScreen('prices')} onNews={() => setScreen('news')} onPromotions={() => setScreen('promotions')} onSettings={() => setScreen('settings')} onAnalyses={() => setScreen('analyses')} />
      )}
      {screen === 'clinic' && (
        <ClinicScreen onBack={() => setScreen('home')} onBook={() => openBooking()} />
      )}
      {screen === 'prices' && (
        <PricesScreen onBack={() => setScreen('account')} onBook={openBooking} />
      )}
      {screen === 'news' && (
        <NewsScreen onBack={() => setScreen('account')} onBook={() => openBooking()} />
      )}
      {screen === 'promotions' && (
        <PromotionsScreen onBack={() => setScreen('account')} onBook={(p) => openBooking(p)} onOpenDoctor={openDoctor} />
      )}
      {screen === 'search' && (
        <SearchScreen onBack={() => setScreen('home')} onOpenDept={openDept} onOpenDoctor={openDoctor} onBook={openBooking} />
      )}
      {screen === 'settings' && (
        <SettingsScreen onBack={() => setScreen('account')} />
      )}
      {screen === 'analyses' && (
        <AnalysesScreen onBack={() => setScreen('account')} onBook={() => openBooking()} />
      )}

      {isTab && (
        <>
          <div className="nav-veil" aria-hidden />
          <BottomNav current={navCurrent} onChange={(s) => (s === 'booking' ? openBooking() : setScreen(s))} />
          <DrZem onBook={(d) => openBooking(d ? { deptId: d } : {})} onOpenDept={openDept} onOpenDoctor={openDoctor}
            onDoctors={() => setScreen('doctors')} onClinic={() => setScreen('clinic')} />
        </>
      )}

      <SheetHost />
      <LightboxHost />
      <ToastHost />
    </div>
  );
}
