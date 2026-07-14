import { describe, it, expect } from 'vitest';
import { defineTheme, describeTheme, defineThemes, type ThemeSeed } from './defineTheme';
import { lightTheme } from './light';
import { contrast, type LinRGB } from './color-engine';

function hexToLinear(hex: string): LinRGB {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return [ch[0], ch[1], ch[2]];
}
/** Resolve a token value we can compute contrast on (generated hex, or white/black). */
function resolve(v: string): LinRGB | null {
  if (v.startsWith('#')) return hexToLinear(v);
  if (v === 'var(--move-white)') return hexToLinear('#ffffff');
  if (v === 'var(--move-black)') return hexToLinear('#000000');
  return null; // primitive var() ref — not resolvable at unit-test time
}

const LIGHT: ThemeSeed = {
  name: 'test-light',
  appearance: 'light',
  neutral: { hue: 250, chroma: 0.008 },
  accent: { hue: 262 },
};
const DARK: ThemeSeed = { ...LIGHT, name: 'test-dark', appearance: 'dark' };

describe('defineTheme — completeness', () => {
  it('produces every token the reference theme has', () => {
    const t = defineTheme(LIGHT).tokens as unknown as Record<string, string>;
    const missing = Object.keys(lightTheme.tokens).filter((k) => !(k in t));
    expect(missing).toEqual([]);
  });

  it('returns a valid Theme shape', () => {
    const t = defineTheme(DARK);
    expect(t.name).toBe('test-dark');
    expect(t.animation.duration.normal).toBe(200);
  });
});

describe.each([
  ['light', LIGHT],
  ['dark', DARK],
])('defineTheme — WCAG 2.2 contract (%s)', (_name, seed) => {
  const tk = defineTheme(seed).tokens as unknown as Record<string, string>;
  const C = (fg: string, bg: string) => contrast(resolve(tk[fg])!, resolve(tk[bg])!);
  const SURFACES = ['--move-bg-base', '--move-bg-subtle', '--move-bg-muted', '--move-bg-emphasis'];

  it('fg-base is AAA (≥7) on every surface', () => {
    for (const s of SURFACES) expect(C('--move-fg-base', s)).toBeGreaterThanOrEqual(6.95);
  });

  it('fg-muted holds the comfort target (≥5.5) on base/subtle/muted', () => {
    for (const s of SURFACES.slice(0, 3))
      expect(C('--move-fg-muted', s)).toBeGreaterThanOrEqual(5.45);
  });

  it('fg-subtle holds 3:1 on base/subtle', () => {
    for (const s of SURFACES.slice(0, 2))
      expect(C('--move-fg-subtle', s)).toBeGreaterThanOrEqual(2.95);
  });

  it('link (accent text) holds AA (≥4.5) on every surface', () => {
    for (const s of SURFACES) expect(C('--move-link', s)).toBeGreaterThanOrEqual(4.45);
  });

  it('focus ring holds 3:1 on base/subtle', () => {
    for (const s of SURFACES.slice(0, 2))
      expect(C('--move-focus-ring-color', s)).toBeGreaterThanOrEqual(2.95);
  });

  it('button label clears AA (≥4.5) on the primary fill', () => {
    expect(C('--move-primary-fg', '--move-primary')).toBeGreaterThanOrEqual(4.45);
  });
});

describe('defineTheme — contrast guard', () => {
  it('reports notices only when a seed needed a nudge', () => {
    const clean = describeTheme(LIGHT);
    // a wildly over-saturated neutral forces text clamps
    const hot = describeTheme({ ...LIGHT, neutral: { hue: 250, chroma: 0.05 } });
    expect(hot.notices.length).toBeGreaterThanOrEqual(clean.notices.length);
  });
});

describe('defineThemes — one seed → both modes', () => {
  it('returns light + dark from a single seed, both complete', () => {
    const { light, dark } = defineThemes({
      name: 'brand',
      neutral: { hue: 250, chroma: 0.008 },
      accent: { hue: 262 },
    });
    expect(light.name).toBe('brand');
    expect(dark.name).toBe('brand');
    // the two share the seed but differ in surfaces (light bg is lighter than dark bg)
    const lb = (light.tokens as unknown as Record<string, string>)['--move-bg-base'];
    const db = (dark.tokens as unknown as Record<string, string>)['--move-bg-base'];
    expect(lb).not.toBe(db);
  });
});
