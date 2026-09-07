#!/usr/bin/env node
/**
 * A component that positions something absolutely establishes a containing block.
 *
 * `position: absolute` with no positioned ancestor resolves against the DOCUMENT.
 * The element then escapes every scroll container between it and the page, and
 * lands at its static offset measured from the top of the document — so the
 * document's scroll height grows to reach it.
 *
 * Three components shipped that, all of them a visually-hidden copy: the
 * accessible full text anime's splitText injects for AnimatedText, Chart's hidden
 * data table, PasswordStrength's sr-only label. On the components gallery the
 * document became 17,365px tall against a 907px viewport — a whole screen of
 * empty page past the app shell, taking the sidebar with it.
 *
 * What made it hard to see is that `body.scrollHeight` stayed at the viewport
 * the entire time. Nothing in the BODY was tall. Only
 * `documentElement.scrollHeight` knew, because an escaped element extends the
 * initial containing block rather than any element in the flow.
 *
 * The rule is deliberately loose — SOMETHING in the file is positioned — because
 * which element should be the containing block is a judgement the stylesheet
 * makes, and a file that positions nothing at all has certainly not made it.
 *
 * @enforces styles-18
 * @instead give the element that owns the absolutely-positioned child
 *   `position: relative`. For an sr-only copy that is the component root.
 *
 * Exit: 0 = clean, 1 = at least one component positioning into the document.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');

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
  if (/containing-block-exempt/.test(src)) continue;

  // The pattern that shipped three times: an element positioned OUT of sight —
  // absolute, and clipped. Nothing else in a stylesheet is reliably identifiable
  // as "this must not escape", because which ancestor should contain a given
  // absolute child is a judgement the DOM makes and the file cannot state.
  const hidden = [...src.matchAll(/([^{}]+)\{([^}]*)\}/g)].filter(
    (m) => /position:\s*absolute/.test(m[2]) && /clip(-path)?:/.test(m[2]),
  );
  if (!hidden.length) continue;

  // The root is what has to contain it: a visually-hidden copy belongs to the
  // component, and the component's own box is the only ancestor it can rely on.
  if (/^\.root\b[^{]*\{[^}]*position:\s*(relative|absolute|fixed|sticky)/ms.test(src)) continue;

  for (const m of hidden) {
    problems.push({
      rel: relative(MOVE_ROOT, file),
      line: src.slice(0, m.index).split('\n').length,
      selector: m[1].trim().split('\n').pop().trim(),
    });
  }
}

if (problems.length === 0) {
  console.log('✓ containing-block: every visually-hidden child resolves against its own component.');
  process.exit(0);
}

console.log(`✗ containing-block: ${problems.length} hidden element(s) positioning into the document.`);
for (const p of problems) {
  console.log(`\n  [styles-18] ${p.rel}:${p.line} — ${p.selector} is hidden off-screen, and .root is not positioned`);
  console.log(
    '    With no positioned ancestor this resolves against the document, escapes every',
  );
  console.log('    scroll container, and stretches the page to reach it.');
}
process.exit(1);
