#!/usr/bin/env node
/**
 * A stagger reads the children of an element WE own.
 *
 * `staggerAnimate` runs `querySelectorAll` on the step's target and animates
 * what it finds. That target therefore has to be an element the component
 * renders itself — a plain div — and never a third-party component. Radix
 * attaches its own ref, styling, positioning and scroll to its elements, and
 * reparents them through portals and presence; an animated ref put there is
 * competing with the library for the same node.
 *
 * Dropdown shipped both shapes at once, which is what makes this checkable
 * rather than a matter of taste. Its top-level menu staggers `contentInner`, a
 * div it renders. Its SUB-menu staggered `subContent` — `RadixDropdownMenu.
 * SubContent` itself. Same component, same choreography, one layer built two
 * ways, and only one of them animated.
 *
 * The spec already records the fact that decides it: every slot declares the
 * `element` it renders. So the rule needs no new bookkeeping — it reads the
 * target out of the source, where the true value lives, and the element out of
 * the spec, where the contract lives.
 *
 * Only steps with an explicit `target` are judged. A step that omits one
 * inherits its slot from the trigger, which this cannot resolve without
 * duplicating the engine's resolution; those are reported as unchecked at the
 * end rather than silently passed, so the coverage is honest.
 *
 * @enforces animation-5
 * @instead render a plain element inside the third-party one, give THAT the
 *   slot, and stagger it — the way Content wraps its rows in `contentInner`.
 *
 * Exit: 0 = clean, 1 = at least one stagger aimed at a foreign element.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');

/** A native tag: all lowercase, no dots. `div`, `ul`, `button`. */
const NATIVE = /^[a-z][a-z0-9-]*$/;

function specFiles(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) specFiles(full, out);
    else if (e.endsWith('.spec.ts')) out.push(full);
  }
  return out;
}

/** slot name (as declared, lowercase-first) → the element it renders. */
function slotElements(specSrc) {
  const map = new Map();
  for (const m of specSrc.matchAll(/name: '(\w+)',\s*\n\s*element: '([^']+)'/g)) {
    if (!map.has(m[1])) map.set(m[1], m[2]);
  }
  return map;
}

const problems = [];
let checked = 0;
let unresolved = 0;

for (const specPath of specFiles(join(MOVE_ROOT, 'src', 'components'))) {
  const comp = basename(specPath, '.spec.ts');
  const srcPath = join(dirname(specPath), `${comp}.tsx`);
  if (!existsSync(srcPath)) continue;
  const src = readFileSync(srcPath, 'utf8');
  if (/stagger-container-exempt/.test(src)) continue;
  const elements = slotElements(readFileSync(specPath, 'utf8'));

  // Each animation step that staggers children. The target sits on its own line
  // above `children:` in every shape this repo writes, so the pair is read
  // together rather than by scanning for the nearest `target:` anywhere above —
  // proximity has produced wrong answers in this codebase before.
  for (const m of src.matchAll(/target: '(\w+)',\s*\n\s*children: /g)) {
    const target = m[1];
    // Refs are capitalised (`ContentInner`); slots are declared lowercase-first.
    const slot = target.charAt(0).toLowerCase() + target.slice(1);
    const element = elements.get(slot);
    checked++;
    if (!element) {
      unresolved++;
      continue;
    }
    if (NATIVE.test(element)) continue;
    problems.push({
      rel: relative(MOVE_ROOT, srcPath),
      line: src.slice(0, m.index).split('\n').length,
      target,
      element,
    });
  }
  // Steps that stagger without naming a target: counted, never judged.
  for (const m of src.matchAll(/\n\s*children: /g)) void m;
}

const note = unresolved
  ? ` (${unresolved} target(s) had no matching slot in the spec, so were not judged)`
  : '';

if (problems.length === 0) {
  console.log(`✓ stagger-container: ${checked} stagger target(s) are elements we own${note}.`);
  process.exit(0);
}

console.log(`✗ stagger-container: ${problems.length} stagger(s) aimed at a foreign element.`);
for (const p of problems) {
  console.log(`\n  [animation-5] ${p.rel}:${p.line} — target '${p.target}' renders <${p.element}>`);
  console.log('    A stagger queries this element for its children, but a third-party');
  console.log('    component owns its own ref, styling and reparenting. Wrap the rows in a');
  console.log('    plain element of your own and stagger that instead.');
}
process.exit(1);
