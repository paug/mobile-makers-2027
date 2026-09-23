// Headline weight follows viewport position (port of the DS ScrollTitle component).
const FROM = 400;
const TO = 700;

const els = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-title]'));
let raf = 0;

function update() {
  raf = 0;
  const vh = window.innerHeight || 1;
  for (const el of els) {
    const r = el.getBoundingClientRect();
    let p: number;
    if (el.dataset.scrollTitle === 'leave') {
      p = 1 - Math.min(1, Math.max(0, -r.top / (r.height + vh * 0.35)));
    } else {
      const c = (r.top + r.height / 2) / vh;
      p = Math.min(1, (1 - Math.min(1, Math.abs(c - 0.5) / 0.5)) * 1.6);
    }
    const w = Math.round(FROM + (TO - FROM) * p);
    el.style.fontWeight = String(w);
    el.style.fontVariationSettings = `"wght" ${w}`;
  }
}

const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
if (els.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
}

export {};
