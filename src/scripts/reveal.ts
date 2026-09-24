// Scroll-driven entrances: sections fade in (port of the prototype's scanReveal), card grids unfold one sheet
// after another, and figures count up. Nothing is hidden until this script runs, so the page works without JS.
const motionOk = 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const onScreen = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.top < innerHeight && r.bottom > 0;
};

// Calls `run` once when `el` enters the viewport. A passive scroll check backs up the observer, which some
// in-app browsers never fire, so content can never stay hidden once it is on screen.
const whenVisible = (el: Element, run: () => void) => {
  let done = false;
  const go = () => {
    if (done) return;
    done = true; io.disconnect(); removeEventListener('scroll', check); run();
  };
  const check = () => { if (onScreen(el)) go(); };
  const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && go(), { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  io.observe(el);
  addEventListener('scroll', check, { passive: true });
  check();
};

if (motionOk) {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    // Already on screen at load (or reached via an anchor): show without animating
    if (onScreen(el)) return;
    el.classList.add('rv');
    whenVisible(el, () => el.classList.add('is-in'));
  });

  document.querySelectorAll<HTMLElement>('[data-unfold]').forEach((grid) => {
    const kids = [...grid.children] as HTMLElement[];
    kids.forEach((k, i) => k.style.setProperty('--uf-i', String(i)));
    grid.classList.add('uf-wait');
    whenVisible(grid, () => {
      grid.classList.add('uf-go');
      void grid.offsetWidth; // commit the folded state so removing it transitions
      grid.classList.remove('uf-wait');
      // Hand transitions back to the components (hover lift, growing ear) once the last sheet is flat
      setTimeout(() => grid.classList.remove('uf-go'), kids.length * 80 + 900);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = parseInt(el.textContent ?? '', 10);
    if (!Number.isFinite(target) || onScreen(el)) return;
    const suffix = (el.textContent ?? '').replace(/^\d+/, '');
    whenVisible(el, () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / 1100);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0' + suffix;
      requestAnimationFrame(tick);
    });
  });
}

export {};
