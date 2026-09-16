#!/usr/bin/env node
/**
 * Untranslatable-text guard — no user-facing string is baked into a component.
 *
 * Every component routes its strings through one `labels` object, and
 * `component-conformance` E1 already refuses a hardcoded `aria-label`. The half
 * nobody was checking is VISIBLE text: `<span>Time</span>` passes E1 cleanly,
 * ships in every locale as English, and no consumer can reach it.
 *
 * That asymmetry is the whole finding. A name a screen reader speaks was
 * guarded; the word a sighted user reads was not — and the two are the same
 * problem. DatePicker's "Time" heading was the one that had slipped through.
 *
 * Scans three places a component source can speak: JSX text children, text
 * props (`label="Speed"`), and text fields of objects it builds for itself
 * (`{ label: 'Speed' }`). The third is how the media players' settings menu —
 * Speed, Quality, Audio — shipped English-only under a check that was already
 * watching for exactly this: a menu assembled in a `useMemo` renders no JSX
 * text of its own, so its words went straight past a text-child scan.
 *
 * A string qualifies as user-facing when it starts with a capital and reads as
 * words; symbols, separators, and single characters are not prose and are
 * skipped, as is the DEFAULT_LABELS object, where such strings belong.
 *
 * @enforces i18n-1
 * @instead add the string to the component's `{Name}Labels` interface and
 *   `DEFAULT_LABELS`, then render `labels.thatKey` — so a consumer can translate
 *   it through the same object as every other string the component speaks.
 */

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = join(HERE, '..', '..');
const COMPONENTS = join(MOVE, 'src', 'components');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx$/.test(full) && !/\.(test|spec|browser)\./.test(full)) out.push(full);
  }
  return out;
}

const files = walk(COMPONENTS);
const errors = [];

/**
 * Props and object fields whose value a person reads. `label: 'Speed'` in the
 * settings menu VideoPlayer builds for itself is the same untranslatable word
 * as `<span>Speed</span>` — it just never passed through JSX text to be caught.
 */
const TEXT_KEYS =
  'label|placeholder|heading|title|caption|summary|message|emptyMessage|description|tooltip|alt';

const PATTERNS = [
  // JSX text child: <span>Speed</span>
  /(?<!\bimport[^\n]*)>\s*([A-Z][A-Za-z][A-Za-z '’,.\-]{2,60})\s*</g,
  // JSX attribute: label="Speed"
  new RegExp(`\\b(?:${TEXT_KEYS})=["']([A-Z][A-Za-z][A-Za-z '’,.\\-]{2,60})["']`, 'g'),
  // Object field: { label: 'Speed' }
  new RegExp(`\\b(?:${TEXT_KEYS})\\s*:\\s*['"]([A-Z][A-Za-z][A-Za-z '’,.\\-]{2,60})['"]`, 'g'),
];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const seen = new Set();
  // The DEFAULT_LABELS object is exactly where these strings belong; its own
  // `label:` / `title:` keys are the destination, not the offence.
  const defaults = [];
  for (const d of text.matchAll(/^const DEFAULT_LABELS[^\n]*\{$/gm)) {
    const start = text.slice(0, d.index).split('\n').length;
    const end = lines.findIndex((l, i) => i >= start && /^\};/.test(l)) + 1;
    defaults.push([start, end]);
  }
  const inDefaults = (line) => defaults.some(([s, e]) => line >= s && line <= e);

  for (const pattern of PATTERNS) {
    for (const m of text.matchAll(pattern)) {
      const literal = m[1].trim();
      // A path or filename in a comment-ish position is not prose.
      if (/\.(tsx?|css|mjs|json)$/.test(literal)) continue;
      const line = text.slice(0, m.index).split('\n').length;
      if (inDefaults(line)) continue;
      if (/i18n-exempt:/.test((lines[line - 2] ?? '') + (lines[line - 1] ?? ''))) continue;
      const key = `${line}:${literal}`;
      if (seen.has(key)) continue;
      seen.add(key);
      errors.push(`${relative(MOVE, file)}:${line}  "${literal}"`);
    }
  }
}
errors.sort();

if (errors.length) {
  console.error(`\n✗ i18n-literals: ${errors.length} hardcoded user-facing string(s).\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    `\n  Route it through the component's \`labels\` object — add the key to\n` +
      `  \`{Name}Labels\` and \`DEFAULT_LABELS\`, then render \`labels.thatKey\`. A visible\n` +
      `  string a consumer cannot reach is as untranslatable as a hardcoded aria-label,\n` +
      `  which is already refused. If the text is genuinely not prose, mark it:\n` +
      `  /* i18n-exempt: reason */\n`,
  );
  process.exit(1);
}

console.log(
  `✓ i18n-literals: ${files.length} component source(s) — every user-facing string routes through \`labels\`.`,
);
