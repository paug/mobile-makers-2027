// Site-wide switches and links. Replaces the design prototype's editable props.
export const CONTACT = 'mailto:contact@mobilemakers.fr';

export const STATES = {
  showAgenda: false,
  cfpOpen: true,
  speakersAnnounced: false,
  ticketPhase: 'early' as 'early' | 'regular',
};

export const LINKS = {
  ticketUrl: CONTACT + '?subject=Billet%20Mobile%20Makers%202027',
  cfpUrl: CONTACT + '?subject=Proposition%20de%20talk',
  sponsorUrl: CONTACT + '?subject=Sponsoring%20Mobile%20Makers%202027',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=UGC+Cin%C3%A9+Cit%C3%A9+Bercy+Paris',
  cocUrl: CONTACT + '?subject=Code%20de%20conduite',
  legalUrl: CONTACT,
  privacyUrl: CONTACT,
  linkedinUrl: '',
  xUrl: '',
  youtubeUrl: '',
};

// [name, hue, LinkedIn URL]; leave the URL empty to hide the link
export const TEAM: [string, Hue, string][] = [
  ['Edouard Marquez', 'red', ''],
  ['Martin Bonnin', 'cyan', ''],
  ['Alex Bruneau', 'green', ''],
  ['Benjamin Gonin', 'blue', ''],
  ['Renaud Mathieu', 'cyan', ''],
  ['Nicolas Guillot', 'red', ''],
];

export type Hue = 'red' | 'cyan' | 'green' | 'blue';
