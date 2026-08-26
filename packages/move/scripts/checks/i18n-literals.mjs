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
 * Scans JSX text children in component sources. A string qualifies as
 * user-facing when it starts with a capital and reads as words; symbols,
 * separators, and single characters are not prose and are skipped.
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

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const m of text.matchAll(/>\s*([A-Z][A-Za-z][A-Za-z '’,.\-]{2,60})\s*</g)) {
    const literal = m[1].trim();
    // A path or filename in a comment-ish position is not prose.
    if (/\.(tsx?|css|mjs|json)$/.test(literal)) continue;
    const line = text.slice(0, m.index).split('\n').length;
    if (/i18n-exempt:/.test((lines[line - 2] ?? '') + (lines[line - 1] ?? ''))) continue;
    errors.push(`${relative(MOVE, file)}:${line}  "${literal}"`);
  }
}

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
