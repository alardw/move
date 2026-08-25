// Chart — renderer contract
// =============================================================================
// The typed seam between the Chart SHELL and whatever draws the plot.
//
// The shell owns everything that is not drawing: the frame, the accessible
// name, the data-table alternative, the legend, async status, and — critically
// — TOKEN RESOLUTION. It reads `useTheme().theme.tokens` once and hands the
// renderer a `ChartTheme` of concrete values. A renderer therefore knows its
// own drawing library and nothing about Move: it never reads a CSS custom
// property, never calls getComputedStyle, and never imports a Move token.
//
// `ChartSpec` is deliberately DECLARATIVE, not pixel-resolved. The shell does
// not compute scales, because an adapter wrapping a charting library computes
// its own — handing over pixel coordinates would make every such library
// unusable. The built-in renderer builds scales from this; a Recharts adapter
// maps it onto Recharts props.
//
// These contracts are surfaced through `src/adapters` (the catalogue) while
// living here, the same way `IconResolver` and `CodeHighlighterFn` do.
// =============================================================================

import type * as React from 'react';
import type { Color } from '../../../shared/types';

/** One row of source data. Series values are read by key and coerced to number. */
export type ChartDatum = Record<string, unknown>;

/** How a series is drawn. v1 covers the shared axis/scale/grid family only. */
export type ChartSeriesType = 'line' | 'area' | 'bar';

/** Which grid lines the renderer draws. */
export type ChartGrid = 'none' | 'horizontal' | 'vertical' | 'both';

/**
 * How a line or area path travels between points.
 *
 * `monotone` smooths without inventing peaks — between two points the curve
 * never exceeds either, so it cannot imply a value the data does not contain.
 */
export type ChartCurve = 'linear' | 'monotone' | 'step';

/**
 * How x positions are derived.
 *
 * `category` spaces rows evenly by index — right for months, regions, names.
 * `linear` places each row at its own numeric x, so unevenly sampled data is
 * drawn honestly instead of being straightened into equal spacing. Timestamps
 * are just numbers: pass epoch milliseconds and a `formatX`.
 */
export type ChartXScale = 'category' | 'linear';

/**
 * One series, as the CONSUMER declares it on `<Chart series={[...]} />`.
 * `color` is a Move color NAME; the shell resolves it to a value before any
 * renderer sees it.
 */
export interface ChartSeries {
  /** Key in each data row holding this series' value. */
  key: string;
  /** How to draw it. */
  type: ChartSeriesType;
  /** Legend text and data-table column header. Defaults to `key`. */
  label?: string;
  /** Move color name. Defaults to this series' slot in the categorical ramp. */
  color?: Color;
  /**
   * Draw with a dashed stroke. A non-color differentiator, so the chart stays
   * readable without color perception (WCAG 1.4.1).
   */
  dash?: boolean;
}

/**
 * A series after the shell has resolved it: label defaulted, color turned into
 * a concrete value. This is what a renderer consumes — no Move lookups needed.
 */
export interface ResolvedChartSeries {
  key: string;
  type: ChartSeriesType;
  label: string;
  /** Concrete CSS color value, already resolved from the theme. */
  color: string;
  dash: boolean;
}

/**
 * The normalized, renderer-facing description of what to draw. Plain data —
 * serializable, with no React nodes and no pixel geometry.
 */
export interface ChartSpec {
  /** Source rows, in x order. */
  data: readonly ChartDatum[];
  /** Key in each row holding the x/category value. */
  x: string;
  /** Series to draw, in declaration order (also draw and legend order). */
  series: readonly ResolvedChartSeries[];
  /** Which grid lines to draw. */
  grid: ChartGrid;
  /** Stack bar and area series instead of overlaying them. */
  stacked: boolean;
  /** Mark each data point on line and area series. */
  dots: boolean;
  /** How line and area paths travel between points. */
  curve: ChartCurve;
  /** How x positions are derived from the data. */
  xScale: ChartXScale;
  /** Format an x tick label. */
  formatX?: (value: unknown) => string;
  /** Format a y tick label. */
  formatY?: (value: number) => string;
}

/**
 * Move's design tokens, resolved to concrete values for a drawing layer.
 *
 * Every field is a ready-to-use value: a CSS color string, or a number in
 * pixels. Nothing here needs further resolution, which is what lets a canvas
 * renderer (no CSS at all) honour the theme exactly as an SVG one does.
 */
