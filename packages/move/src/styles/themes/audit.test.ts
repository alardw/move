import { describe, it, expect } from 'vitest';
import { auditTheme, parsePrimitives, themeColorOf } from './audit';
import { hexToLinear, type LinRGB } from './color-engine';
import type { Theme } from './types';

const colorMap =
  (m: Record<string, string>) =>
  (n: string): LinRGB | null =>
    m[n] ? hexToLinear(m[n]) : null;

// A fully WCAG-2.2-AA-compliant light theme (dark ink on light grays, deep accent).
const COMPLIANT: Record<string, string> = {
  '--move-bg-base': '#ffffff',
  '--move-bg-subtle': '#f4f4f5',
  '--move-bg-muted': '#e4e4e7',
  '--move-bg-emphasis': '#d4d4d8',
  '--move-fg-base': '#18181b',
  '--move-fg-muted': '#3f3f46',
  '--move-fg-subtle': '#52525b',
  '--move-link': '#3730a3',
  '--move-focus-ring-color': '#4338ca',
  '--move-primary': '#3730a3',
  '--move-primary-fg': '#ffffff',
};

describe('auditTheme', () => {
  it('passes a fully compliant theme with no violations', () => {
    const res = auditTheme(colorMap(COMPLIANT));
    expect(res.pass).toBe(true);
    expect(res.violations).toEqual([]);
  });

  it('flags fg-subtle that is too light for its 3:1 floor', () => {
    const res = auditTheme(colorMap({ ...COMPLIANT, '--move-fg-subtle': '#a1a1aa' })); // ~2.5 on white
    expect(res.pass).toBe(false);
    expect(res.violations.some((v) => v.pair.includes('fg-subtle'))).toBe(true);
  });

  it('flags a button label that fails AA on the primary fill', () => {
    const res = auditTheme(colorMap({ ...COMPLIANT, '--move-primary': '#4c6ef5' })); // white on indigo-600 ~4.38
    expect(res.violations.some((v) => v.pair.includes('primary-fg on --move-primary'))).toBe(true);
  });

  it('warns when muted text meets AA but misses the comfort target', () => {
    // ~5:1 on the muted surface — passes AA (4.5) but under the 5.5 comfort target
    const res = auditTheme(colorMap({ ...COMPLIANT, '--move-fg-muted': '#5f5f66' }));
    expect(res.warnings.some((v) => v.pair.includes('fg-muted'))).toBe(true);
    expect(res.pass).toBe(true); // a comfort miss is not a hard failure
  });

  it('marks unresolvable pairs n/a rather than failing', () => {
    const res = auditTheme(() => null);
    expect(res.rows.every((r) => r.status === 'n/a')).toBe(true);
    expect(res.pass).toBe(true);
  });
});

describe('themeColorOf — var() resolution', () => {
  it('resolves a token through the theme then the primitive map', () => {
    const primitives = parsePrimitives('--move-indigo-700: #4263eb;\n  --move-white: #ffffff;');
    const theme = {
      name: 't',
      tokens: {
        '--move-primary': 'var(--move-indigo-700)',
        '--move-primary-fg': 'var(--move-white)',
      },
      animation: {},
    } as unknown as Theme;
    const colorOf = themeColorOf(theme, primitives);
    expect(colorOf('--move-primary')).not.toBeNull();
    expect(colorOf('--move-primary-fg')).not.toBeNull();
    expect(colorOf('--move-nonexistent')).toBeNull();
  });
});
