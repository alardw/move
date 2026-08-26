// Chart — scale and tick math
// =============================================================================
// Pure functions: no DOM, no React, no Move imports. Everything the built-in
// renderer needs to turn data values into pixel positions.
// =============================================================================

/** Maps a continuous domain onto a pixel range. */
export interface LinearScale {
  (value: number): number;
  domain: readonly [number, number];
  range: readonly [number, number];
}

/** Maps discrete indices onto evenly spaced pixel bands. */
export interface BandScale {
  /** Left edge of band `i`. */
  (index: number): number;
  /** Centre of band `i` — where lines and points sit. */
  center(index: number): number;
  /** Width of one band, inner padding already removed. */
  bandwidth: number;
}

/**
 * Continuous scale. A zero-width domain is widened by ±0.5 so a flat series
 * still renders (down the middle) instead of dividing by zero.
 */
export function linearScale(
  domain: readonly [number, number],
  range: readonly [number, number],
): LinearScale {
  let [d0, d1] = domain;
  if (d0 === d1) {
    d0 -= 0.5;
    d1 += 0.5;
  }
  const [r0, r1] = range;
  const scale = ((value: number) => r0 + ((value - d0) / (d1 - d0)) * (r1 - r0)) as LinearScale;
  scale.domain = [d0, d1];
  scale.range = range;
  return scale;
}

/** Discrete scale for categorical x positions. `padding` is a 0–1 fraction of a band. */
export function bandScale(
  count: number,
  range: readonly [number, number],
  padding = 0.1,
): BandScale {
  const [r0, r1] = range;
  const step = count > 0 ? (r1 - r0) / count : 0;
  const bandwidth = Math.max(0, step * (1 - padding));
  const offset = (step - bandwidth) / 2;
  const scale = ((index: number) => r0 + index * step + offset) as BandScale;
  scale.center = (index: number) => r0 + index * step + step / 2;
  scale.bandwidth = bandwidth;
  return scale;
}

/**
 * The smallest "nice" step (a 1, 2, 5 or 10 multiple of a power of ten) that
 * covers `[min, max]` in about `count` intervals.
 *
 * Adapted from d3-array's `tickIncrement` — ISC licensed.
 * Copyright 2010-2023 Mike Bostock.
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
const E10 = Math.sqrt(50);
const E5 = Math.sqrt(10);
const E2 = Math.sqrt(2);

function tickStep(min: number, max: number, count: number): number {
  const step = (max - min) / Math.max(0, count);
  const power = Math.floor(Math.log10(step));
  const error = step / 10 ** power;
  const factor = error >= E10 ? 10 : error >= E5 ? 5 : error >= E2 ? 2 : 1;
  return factor * 10 ** power;
}

/**
 * Evenly spaced "nice" tick values covering `[min, max]`.
 *
 * A FRACTIONAL step is applied by dividing by its integer reciprocal rather
 * than multiplying: `3 / 10` is exactly 0.3, while `3 * 0.1` is
 * 0.30000000000000004 — and that lands straight in an axis label. Repeated
 * addition is worse again. Only the divide is safe.
 */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
  if (min === max) return [min];
  if (min > max) [min, max] = [max, min];

  const step = tickStep(min, max, count);
  if (!Number.isFinite(step) || step <= 0) return [];

  const first = Math.ceil(min / step);
  const last = Math.floor(max / step);
  const ticks: number[] = [];

  if (step < 1) {
    const inverse = Math.round(1 / step);
    for (let i = first; i <= last; i += 1) ticks.push(i / inverse);
  } else {
    for (let i = first; i <= last; i += 1) ticks.push(i * step);
  }
  return ticks;
}

/**
 * Extend `[min, max]` outward to land on round numbers, so the axis ends on a
 * tick instead of mid-step.
 */
export function niceDomain(min: number, max: number, count = 5): [number, number] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) return min === 0 ? [0, 1] : [Math.min(0, min), Math.max(0, max)];
  const step = tickStep(min, max, count);
  if (!Number.isFinite(step) || step <= 0) return [min, max];
  return [Math.floor(min / step) * step, Math.ceil(max / step) * step];
}

/** How the path travels between points. */
export type ChartCurve = 'linear' | 'monotone' | 'step';

/** Two decimals is under a tenth of a pixel and keeps path strings small. */
const r = (n: number) => Math.round(n * 100) / 100;

