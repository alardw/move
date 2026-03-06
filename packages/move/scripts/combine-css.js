import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const DIST = new URL('../dist', import.meta.url).pathname;

async function collectCss(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let css = '';
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      css += await collectCss(full);
    } else if (entry.name.endsWith('.css') && entry.name !== 'styles.css') {
      css += await readFile(full, 'utf8') + '\n';
    }
  }
  return css;
}

const combined = await collectCss(DIST);
await writeFile(join(DIST, 'styles.css'), combined);
console.log(`Combined CSS written to dist/styles.css (${(combined.length / 1024).toFixed(1)} KB)`);
