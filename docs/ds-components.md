# Mobile Makers DS components: reimplementation spec

Source: Claude Design project cf5be843, `_ds/mobile-makers-design-system-.../_ds_bundle.js` (React). Tokens live in `src/styles/ds/`. All components are sharp rectangles (border-radius 0). Values below reference CSS custom properties from the tokens.

## Implementation notes for static Astro

- **Button**: `<button>` or `<a>` (as=a). Base: `display:inline-flex; align-items:center; justify-content:center; gap:10px; border-radius:0; white-space:nowrap; text-decoration:none; font: var(--weight-semibold) <fs>/1 var(--font-body)` (note: body font, Newsreader). Sizes: sm height var(--control-sm) 36px, padding 0 14px, font var(--text-sm), icon 16; md 44px, 0 20px, var(--text-md), icon 18; lg 56px, 0 28px, var(--text-lg), icon 22. fullWidth: width 100%.
  - Variants (bg / fg / hover bg / hover shadow): primary var(--red) / #fff / var(--red-light) / var(--shadow-fold-brand); accent var(--cyan) / var(--ink-1) / var(--cyan-light) / var(--shadow-fold-cyan); secondary var(--paper-0) / var(--ink-1) / var(--paper-2) / var(--shadow-fold-lg), border 1.5px solid var(--border-default); inverse var(--graphite) / var(--paper-1) / var(--ink-2) / var(--shadow-fold-lg); ghost transparent / var(--ink-1) / var(--paper-2), flat (no shadow, no transform).
  - Non-secondary variants have border `null` in source (invalid declaration, so effectively no border). For CSS: `border: 1.5px solid transparent` keeps sizes consistent; source visually = no border.
  - States: rest shadow var(--shadow-fold-sm); hover `transform: translateY(-2px)` + glow shadow; active `transform: scale(.97)` + var(--shadow-fold-sm). Transition: `transform var(--dur-spatial-fast) var(--ease-spring), box-shadow var(--dur-effect) var(--ease-emphasized), background var(--dur-effect) var(--ease-emphasized)`.
  - Disabled: bg var(--paper-3), color var(--ink-3), border 1.5px solid var(--paper-3), no shadow/transform, cursor not-allowed, opacity .7.
  - icon before children, iconRight after, via Icon component.
