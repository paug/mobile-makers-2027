// Moves the English pages (built under dist/en/) to dist/i18n/en/, the folder Firebase Hosting serves in place of the
// French default when Accept-Language (or the firebase-language-override cookie) prefers English. See firebase.json i18n.
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';

rmSync('dist/i18n', { recursive: true, force: true });
mkdirSync('dist/i18n');
if (!existsSync('dist/en')) throw new Error('dist/en/ not found, run astro build first.');
renameSync('dist/en', 'dist/i18n/en');
console.log('Moved dist/en/ to dist/i18n/en/.');
