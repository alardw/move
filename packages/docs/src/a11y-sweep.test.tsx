import { describe, it, expect, afterAll } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import axe from 'axe-core';
import { MoveRoot } from 'move';
import { COMPONENT_CONTENT } from './content/components';

// Mechanical a11y sweep (a11y-1), run as a RATCHET. Renders every component sample
// and runs axe-core over the DOM. jsdom can't do layout or colour,
// so we run only the mechanical rules — roles, names, ARIA — and disable the
// page-scope / contrast rules that don't apply to a rendered fragment.
//
// The baseline (a11y.baseline.json) holds the accepted per-entry/per-rule counts.
// New violations above the baseline fail; fixing one shrinks the baseline. Re-snapshot
// with `A11Y_UPDATE=1 vitest run src/a11y-sweep.test.tsx`. Same model as app-conformance.
const AXE_OPTS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false },
    'landmark-one-main': { enabled: false },
    'page-has-heading-one': { enabled: false },
    'html-has-lang': { enabled: false },
    'document-title': { enabled: false },
    bypass: { enabled: false },
    'landmark-unique': { enabled: false },
  },
};

// vitest runs with the docs package as cwd.
const BASELINE = path.join(process.cwd(), 'src', 'a11y.baseline.json');

type Counts = Record<string, Record<string, number>>; // label -> rule -> n
const sortCounts = (c: Counts): Counts => {
  const out: Counts = {};
  for (const label of Object.keys(c).sort()) {
    out[label] = {};
    for (const rule of Object.keys(c[label]).sort()) out[label][rule] = c[label][rule];
  }
  return out;
};

type Entry = { label: string; node: React.ReactElement };
const entries: Entry[] = [];
for (const c of Object.values(COMPONENT_CONTENT)) {
  for (const s of c.samples ?? []) {
    const S = s.render;
    entries.push({ label: `${c.meta.slug}/${s.id}`, node: <S /> });
  }
}
/**
 * One test per sample, rather than one test over all 258.
 *
 * As a single `it()` the whole sweep shared one 120s budget, and it took 72s on
 * a developer machine — under the cap, but a CI runner is two to three times
 * slower, so the gate was a coin flip that finally came up tails. A timeout is
 * also the least useful failure a ratchet can produce: it names no component,
 * so "the a11y check is red" tells you nothing about which sample broke.
 *
 * Per-sample tests cost the same total time and remove the cliff — each gets its
 * own budget, and a failure names the entry. They also let each sample assert
 * against its own baseline entry, which is what it was really doing all along.
 *
 * The two whole-sweep assertions cannot live in a per-sample test, so they run
 * in afterAll: the re-snapshot for A11Y_UPDATE, and the check that no baselined
 * violation has been fixed while keeping its allowance — slack in a gate reads
 * as assurance and is the opposite.
 */
const baseline: Counts = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
const counts: Counts = {};
let visited = 0;

// Some samples are genuinely heavy (Chart's ten thousand points, Table's rows).
// Generous per sample, and still a fraction of one shared bucket.
const PER_SAMPLE_TIMEOUT = 20_000;

describe('a11y sweep (axe — roles, names, ARIA)', () => {
  for (const e of entries) {
    it(
      `${e.label} introduces no mechanical a11y violations above the baseline`,
      async () => {
        try {
          const { container } = render(<MoveRoot>{e.node}</MoveRoot>);
          const res = await axe.run(container, AXE_OPTS);
          for (const v of res.violations) {
            (counts[e.label] ??= {})[v.id] = (counts[e.label]?.[v.id] ?? 0) + v.nodes.length;
          }
        } finally {
          cleanup();
          visited++;
        }

        if (process.env.A11Y_UPDATE) return;

        const regressions: string[] = [];
        for (const [rule, n] of Object.entries(counts[e.label] ?? {})) {
          const allowed = baseline[e.label]?.[rule] ?? 0;
          if (n > allowed) regressions.push(`+${n - allowed}  ${e.label}  [${rule}]`);
        }
        expect(regressions, regressions.join('\n')).toEqual([]);
      },
      PER_SAMPLE_TIMEOUT,
    );
  }

  afterAll(() => {
    if (process.env.A11Y_UPDATE) {
      fs.writeFileSync(BASELINE, JSON.stringify(sortCounts(counts), null, 2) + '\n');
      const live = Object.values(counts).reduce(
        (a, r) => a + Object.values(r).reduce((x, y) => x + y, 0),
        0,
      );
      // eslint-disable-next-line no-console
      console.log(
        `a11y baseline written — ${live} finding(s) across ${Object.keys(counts).length} entries`,
      );
      return;
    }

    // Only meaningful once every sample has run; a bailed-out run would read a
    // skipped sample's absent findings as findings that were fixed.
    if (visited < entries.length) return;

    let fixed = 0;
    for (const [label, rules] of Object.entries(baseline))
      for (const [rule, n] of Object.entries(rules)) fixed += Math.max(0, n - (counts[label]?.[rule] ?? 0));

    // A ratchet only ratchets if it tightens. `fixed` was computed and printed
    // and never asserted, so a repaired violation left its allowance behind and
    // the same bug could slide back in silently — which is what happened: two
    // FileUpload `label` findings sat in the baseline while the hidden file
    // input genuinely had no accessible name (WCAG 4.1.2), and the sweep was
    // green throughout. Slack in a gate reads as assurance and is the opposite.
    expect(
      fixed,
      `${fixed} baselined a11y violation(s) are fixed but still allowed. Re-snapshot so ` +
        `the baseline cannot absorb them again:\n\n` +
        `    A11Y_UPDATE=1 npx vitest run src/a11y-sweep.test.tsx\n`,
    ).toBe(0);
  });
});
