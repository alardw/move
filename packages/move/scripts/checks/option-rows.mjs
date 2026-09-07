#!/usr/bin/env node
/**
 * A list you choose from looks the same wherever it is.
 *
 * Select, Dropdown, Autocomplete and the media players' settings menu all render
 * a row you highlight with the keyboard and select with a click. They matched
 * only by coincidence: each carried its own `*-item-radius`, `*-item-padding-*`
 * and `*-item-bg-highlight`, every one resolving to the same value, with nothing
 * holding them together — and the one written last matched none of them. Square
 * rows bleeding into the panel's rounded corner, a highlight three times the
 * strength of Select's, and a selected row that did not darken when focused, so
 * it was distinguished from an unfocused one by the ring's offset alone.
 *
 * `--move-option-*` is the definition. This is what makes components use it.
 *
 * Why a CSS check rather than a capability: capabilities are declared in a spec,
 * and the component this was written for has none. Ten shared internals under
 * `_shared/` are outside the spec system entirely — which is exactly where these
 * defects lived. Nine CSS checks already walk every `.module.css`, so this one
 * reaches them.
 *
 * @enforces styles-17
 * @instead read the shared token. If a surface genuinely needs a different
 *   value — the players' chrome is a fixed neutral over video, not a themed
 *   ground — redefine the token locally rather than inlining a number, so the
 *   relationship stays visible.
 *
 * Exit: 0 = clean, 1 = at least one option row styled outside the definition.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');

/**
 * An option row, by Radix's vocabulary: `data-highlighted` is the keyboard
 * highlight and `data-state="checked"` the selection.
 *
 * Keyed on `data-highlighted` alone, because being HIGHLIGHTABLE is what makes
 * a row an option: a checkbox is checked and a list row can be active, and
 * neither is something you walk with arrow keys. Matching `data-active` flagged
 * List, which is a display list, and matching `data-state="checked"` flagged
 * every Radix toggle in the library. The selected state is still covered — a
 * selected option's rule carries both attributes.
 */
const HIGHLIGHTED = /\[data-highlighted\]/;

/** The properties that make one list look like another. */
const SHARED = {
  'border-radius': '--move-option-radius',
  'background-color': '--move-option-bg-highlight, --move-option-bg-selected, --move-option-bg-selected-highlight',
  background: '--move-option-bg-highlight, --move-option-bg-selected, --move-option-bg-selected-highlight',
};

function cssFiles(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) cssFiles(full, out);
    else if (e.endsWith('.module.css')) out.push(full);
  }
  return out;
}

const problems = [];

for (const file of cssFiles(join(MOVE_ROOT, 'src', 'components'))) {
  const src = readFileSync(file, 'utf8');
  const rel = relative(MOVE_ROOT, file);
  for (const m of src.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const selector = m[1].trim().split('\n').pop().trim();
    if (!HIGHLIGHTED.test(selector)) continue;
    const line = src.slice(0, m.index).split('\n').length;
    for (const [prop, tokens] of Object.entries(SHARED)) {
      const decl = new RegExp(`(?:^|;)\\s*${prop}:\\s*([^;]+)`, 'm').exec(m[2]);
      if (!decl) continue;
      const value = decl[1].trim();
      if (/option-exempt/.test(m[2])) continue;
      // Resolved one level. A component keeps its own public token name and
      // points it at the shared one — `--move-select-item-radius:
      // var(--move-option-radius)` — so an override still works while the value
      // lives in one place. Reading the name alone called that drift.
      const local = /^var\((--move-[\w-]+)\)$/.exec(value);
      const resolved = local
        ? (new RegExp(`${local[1]}:\\s*([^;]+)`).exec(src)?.[1] ?? value).trim()
        : value;
      const ok = tokens.split(', ').some((t) => value.includes(t) || resolved.includes(t));
      if (!ok) {
        problems.push({ rel, line, selector, prop, value, tokens });
      }
    }
  }
}

if (problems.length === 0) {
  console.log('✓ option-rows: every highlighted row is styled from the shared option tokens.');
  process.exit(0);
}

console.log(`✗ option-rows: ${problems.length} row(s) styled outside the shared definition.`);
for (const p of problems) {
  console.log(`\n  [styles-17] ${p.rel}:${p.line} — ${p.selector}`);
  console.log(`    ${p.prop}: ${p.value}`);
  console.log(`    expected one of: ${p.tokens}`);
}
process.exit(1);
