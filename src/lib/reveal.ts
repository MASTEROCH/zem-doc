/**
 * Scroll-reveal движок (Apple/Linear-стиль).
 *
 * Блоки, что уже видны при открытии экрана, показываются мгновенно — чтобы не
 * драться с View-Transition переходом экрана. Всё, что ниже сгиба, плавно
 * «поднимается» по мере прокрутки. Работает автоматически: наблюдаем за
 * .screen и размечаем секции; MutationObserver ловит смену экрана.
 */

const REVEAL_SELECTOR = '.section';
const VISIBLE_MARGIN = 0.9; // доля высоты вьюпорта — что считаем «над сгибом»

let io: IntersectionObserver | null = null;
let mo: MutationObserver | null = null;
let queued = false;

function show(el: HTMLElement, instant: boolean) {
  if (instant) el.classList.add('rv-noanim');
  el.classList.add('rv-in');
  if (instant) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('rv-noanim')));
}

function tag(el: HTMLElement) {
  if (el.dataset.rv) return;
  el.dataset.rv = '1';
  // над сгибом при первом появлении экрана → мгновенно, без «двойной» анимации
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 800;
  if (rect.top < vh * VISIBLE_MARGIN) {
    el.classList.add('rv');
    show(el, true);
    return;
  }
  el.classList.add('rv');
  io?.observe(el);
}

function scan() {
  queued = false;
  const root = document.getElementById('root');
  if (!root) return;
  root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(tag);
}

function scheduleScan() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(scan);
}

export function initReveal() {
  if (typeof window === 'undefined') return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; // уважаем системную настройку — без reveal

  document.documentElement.classList.add('rv-on');

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          show(e.target as HTMLElement, false);
          io?.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );

  scan();

  // смена экрана / подгрузка контента → перосмотреть DOM
  mo = new MutationObserver(scheduleScan);
  const root = document.getElementById('root');
  if (root) mo.observe(root, { childList: true, subtree: true });
}