export interface ChartTheme {
  /**
   * The categorical ramp, in assignment order — series N without an explicit
   * color takes `series[N % series.length]`.
   */
  series: readonly string[];
  /** Grid line color. */
  grid: string;
  /** Axis line color. */
  axis: string;
  /** Tick label color. */
  tick: string;
  /** Axis and legend label color. */
  label: string;
  /** Font family for all chart text. */
  font: string;
  /** Tick and legend text size, in px. */
  fontSize: number;
  /** Series stroke width, in px. */
  strokeWidth: number;
  /** Data point radius, in px. */
  pointRadius: number;
  /** Fill opacity for area series, 0–1. */
  areaOpacity: number;
  /**
   * The viewer prefers reduced motion. Renderers that animate on their own
   * (rather than through Move's animation system) must honour this.
   */
  reducedMotion: boolean;
}

/** The inner drawing area a renderer actually plotted into, excluding axes. */
export interface PlotRect {
  /** Left edge, in px from the plot container's origin. */
  x: number;
  /** Top edge, in px from the plot container's origin. */
  y: number;
  width: number;
  height: number;
}

/**
 * Where a renderer actually drew, reported back to the shell.
 *
 * `x` carries the pixel position of every data index rather than leaving the
 * shell to derive them from `rect`. Deriving is guesswork: a band scale centres
 * points at `(i + 0.5) · w/n`, a point scale puts the first on the left edge and
 * the last on the right at `i · w/(n-1)`, and a time scale spaces them
 * unevenly. Recharts picks between the first two depending on whether a bar
 * series is present. Reporting the positions removes the guess entirely, and
 * works for a canvas renderer just as well.
 */
export interface PlotGeometry {
  /** Inner drawing area, excluding axes. */
  rect: PlotRect;
  /** Pixel x of each data index, in data order. Same length as `spec.data`. */
  x: number[];
}

/** What a renderer is handed. */
export interface ChartRendererProps {
  /** What to draw. */
  spec: ChartSpec;
  /** Resolved Move tokens to draw it with. */
  theme: ChartTheme;
  /** Measured plot width in px. Always > 0 — the shell does not render at zero. */
  width: number;
  /** Measured plot height in px. Always > 0. */
  height: number;
  /**
   * Report where you drew, so the shell can hit-test the pointer and render its
   * own tooltip and crosshair over the plot.
   *
   * Optional on purpose. The shell owns the tooltip — one look, one keyboard
   * and screen-reader story, and it works over a canvas renderer where there is
   * no DOM to hover. A renderer that never calls this simply has no tooltip;
   * nothing breaks.
   *
   * Call it after layout, and again whenever the geometry changes.
   */
  onPlotGeometry?: (geometry: PlotGeometry) => void;
}

/**
 * The drawing layer. Return anything React can render into the plot slot —
 * an `<svg>`, a `<canvas>`, or a third-party chart component.
 *
 * This is a FUNCTION COMPONENT, and the shell renders it as one (`<Renderer …/>`,
 * never `renderer(props)`). So it may use hooks, gets its own state, and mounts
 * and unmounts with the plot. Give it a name — it shows up in React DevTools
 * and in error boundaries.
 *
 * The shell never inspects the returned subtree. To take part in the entrance
 * animation, mark each series group with `data-series` (and line/area strokes
 * with `data-series-line`); a renderer that omits them simply appears without
 * the stagger.
 */
export type ChartRenderer = (props: ChartRendererProps) => React.ReactNode;

/**
 * Default categorical ramp, as Move color names.
 *
 * ORDER IS THE POINT. Series are assigned in sequence, so what matters is how
 * far apart *consecutive* entries sit — most charts carry two or three series,
 * and those are the ones a reader compares. The order below was picked by
 * maximising the smallest adjacent hue gap across the whole ramp: every
 * neighbouring pair is at least 113° apart in OKLCH hue, and the first two
 * (indigo → orange) are 142° apart. Sorting by hue instead would put the
 * closest colours side by side, which is the opposite of what a categorical
 * scale wants.
 *
 * Omits `gray` (reads as chrome or disabled), and `red`, `green` and `yellow`:
 * the first two are bound to error and success, so they imply a meaning the
 * data may not carry, and yellow is too light to clamp without turning olive.
 * Pass `palette` to override — a chart that genuinely is about pass/fail should
 * absolutely use red and green.
 */
export const CHART_SERIES_COLORS = [
  'indigo',
  'orange',
  'cyan',
  'pink',
  'blue',
  'lime',
  'grape',
  'teal',
  'violet',
] as const satisfies readonly Color[];
