#!/usr/bin/env node
/**
 * Dismissable-lifecycle guardrail.
 *
 * Animated open/close (popups, overlays, popup-inputs) is delicate: the exit
 * animation must never hang the close (orphaned promise) and reopening mid-close
 * must win. That logic lives ONCE in the shared `useDismissable` /
 * `useDismissableExit` hooks (src/animation/useDismissable.ts). A component that
 * hand-rolls it — `runExit().then(onCloseComplete)` wired to its own `isClosing`
 * state — re-opens the bug surface (this is exactly how DatePicker shipped the
 * "opens once, then nothing happens" lock).
 *
 * This check flags any component that calls `runExit().then(` itself instead of
 * delegating to `useDismissableExit`. The only place that pattern is allowed is
 * the hook.
 *
 * Exit: 0 = clean, 1 = a component hand-rolls the exit lifecycle.
 */

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(HERE, '..', '..', 'src', 'components');
const ROOT = join(HERE, '..', '..');

const offenders = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (entry.endsWith('.tsx') && !entry.endsWith('.test.tsx') && !entry.endsWith('.browser.test.tsx')) {
      const text = readFileSync(p, 'utf8');
      // Hand-rolled exit lifecycle: calling runExit() and chaining .then on it.
      // Migrated components pass `runExit` into useDismissableExit and never
      // call `.then` on it themselves.
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        if (/runExit\(\)\s*\.then\(/.test(line)) {
          offenders.push(`${relative(ROOT, p)}:${i + 1}`);
        }
      });
    }
  }
}

walk(COMPONENTS_DIR);

if (offenders.length) {
  console.error('  ✗ Components hand-rolling the dismissable exit lifecycle (use useDismissableExit instead):');
  for (const o of offenders) console.error(`      ${o}`);
  console.error(`\n  dismissable-lifecycle: ${offenders.length} offender(s).`);
  process.exit(1);
}
console.log('✓ dismissable-lifecycle: no component hand-rolls runExit().then — all delegate to useDismissableExit.');
process.exit(0);