- **IconButton**: square `<button aria-label title>`, `display:inline-grid; place-items:center; padding:0; border-radius:0`, size = control-sm/md/lg (36/44/56), icon 16/20/24. Default variant secondary: bg var(--paper-0) (hover var(--paper-1)), fg var(--ink-1), border 1px solid var(--border-default). primary: bg var(--cyan) (hover var(--cyan-light)), fg var(--paper-0), no border. inverse: bg var(--ink-1), fg var(--paper-0), no border. ghost: transparent (hover var(--paper-2)), fg ink-1, no border, flat. Rest shadow none; hover var(--shadow-fold) + translateY(-1px); active var(--shadow-fold-sm) + scale(.96). Same transition as Button. Disabled opacity .5, flat.
- **Tabs (boxed)**: container `role=tablist; display:flex; gap:0; background:var(--surface-container); padding:4px; border-radius:0`. Each tab `<button role=tab aria-selected>`: height 36px, padding 0 16px, font `var(--weight-semibold) var(--text-sm)/1 var(--font-ui)`, border 0, radius 0, cursor pointer; selected bg var(--paper-0), color var(--ink-1), box-shadow var(--shadow-fold-sm); unselected transparent, var(--ink-3), no shadow. Transition `background var(--dur-effect) var(--ease-emphasized), box-shadow var(--dur-effect), color var(--dur-effect)`. Optional count span: margin-left 8px, font var(--type-caps), color var(--red) when selected else var(--ink-4). Needs tiny JS to switch aria-selected / panels. (Line variant: gap 28px, border-bottom 1px solid var(--border-subtle); tabs padding 10px 0 14px, font semibold var(--text-md)/1 var(--font-ui), selected `box-shadow: inset 0 -3px 0 var(--red)`, transition color var(--dur-fast).)
- **Card**: outer div `position:relative; border-radius:0; box-shadow:<sh>` where shadow = fold (default) var(--shadow-fold), paper var(--shadow-paper), lg var(--shadow-fold-lg), none. Inner div (the shadow must be on the wrapper because clip-path clips box-shadow): `position:relative; background; color; border:1px solid var(--border-subtle)` (paper tone only, else none); `clip-path: polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%); padding:<padding, default var(--space-6)>; height:100%; box-sizing:border-box; overflow:hidden`. Tones [bg, fg]: paper [paper-0, ink-1], brand [cyan, ink-1], red/accent [red, #fff], green [green, ink-1], graphite/inverse [graphite, paper-1]. Non-paper tones add overlay span `position:absolute; inset:0; background-image:var(--fold-light); pointer-events:none`. Contains DogEar (face paper for paper tone, dark for graphite/inverse, light otherwise).
- **DogEar** (span, first child of clipped element): `position:absolute; top:0; right:0; width:14px; height:14px; background:<var(--fold-corner-face | -paper | -dark)>; clip-path:polygon(0 0,100% 100%,0 100%); box-shadow:inset 1px -1px 2px rgba(40,40,40,.16); pointer-events:none; transition: width var(--dur-spatial-fast) var(--ease-spring), height var(--dur-spatial-fast) var(--ease-spring)`.
- **Badge** `<span>`: `display:inline-flex; align-items:center; gap:6px; height:24px; padding:0 10px; border-radius:0; font:var(--type-caps); letter-spacing:var(--tracking-caps); text-transform:uppercase; white-space:nowrap`. Tones [bg, fg]: neutral [var(--paper-2), var(--ink-1)], brand [var(--red), #fff], accent [var(--cyan), var(--ink-1)], success [var(--green), var(--ink-1)], info [var(--cyan-light), var(--ink-1)], inverse [var(--ink-1), var(--paper-1)].
- **Tag** `<span>`: `display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 10px; border-radius:0; font:var(--type-label); user-select:none; white-space:nowrap; transition:background var(--dur-effect) var(--ease-emphasized)`. Unselected bg var(--surface-container-low), color var(--ink-1), border 1px solid var(--border-default). Selected bg var(--ink-1), color var(--paper-1), border 1px solid var(--ink-1). Clickable: role=button, tabindex 0, cursor pointer. Removable: inner button 18x18, grid centered, padding 0, margin 0 -4px 0 0, transparent, border 0, color inherit, with Icon x size 14.
- **Icon**: Lucide (ISC) path data, `<svg aria-hidden width=size height=size viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;flex:none"><path d="..."/></svg>`, default size 20. Unknown names fall back to a CSS mask from `https://unpkg.com/lucide-static@0.475.0/icons/<name>.svg` (span with background:currentColor and mask `url(...) center / contain no-repeat`). Full path map copied verbatim in the source section below (includes arrow-right, map-pin, train-front, info, coffee, clock, check, mic, ticket, calendar, users, linkedin, external-link, user, youtube, mail, menu, x).
- **Fold** (decorative, aria-hidden div): width = height = size (default 120px), `flex:none; clip-path:<shape>; background:<hue>; background-image: linear-gradient(<dir>, rgba(255,255,255,.3) 0 50%, rgba(40,40,40,.22) 50% 100%); filter: drop-shadow(0 12px 24px rgba(40,40,40,.14)); transform: rotate(<rotate>deg)` (only if rotate != 0). Crease dir: vertical (default) `to right`, horizontal `to bottom`, diagonal `135deg`. Shapes: crane `polygon(0 100%,50% 0,100% 100%)`, kite (default) `polygon(50% 0,100% 40%,50% 100%,0 40%)`, shard `polygon(0 0,100% 0,72% 100%,0 100%)`, hexafold `polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)`, corner `polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)`. Hues: cyan var(--cyan) #20B8E8, red var(--red) #E8402C, green var(--green) #3DD16E, graphite var(--graphite) #282828, ink var(--graphite-dark) #161616, paper var(--paper-0) #FFF; any other string is used as a raw colour. Note: `background` shorthand sets the colour, then `background-image` layers the half-light / half-shade gradient on top. It is CSS clip-path on a div, not SVG.
- **ScrollTitle**: heading (default h2) whose font-weight follows viewport position. Props from=400, to=700, mode='center'|'leave'. Inline `transition: font-weight 120ms linear, font-variation-settings 120ms linear`. On scroll/resize (passive, rAF-throttled), compute p from `r = el.getBoundingClientRect()`, `vh = innerHeight`:
  - center (default): `c = (r.top + r.height/2)/vh; p = 1 - min(1, |c - 0.5|/0.5); p = min(1, p*1.6)` (bold when centred, light at edges).
  - leave: `p = 1 - clamp(-r.top / (r.height + vh*0.35), 0, 1)` (full weight until it scrolls past the top, then thins out).
  - weight `w = round(from + (to-from)*p)`; set `el.style.fontWeight = w` and `el.style.fontVariationSettings = '"wght" ' + w`. Gill Sans is static OTF, so it steps across available weights (300/400/500/600-700/800-900 faces).
- **SpeakerCard**: wrapper (Folded) `display:block; box-shadow: var(--shadow-fold)` (hover var(--shadow-fold-lg)), `transform: none` (hover translateY(-2px)), transition `transform var(--dur-spatial-fast) var(--ease-spring), box-shadow var(--dur-effect) var(--ease-emphasized)`. Inside `<article>`: `position:relative; background:var(--paper-0); border:1px solid var(--border-subtle); border-radius:0; clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%); overflow:hidden`, with DogEar face light. Photo area: `position:relative; aspect-ratio:1/1; background:<hue: cyan/red/green/graphite vars>; overflow:hidden`; img `width:100%; height:100%; object-fit:cover; display:block; filter:grayscale(1) contrast(1.05); mix-blend-mode:multiply` (duotone). Without photo: initials (first letter of first two words), `position:absolute; inset:0; display:grid; place-items:center; font:500 72px/1 var(--font-display); letter-spacing:-0.02em; color: var(--ink-1) for cyan/green hues else rgba(255,255,255,.95)`. Overlays: shade div `position:absolute; inset:0; background-image:var(--fold-shade)`; bottom-right paper triangle `position:absolute; right:0; bottom:0; width:38%; height:38%; background:var(--paper-0); clip-path:polygon(100% 0,100% 100%,0 100%)`. Body `padding:var(--space-4)`: h3 `margin:0; font:var(--type-h4); letter-spacing:var(--tracking-tight); color:var(--ink-1)`; role line `font:var(--type-body-sm); color:var(--text-secondary); margin-top:4px` = `role · <strong style="font-weight:600">company</strong>`; topics row `display:flex; gap:6px; flex-wrap:wrap; margin-top:12px` of Tags with `height:24px; font-size:12px`.

## Verbatim source (decoded from _ds_bundle.js)

```js
// components/conference/Fold.jsx
try { (() => {
const CLIPS = {
  crane: 'var(--clip-crane)',
  kite: 'var(--clip-kite)',
  shard: 'var(--clip-shard)',
  hexafold: 'var(--clip-hexafold)',
  corner: 'var(--clip-fold-corner)'
};
const HUES = {
  cyan: 'var(--cyan)',
  red: 'var(--red)',
  green: 'var(--green)',
  graphite: 'var(--graphite)',
  ink: 'var(--graphite-dark)',
  paper: 'var(--paper-0)'
};
/** Decorative folded-paper facet: a hue split into a lit and a shadowed face along a crease. */
function Fold({
  shape = 'kite',
  hue = 'cyan',
  size = 120,
  crease = 'vertical',
  rotate = 0,
  style
}) {
  const dir = crease === 'horizontal' ? 'to bottom' : crease === 'diagonal' ? '135deg' : 'to right';
  return React.createElement('div', {
    'aria-hidden': true,
    style: {
      width: size,
      height: size,
      flex: 'none',
      clipPath: CLIPS[shape] || CLIPS.kite,
      background: HUES[hue] || hue,
      backgroundImage: 'linear-gradient(' + dir + ', rgba(255,255,255,.3) 0 50%, rgba(40,40,40,.22) 50% 100%)',
      transform: rotate ? 'rotate(' + rotate + 'deg)' : undefined,
      filter: 'drop-shadow(0 12px 24px rgba(40,40,40,.14))',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Fold });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/conference/Fold.jsx", error: String((e && e.message) || e) }); }

// components/conference/ScrollTitle.jsx
try { (() => {
const {
  useEffect,
  useRef,
  useState
} = React;
/** Headline whose weight follows its position in the viewport: regular as it enters, bold when centred, regular again as it leaves. Smooth with a variable font (Cabin fallback); steps 400→600→700 with system Gill Sans. */
function ScrollTitle({
  as = 'h2',
  children,
  from = 400,
  to = 700,
  mode = 'center',
  style,
  ...rest
}) {
  const ref = useRef(null);
  const [w, setW] = useState(from);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      let p;
      if (mode === 'leave') p = 1 - Math.min(1, Math.max(0, -r.top / (r.height + vh * 0.35)));else {
        const c = (r.top + r.height / 2) / vh;
        p = 1 - Math.min(1, Math.abs(c - 0.5) / 0.5);
        p = Math.min(1, p * 1.6);
      }
      setW(Math.round(from + (to - from) * p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [from, to, mode]);
  // Weight is applied imperatively so callers can keep the `font` shorthand in style without React's font/fontWeight conflict.
  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.style.fontWeight = String(w);
      el.style.fontVariationSettings = '"wght" ' + w;
    }
  }, [w]);
  return React.createElement(as, {
    ref,
    ...rest,
    style: {
      transition: 'font-weight 120ms linear, font-variation-settings 120ms linear',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { ScrollTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/conference/ScrollTitle.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const T = {
  neutral: ['var(--paper-2)', 'var(--ink-1)'],
  brand: ['var(--red)', '#fff'],
  accent: ['var(--cyan)', 'var(--ink-1)'],
  success: ['var(--green)', 'var(--ink-1)'],
  info: ['var(--cyan-light)', 'var(--ink-1)'],
  inverse: ['var(--ink-1)', 'var(--paper-1)']
};
/** Status badge in mono caps. Sharp rectangle, no fold. */
function Badge({
  tone = 'neutral',
  children,
  style,
  ...rest
}) {
  const [bg, fg] = T[tone] || T.neutral;
  return React.createElement('span', {
    ...rest,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: '0 10px',
      borderRadius: 0,
      background: bg,
      color: fg,
      font: 'var(--type-caps)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
// Lucide (ISC) path data, 24×24 grid, 2px stroke. Inline so icons never depend on the network; unknown names fall back to the lucide-static CDN via CSS mask.
const P = {
  'arrow-right': 'M5 12h14M12 5l7 7-7 7',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  'arrow-up-right': 'M7 7h10v10M7 17 17 7',
  'arrow-down': 'M12 5v14M19 12l-7 7-7-7',
  'arrow-up': 'M12 19V5M5 12l7-7 7 7',
  wifi: 'M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.859a10 10 0 0 1 14 0M8.5 16.429a5 5 0 0 1 7 0',
  wallet: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
  'chevron-down': 'm6 9 6 6 6-6',
  'chevron-up': 'm18 15-6-6-6 6',
  'chevron-right': 'm9 18 6-6-6-6',
  'chevron-left': 'm15 18-6-6 6-6',
  x: 'M18 6 6 18M6 6l12 12',
  check: 'M20 6 9 17l-5-5',
  plus: 'M5 12h14M12 5v14',
  minus: 'M5 12h14',
  menu: 'M4 12h16M4 6h16M4 18h16',
  search: 'm21 21-4.34-4.34M3 11a8 8 0 1 0 16 0 8 8 0 1 0-16 0',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  'calendar-plus': 'M8 2v4M16 2v4M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8M3 10h18M16 19h6M19 16v6',
  clock: 'M12 6v6l4 2M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0',
  'map-pin': 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0M9 10a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  map: 'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0zM15 5.764v15M9 3.236v15',
  'train-front': 'M8 3.1V7a4 4 0 0 0 8 0V3.1M9 15l-1-1M15 15l1-1M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5zM8 19l-2 3M16 19l2 3',
  mail: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  lock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4',
  ticket: 'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zM13 5v2M13 17v2M13 11v2',
  'share-2': 'M15 6a3 3 0 1 0 6 0 3 3 0 1 0-6 0M3 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0M15 18a3 3 0 1 0 6 0 3 3 0 1 0-6 0M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98',
  smartphone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01',
  info: 'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 16v-4M12 8h.01',
  'circle-alert': 'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 8v4M12 16h.01',
  'triangle-alert': 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4 2 2 0 1 0 0-4',
  youtube: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17M10 15l5-3-5-3z',
  'external-link': 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  download: 'M12 15V3M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M5 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  mic: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3M19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
  coffee: 'M10 2v2M14 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1M6 2v2',
  star: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
  globe: 'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20',
  heart: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  'circle-check': 'M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M9 12l2 2 4-4',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54z',
  settings: 'M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'
};
const CDN = 'https://unpkg.com/lucide-static@0.475.0/icons/';
/** Lucide icon. Inline path when known (no network), CDN mask otherwise. Inherits currentColor. */
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  style,
  ...rest
}) {
  const d = P[name];
  if (d) return React.createElement('svg', {
    'aria-hidden': true,
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...rest,
    style: {
      display: 'inline-block',
      flex: 'none',
      ...style
    }
  }, React.createElement('path', {
    d
  }));
  const url = 'url(' + CDN + name + '.svg)';
  return React.createElement('span', {
    'aria-hidden': true,
    ...rest,
    style: {
      display: 'inline-block',
      flex: 'none',
      width: size,
      height: size,
      background: color,
      WebkitMask: url + ' center / contain no-repeat',
      mask: url + ' center / contain no-repeat',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const {
  useState
} = React;
const H = {
  sm: 'var(--control-sm)',
  md: 'var(--control-md)',
  lg: 'var(--control-lg)'
};
const PX = {
  sm: '0 14px',
  md: '0 20px',
  lg: '0 28px'
};
const FS = {
  sm: 'var(--text-sm)',
  md: 'var(--text-md)',
  lg: 'var(--text-lg)'
};
const V = {
  primary: {
    bg: 'var(--red)',
    fg: '#fff',
    border: null,
    hoverBg: 'var(--red-light)',
    glow: 'var(--shadow-fold-brand)'
  },
  secondary: {
    bg: 'var(--paper-0)',
    fg: 'var(--ink-1)',
    border: 'var(--border-default)',
    hoverBg: 'var(--paper-2)'
  },
  accent: {
    bg: 'var(--cyan)',
    fg: 'var(--ink-1)',
    border: null,
    hoverBg: 'var(--cyan-light)',
    glow: 'var(--shadow-fold-cyan)'
  },
  inverse: {
    bg: 'var(--graphite)',
    fg: 'var(--paper-1)',
    border: null,
    hoverBg: 'var(--ink-2)',
    glow: 'var(--shadow-fold-lg)'
  },
  ghost: {
    bg: 'transparent',
    fg: 'var(--ink-1)',
    border: null,
    hoverBg: 'var(--paper-2)',
    flat: true
  }
};
/** Sharp paper rectangle, no radius, no fold. Lifts with a coloured glow on hover; scales to .97 while pressed. Ghost is flat. */
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth,
  disabled,
  children,
  style,
  as = 'button',
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const v = V[variant] || V.primary;
  const flat = v.flat;
  const shadow = flat || disabled ? 'none' : down ? 'var(--shadow-fold-sm)' : hover ? v.glow || 'var(--shadow-fold-lg)' : 'var(--shadow-fold-sm)';
  const tf = flat || disabled ? 'none' : down ? 'scale(.97)' : hover ? 'translateY(-2px)' : 'none';
  const st = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: H[size],
    padding: PX[size],
    width: fullWidth ? '100%' : undefined,
    font: 'var(--weight-semibold) ' + FS[size] + '/1 var(--font-body)',
    letterSpacing: '0',
    color: v.fg,
    background: disabled ? 'var(--paper-3)' : hover ? v.hoverBg : v.bg,
    color: disabled ? 'var(--ink-3)' : v.fg,
    border: 'var(--border-w-strong) solid ' + (disabled ? 'var(--paper-3)' : v.border),
    borderRadius: 0,
    boxShadow: shadow,
    transform: tf,
    transition: 'transform var(--dur-spatial-fast) var(--ease-spring), box-shadow var(--dur-effect) var(--ease-emphasized), background var(--dur-effect) var(--ease-emphasized)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? .7 : 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...style
  };
  const isz = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  return React.createElement(as, {
    ...rest,
    disabled,
    style: st,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false)
  }, icon && React.createElement(__ds_scope.Icon, {
    name: icon,
    size: isz
  }), children, iconRight && React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: isz
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
const {
  useState
} = React;
const S = {
  sm: 'var(--control-sm)',
  md: 'var(--control-md)',
  lg: 'var(--control-lg)'
};
/** Square icon-only button, sharp corners, same lift as Button (ghost stays flat). Always pass a label. */
function IconButton({
  icon,
  label,
  variant = 'secondary',
  size = 'md',
  disabled,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const inv = variant === 'inverse',
    ghost = variant === 'ghost',
    prim = variant === 'primary';
  const bg = ghost ? hover ? 'var(--paper-2)' : 'transparent' : inv ? 'var(--ink-1)' : prim ? hover ? 'var(--cyan-light)' : 'var(--cyan)' : hover ? 'var(--paper-1)' : 'var(--paper-0)';
  const fg = inv || prim ? 'var(--paper-0)' : 'var(--ink-1)';
  const flat = ghost || disabled;
  return React.createElement('button', {
    'aria-label': label,
    title: label,
    disabled,
    ...rest,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    style: {
      display: 'inline-grid',
      placeItems: 'center',
      width: S[size],
      height: S[size],
      padding: 0,
      background: bg,
      color: fg,
      border: ghost || inv || prim ? 'none' : '1px solid var(--border-default)',
      borderRadius: 0,
      boxShadow: flat ? 'none' : down ? 'var(--shadow-fold-sm)' : hover ? 'var(--shadow-fold)' : 'none',
      transform: flat ? 'none' : down ? 'scale(.96)' : hover ? 'translateY(-1px)' : 'none',
      transition: 'transform var(--dur-spatial-fast) var(--ease-spring), box-shadow var(--dur-effect) var(--ease-emphasized), background var(--dur-effect) var(--ease-emphasized)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 16 : size === 'lg' ? 24 : 20
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
const SRC = {
  mark: 'mark-tight.png',
  wordmark: 'wordmark.png',
  lockup: 'lockup.png',
  'android-makers': 'lockup-android-makers.png',
  'flutter-makers': 'lockup-flutter-makers.png'
};
const RATIO = {
  mark: 1.0,
  wordmark: 2.03,
  lockup: 2.87,
  'android-makers': 2.87,
  'flutter-makers': 2.87
};
/** Official Mobile Makers logo (PNG from assets/logo). Set assetsBase to the path of the assets/ folder from the page. */
function Logo({
  variant = 'lockup',
  height = 40,
  assetsBase = '../../assets',
  alt = 'Mobile Makers',
  style,
  ...rest
}) {
  const src = assetsBase.replace(/\/$/, '') + '/logo/' + (SRC[variant] || SRC.lockup);
  return React.createElement('img', {
    src,
    alt,
    height,
    width: Math.round(height * (RATIO[variant] || 1)),
    draggable: false,
    ...rest,
    style: {
      display: 'block',
      height,
      width: 'auto',
      objectFit: 'contain',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
/** Topic tag: a small paper rectangle (iOS, Android, Flutter…); selected = ink fill. Selectable and/or removable. */
function Tag({
  children,
  selected,
  onRemove,
  onClick,
  style,
  ...rest
}) {
  return React.createElement('span', {
    ...rest,
    onClick,
    role: onClick ? 'button' : undefined,
    tabIndex: onClick ? 0 : undefined,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 30,
      padding: '0 10px',
      background: selected ? 'var(--ink-1)' : 'var(--surface-container-low)',
      color: selected ? 'var(--paper-1)' : 'var(--ink-1)',
      border: selected ? '1px solid var(--ink-1)' : '1px solid var(--border-default)',
      borderRadius: 0,
      transition: 'background var(--dur-effect) var(--ease-emphasized)',
      font: 'var(--type-label)',
      cursor: onClick ? 'pointer' : 'default',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children, onRemove && React.createElement('button', {
    'aria-label': 'Remove',
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: 'grid',
      placeItems: 'center',
      padding: 0,
      margin: '0 -4px 0 0',
      width: 18,
      height: 18,
      background: 'transparent',
      border: 0,
      color: 'inherit',
      cursor: 'pointer'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'x',
    size: 14
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/dogEar.js
try { (() => {
/** Dog-ear shared by Card, TicketCard and SpeakerCard: the top-right corner is cut away and the triangular flap below the crease shows the back of the sheet (crease line + shade away from the crease).
 *  clip-path clips an element's own box-shadow, so the shadow must live on a wrapper: use <Folded> around the clipped element. */
const dogEarClip = size => 'polygon(0 0,calc(100% - ' + size + 'px) 0,100% ' + size + 'px,100% 100%,0 100%)';
const FACE = {
  light: 'var(--fold-corner-face)',
  paper: 'var(--fold-corner-face-paper)',
  dark: 'var(--fold-corner-face-dark)'
};
function DogEar({
  size = 14,
  face = 'light'
}) {
  return React.createElement('span', {
    'aria-hidden': true,
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: size,
      height: size,
      background: FACE[face] || FACE.light,
      clipPath: 'polygon(0 0,100% 100%,0 100%)',
      boxShadow: 'inset 1px -1px 2px rgba(40,40,40,.16)',
      pointerEvents: 'none',
      transition: 'width var(--dur-spatial-fast) var(--ease-spring), height var(--dur-spatial-fast) var(--ease-spring)'
    }
  });
}
/** Shadow + lift carrier for a dog-eared (clipped) child. */
function Folded({
  shadow = 'none',
  transform = 'none',
  fullWidth,
  display = 'inline-flex',
  style,
  children,
  ...rest
}) {
  return React.createElement('span', {
    ...rest,
    style: {
      display,
      width: fullWidth ? '100%' : undefined,
      boxShadow: shadow,
      transform,
      transition: 'transform var(--dur-spatial-fast) var(--ease-spring), box-shadow var(--dur-effect) var(--ease-emphasized)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { dogEarClip, DogEar, Folded });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/dogEar.js", error: String((e && e.message) || e) }); }

// components/conference/SpeakerCard.jsx
try { (() => {
const {
  useState
} = React;
/** Speaker tile on a dog-eared paper rectangle: duotone photo slot, name, role, topic tags. Hover lifts the sheet. */
function SpeakerCard({
  name,
  role,
  company,
  topics = [],
  photo,
  hue = 'cyan',
  onClick,
  style
}) {
  const [h, setH] = useState(false);
  const HUES = {
    cyan: 'var(--cyan)',
    red: 'var(--red)',
    green: 'var(--green)',
    graphite: 'var(--graphite)'
  };
  return React.createElement(__ds_scope.Folded, {
    shadow: h ? 'var(--shadow-fold-lg)' : 'var(--shadow-fold)',
    transform: h ? 'translateY(-2px)' : 'none',
    display: 'block',
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      ...style
    }
  }, React.createElement('article', {
    onClick,
    style: {
      position: 'relative',
      background: 'var(--paper-0)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 0,
      clipPath: __ds_scope.dogEarClip(14),
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default'
    }
  }, React.createElement(__ds_scope.DogEar, {
    size: 14,
    face: 'light'
  }), React.createElement('div', {
    style: {
      position: 'relative',
      aspectRatio: '1 / 1',
      background: HUES[hue] || hue,
      overflow: 'hidden'
    }
  }, photo ? React.createElement('img', {
    src: photo,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      filter: 'grayscale(1) contrast(1.05)',
      mixBlendMode: 'multiply'
    }
  }) : React.createElement('div', {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      font: '500 72px/1 var(--font-display)',
      color: hue === 'cyan' || hue === 'green' ? 'var(--ink-1)' : 'rgba(255,255,255,.95)',
      letterSpacing: '-0.02em'
    }
  }, name.split(' ').map(w => w[0]).join('').slice(0, 2)), React.createElement('div', {
    'aria-hidden': true,
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--fold-shade)',
      pointerEvents: 'none'
    }
  }), React.createElement('div', {
    'aria-hidden': true,
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: '38%',
      height: '38%',
      background: 'var(--paper-0)',
      clipPath: 'polygon(100% 0,100% 100%,0 100%)'
    }
  })), React.createElement('div', {
    style: {
      padding: 'var(--space-4)'
    }
  }, React.createElement('h3', {
    style: {
      margin: 0,
      font: 'var(--type-h4)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--ink-1)'
    }
  }, name), React.createElement('div', {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, role, company && ' · ', company && React.createElement('strong', {
    style: {
      fontWeight: 600
    }
  }, company)), topics.length > 0 && React.createElement('div', {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginTop: 12
    }
  }, topics.map(t => React.createElement(__ds_scope.Tag, {
    key: t,
    style: {
      height: 24,
      fontSize: 12
    }
  }, t))))));
}
Object.assign(__ds_scope, { SpeakerCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/conference/SpeakerCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
const TONES = {
  paper: ['var(--paper-0)', 'var(--ink-1)'],
  brand: ['var(--cyan)', 'var(--ink-1)'],
  red: ['var(--red)', '#fff'],
  green: ['var(--green)', 'var(--ink-1)'],
  accent: ['var(--red)', '#fff'],
  graphite: ['var(--graphite)', 'var(--paper-1)'],
  inverse: ['var(--graphite)', 'var(--paper-1)']
};
/** Paper card: sharp rectangle, soft shadow, hairline border, and the signature dog-ear on the top-right corner (always on; `folded` is accepted for compatibility). */
function Card({
  tone = 'paper',
  folded,
  shadow = 'fold',
  padding = 'var(--space-6)',
  pageColor,
  children,
  style,
  ...rest
}) {
  const [bg, fg] = TONES[tone] || TONES.paper;
  const sh = shadow === 'none' ? 'none' : shadow === 'paper' ? 'var(--shadow-paper)' : shadow === 'lg' ? 'var(--shadow-fold-lg)' : 'var(--shadow-fold)';
  const inner = React.createElement('div', {
    style: {
      position: 'relative',
      background: bg,
      color: fg,
      border: tone === 'paper' ? '1px solid var(--border-subtle)' : 'none',
      borderRadius: 0,
      clipPath: __ds_scope.dogEarClip(14),
      padding,
      height: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }
  }, React.createElement(__ds_scope.DogEar, {
    size: 14,
    face: tone === 'paper' ? 'paper' : tone === 'graphite' || tone === 'inverse' ? 'dark' : 'light'
  }), tone !== 'paper' && React.createElement('span', {
    'aria-hidden': true,
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'var(--fold-light)',
      pointerEvents: 'none'
    }
  }), children);
  return React.createElement('div', {
    ...rest,
    style: {
      position: 'relative',
      borderRadius: 0,
      boxShadow: sh,
      ...style
    }
  }, inner);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const {
  useState
} = React;
/** Tabs: line (red underline) or boxed (segmented rectangle). */
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'line',
  style
}) {
  const [inner, setInner] = useState(defaultValue ?? (items[0] && items[0].value));
  const cur = value ?? inner;
  const set = v => {
    setInner(v);
    onChange && onChange(v);
  };
  const boxed = variant === 'boxed';
  return React.createElement('div', {
    role: 'tablist',
    style: {
      display: 'flex',
      gap: boxed ? 0 : 28,
      borderBottom: boxed ? 'none' : '1px solid var(--border-subtle)',
      background: boxed ? 'var(--surface-container)' : 'none',
      padding: boxed ? 4 : 0,
      borderRadius: 0,
      ...style
    }
  }, items.map(it => {
    const on = it.value === cur;
    return React.createElement('button', {
      key: it.value,
      role: 'tab',
      'aria-selected': on,
      onClick: () => set(it.value),
      style: boxed ? {
        height: 36,
        padding: '0 16px',
        font: 'var(--weight-semibold) var(--text-sm)/1 var(--font-ui)',
        background: on ? 'var(--paper-0)' : 'transparent',
        color: on ? 'var(--ink-1)' : 'var(--ink-3)',
        border: 0,
        borderRadius: 0,
        boxShadow: on ? 'var(--shadow-fold-sm)' : 'none',
        cursor: 'pointer',
        transition: 'background var(--dur-effect) var(--ease-emphasized), box-shadow var(--dur-effect), color var(--dur-effect)'
      } : {
        position: 'relative',
        padding: '10px 0 14px',
        font: 'var(--weight-semibold) var(--text-md)/1 var(--font-ui)',
        background: 'none',
        border: 0,
        color: on ? 'var(--ink-1)' : 'var(--ink-3)',
        cursor: 'pointer',
        boxShadow: on ? 'inset 0 -3px 0 var(--red)' : 'none',
        transition: 'color var(--dur-fast)'
      }
    }, it.label, it.count != null && React.createElement('span', {
      style: {
        marginLeft: 8,
        font: 'var(--type-caps)',
        color: on ? 'var(--red)' : 'var(--ink-4)'
      }
    }, it.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

```
