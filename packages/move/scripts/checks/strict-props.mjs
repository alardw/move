#!/usr/bin/env node
/**
 * Strict-props check.
 *
 * Component `Props` interfaces must be strictly typed so `tsc` rejects invalid
 * prop values (e.g. `gap="3xl"`) and unknown props. They must NOT use the loose
 * `extends Record<string, unknown>` — that index signature silently accepts any
 * key/value and disables literal-union checking for the public API.
 *
 * The factory itself relaxes its generic to `TProps extends object` and casts
 * internally (`as Record<string, unknown>`) for dynamic prop reads, so the loose
 * record is never needed on a component interface.
 *
 * `tsc` CANNOT catch this (a loose interface compiles fine), so without this
 * guard a regenerated/new component silently reintroduces it and undoes the
 * strict-props migration. Fails when any `*.tsx` under src/components or
 * src/infrastructure has an interface `extends Record<string, unknown>`.
 *
 * The fix: extend `React.HTMLAttributes<HTMLElement>` (or the element-specific
 * attrs the slot renders — Anchor/Input/Td/Th/Img/…), using `Omit<…, 'key'>`
 * when the component intentionally redefines a native prop.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCAN = ['src/components', 'src/infrastructure'].map((p) => join(ROOT, p));

/** Recursively collect all .tsx files (excluding tests). */
function collect(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) collect(p, out);
    else if (entry.endsWith('.tsx') && !entry.endsWith('.test.tsx')) out.push(p);
  }
  return out;
}

// Matches an interface declaration that extends the loose record.
const OFFENDER = /\bextends\s+Record<\s*string\s*,\s*unknown\s*>/;

let errors = 0;
const out = [];
for (const base of SCAN) {
  let files;
  try { files = collect(base); } catch { continue; }
  for (const file of files.sort()) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (OFFENDER.test(line)) {
        errors++;
        out.push(`  ${relative(ROOT, file)}:${i + 1}  ${line.trim()}`);
      }
    });
  }
}

if (errors > 0) {
  console.error('✗ strict-props: component Props must not `extends Record<string, unknown>`.');
  console.error('  Use `React.HTMLAttributes<HTMLElement>` (or element-specific attrs), with `Omit<…>` for redefined props.\n');
  console.error(out.join('\n'));
  console.error(`\n${errors} offending interface(s).`);
  process.exit(1);
}

console.log('✓ strict-props: no component Props extends Record<string, unknown>.');
