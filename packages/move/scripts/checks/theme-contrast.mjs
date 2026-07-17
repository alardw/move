#!/usr/bin/env node
/**
 * Theme contrast — WCAG 2.2 AA on a RESOLVED theme (a11y-3, WCAG 1.4.3 / 1.4.11).
 *
 * `defineTheme` clamps the tokens it computes, so a generated theme is AA by
 * construction — which is why Move's own light/dark can't drift. What that guarantee
 * does NOT cover is spelled out in audit.ts: raw-token overrides, hand-authored
 * themes, and the chromatic tokens defineTheme references but never clamps. That is
 * the half `auditTheme` was written for.
 *
 * It was written, exported, and unit-tested — and then called from exactly one place,
 * the Theme Builder's live matrix, which a human has to go and look at. audit.ts's own
 * header names four call sites; three were never built, including this one. A comment
 * can name a phantom gate forever.
 *
 * So this is the gate: resolve every shipped theme's tokens against the real primitive
 * CSS and audit the pairs. It proves the clamp actually holds end-to-end rather than
 * trusting that it does — the clamp guarantees the tokens it computes, and this checks
 * the colours those tokens finally resolve to, which is a different claim.
 *
 * The same `auditTheme` is exported for consumers to call on their own resolved theme,
 * where the risk is real rather than theoretical: their overrides are exactly the
 * unclamped case. (This gate audits Move's shipped themes; it is not yet wired into the
 * consumer `move check` runner.)
 *
 * Exit: 0 = every audited pair meets its floor, 1 = at least one is below.
 *
 * @enforces a11y-3
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Run under tsx (see the check:theme-contrast script), so import the theme modules
// straight from source — NOT the built barrel. check:all runs on CI and pre-push with
// no build step before it, so a dist import would fail on a clean tree, or worse, audit
// a stale build. These modules are pure colour math (audit.ts + defineTheme + moveSeed),
// no CSS or React, so tsx loads them with nothing to bundle.
import { auditTheme, parsePrimitives, themeColorOf } from '../../src/styles/themes/audit.ts';
import { lightTheme } from '../../src/styles/themes/light.ts';
import { darkTheme } from '../../src/styles/themes/dark.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const PRIMITIVES_DIR = join(MOVE_ROOT, 'src', 'styles', 'tokens', 'primitives');

// The audit needs real hex values, so the primitive CSS is the source — the same text
// `parsePrimitives` was built to read. Every primitive file, since a theme token can
// reference any of them.
const primitiveCss = readdirSync(PRIMITIVES_DIR)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(join(PRIMITIVES_DIR, f), 'utf8'))
  .join('\n');

const primitives = parsePrimitives(primitiveCss);
if (Object.keys(primitives).length < 50) {
  console.error(
    `  ✗ theme-contrast: parsed only ${Object.keys(primitives).length} primitives — the CSS shape`,
  );
  console.error('    changed. Every pair would resolve to n/a and this would pass while checking');
  console.error('    nothing, which is worse than no gate.');
  process.exit(1);
}

const failures = [];
let audited = 0;

for (const [name, theme] of [
  ['light', lightTheme],
  ['dark', darkTheme],
]) {
  const res = auditTheme(themeColorOf(theme, primitives));
  const resolved = res.rows.filter((r) => r.ratio !== null);
  audited += resolved.length;

  // A theme whose pairs all resolve to n/a would "pass" with nothing measured.
  if (resolved.length < res.rows.length / 2) {
    console.error(`  ✗ theme-contrast: ${name} — only ${resolved.length}/${res.rows.length} pairs`);
    console.error('    resolved to a colour. The token graph changed; fix the resolution.');
    process.exit(1);
  }

  for (const v of res.violations) {
    failures.push(`${name}: ${v.label} (${v.pair}) — ${v.ratio?.toFixed(2)}:1, needs ${v.floor}:1`);
  }
}

if (failures.length) {
  console.error('  ✗ Theme colour pairs below their WCAG floor:');
  for (const f of failures) console.error(`      ${f}`);
  console.error(`\n  theme-contrast: ${failures.length} pair(s) fail AA.`);
  console.error(
    '  Let defineTheme generate the value rather than pinning it, or ease the override.',
  );
  process.exit(1);
}

console.log(`✓ theme-contrast: ${audited} colour pairs across light + dark meet WCAG 2.2 AA.`);
process.exit(0);
