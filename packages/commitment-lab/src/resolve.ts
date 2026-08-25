// resolve.ts — Spike-1 proof, runnable: `npm run resolve` (from packages/commitment-lab).
//
// Resolves a LabComposite's decisions against the LIVE design pattern it names — using the
// real axes + bindings imported read-only from packages/move. For each pattern axis it shows
// the committed value and the concrete Move node it binds to, and it flags any axis left
// unresolved, any illegal value, and any decision that doesn't belong to the pattern. This is
// the smallest honest test that the spec model + the real pattern actually mesh.

declare const process: { exit(code: number): never };

import type { DesignPatternSpec } from '../../move/patterns/spec-type';
import type { LabComposite } from './types';
import { PATTERNS } from './patterns';
import { videoTile } from './composites/VideoTile.spec';

type Status = 'ok' | 'gap' | 'illegal' | 'unresolved';

interface Row {
  axis: string;
  slot: string;
  decision: string;
  repr: string;
  status: Status;
}

const slotForAxis = (pattern: DesignPatternSpec, axis: string): string =>
  pattern.skeleton.find((s) => s.drivenBy.includes(axis))?.slot ?? '—';

const legal = (value: readonly string[], options?: readonly string[]): boolean =>
  !options || options.includes('*') || value.every((v) => options.includes(v));

const reprFor = (
  pattern: DesignPatternSpec,
  slot: string,
  axis: string,
  decision: string | readonly string[],
): string => {
  const wanted = Array.isArray(decision) ? '*' : (decision as string);
  const b = pattern.bindings.find(
    (x) => x.slot === slot && x.axis === axis && (x.value === wanted || x.value === '*'),
  );
  if (!b) return '⚠ no binding';
  return b.repr ?? '∅ declared gap';
};

function resolve(composite: LabComposite, pattern: DesignPatternSpec) {
  const rows: Row[] = pattern.axes.map((ax): Row => {
    const slot = slotForAxis(pattern, ax.axis);
    const decision = composite.decisions[ax.axis];
    if (decision === undefined)
      return { axis: ax.axis, slot, decision: '—', repr: '', status: 'unresolved' };

    const values = Array.isArray(decision) ? decision : [decision as string];
    const shown = values.join(', ');
    if (!legal(values, ax.options))
      return { axis: ax.axis, slot, decision: shown, repr: `not in [${ax.options?.join(' | ')}]`, status: 'illegal' };

    const repr = reprFor(pattern, slot, ax.axis, decision);
    return { axis: ax.axis, slot, decision: shown, repr, status: repr.startsWith('∅') ? 'gap' : 'ok' };
  });

  const axisNames = new Set(pattern.axes.map((a) => a.axis));
  const extraneous = Object.keys(composite.decisions).filter((k) => !axisNames.has(k));
  return { rows, extraneous };
}

// ── run ────────────────────────────────────────────────────────────────────
const composite = videoTile as LabComposite;
const pattern = PATTERNS[composite.fromPattern];

const MARK: Record<Status, string> = { ok: '✓', gap: '·', illegal: '✗', unresolved: '✗' };
const pad = (s: string, n: number) => s.padEnd(n);

console.log(`\n  ${composite.name}  —  role: ${composite.role}`);
console.log(
  `  signature: ${composite.signature.verb} × ${composite.signature.object} × ${composite.signature.scope}`,
);
console.log(`  fromPattern: ${composite.fromPattern} (${pattern ? pattern.name : 'NOT FOUND'})\n`);

if (!pattern) {
  console.log(`  ✗ unknown pattern "${composite.fromPattern}" — nothing to resolve against.\n`);
  process.exit(1);
}

const { rows, extraneous } = resolve(composite, pattern);

console.log(`    ${pad('axis', 16)}${pad('slot', 12)}${pad('decision', 22)}binding`);
console.log(`    ${'─'.repeat(72)}`);
for (const r of rows) {
  console.log(`  ${MARK[r.status]} ${pad(r.axis, 16)}${pad(r.slot, 12)}${pad(r.decision, 22)}${r.repr}`);
}

const counts = rows.reduce<Record<Status, number>>(
  (a, r) => ((a[r.status] = (a[r.status] ?? 0) + 1), a),
  { ok: 0, gap: 0, illegal: 0, unresolved: 0 },
);
for (const e of extraneous) console.log(`  ✗ ${pad(e, 16)}${pad('—', 12)}decision not an axis of this pattern`);

const broken = counts.illegal + counts.unresolved + extraneous.length;
console.log(`    ${'─'.repeat(72)}`);
console.log(
  `  ${broken === 0 ? '✓ RESOLVES' : '✗ INCOMPLETE'} — ${counts.ok} bound · ${counts.gap} declared-gap · ${counts.illegal} illegal · ${counts.unresolved} unresolved · ${extraneous.length} stray\n`,
);

process.exit(broken === 0 ? 0 : 1);
