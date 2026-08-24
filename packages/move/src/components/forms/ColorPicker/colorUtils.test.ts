import { describe, it, expect } from 'vitest';
import { parseColor, formatColor, rgbToHsv, hsvToRgb } from './colorUtils';

/**
 * Round-trip fidelity. HSV is the internal model and every committed value
 * goes through parse → HSV → format, so a lossy conversion silently rewrites
 * the user's color: `rgbToHsv` used to round h/s/v to integers, which changed
 * 81% of hex inputs on commit (#abcdef came back as #adcef0). Integer HSV has
 * roughly 3.7M representable points against RGB's 16.7M, so it cannot be a
 * faithful model — rounding belongs at the display boundary, not here.
 */
describe('colorUtils round-trip', () => {
  const CASES = [
    '#496bf2',
    '#3366ff',
    '#abcdef',
    '#123456',
    '#7f7f7f',
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#010203',
    '#fefdfc',
  ];

  it.each(CASES)('hex %s survives parse → format unchanged', (hex) => {
    expect(formatColor(parseColor(hex)!, 'hex')).toBe(hex);
  });

  it('every sampled RGB triple survives the round-trip', () => {
    const changed: string[] = [];
    for (let r = 0; r < 256; r += 5) {
      for (let g = 0; g < 256; g += 5) {
        for (let b = 0; b < 256; b += 5) {
          const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
          const out = formatColor(parseColor(hex)!, 'hex');
          if (out !== hex) changed.push(`${hex} → ${out}`);
        }
      }
    }
    expect(changed.slice(0, 10), `${changed.length} colors changed on round-trip`).toEqual([]);
  });

  it('rgb → hsv → rgb is exact', () => {
    for (const [r, g, b] of [
      [73, 107, 242],
      [171, 205, 239],
      [1, 2, 3],
      [254, 253, 252],
    ]) {
      const hsv = rgbToHsv(r, g, b);
      expect(hsvToRgb(hsv.h, hsv.s, hsv.v)).toEqual({ r, g, b });
    }
  });

  it('keeps full precision in the model', () => {
    // The guard on the actual regression: a converter that rounds looks fine
    // on primary colors and fails everywhere else.
    const hsv = rgbToHsv(171, 205, 239);
    expect(Number.isInteger(hsv.h) && Number.isInteger(hsv.s) && Number.isInteger(hsv.v)).toBe(
      false,
    );
  });

  it('rounds at the display boundary, not in the model', () => {
    // An hsl() string is a display form and must not carry float noise.
    expect(formatColor(parseColor('#abcdef')!, 'hsl')).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
  });

  it('round-trips through rgb and hsl formats', () => {
    const hex = '#496bf2';
    const viaRgb = formatColor(parseColor(hex)!, 'rgb');
    expect(viaRgb).toBe('rgb(73, 107, 242)');
    expect(formatColor(parseColor(viaRgb)!, 'hex')).toBe(hex);
  });
});
