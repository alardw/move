import { describe, it, expect } from 'vitest';
import {
  arcPath,
  areaPath,
  pieLayout,
  sliceAnchor,
  sliceAt,
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

describe('pieLayout', () => {
  it('divides the circle in proportion to the values', () => {
    const slices = pieLayout([1, 1, 2]);
    expect(slices.map((s) => s.share)).toEqual([0.25, 0.25, 0.5]);
    const total = slices.reduce((sum, s) => sum + (s.endAngle - s.startAngle), 0);
    expect(total).toBeCloseTo(Math.PI * 2);
  });

  it('starts at twelve o’clock and runs clockwise', () => {
    const [first] = pieLayout([1, 1]);
    expect(first.startAngle).toBeCloseTo(-Math.PI / 2);
    expect(first.endAngle).toBeGreaterThan(first.startAngle);
  });

  it('drops negatives rather than reflecting them — a negative part of a whole is not a wedge', () => {
    const slices = pieLayout([3, -5, 1]);
    expect(slices[1].share).toBe(0);
    expect(slices[0].share + slices[2].share).toBeCloseTo(1);
  });

  it('keeps zero rows so the legend and table stay aligned with the data', () => {
    expect(pieLayout([5, 0, 5])).toHaveLength(3);
  });

  it('returns nothing when there is no positive total', () => {
    expect(pieLayout([0, 0])).toEqual([]);
    expect(pieLayout([])).toEqual([]);
  });
});

describe('arcPath', () => {
  it('draws a wedge from the centre when there is no inner radius', () => {
    const d = arcPath(50, 50, 0, 40, -Math.PI / 2, 0);
    expect(d.startsWith('M50,50')).toBe(true);
    expect(d).toContain('A40,40');
    expect(d.endsWith('Z')).toBe(true);
  });

  it('draws a ring segment when there is', () => {
    const d = arcPath(50, 50, 20, 40, -Math.PI / 2, 0);
    expect(d.startsWith('M50,50')).toBe(false); // never touches the centre
    expect(d).toContain('A40,40');
    expect(d).toContain('A20,20');
  });

  it('sets the large-arc flag past a half turn', () => {
    const small = arcPath(0, 0, 0, 10, 0, Math.PI / 2);
    const large = arcPath(0, 0, 0, 10, 0, Math.PI * 1.5);
    expect(small).toContain('0 0 1');
    expect(large).toContain('0 1 1');
  });

  it('splits a full circle in two, which a single arc cannot express', () => {
    const d = arcPath(50, 50, 0, 40, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2);
    expect((d.match(/A/g) ?? []).length).toBe(2);
  });

  it('is empty for a zero-width slice', () => {
    expect(arcPath(0, 0, 0, 10, 1, 1)).toBe('');
  });
});

describe('sliceAt', () => {
  const slices = pieLayout([1, 1, 1, 1]); // quarters, from twelve o'clock
  const hit = (x: number, y: number) => sliceAt(slices, 0, 0, 0, 10, x, y);

  it('finds the slice under a point', () => {
    expect(hit(3, -3)).toBe(0); // upper right
    expect(hit(3, 3)).toBe(1); // lower right
    expect(hit(-3, 3)).toBe(2); // lower left
    expect(hit(-3, -3)).toBe(3); // upper left
  });

  it('misses outside the outer radius', () => {
    expect(hit(50, 50)).toBeNull();
  });

  it('misses inside the hole of a ring', () => {
    expect(sliceAt(slices, 0, 0, 5, 10, 1, 1)).toBeNull();
  });
});

describe('sliceAnchor', () => {
  const quarters = pieLayout([1, 1, 1, 1]); // from twelve o'clock, clockwise

  it('sits outside the ring, never on it', () => {
    for (const slice of quarters) {
      const a = sliceAnchor(0, 0, 100, 8, slice);
      expect(Math.hypot(a.x, a.y)).toBeCloseTo(108);
    }
  });

  it('opens away from the chart — right half right, left half left', () => {
    expect(sliceAnchor(0, 0, 100, 8, quarters[0]).side).toBe('right'); // upper right
    expect(sliceAnchor(0, 0, 100, 8, quarters[1]).side).toBe('right'); // lower right
    expect(sliceAnchor(0, 0, 100, 8, quarters[2]).side).toBe('left'); // lower left
    expect(sliceAnchor(0, 0, 100, 8, quarters[3]).side).toBe('left'); // upper left
  });

  it('is offset from the pie centre', () => {
    const a = sliceAnchor(200, 150, 50, 4, quarters[0]);
    expect(a.x).toBeGreaterThan(200);
    expect(a.y).toBeLessThan(150);
  });
});

describe('isEmphasised', () => {
  it('emphasises everything when nothing is hovered', async () => {
    const { isEmphasised } = await import('./adapters/builtin/shared');
    expect(isEmphasised(0, null)).toBe(true);
    expect(isEmphasised(3, undefined)).toBe(true);
  });

  it('emphasises only the hovered mark', async () => {
    const { isEmphasised } = await import('./adapters/builtin/shared');
    expect(isEmphasised(2, 2)).toBe(true);
    expect(isEmphasised(0, 2)).toBe(false);
  });

  it('"nothing hovered" and "this one" resolve alike — which is what keeps the animation config static', async () => {
    const { markAttrs } = await import('./adapters/builtin/shared');
    expect(markAttrs(1, null)['data-active']).toBe('');
    expect(markAttrs(1, 1)['data-active']).toBe('');
    expect(markAttrs(1, 0)['data-active']).toBeUndefined();
  });
});

describe('dot stagger budget', () => {
  /** Mirrors buildChartAnimations — the total must not grow with the count. */
  const DOT_SEQUENCE_MS = 700;
  const delay = (n: number) => (n > 1 ? Math.min(90, DOT_SEQUENCE_MS / (n - 1)) : 0);
  const total = (n: number) => (n - 1) * delay(n);

  it('spans the same time whatever the point count', () => {
    for (const n of [12, 48, 200, 2000, 10000]) {
      expect(total(n)).toBeLessThanOrEqual(DOT_SEQUENCE_MS + 1);
    }
  });

  it('a lower bound on the per-item delay would break that — 14ms costs 140s at 10k', () => {
    const floored = (n: number) => (n - 1) * Math.max(14, delay(n));
    expect(floored(10_000)).toBeGreaterThan(100_000);
    expect(total(10_000)).toBeLessThanOrEqual(DOT_SEQUENCE_MS + 1);
  });

  it('still reads as a sequence at chart-sized counts', () => {
    expect(delay(12)).toBeGreaterThan(30);
    expect(delay(48)).toBeGreaterThan(10);
  });
});
