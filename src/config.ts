// Site-wide switches and links. Replaces the design prototype's editable props.
export const CONTACT = 'mailto:contact@mobilemakers.fr';

export const STATES = {
  showAgenda: false,
  cfpOpen: true,
  speakersAnnounced: false,
  showSponsorTiers: false,
  // 'soon': ticketing not open yet, every tier shows "opening soon"
  ticketPhase: 'soon' as 'soon' | 'early' | 'regular',
};

export const LINKS = {
  // Short links on the site domain, redirected by Firebase Hosting to the ticketing, CFP and sponsor deck
  ticketUrl: 'https://mobilemakers.fr/tickets',
  cfpUrl: 'https://mobilemakers.fr/cfp',
  sponsorUrl: 'https://mobilemakers.fr/sponsor-deck',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=UGC+Cin%C3%A9+Cit%C3%A9+Bercy+Paris',
  linkedinUrl: 'https://www.linkedin.com/company/paris-android-user-group/',
  xUrl: '',
  youtubeUrl: '',
};

// [name, hue, LinkedIn URL, photo]; leave the URL empty to hide the link.
// Photo: path under public/ (e.g. '/assets/team/renaud.jpg'); empty shows a plain colour block.
export const TEAM: [string, Hue, string, string][] = [
  ['Edouard Marquez', 'red', 'https://www.linkedin.com/in/edouard-marquez-32431514/', ''],
  ['Martin Bonnin', 'cyan', 'https://www.linkedin.com/in/martinbonnin/', ''],
  ['Alex Bruneau', 'green', 'https://www.linkedin.com/in/alexandre-bruneau-03380654/', ''],
  ['Benjamin Gonin', 'blue', 'https://www.linkedin.com/in/benjamingonin/', ''],
  ['Renaud Mathieu', 'cyan', 'https://www.linkedin.com/in/renaudmathieu1/', ''],
  ['Nicolas Guillot', 'red', 'https://www.linkedin.com/in/guillotnico/', ''],
];

export type Hue = 'red' | 'cyan' | 'green' | 'blue';
