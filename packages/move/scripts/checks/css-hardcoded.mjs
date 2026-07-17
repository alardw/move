#!/usr/bin/env node
/**
 * No hard-coded colours (spec rule styles-2).
 *
 * A component's colours must come from --move-* tokens, or they escape the theme
 * and break dark mode + rebranding. This flags raw colour literals — hex,
 * rgb()/rgba(), hsl()/hsla() — in component module CSS. (This is the enforcement
 * css-tokens was mis-credited with: css-tokens only checks that var(--move-*)
 * references resolve, never that a raw value should have been a token.)
 *
 * Allowed:
 *   - a colour inside a `var(--x, <fallback>)` fallback — the token still drives
 *     it and the fallback is the intentional escape hatch;
 *   - a line carrying a `token-exempt: <reason>` comment;
 *   - a whole file carrying a `token-exempt-file: <reason>` comment (e.g. a
 *     colour picker, whose swatches/spectrum ARE colour content, not chrome).
 *
 * @enforces styles-2
 *
 * Exit: 0 = clean, 1 = at least one raw colour.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');

const cssFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.module.css')) cssFiles.push(p);
  }
})(COMPONENTS);

const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/g;
const violations = [];
let exemptFiles = 0;

for (const f of cssFiles) {
  const src = readFileSync(f, 'utf8');
  if (src.includes('token-exempt-file')) {
    exemptFiles++;
    continue;
  }
  src.split('\n').forEach((raw, i) => {
    if (raw.includes('token-exempt')) return;
    // Strip CSS comments and var() spans — a colour inside a var() fallback is allowed.
    const line = raw.replace(/\/\*[^]*?\*\//g, '').replace(/var\([^)]*\)/g, '');
    const matches = line.match(COLOR);
    if (matches) for (const m of matches) violations.push(`${relative(MOVE_ROOT, f)}:${i + 1}  ${m}`);
  });
}

if (violations.length) {
  console.error(
    `✗ css-hardcoded: ${violations.length} raw colour literal(s) — use a --move-* token, or add /* token-exempt: reason */.\n`,
  );
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}
console.log(
  `✓ css-hardcoded: no raw colour literals in component CSS (${cssFiles.length} files, ${exemptFiles} exempt).`,
);
process.exit(0);
