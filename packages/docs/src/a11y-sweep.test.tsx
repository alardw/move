import { describe, it, expect } from 'vitest';
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
describe('a11y sweep (axe — roles, names, ARIA)', () => {
  it(
    'introduces no mechanical a11y violations above the baseline',
    async () => {
      const counts: Counts = {};
      const errors: { label: string; msg: string }[] = [];

      for (const e of entries) {
        try {
          const { container } = render(<MoveRoot>{e.node}</MoveRoot>);
          const res = await axe.run(container, AXE_OPTS);
          for (const v of res.violations) {
            (counts[e.label] ??= {})[v.id] = (counts[e.label]?.[v.id] ?? 0) + v.nodes.length;
          }
        } catch (err) {
          errors.push({ label: e.label, msg: String((err as Error)?.message ?? err).slice(0, 140) });
        } finally {
          cleanup();
        }
      }

      const live = Object.values(counts).reduce((a, r) => a + Object.values(r).reduce((x, y) => x + y, 0), 0);

      if (process.env.A11Y_UPDATE) {
        fs.writeFileSync(BASELINE, JSON.stringify(sortCounts(counts), null, 2) + '\n');
        // eslint-disable-next-line no-console
        console.log(`a11y baseline written — ${live} finding(s) across ${Object.keys(counts).length} entries`);
        return;
      }

      const baseline: Counts = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
      let baseTotal = 0;
      for (const r of Object.values(baseline)) for (const n of Object.values(r)) baseTotal += n;

      const regressions: string[] = [];
      for (const [label, rules] of Object.entries(counts))
        for (const [rule, n] of Object.entries(rules)) {
          const allowed = baseline[label]?.[rule] ?? 0;
          if (n > allowed) regressions.push(`+${n - allowed}  ${label}  [${rule}]`);
        }
      let fixed = 0;
      for (const [label, rules] of Object.entries(baseline))
        for (const [rule, n] of Object.entries(rules)) fixed += Math.max(0, n - (counts[label]?.[rule] ?? 0));

      // eslint-disable-next-line no-console
      console.log(`a11y ratchet: ${live} live · ${baseTotal} baseline · ${regressions.length} new · ${fixed} fixed`);
      for (const e of errors) console.log(`  ⚠ render error ${e.label}: ${e.msg}`);
      if (regressions.length) {
        console.log('\n✗ new a11y violations (above the baseline):');
        for (const r of regressions) console.log(`  ${r}`);
      }

      expect(regressions, regressions.join('\n')).toEqual([]);
    },
    120_000,
  );
});
