import { describe, it, expect } from 'vitest';
import {
  oklchToLinear,
  oklchHex,
  luminance,
  contrast,
  clampToContrast,
  wcagLevel,
  type LinRGB,
} from './color-engine';

/** sRGB hex → linear-light (for asserting against known WCAG figures). */
function hexToLinear(hex: string): LinRGB {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return [ch[0], ch[1], ch[2]];
}

const WHITE = hexToLinear('#ffffff');
const BLACK = hexToLinear('#000000');

describe('color-engine — OKLCH conversion', () => {
  it('oklch(1,0,·) is white, oklch(0,0,·) is black', () => {
    expect(oklchHex(1, 0, 0)).toBe('#ffffff');
    expect(oklchHex(0, 0, 0)).toBe('#000000');
  });

  it('a low-chroma neutral stays near-gray (channels within a few points)', () => {
    const [r, g, b] = oklchToLinear(0.6, 0.006, 250).map((c) => Math.round(c * 255));
    expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThan(12);
  });
});

describe('color-engine — WCAG 2.2 contrast', () => {
  it('luminance of white is 1 and black is 0', () => {
    expect(luminance(WHITE)).toBeCloseTo(1, 5);
    expect(luminance(BLACK)).toBeCloseTo(0, 5);
  });

  it('black on white is 21:1, identical colors are 1:1', () => {
    expect(contrast(BLACK, WHITE)).toBeCloseTo(21, 1);
    expect(contrast(WHITE, WHITE)).toBeCloseTo(1, 5);
  });

  it('matches the canonical #767676-on-white AA boundary (~4.54:1)', () => {
    const c = contrast(hexToLinear('#767676'), WHITE);
    expect(c).toBeGreaterThan(4.4);
    expect(c).toBeLessThan(4.65);
  });

  it('is order-independent', () => {
    const a = hexToLinear('#334455');
    expect(contrast(a, WHITE)).toBeCloseTo(contrast(WHITE, a), 6);
  });
});

describe('color-engine — clampToContrast', () => {
  it('darkens light-mode text until it clears the target against the surface', () => {
    // A too-light neutral text on white; demand AA 4.5.
    const r = clampToContrast(0.75, 0.01, 250, [WHITE], 4.5, false);
    expect(r.clamped).toBe(true);
    expect(r.ratio).toBeGreaterThanOrEqual(4.5);
    expect(r.L).toBeLessThan(0.75); // moved darker
  });

  it('brightens dark-mode text against a dark surface', () => {
    const darkSurface = oklchToLinear(0.17, 0.01, 250);
    const r = clampToContrast(0.4, 0.01, 250, [darkSurface], 4.5, true);
    expect(r.ratio).toBeGreaterThanOrEqual(4.5);
    expect(r.L).toBeGreaterThan(0.4); // moved lighter
  });

  it('leaves an already-compliant color untouched', () => {
    const r = clampToContrast(0.22, 0.01, 250, [WHITE], 7, false);
    expect(r.clamped).toBe(false);
  });

  it('guarantees the target against the WORST of several surfaces', () => {
    const surfaces = [WHITE, oklchToLinear(0.93, 0.01, 250)]; // base + emphasis
    const r = clampToContrast(0.6, 0.01, 250, surfaces, 4.5, false);
    for (const s of surfaces) {
      expect(contrast(oklchToLinear(r.L, 0.01, 250), s)).toBeGreaterThanOrEqual(4.49);
    }
  });
});

describe('color-engine — wcagLevel', () => {
  it('grades normal text at 7 / 4.5 thresholds', () => {
    expect(wcagLevel(7.1)).toBe('AAA');
    expect(wcagLevel(5)).toBe('AA');
    expect(wcagLevel(3)).toBe('fail');
  });
  it('grades large text at 4.5 / 3 thresholds', () => {
    expect(wcagLevel(4.6, true)).toBe('AAA');
    expect(wcagLevel(3.2, true)).toBe('AA');
    expect(wcagLevel(2.5, true)).toBe('fail');
  });
});
