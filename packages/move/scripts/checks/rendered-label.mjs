#!/usr/bin/env node
/**
 * Text a component renders as a visible name belongs to a declared slot.
 *
 * This is the declaration gap, and it is the one the other checks cannot see. An
 * unclassed `<span>` is not a slot, so it carries no `typography` role, so
 * `check:type-scale` has nothing to compare — and `has-label` only fires where a
 * `label` slot already exists, so it protects components that already got it
 * right.
 *
 * That is exactly how two controls shipped their labels at body copy while every
 * other control in the library rendered at the `ui` step: Checkbox and RadioGroup
 * each rendered `<span id={labelId}>{children}</span>`, with no class, no slot
 * and no role. Nothing was malformed. Nothing was declared either, so nothing
 * looked.
 *
 * A slot is recognised however it arrives — `cx('label')`, `{...slot('label')}`,
 * `className={styles.label}` — because the point is that the element is NAMED,
 * not how the class reached it.
 *
 * @enforces styles-20
 * @instead declare the slot: add it to `slots: [...]`, give it a `kind` and a
 *   `typography` role in the spec, and render it through `cx()` + `sp()`. Then
 *   the type scale can see it.
 *
 * Exit: 0 = clean, 1 = at least one visible name rendered outside a slot.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');

/**
 * Caller text rendered as a control's NAME — not merely as children.
 *
 * Bare `{children}` was too broad by a mile: every wrapper in the library
 * renders children, and a tooltip's content div is not a label. What makes text
 * a name is that something points at it — an `id` a control references through
 * aria-labelledby — or that it is the `label` prop itself.
 */
const NAMES_A_CONTROL = /id=\{labelId\}|\{\s*props\.label\b|\{\s*label\s+as\b/;

function sourceFiles(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (e.endsWith('.tsx') && !e.endsWith('.test.tsx')) out.push(full);
  }
  return out;
}

const problems = [];

for (const file of sourceFiles(join(MOVE_ROOT, 'src', 'components'))) {
  const src = readFileSync(file, 'utf8');
  if (/rendered-label-exempt/.test(src)) continue;

  // Each <span>/<label>/<div> opening tag, with its attributes, that renders a
  // caller-supplied name.
  for (const m of src.matchAll(/<(span|label|div|p)\b([^>]*)>/g)) {
    const [, tag, attrs] = m;
    // The naming marker may sit in the attributes (id={labelId}) or in the body
    // just after the tag (the label prop being rendered).
    const window = attrs + src.slice(m.index + m[0].length, m.index + m[0].length + 60);
    if (!NAMES_A_CONTROL.test(window)) continue;
    // Named by any route: a slot spread, the cx helper, or a styles class.
    //
    // Searched in a window rather than in `attrs`, because an attribute capture
    // that stops at the first `>` stops INSIDE a TypeScript generic:
    // `{...(labelSp as Record<string, unknown>)}` ends the capture before
    // `className={cx('label')}` two lines below, and the element looks unnamed
    // when it is not.
    const tagWindow = src.slice(m.index, m.index + 400);
    if (/slot\('|cx\('|styles\./.test(tagWindow)) continue;
    // An element that only exists to carry an id for aria-labelledby, with no
    // visible text of its own, is not a name — but if it renders children it is.
    problems.push({
      rel: relative(MOVE_ROOT, file),
      line: src.slice(0, m.index).split('\n').length,
      tag,
    });
  }
}

if (problems.length === 0) {
  console.log('✓ rendered-label: every visible name is rendered through a declared slot.');
  process.exit(0);
}

console.log(`✗ rendered-label: ${problems.length} name(s) rendered outside a slot.`);
for (const p of problems) {
  console.log(`\n  [styles-20] ${p.rel}:${p.line} — <${p.tag}> renders a name with no slot`);
  console.log('    No slot means no typography role, so check:type-scale cannot see its size.');
}
process.exit(1);
