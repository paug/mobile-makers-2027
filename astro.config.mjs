// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mobilemakers.fr',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR', en: 'en' } } })],
  vite: { plugins: [tailwindcss()] },
});
