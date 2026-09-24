// Fails the build when a bracketed placeholder such as "[DATE]" is still rendered in dist/.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PLACEHOLDER = /\[[A-ZÀ-Ü][^\]]{1,80}\]/g;

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (p.endsWith('.html')) yield p;
  }
}

let failed = false;
for (const file of htmlFiles('dist')) {
  const hits = readFileSync(file, 'utf8').match(PLACEHOLDER);
  if (hits) {
    failed = true;
    console.error(`${file}: ${[...new Set(hits)].join(', ')}`);
  }
}
if (failed) {
  console.error('Placeholder copy found in the built HTML (see above).');
  process.exit(1);
}
console.log('No placeholder copy in dist/.');
