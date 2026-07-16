/**
 * auditTheme — verify a RESOLVED theme against the WCAG 2.2 AA contract.
 *
 * Unlike the `defineTheme` clamp (which guarantees only the tokens it computes),
 * this audits ANY theme's final resolved colors — so it covers raw-token overrides,
 * hand-authored themes, and the chromatic tokens `defineTheme` references but never
 * clamps. One function, four call sites: the library `check:theme-contrast`, the
 * consumer `move check`, the Theme Builder's live matrix, and the docs a11y sweep.
 *
 * `auditTheme` is pure and takes a `colorOf` accessor so the caller owns resolution
 * (Node: parse primitives from CSS; browser: getComputedStyle). Node helpers for the
 * former live below.
 */

import { contrast, hexToLinear, type LinRGB } from './color-engine';
import type { Theme } from './types';

export type AuditStatus = 'AAA' | 'AA' | 'pass' | 'warn' | 'fail' | 'n/a';
export interface AuditRow {
  label: string;
  pair: string;
  ratio: number | null;
  floor: number;
  comfort?: number;
  status: AuditStatus;
}
export interface AuditResult {
  pass: boolean;
  violations: AuditRow[]; // below the WCAG floor — hard fail
  warnings: AuditRow[]; // meets floor, below the comfort target
  rows: AuditRow[];
}

const SURFACES = ['--move-bg-base', '--move-bg-subtle', '--move-bg-muted', '--move-bg-emphasis'];

interface Rule {
  fg: string;
  on: string[];
  floor: number; // WCAG hard floor (AA 4.5 text / 3 large-UI)
  comfort?: number; // soft aspiration (AAA / reading comfort)
  label: string;
}

/** The contrast contract, grounded in real component usage (see define-theme-spec.md). */
const CONTRACT: Rule[] = [
  { fg: '--move-fg-base', on: SURFACES, floor: 4.5, comfort: 7, label: 'body text' },
  {
    fg: '--move-fg-muted',
    on: SURFACES.slice(0, 3),
    floor: 4.5,
    comfort: 5.5,
    label: 'secondary / placeholder',
  },
  { fg: '--move-fg-subtle', on: SURFACES.slice(0, 2), floor: 4.5, label: 'subtle text' },
  { fg: '--move-link', on: SURFACES, floor: 4.5, label: 'accent text (link)' },
  {
    fg: '--move-focus-ring-color',
    on: ['--move-bg-base', '--move-bg-subtle'],
    floor: 3,
    label: 'focus ring',
  },
  // Non-text contrast (WCAG 1.4.11) for interactive control boundaries. Each is
  // graded on the surfaces it actually renders on: the soft border on the
  // base/subtle ground, the strong border on the elevated surfaces the surface
  // system swaps it in for (see surface.css).
  {
    fg: '--move-border-interactive',
    on: ['--move-bg-base', '--move-bg-subtle'],
    floor: 3,
    label: 'control border',
  },
  {
    fg: '--move-border-interactive-strong',
    on: ['--move-bg-muted', '--move-bg-emphasis'],
    floor: 3,
    label: 'control border (elevated)',
  },
];

function grade(ratio: number, floor: number, comfort?: number): AuditStatus {
  if (ratio < floor) return 'fail';
  if (comfort && ratio < comfort) return 'warn';
  return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'pass';
}

export function auditTheme(colorOf: (name: string) => LinRGB | null): AuditResult {
  const rows: AuditRow[] = [];
  const violations: AuditRow[] = [];
  const warnings: AuditRow[] = [];

  const record = (
    label: string,
    fgName: string,
    bgName: string,
    floor: number,
    comfort?: number,
  ) => {
    const fg = colorOf(fgName);
    const bg = colorOf(bgName);
    const pair = `${fgName} on ${bgName}`;
    if (!fg || !bg) {
      rows.push({ label, pair, ratio: null, floor, comfort, status: 'n/a' });
      return;
    }
    const ratio = contrast(fg, bg);
    const status = grade(ratio, floor, comfort);
    const row: AuditRow = { label, pair, ratio, floor, comfort, status };
    rows.push(row);
    if (status === 'fail') violations.push(row);
    else if (status === 'warn') warnings.push(row);
  };

  for (const r of CONTRACT) for (const bg of r.on) record(r.label, r.fg, bg, r.floor, r.comfort);
  record('button label', '--move-primary-fg', '--move-primary', 4.5);

  return { pass: violations.length === 0, violations, warnings, rows };
}

// ── Node resolution helpers ────────────────────────────────────────────────────

/** Parse `--move-name: #hex | var(...)` declarations from CSS text into a map. */
export function parsePrimitives(css: string): Record<string, string> {
  const map: Record<string, string> = {};
  const re = /(--move-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8}|var\(\s*--move-[a-z0-9-]+\s*\))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) map[m[1]] = m[2];
  return map;
}

/** Build a `colorOf` that resolves a theme token to a concrete color, following
 *  `var(--move-…)` through the theme's own tokens then the primitive map. */
export function themeColorOf(
  theme: Theme,
  primitives: Record<string, string>,
): (name: string) => LinRGB | null {
  const tokens = theme.tokens as unknown as Record<string, string>;
  const resolve = (val: string | undefined, depth = 0): string | null => {
    if (!val || depth > 6) return null;
    const v = val.trim();
    if (v.startsWith('#')) return v;
    const ref = v.match(/^var\(\s*(--move-[a-z0-9-]+)\s*\)$/);
    if (ref) return resolve(tokens[ref[1]] ?? primitives[ref[1]], depth + 1);
    return null; // rgba()/transparent/keywords — not a contrast color
  };
  return (name) => {
    const hex = resolve(tokens[name] ?? primitives[name]);
    return hex ? hexToLinear(hex) : null;
  };
}
