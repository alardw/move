import { describe, it, expect } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import axe from 'axe-core';
import { MoveRoot } from 'move';

// Render-time a11y ratchet. Renders every composite in src/composites and runs
// axe-core over the DOM (mechanical rules only — jsdom has no layout or colour).
// The baseline (accessibility.baseline.json) holds the accepted per-entry/per-rule
// counts: a NEW violation above it fails; fixing one lets you shrink the baseline.
// Re-snapshot: A11Y_UPDATE=1 vitest run src/conformance/accessibility.test.tsx
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

const BASELINE = path.join(process.cwd(), 'src', 'conformance', 'accessibility.baseline.json');

type Counts = Record<string, Record<string, number>>;
const sortCounts = (c: Counts): Counts => {
  const out: Counts = {};
  for (const label of Object.keys(c).sort()) {
    out[label] = {};
    for (const rule of Object.keys(c[label]).sort()) out[label][rule] = c[label][rule];
  }
  return out;
};

// Every default/named component export under src/composites becomes a sweep entry.
// A composite that needs props will throw on bare render — that's recorded as a
// render error (logged, non-fatal), not counted as an a11y violation.
const modules = import.meta.glob('../composites/**/*.tsx', { eager: true });
type Entry = { label: string; Comp: React.ComponentType };
const entries: Entry[] = [];
for (const [file, mod] of Object.entries(modules)) {
  if (file.endsWith('.test.tsx')) continue;
  const base = file.replace('../composites/', '').replace(/\.tsx$/, '');
  for (const [name, val] of Object.entries(mod as Record<string, unknown>)) {
    if (typeof val === 'function' && /^[A-Z]/.test(name)) {
      entries.push({ label: `${base}/${name}`, Comp: val as React.ComponentType });
    }
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
          const { container } = render(
            <MoveRoot>
              <e.Comp />
            </MoveRoot>,
          );
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

      console.log(`a11y ratchet: ${live} live · ${baseTotal} baseline · ${regressions.length} new`);
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
