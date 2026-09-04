#!/usr/bin/env node
/**
 * The spec's `animations` array must describe the animations that ship.
 *
 * `check:spec-drift` compares props, defaults, slots, tokens and engine imports.
 * It never reads `animations`, so that one field could say anything at all and
 * stay green — and it did. In a single week it hid three separate things: a
 * Sidebar whose two staggers were absent from the array entirely, three menus
 * still declaring a `[role="menuitem"]` selector months after the component
 * moved off it, and an `Item.hover` shipped by Dropdown, Select and Autocomplete
 * that no spec mentioned. Each was found by eye, which is not a strategy.
 *
 * Two directions, because the two failures are different:
 *
 *   spec → source   a trigger the spec claims must exist in the component, or
 *                   the spec is describing something that was removed.
 *   source → spec   a trigger in a module-scope defaults array must be declared,
 *                   or the component ships motion nothing wrote down.
 *
 * Module scope is what separates a shipped default from internal wiring. Select
 * and Autocomplete remap their public `open`/`closed` onto `Content.enter` and
 * `Content.exit` inside the component, and those remappings are implementation,
 * not API — a spec listing them would be describing the plumbing.
 *
 * Stagger selectors are compared as text: a selector the spec names must appear
 * somewhere in the source, whether inline or behind a constant. That is what
 * catches a component whose reveal quietly stopped matching what it reveals.
 *
 * @enforces spec-9
 * @instead update the spec's `animations` to match the component, or delete the
 *   entry if the animation is gone. A trigger built inside the component from a
 *   public one does not belong in the spec.
 *
 * Exit: 0 = clean, 1 = at least one drift.
 */
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');

function specFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...specFiles(full));
    else if (entry.endsWith('.spec.ts')) out.push(full);
  }
  return out;
}

/** The `animations: [...]` array as text, or null when the spec has none. */
function animationsBlock(src) {
  const start = src.indexOf('\n  animations: [');
  if (start === -1) return null;
  const end = src.indexOf('\n  ],\n', start);
  return end === -1 ? null : src.slice(start, end);
}

/**
 * Regions of the source at MODULE scope — outside any function body — which is
 * where a shipped default lives. Found by brace depth from column zero, so a
 * top-level `const X = [...]` counts and the same literal inside a `setup()`
 * does not.
 */
function moduleScopeText(src) {
  const out = [];
  let depth = 0;
  let buffer = '';
  for (const line of src.split('\n')) {
    // A line starting at column zero with `const`/`function`/`export` re-anchors
    // us at module scope even if brace counting has drifted on a template.
    if (depth === 0) buffer += line + '\n';
    for (const ch of line) {
      if (ch === '{' || ch === '(' || ch === '[') depth++;
      else if (ch === '}' || ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
    }
    if (depth === 0 && buffer) {
      out.push(buffer);
      buffer = '';
    }
  }
  return out.join('\n');
}

const triggersIn = (text) =>
  new Set([...text.matchAll(/trigger:\s*'([^']+)'/g)].map((m) => m[1]));
const selectorsIn = (text) =>
  new Set([...text.matchAll(/children:\s*'([^']+)'/g)].map((m) => m[1]));

const problems = [];
let checked = 0;

for (const specPath of specFiles(COMPONENTS)) {
  const sourcePath = specPath.replace(/\.spec\.ts$/, '.tsx');
  let source;
  try {
    source = readFileSync(sourcePath, 'utf8');
  } catch {
    continue; // a spec with no single-file source; spec-drift already reports it
  }
  const spec = readFileSync(specPath, 'utf8');
  const block = animationsBlock(spec);
  if (!block) continue;
  checked++;

  const rel = relative(MOVE_ROOT, specPath);
  const specTriggers = triggersIn(block);
  const sourceTriggers = triggersIn(source);
  const defaultTriggers = triggersIn(moduleScopeText(source));

  for (const t of specTriggers) {
    if (!sourceTriggers.has(t)) {
      problems.push({ rel, msg: `spec declares '${t}', which the component no longer fires` });
    }
  }
  for (const t of defaultTriggers) {
    if (!specTriggers.has(t)) {
      problems.push({ rel, msg: `component ships '${t}' by default, and the spec omits it` });
    }
  }

  for (const sel of selectorsIn(block)) {
    if (!source.includes(sel)) {
      problems.push({
        rel,
        msg: `spec staggers '${sel}', which appears nowhere in the component`,
      });
    }
  }
}

/**
 * Ratcheted. The first run found 29 across 71 components — Toast firing
 * `Item.enter` while its spec says `Root.enter`, Accordion firing `icon-open`
 * while its spec says `open`, Table staggering `tr` while its spec says
 * `tbody > tr`. That is what a field nothing reads looks like after a year.
 * Rewriting 29 specs unread would be guessing at what each component means, so
 * what exists is recorded and what is NEW fails; the backlog gets cleared one
 * component at a time by someone reading its animations.
 */
const BASELINE = join(HERE, 'animation-spec-drift.baseline.json');
const key = (p) => `${p.rel} :: ${p.msg}`;
const live = problems.map(key).sort();

if (process.argv.includes('--write')) {
  writeFileSync(BASELINE, JSON.stringify(live, null, 2) + '\n');
  console.log(`⚑ animation-spec-drift: baseline written with ${live.length} entr(ies).`);
  process.exit(0);
}

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : [];
const known = new Set(baseline);
const fresh = problems.filter((p) => !known.has(key(p)));
const fixed = baseline.filter((b) => !live.includes(b));

if (fresh.length === 0) {
  console.log(
    `⚑ animation-spec-drift: ${checked} spec(s) read · ${live.length} live · ` +
      `${baseline.length} baseline · 0 new · ${fixed.length} fixed.`,
  );
  if (fixed.length) {
    console.log('  Fixed since the baseline — run with --write to lock them in:');
    for (const f of fixed) console.log(`    ${f}`);
  }
  process.exit(0);
}

console.log(`✗ animation-spec-drift: ${fresh.length} new drift(s).`);
for (const p of fresh) console.log(`\n  [spec-9] ${p.rel} — ${p.msg}`);
console.log(
  `\n  → update the spec's \`animations\` to match, or delete the entry if the animation is gone.`,
);
process.exit(1);
