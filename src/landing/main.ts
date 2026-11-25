import { setupLanguage } from './language';
import { ZetaHero } from './zetaHero';

setupLanguage();

const ENTRY_URL = 'app.html';
const heroSection = document.querySelector<HTMLElement>('#hero');
const stage = document.querySelector<HTMLElement>('#stage');
const canvas = document.querySelector<HTMLCanvasElement>('#hero-canvas');
const nav = document.querySelector<HTMLElement>('#nav');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let hero: ZetaHero | null = null;
if (canvas && stage) {
  try {
    hero = new ZetaHero(canvas, stage, { reducedMotion });
  } catch (error) {
    console.warn('landing: WebGL 初始化失败，回退为静态视觉', error);
    document.documentElement.classList.add('no-webgl');
  }
}

let navigating = false;

function enterMainExperience(): void {
  if (navigating) return;
  navigating = true;
  document.body.classList.add('is-leaving');
  hero?.enter();
  window.setTimeout(
    () => window.location.assign(ENTRY_URL),
    hero ? hero.leaveMilliseconds : reducedMotion ? 120 : 240,
  );
}

heroSection?.addEventListener('click', (event) => {
  if ((event.target as HTMLElement).closest('[data-scroll]')) return;
  enterMainExperience();
});

document.querySelectorAll<HTMLElement>('[data-enter]').forEach((element) => {
  element.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    enterMainExperience();
  });
});

document.querySelectorAll<HTMLElement>('[data-scroll]').forEach((element) => {
  element.addEventListener('click', (event) => {
    event.stopPropagation();
    const selector = element.dataset.scroll;
    if (!selector) return;
    document.querySelector(selector)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  });
});

if (nav) {
  const updateNav = (): void => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
}

const reveals = document.querySelectorAll<HTMLElement>('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((element) => element.classList.add('in'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  reveals.forEach((element) => observer.observe(element));
}

window.addEventListener('pagehide', (event) => {
  if (!event.persisted) hero?.dispose();
});
