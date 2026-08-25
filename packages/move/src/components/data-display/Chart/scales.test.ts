import { describe, it, expect } from 'vitest';
import {
  areaPath,
  bandScale,
  labelStride,
  linePath,
  linearScale,
  niceDomain,
  niceTicks,
} from './scales';

/** Pull the anchor + control points out of a path so curves can be evaluated. */
function parseCubics(d: string) {
  const nums = d
    .split(/[MC]/)
    .filter(Boolean)
    .map((seg) => seg.trim().split(/[ ,]+/).map(Number));
  const start: [number, number] = [nums[0][0], nums[0][1]];
  const segments: [number, number][][] = [];
  let from = start;
  for (let i = 1; i < nums.length; i += 1) {
    const [c1x, c1y, c2x, c2y, x, y] = nums[i];
    segments.push([from, [c1x, c1y], [c2x, c2y], [x, y]]);
    from = [x, y];
  }
  return segments;
}

const cubicY = (p: [number, number][], t: number) => {
  const u = 1 - t;
  return (
    u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]
  );
};

describe('linearScale', () => {
  it('maps the domain onto the range', () => {
    const scale = linearScale([0, 100], [0, 200]);
    expect(scale(0)).toBe(0);
    expect(scale(50)).toBe(100);
    expect(scale(100)).toBe(200);
  });

  it('handles an inverted range, as a y axis needs', () => {
    const scale = linearScale([0, 10], [100, 0]);
    expect(scale(0)).toBe(100);
    expect(scale(10)).toBe(0);
  });

  it('widens a zero-width domain instead of dividing by zero', () => {
    const scale = linearScale([5, 5], [0, 100]);
    expect(Number.isFinite(scale(5))).toBe(true);
    expect(scale(5)).toBe(50); // a flat series renders down the middle
  });
});

describe('bandScale', () => {
  it('spaces bands evenly across the range', () => {
    const band = bandScale(4, [0, 400], 0);
    expect(band(0)).toBe(0);
    expect(band(1)).toBe(100);
    expect(band.bandwidth).toBe(100);
  });

  it('centres are offset by half a step', () => {
    const band = bandScale(4, [0, 400], 0);
    expect(band.center(0)).toBe(50);
    expect(band.center(3)).toBe(350);
  });

  it('padding narrows the band but not the step', () => {
    const band = bandScale(4, [0, 400], 0.2);
    expect(band.bandwidth).toBeCloseTo(80);
    expect(band.center(1)).toBe(150); // centres are unaffected by padding
  });

  it('survives an empty dataset', () => {
    const band = bandScale(0, [0, 400]);
    expect(band.bandwidth).toBe(0);
  });
});

describe('niceTicks', () => {
  it('produces round values', () => {
    expect(niceTicks(0, 100, 5)).toEqual([0, 20, 40, 60, 80, 100]);
  });

  it('does not accumulate floating point error', () => {
    // Adding 0.1 repeatedly yields 0.30000000000000004; multiplying does not.
    for (const t of niceTicks(0, 1, 10)) {
      expect(t.toString().replace('-', '').length).toBeLessThanOrEqual(4);
    }
  });

  it('handles negative domains', () => {
    const ticks = niceTicks(-50, 50, 4);
    expect(ticks[0]).toBeLessThanOrEqual(-25);
    expect(ticks).toContain(0);
  });

  it('tolerates reversed, equal and non-finite bounds', () => {
    expect(niceTicks(100, 0, 5)).toEqual(niceTicks(0, 100, 5));
    expect(niceTicks(7, 7)).toEqual([7]);
    expect(niceTicks(NaN, 10)).toEqual([]);
    expect(niceTicks(0, Infinity)).toEqual([]);
  });

  it('every tick lies inside the domain', () => {
    for (const t of niceTicks(3, 97, 5)) {
      expect(t).toBeGreaterThanOrEqual(3);
      expect(t).toBeLessThanOrEqual(97);
    }
  });
});

describe('niceDomain', () => {
  it('extends outward to round numbers', () => {
    const [min, max] = niceDomain(3, 97, 5);
    expect(min).toBeLessThanOrEqual(3);
    expect(max).toBeGreaterThanOrEqual(97);
    expect(min % 20).toBe(0);
  });

  it('gives a usable domain for a flat or empty series', () => {
    expect(niceDomain(0, 0)).toEqual([0, 1]);
    expect(niceDomain(NaN, NaN)).toEqual([0, 1]);
  });

  it('keeps zero in range for a non-zero flat series', () => {
    const [min, max] = niceDomain(5, 5);
    expect(min).toBeLessThanOrEqual(0);
    expect(max).toBeGreaterThanOrEqual(5);
  });
});

