// Fade sections in as they enter the viewport (port of the prototype's scanReveal).
const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }),
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );
  els.forEach((el) => {
    // Already on screen at load (or reached via an anchor): show without animating
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return;
    el.classList.add('rv');
    io.observe(el);
    // Safety net when the observer never fires (in-app browsers, find-in-page): show after 1.2 s
    setTimeout(() => el.classList.add('is-in'), 1200);
  });
}

export {};
