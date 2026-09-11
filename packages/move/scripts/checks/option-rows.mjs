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
 * `--move-option-*` is the definition. This is what makes components use it —
 * the highlight, the geometry under it, and the ratio the row grows by.
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

/**
 * The same, for the row's own rule rather than its highlighted state.
 *
 * Geometry is not a state, so it is never written on `[data-highlighted]` — it
 * sits on the base rule, which the selector filter above skips. Checked
 * separately on the rule the highlighted one belongs to.
 *
 * `margin-block` is the gap between rows. Two of the three lists had none, so
 * their highlights met edge to edge and read as one block; the token existed
 * and only the media players' menu used it.
 */
const SHARED_GEOMETRY = {
  padding: '--move-option-padding-y, --move-option-padding-x',
  'margin-block': '--move-option-gap',
};

/**
 * A row grows under the pointer by a few PIXELS, and the ratio that does it has
 * to be derived from a width worth deriving it from.
 *
 * Every list computed its own `(width + 4) / width` off the TRIGGER's width, and
 * a menu hangs off whatever opened it — an icon button at 32px gives 1.125, a
 * row growing an eighth of its size and overflowing the panel. Select clamped
 * to a floor and the other two did not: one formula, three copies, two wrong.
 * There is now one helper, and this is what keeps the fourth list from writing
 * a fourth copy.
 */
const HOVER_SCALE_INLINE = /\(\s*\w*[wW]idth\s*\+[^)]*\)\s*\/\s*\w*[wW]idth/;
const HOVER_SCALE_HELPER = 'optionHoverScale';

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

/**
 * Geometry lives on the base rule. Find the class the highlighted selector names
 * (`.item[data-highlighted]` → `.item`) and read that rule instead.
 */
for (const file of cssFiles(join(MOVE_ROOT, 'src', 'components'))) {
  const src = readFileSync(file, 'utf8');
  const rel = relative(MOVE_ROOT, file);

  const rowClasses = new Set();
  for (const m of src.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const selector = m[1].trim().split('\n').pop().trim();
    if (!HIGHLIGHTED.test(selector)) continue;
    for (const cls of selector.matchAll(/\.([\w-]+)\[data-highlighted\]/g)) rowClasses.add(cls[1]);
  }

  for (const cls of rowClasses) {
    const rule = new RegExp(`(?:^|\\n)\\.${cls}\\s*\\{([^}]*)\\}`).exec(src);
    if (!rule) continue;
    const body = rule[1];
    if (/option-exempt/.test(body)) continue;
    const line = src.slice(0, rule.index).split('\n').length + 1;
    for (const [prop, tokens] of Object.entries(SHARED_GEOMETRY)) {
      const decl = new RegExp(`(?:^|;)\\s*${prop}:\\s*([^;]+)`, 'm').exec(body);
      if (!decl) {
        problems.push({ rel, line, selector: `.${cls}`, prop, value: '(absent)', tokens });
        continue;
      }
      const value = decl[1].trim();
      const names = [...value.matchAll(/var\((--move-[\w-]+)\)/g)].map((v) => v[1]);
      const resolved = names
        .map((n) => (new RegExp(`${n}:\\s*([^;]+)`).exec(src)?.[1] ?? n).trim())
        .join(' ');
      const ok = tokens
        .split(', ')
        .every((t) => value.includes(t) || resolved.includes(t));
      if (!ok) problems.push({ rel, line, selector: `.${cls}`, prop, value, tokens });
    }
  }
}

/** One formula for how far a row travels, in one place. */
function sourceFiles(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (e.endsWith('.tsx') && !e.endsWith('.test.tsx')) out.push(full);
  }
  return out;
}

for (const file of sourceFiles(join(MOVE_ROOT, 'src', 'components'))) {
  const src = readFileSync(file, 'utf8');
  if (src.includes(HOVER_SCALE_HELPER)) continue;
  for (const [i, text] of src.split('\n').entries()) {
    if (!HOVER_SCALE_INLINE.test(text)) continue;
    problems.push({
      rel: relative(MOVE_ROOT, file),
      line: i + 1,
      selector: 'hover scale',
      prop: 'scale ratio',
      value: text.trim(),
      tokens: `${HOVER_SCALE_HELPER}() from src/shared/optionHoverScale`,
    });
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
