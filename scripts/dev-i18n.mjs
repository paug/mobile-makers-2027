// Dev server only: mimics Firebase Hosting i18n rewrites (firebase.json). The language comes from the
// firebase-language-override cookie, then Accept-Language. English requests are served from the /en/ pages when
// one exists; anything else falls back to the French default, like in production.
import { existsSync } from 'node:fs';

/** @param {string | undefined} cookieHeader @param {string | undefined} acceptLanguage */
function prefersEnglish(cookieHeader, acceptLanguage) {
  const override = /(?:^|;\s*)firebase-language-override=([^;]*)/.exec(cookieHeader ?? '')?.[1];
  const wanted = override
    ? decodeURIComponent(override).split(',')
    : (acceptLanguage ?? '').split(',')
        .map((part) => { const [tag, q] = part.trim().split(';q='); return { lang: tag.split('-')[0].toLowerCase(), q: q ? Number(q) : 1 }; })
        .sort((a, b) => b.q - a.q)
        .map((l) => l.lang);
  return wanted.find((l) => l === 'fr' || l === 'en') === 'en';
}

/** Whether an English page exists for this path (static page, or blog post with an English translation). */
function hasEnglish(/** @type {string} */ path) {
  const dir = path.endsWith('/') ? path : path + '/';
  const post = /^\/blog\/([^/]+)\/$/.exec(dir)?.[1];
  if (post) return existsSync(`src/content/blog/en/${post}.md`);
  return existsSync(`src/pages/en${dir}index.astro`) || existsSync(`src/pages/en${dir.slice(0, -1)}.astro`);
}

/** @returns {import('astro').AstroIntegration} */
export default function devI18n() {
  return {
    name: 'dev-i18n',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, _res, next) => {
          const [path, query] = (req.url ?? '/').split('?');
          if (req.method === 'GET' && !path.startsWith('/en/') && !path.includes('.') && !path.startsWith('/@') && !path.startsWith('/_')
            && prefersEnglish(req.headers.cookie, req.headers['accept-language']) && hasEnglish(path)) {
            req.url = '/en' + path + (query !== undefined ? '?' + query : '');
          }
          next();
        });
      },
    },
  };
}
