#!/usr/bin/env node
/**
 * A press state sits on the thing being pressed.
 *
 * `:active` matches an ANCESTOR whenever a descendant is pressed. So a transform
 * under `:active` on a container scales everything inside it: clicking one
 * segment of a toggle group made the whole control shrink, because the rule sat
 * on the group rather than on the segment.
 *
 * The sibling controls were safe for a reason worth stating, since it is the
 * reason this is checkable at all: their root IS the button, so there is no
 * descendant for `:active` to propagate from. `kind` records exactly that —
 * `control`, `trigger` and `item` are pressed; a `group`, a `surface`, a
 * `scrollport` contain things that are.
 *
 * Only transforms. A container may legitimately change colour on `:active` — a
 * row tinting while you hold it is fine, because the tint is what you meant.
 * Geometry is different: it moves the children too.
 *
 * @enforces styles-19
 * @instead move the rule to the slot that is actually pressed. If a container
 *   genuinely must respond, say which descendant it applies to —
 *   `.root:active .thumb` — so the subject is explicit.
 *
 * Exit: 0 = clean, 1 = at least one press state on a container.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');

/** Kinds that ARE the pressed element. */
const PRESSABLE = new Set(['control', 'trigger', 'item']);

function specFiles(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) specFiles(full, out);
    else if (e.endsWith('.spec.ts')) out.push(full);
  }
  return out;
}

const problems = [];

for (const specPath of specFiles(join(MOVE_ROOT, 'src', 'components'))) {
  const comp = basename(specPath, '.spec.ts');
  const cssPath = join(dirname(specPath), `${comp}.module.css`);
  if (!existsSync(cssPath)) continue;
  const css = readFileSync(cssPath, 'utf8');
  const spec = readFileSync(specPath, 'utf8');
  if (/press-scope-exempt/.test(css)) continue;

  const kinds = new Map();
  for (const m of spec.matchAll(/name: '(\w+)',\s*element: '[^']*',\s*kind: '(\w+)'/g)) {
    if (!kinds.has(m[1])) kinds.set(m[1], m[2]);
  }

  for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    if (!/(^|;|\s)transform:/.test(m[2])) continue;
    for (const sel of m[1].trim().split(',')) {
      // The SUBJECT of the selector — the element the rule styles — is its last
      // compound. `.root:active .thumb` styles the thumb and is fine; the
      // problem is only when the element carrying :active is the one transformed.
      const subject = sel.trim().split(/\s+|>/).pop() ?? '';
      if (!subject.includes(':active')) continue;
      const cls = (subject.match(/^\.([a-zA-Z][\w-]*)/) ?? [])[1];
      if (!cls) continue;
      const kind = kinds.get(cls);
      if (PRESSABLE.has(kind)) continue;
      problems.push({
        rel: relative(MOVE_ROOT, cssPath),
        line: css.slice(0, m.index).split('\n').length,
        selector: sel.trim(),
        cls,
        kind: kind ?? 'undeclared',
      });
    }
  }
}

if (problems.length === 0) {
  console.log('✓ press-scope: every :active transform sits on the element being pressed.');
  process.exit(0);
}

console.log(`✗ press-scope: ${problems.length} press state(s) on a container.`);
for (const p of problems) {
  console.log(`\n  [styles-19] ${p.rel}:${p.line} — ${p.selector}`);
  console.log(`    .${p.cls} is kind '${p.kind}', not something that gets pressed.`);
  console.log('    :active matches ancestors, so this transforms everything inside it.');
}
process.exit(1);
