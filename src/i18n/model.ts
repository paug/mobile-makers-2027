// Builds the page view model for a language, ported from the prototype's renderVals().
import { T, type Lang } from './copy';
import { CONTACT, LINKS, STATES, TEAM, type Hue } from '../config';

const ANCHORS = ['#event', '#agenda', '#speakers', '#sponsors', '#tickets', '#cfp', '#team'];

const WHY_ART = [
  { bg: 'var(--red)', ink: 'var(--red)', shape: 'kite', foldHue: 'graphite' },
  { bg: 'var(--cyan)', ink: 'var(--cyan-dark)', shape: 'crane', foldHue: 'graphite' },
  { bg: 'var(--graphite)', ink: 'var(--ink-1)', shape: 'hexafold', foldHue: 'cyan' },
  { bg: 'var(--green)', ink: 'var(--green-dark)', shape: 'shard', foldHue: 'graphite' },
] as const;

const HUES: Record<Hue, [string, string]> = {
  red: ['var(--red)', 'var(--red-dark)'],
  cyan: ['var(--cyan)', 'var(--cyan-dark)'],
  green: ['var(--green)', 'var(--green-dark)'],
  blue: ['var(--blue)', 'var(--blue-dark)'],
};

export function buildModel(lang: Lang) {
  const t = T[lang];
  const L = LINKS;
  const { showAgenda, cfpOpen, speakersAnnounced, ticketPhase: phase } = STATES;

  const socials = ([['linkedin', 'LinkedIn', L.linkedinUrl], [null, 'X', L.xUrl], ['youtube', 'YouTube', L.youtubeUrl], ['mail', 'Email', CONTACT]] as [string | null, string, string][])
    .filter(([, , href]) => href)
    .map(([icon, label, href]) => ({ icon, label, href, target: href.startsWith('mailto:') ? '_self' : '_blank' }));

  const navItems = t.nav.map((label, i) => ({ label, href: ANCHORS[i] })).filter((n) => showAgenda || n.href !== '#agenda');

  const colors: Record<string, string> = { social: 'var(--cyan-dark)', keynote: 'var(--red)', parallel: 'var(--ink-1)', tbc: 'var(--ink-3)', party: 'var(--red)' };
  const tagBg: Record<string, string> = { social: 'var(--cyan-light)', keynote: 'var(--cyan-light)', parallel: 'var(--paper-2)', tbc: 'var(--cyan-light)', party: 'var(--cyan-light)' };
  const mkTalk = (track: string, lng: string) => ({ ...t.talk, track, lang: lng });
  const slots = t.slots.map(([time, title, kind, note]) => ({
    time, title, kind, note, color: colors[kind], tagBg: tagBg[kind], tbc: kind === 'tbc', parallel: kind === 'parallel',
    tag: kind === 'parallel' ? t.trackAndroid + ' + ' + t.trackFlutter : t.trackShared,
    android: [mkTalk('Android', 'FR'), mkTalk('Android', 'EN')],
    flutter: [mkTalk('Flutter', 'EN'), mkTalk('Flutter', 'FR')],
  }));

  const states = { early: ['available', 'soon', 'soon', 'available'], regular: ['soldOut', 'available', 'soon', 'available'], late: ['soldOut', 'soldOut', 'available', 'available'] }[phase];
  const tickets = t.tierNames.map((name, i) => {
    const s = states[i];
    return {
      name, price: t.price(t.ph), window: t.windows[i], features: t.features,
      available: s === 'available', soon: s === 'soon', soldOut: s === 'soldOut',
      badge: s === 'soldOut' ? t.soldOut : s === 'soon' ? t.soonBadge : (i === 1 || (i === 0 && phase === 'early')) ? t.available : '',
      badgeTone: (s === 'soldOut' ? 'brand' : s === 'soon' ? 'neutral' : 'success') as 'brand' | 'neutral' | 'success',
      nameColor: s === 'available' ? 'var(--red)' : 'var(--ink-3)',
      priceColor: s === 'available' ? 'var(--ink-1)' : 'var(--ink-3)',
    };
  });

  const tiers = ([['Platinum', 2, 320, '2.3', 140], ['Gold', 3, 240, '2.15', 112], ['Silver', 4, 180, '2.05', 88], ['Digital', 6, 140, '1.95', 72]] as const)
    .map(([name, n, minw, ratio, h]) => ({ name, minw, ratio, h, tiles: Array.from({ length: n }, (_, i) => i) }));

  const team = TEAM.map(([name, k, linkedin], i) => ({ name, id: 'team-' + i, hue: HUES[k][0], hueDark: HUES[k][1], linkedin }));

  const speakers = ([['cyan', 'Android'], ['green', 'Android'], ['graphite', 'Flutter'], ['red', 'Flutter']] as const).map(([hue, tr], i) => ({
    name: t.phName, role: '[' + (lang === 'fr' ? 'Rôle' : 'Role') + ']', company: lang === 'fr' ? '[Entreprise]' : '[Company]', topics: [tr, i % 2 ? 'EN' : 'FR'], hue,
  }));

  const footerHref: Record<string, string> = { coc: L.cocUrl, legal: L.legalUrl, privacy: L.privacyUrl };

  return {
    lang, t, L, socials, navItems, showAgenda, cfpOpen, speakersAnnounced,
    heroA: t.heroTitle.split('. ')[0] + '.',
    heroB: t.heroTitle.split('. ').slice(1).join('. '),
    marquee: Array.from({ length: 12 }, (_, i) => ['Android', 'Flutter', '30.04.2027', 'Paris', 'Kotlin', 'Dart'][i % 6]),
    heroFacts: t.heroFacts.map(([n, l]) => ({ n, l })),
    why: t.why.map(([title, body], i) => ({ n: '0' + (i + 1), title, body, ...WHY_ART[i % 4] })),
    venueStats: t.venueStats.map(([n, l]) => ({ n, l })),
    venueRows: t.venueRows.map(([icon, text]) => ({ icon, text })),
    slots, speakers, tiers, tickets,
    ticketNotes: t.ticketNotes.map(([icon, text]) => ({ icon, text })),
    whySponsor: t.whySponsor.map(([title, body]) => ({ title, body })),
    cfpClosedHref: showAgenda ? '#agenda' : '#tickets',
    cfpClosedCta: showAgenda ? t.ctaAgenda : t.ctaTicket,
    cfpFormats: t.cfpFormats.map(([name, dur]) => ({ name, dur })),
    cfpDates: t.cfpDates.map(([name, date]) => ({ name, date })),
    team,
    footerLinks: t.footerLinks.map(([label, href]) => ({ label, href: footerHref[href] ?? href })),
  };
}

export type Model = ReturnType<typeof buildModel>;