function polylinePath(points: readonly (readonly [number, number])[]): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r(x)},${r(y)}`).join('');
}

/** Value holds until the next category, then steps to it (step-after). */
function stepPath(points: readonly (readonly [number, number])[]): string {
  let out = `M${r(points[0][0])},${r(points[0][1])}`;
  for (let i = 1; i < points.length; i += 1) {
    out += `L${r(points[i][0])},${r(points[i - 1][1])}L${r(points[i][0])},${r(points[i][1])}`;
  }
  return out;
}

/**
 * Monotone cubic interpolation, matching d3-shape's `curveMonotoneX`.
 *
 * Smooths without inventing peaks: between two points the curve never rises
 * above the higher or below the lower, so a smoothed series cannot imply a
 * value the data does not contain. A plain cubic spline overshoots and would.
 *
 * The tangent rule is d3's rather than the classic Fritsch–Carlson weighted
 * harmonic mean, and the endpoints use its three-point estimate rather than a
 * plain secant — which is what stops the first and last segments rendering
 * straight. Every charting library people have seen draws this exact curve, so
 * matching it is what makes `curve="monotone"` mean what they expect.
 *
 * Adapted from d3-shape (monotone.js) — ISC licensed.
 * Copyright 2010-2022 Mike Bostock.
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
const sign = (x: number) => (x < 0 ? -1 : 1);

function monotonePath(points: readonly (readonly [number, number])[]): string {
  const n = points.length;
  if (n < 3) return polylinePath(points);

  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);

  const h: number[] = [];
  const s: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    const dx = xs[i + 1] - xs[i];
    if (dx === 0) return polylinePath(points); // duplicate x — nothing to interpolate
    h.push(dx);
    s.push((ys[i + 1] - ys[i]) / dx);
  }

  // Interior tangents: limited so the curve stays monotone on every span.
  const t: number[] = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i += 1) {
    const s0 = s[i - 1];
    const s1 = s[i];
    const p = (s0 * h[i] + s1 * h[i - 1]) / (h[i - 1] + h[i]);
    t[i] = (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }
  // Endpoints: a three-point estimate, so the first and last spans curve too.
  t[0] = (3 * s[0] - t[1]) / 2;
  t[n - 1] = (3 * s[n - 2] - t[n - 2]) / 2;

  let out = `M${r(xs[0])},${r(ys[0])}`;
  for (let i = 0; i < n - 1; i += 1) {
    const dx = h[i] / 3;
    out +=
      `C${r(xs[i] + dx)},${r(ys[i] + dx * t[i])} ` +
      `${r(xs[i + 1] - dx)},${r(ys[i + 1] - dx * t[i + 1])} ` +
      `${r(xs[i + 1])},${r(ys[i + 1])}`;
  }
  return out;
}

/** The path through the given points, travelling as `curve` describes. */
export function linePath(
  points: readonly (readonly [number, number])[],
  curve: ChartCurve = 'linear',
): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M${r(points[0][0])},${r(points[0][1])}`;
  if (curve === 'step') return stepPath(points);
  if (curve === 'monotone') return monotonePath(points);
  return polylinePath(points);
}

/**
 * A closed band between the points and a baseline.
 *
 * The baseline is either a flat y (an area anchored to the axis) or a run of
 * points (a STACKED area, sitting on whatever is beneath it). Stacked bands
 * must close along the series below rather than down to zero — closing to zero
 * makes every band overlap the ones under it, which reads as a plausible chart
 * while being wrong.
 *
 * A point baseline is travelled with the same `curve` as the top edge, so the
 * two edges of a band always agree.
 */
export function areaPath(
  points: readonly (readonly [number, number])[],
  baseline: number | readonly (readonly [number, number])[],
  curve: ChartCurve = 'linear',
): string {
  if (points.length === 0) return '';
  const forward = linePath(points, curve);

  if (typeof baseline === 'number') {
    const back = points
      .slice()
      .reverse()
      .map(([x]) => `L${r(x)},${r(baseline)}`)
      .join('');
    return `${forward}${back}Z`;
  }

  if (baseline.length === 0) return '';
  // Same curve, walked backwards; the leading move becomes a line so the band
  // stays one closed shape.
  const back = linePath(baseline.slice().reverse(), curve).replace(/^M/, 'L');
  return `${forward}${back}Z`;
}

/**
 * Show at most `max` x labels, keeping the first and evenly skipping the rest,
 * so dense category axes stay readable without measuring text.
 */
export function labelStride(count: number, max: number): number {
  if (count <= max || max <= 0) return 1;
  return Math.ceil(count / max);
}

