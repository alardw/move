// Chart — built-in renderer, shared internals
// =============================================================================
// Small pieces both drawing families need. Everything genuinely mathematical
// lives in `../../scales.ts`; this is only what is specific to reading Move's
// data shape.
// =============================================================================

/**
 * Plot margins for the AXIS renderer.
 *
 * FIXED. Sizing the y gutter to the widest tick label requires measuring text,
 * and the plot area depends on the gutter, which depends on the tick values,
 * which depend on the plot area. That circularity is deferred; a generous fixed
 * gutter is correct for the value ranges charts usually carry.
 */
import type { ChartTheme, ResolvedChartSeries } from '../../types';

export const MARGIN = { top: 8, right: 8, bottom: 22, left: 46 } as const;
export const TICK_COUNT = 5;
export const MAX_X_LABELS = 8;

/** Read a series value out of a row, coercing to a finite number or null. */
export function valueAt(row: Record<string, unknown>, key: string): number | null {
  const raw = row[key];
  const n = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Running totals per row, so stacked series sit on top of each other. */
export function stackOffsets(
  data: readonly Record<string, unknown>[],
  series: readonly ResolvedChartSeries[],
  stacked: boolean,
): number[][] {
  const offsets = data.map(() => [] as number[]);
  const running = data.map(() => 0);
  series.forEach((s) => {
    data.forEach((row, i) => {
      offsets[i].push(running[i]);
      if (stacked && s.type !== 'line') running[i] += valueAt(row, s.key) ?? 0;
    });
  });
  return offsets;
}

/**
 * A pie shares nothing with the axis renderer — no scales, no grid, no ticks —
 * so it takes its own path rather than threading conditionals through one that
 * assumes a horizontal axis.
 *
 * Colours come from `theme.series` PER SLICE rather than per series, which is
 * what a pie means: one series, many parts. The shell's legend reads the same
 * ramp in the same order, so the two agree without passing colours between them.
 */

// =============================================================================
// Shared drawing primitives
// =============================================================================
//
// The axis types differ only in the marks they lay down. The scaffolding around
// those marks — the reveal clip, the stroke, the point markers — is identical,
// so it lives here once instead of in each type's file.

/** Everything a series type needs to draw itself, computed once by the frame. */
export interface SeriesFrame {
  series: ResolvedChartSeries;
  /** Index within `spec.series`. Also namespaces this series' SVG ids. */
  index: number;
  theme: ChartTheme;
  /** Top edge of this series, in pixels. */
  points: readonly (readonly [number, number])[];
  /** What this series sits on: the axis, or the stack beneath it. */
  baseline: readonly (readonly [number, number])[];
  /** Unique id for this series' clip and gradient. */
  uid: string;
  /** Row the pointer is over, for hover emphasis. */
  activeIndex?: number | null;
  /** The drawing area, for sizing the reveal clip. */
  plot: { x: number; y: number; width: number; height: number };
  dots: boolean;
}

/**
 * How far a mark recedes when another is hovered.
 *
 * Dimming the rest rather than brightening the target: it keeps every colour
 * truthful (a highlighted slice still reads as its own hue) and it works on any
 * background, where a glow or a lightened fill would not.
 */
export const DIMMED = 0.45;

/** Opacity for the mark at `index`, given what is hovered. */
export const emphasis = (index: number, activeIndex: number | null | undefined) =>
  activeIndex == null || activeIndex === index ? 1 : DIMMED;

export const clipId = (uid: string, index: number) => `${uid}-sweep-${index}`;

/**
 * The reveal.
 *
 * One clip per series, wiping its marks open left to right. Everything the
 * series draws rides the SAME clip, so nothing has to be kept in sync — only
 * one thing is moving. It sits on each PATH, never on the series group:
 * clipping the group would take the bars with it.
 */
export function SweepClip({ uid, index, plot }: Pick<SeriesFrame, 'uid' | 'index' | 'plot'>) {
  return (
    <clipPath id={clipId(uid, index)}>
      <rect data-sweep="" x={plot.x} y={plot.y} width={plot.width} height={plot.height} />
    </clipPath>
  );
}

/** The line along the top of a series — its own mark for a line, the edge of an area. */
export function SeriesStroke({
  d,
  series,
  theme,
  uid,
  index,
}: { d: string } & Pick<SeriesFrame, 'series' | 'theme' | 'uid' | 'index'>) {
  return (
    <path
      data-series-line=""
      clipPath={`url(#${clipId(uid, index)})`}
      d={d}
      fill="none"
      stroke={series.color}
      strokeWidth={theme.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={series.dash ? '6 4' : undefined}
    />
  );
}

/** Marks each reading, so a reader can see where a value was actually measured. */
export function SeriesDots({
  points,
  series,
  theme,
  activeIndex,
}: Pick<SeriesFrame, 'points' | 'series' | 'theme'> & { activeIndex?: number | null }) {
  return (
    <>
      {points.map(([px, py], i) => (
        <circle
          key={i}
          data-dot=""
          cx={px}
          cy={py}
          // The hovered reading also grows a little; on a 3px dot, opacity
          // alone is too small a change to notice.
          r={activeIndex === i ? theme.pointRadius * 1.8 : theme.pointRadius}
          fill={series.color}
          opacity={emphasis(i, activeIndex)}
        />
      ))}
    </>
  );
}