describe('linePath', () => {
  const pts: [number, number][] = [
    [0, 10],
    [10, 20],
    [20, 5],
  ];

  it('is empty for no points', () => {
    expect(linePath([])).toBe('');
  });

  it('emits a bare move for a single point', () => {
    expect(linePath([[3, 4]])).toBe('M3,4');
  });

  it('linear draws straight segments', () => {
    expect(linePath(pts, 'linear')).toBe('M0,10L10,20L20,5');
  });

  it('step holds each value until the next reading', () => {
    // one horizontal run then a vertical riser, per point
    expect(linePath(pts, 'step')).toBe('M0,10L10,10L10,20L20,20L20,5');
  });

  it('monotone emits cubics through every point', () => {
    const d = linePath(pts, 'monotone');
    expect(d.startsWith('M0,10')).toBe(true);
    expect(d).toContain('C');
    expect(parseCubics(d)).toHaveLength(2);
  });

  it('monotone falls back to straight segments below three points', () => {
    expect(
      linePath(
        [
          [0, 0],
          [1, 1],
        ],
        'monotone',
      ),
    ).toBe('M0,0L1,1');
  });

  it('monotone never overshoots its own data — the design promise', () => {
    // A sharp peak is where a plain cubic spline would bulge past the maximum
    // and imply a value the data does not contain.
    const spiky: [number, number][] = [
      [0, 100],
      [10, 100],
      [20, 10],
      [30, 100],
      [40, 100],
    ];
    for (const seg of parseCubics(linePath(spiky, 'monotone'))) {
      const lo = Math.min(seg[0][1], seg[3][1]);
      const hi = Math.max(seg[0][1], seg[3][1]);
      for (let t = 0; t <= 1; t += 0.05) {
        const y = cubicY(seg, t);
        expect(y).toBeGreaterThanOrEqual(lo - 0.001);
        expect(y).toBeLessThanOrEqual(hi + 0.001);
      }
    }
  });

  it('monotone degrades safely on duplicate x positions', () => {
    const dupe: [number, number][] = [
      [0, 0],
      [0, 10],
      [10, 20],
    ];
    expect(linePath(dupe, 'monotone')).toBe('M0,0L0,10L10,20');
  });
});

describe('areaPath', () => {
  it('closes back along the baseline', () => {
    const d = areaPath(
      [
        [0, 10],
        [10, 20],
      ],
      100,
    );
    expect(d.startsWith('M0,10L10,20')).toBe(true);
    expect(d).toContain('L10,100');
    expect(d).toContain('L0,100');
    expect(d.endsWith('Z')).toBe(true);
  });

  it('follows the same curve as the line it sits under', () => {
    const pts: [number, number][] = [
      [0, 10],
      [10, 20],
      [20, 5],
    ];
    expect(areaPath(pts, 50, 'monotone').startsWith(linePath(pts, 'monotone'))).toBe(true);
  });

  it('is empty for no points', () => {
    expect(areaPath([], 100)).toBe('');
  });
});

describe('labelStride', () => {
  it('shows every label when they fit', () => {
    expect(labelStride(6, 8)).toBe(1);
  });

  it('thins dense axes to at most the cap', () => {
    const stride = labelStride(48, 8);
    expect(stride).toBe(6);
    expect(Math.ceil(48 / stride)).toBeLessThanOrEqual(8);
  });

  it('is safe at the boundaries', () => {
    expect(labelStride(0, 8)).toBe(1);
    expect(labelStride(10, 0)).toBe(1);
  });
});

describe('areaPath with a stacked baseline', () => {
  const top: [number, number][] = [
    [0, 10],
    [10, 20],
  ];
  const under: [number, number][] = [
    [0, 40],
    [10, 30],
  ];

  it('closes along the series below, not down to the axis', () => {
    const d = areaPath(top, under);
    // walks back through the baseline points…
    expect(d).toContain('L10,30');
    expect(d).toContain('L0,40');
    // …and never invents a flat bottom at some fixed y
    expect(d).not.toContain('L10,0');
    expect(d.endsWith('Z')).toBe(true);
  });

  it('still supports a flat baseline for an unstacked area', () => {
    const d = areaPath(top, 100);
    expect(d).toContain('L10,100');
    expect(d).toContain('L0,100');
  });

  it('uses the same curve on both edges of the band', () => {
    const pts: [number, number][] = [
      [0, 10],
      [10, 20],
      [20, 5],
    ];
    const base: [number, number][] = [
      [0, 50],
      [10, 55],
      [20, 45],
    ];
    const d = areaPath(pts, base, 'monotone');
    // one cubic run out along the top, another back along the baseline
    expect((d.match(/C/g) ?? []).length).toBeGreaterThanOrEqual(4);
  });

  it('is empty when the baseline has no points', () => {
    expect(areaPath(top, [])).toBe('');
  });
});