// =============================================================================
// Radial
// =============================================================================

/** A slice of a ring, as laid out by `pieLayout`. */
export interface PieSlice {
  /** Index of the row this slice came from. */
  index: number;
  /** Share of the total, 0–1. */
  share: number;
  startAngle: number;
  endAngle: number;
}

/**
 * Turn values into slices, running clockwise from twelve o'clock.
 *
 * Negative values are dropped rather than reflected: a pie shows parts of a
 * whole, and a negative part has no honest wedge. Zero-valued rows are kept so
 * the legend and the data table still line up with the data.
 */
export function pieLayout(values: readonly number[]): PieSlice[] {
  const usable = values.map((v) => (Number.isFinite(v) && v > 0 ? v : 0));
  const total = usable.reduce((sum, v) => sum + v, 0);
  if (total <= 0) return [];

  let angle = -Math.PI / 2; // twelve o'clock
  return usable.map((v, index) => {
    const share = v / total;
    const startAngle = angle;
    angle += share * Math.PI * 2;
    return { index, share, startAngle, endAngle: angle };
  });
}

/**
 * The path for one slice, or one ring segment when `innerRadius > 0`.
 *
 * A slice covering the whole circle is drawn as two half arcs, because a single
 * arc whose start and end coincide renders as nothing at all.
 */
export function arcPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle;
  if (sweep <= 0) return '';

  if (sweep >= Math.PI * 2 - 1e-9) {
    const mid = startAngle + Math.PI;
    return (
      arcPath(cx, cy, innerRadius, outerRadius, startAngle, mid) +
      arcPath(cx, cy, innerRadius, outerRadius, mid, startAngle + Math.PI * 2)
    );
  }

  const at = (radius: number, a: number): [number, number] => [
    r(cx + Math.cos(a) * radius),
    r(cy + Math.sin(a) * radius),
  ];
  const large = sweep > Math.PI ? 1 : 0;
  const [ox1, oy1] = at(outerRadius, startAngle);
  const [ox2, oy2] = at(outerRadius, endAngle);

  if (innerRadius <= 0) {
    return `M${r(cx)},${r(cy)}L${ox1},${oy1}A${r(outerRadius)},${r(outerRadius)} 0 ${large} 1 ${ox2},${oy2}Z`;
  }

  const [ix1, iy1] = at(innerRadius, endAngle);
  const [ix2, iy2] = at(innerRadius, startAngle);
  return (
    `M${ox1},${oy1}` +
    `A${r(outerRadius)},${r(outerRadius)} 0 ${large} 1 ${ox2},${oy2}` +
    `L${ix1},${iy1}` +
    `A${r(innerRadius)},${r(innerRadius)} 0 ${large} 0 ${ix2},${iy2}Z`
  );
}

/** Middle of a slice, where a label or tooltip anchor belongs. */
export function arcCentroid(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  slice: PieSlice,
): [number, number] {
  const a = (slice.startAngle + slice.endAngle) / 2;
  const radius = (innerRadius + outerRadius) / 2;
  return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
}

/**
 * Where a slice's tooltip should sit, and which way it should open.
 *
 * Just outside the ring along the slice's mid-angle, opening away from the
 * chart — a tooltip over a pie hides the thing it describes, which is worst on
 * small ones. The side is horizontal because a vertical one would still cross
 * the ring for slices near the top or bottom.
 */
export function sliceAnchor(
  cx: number,
  cy: number,
  outerRadius: number,
  gap: number,
  slice: PieSlice,
): { x: number; y: number; side: 'left' | 'right' } {
  const mid = (slice.startAngle + slice.endAngle) / 2;
  return {
    x: cx + Math.cos(mid) * (outerRadius + gap),
    y: cy + Math.sin(mid) * (outerRadius + gap),
    side: Math.cos(mid) >= 0 ? 'right' : 'left',
  };
}

/** Which slice a pointer is over, or null outside the ring. */
export function sliceAt(
  slices: readonly PieSlice[],
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  px: number,
  py: number,
): number | null {
  const dx = px - cx;
  const dy = py - cy;
  const distance = Math.hypot(dx, dy);
  if (distance < innerRadius || distance > outerRadius) return null;

  // Normalise into the same [-90deg, 270deg) range the layout runs in.
  let angle = Math.atan2(dy, dx);
  if (angle < -Math.PI / 2) angle += Math.PI * 2;

  const hit = slices.find((s) => angle >= s.startAngle && angle < s.endAngle);
  return hit ? hit.index : null;
}
