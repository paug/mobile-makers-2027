// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { LEGAL_PAGES } from './src/i18n/model.ts';

const site = 'https://mobilemakers.fr';
const lastmod = new Date();

// The legal pages have a different slug per language, so the sitemap integration cannot pair them
// by prefix the way it pairs / and /en/. This maps each legal URL to its fr/en alternates.
const legalAlternates = Object.fromEntries(
  Object.keys(LEGAL_PAGES.fr).flatMap((key) => {
    const links = [
      { lang: 'fr', url: site + LEGAL_PAGES.fr[key] },
      { lang: 'en', url: site + LEGAL_PAGES.en[key] },
    ];
    return links.map((l) => [l.url, links]);
  }),
);

export default defineConfig({
  site,
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // Same language codes as the hreflang tags in Layout.astro.
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr', en: 'en' } },
      serialize: (item) => ({ ...item, lastmod, links: item.links ?? legalAlternates[item.url] }),
    }),
  ],
});
