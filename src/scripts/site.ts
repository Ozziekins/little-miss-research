/**
 * Site-wide behaviour that survives page navigations (the layout uses Astro's
 * ClientRouter, so this module runs once and keeps the music playing between pages).
 */
import { Music } from '@/scripts/music';

const PREF_KEY = 'lmr:music';
const music = new Music();

const wantsMusic = () => localStorage.getItem(PREF_KEY) !== 'off';

function syncButton() {
  const btn = document.querySelector<HTMLButtonElement>('[data-music]');
  if (!btn) return;
  const on = wantsMusic();
  btn.setAttribute('aria-pressed', String(on));
  btn.classList.toggle('is-waiting', on && !music.playing);
  btn.dataset.label = !on ? 'play music' : music.playing ? 'mute' : 'tap anywhere for music ♪';
}

/**
 * Browsers only allow sound after the visitor interacts with the page, so music is
 * "on by default" in the sense that it starts on the first click, tap or key press.
 */
function onFirstGesture(e: Event) {
  if ((e.target as Element | null)?.closest?.('[data-music]')) return;
  if (wantsMusic() && !music.playing) void music.play().then(syncButton);
  removeGestureListeners();
}
const GESTURES = ['pointerdown', 'keydown', 'touchstart'] as const;
const removeGestureListeners = () => GESTURES.forEach((g) => document.removeEventListener(g, onFirstGesture, true));
GESTURES.forEach((g) => document.addEventListener(g, onFirstGesture, { capture: true, passive: true }));

document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('[data-music]')) return;
  // While waiting for a gesture the button starts the music rather than muting silence.
  if (wantsMusic() && music.playing) {
    localStorage.setItem(PREF_KEY, 'off');
    music.stop();
  } else {
    localStorage.setItem(PREF_KEY, 'on');
    removeGestureListeners();
    void music.play().then(syncButton);
  }
  syncButton();
});

// Header menu (the header is re-rendered on each navigation, so bind per page).
document.addEventListener('astro:page-load', () => {
  syncButton();
  const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav || toggle.dataset.bound) return;
  toggle.dataset.bound = 'true';
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
});

document.addEventListener('keydown', (e) => {
  const nav = document.getElementById('site-nav');
  if (e.key !== 'Escape' || !nav?.classList.contains('is-open')) return;
  const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
  toggle?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
  toggle?.focus();
});

// Remember where people came from, so "surprise me" never sends them back to the same paper.
document.addEventListener('astro:before-preparation', (e) => {
  sessionStorage.setItem('lmr:from', (e as Event & { from: URL }).from.pathname);
});
