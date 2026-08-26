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

/**
 * How a series is drawn.
 *
 * `line`, `area`, `bar` and `scatter` share one axis, scale and grid machine and
 * combine freely. A scatter is points with no connecting stroke — it says the
 * readings are unrelated samples rather than a continuous signal, which is why
 * it usually wants `xScale="linear"`. `pie` shares none of it: it has no axes, its colours and legend are
 * per ROW rather than per series, and hit-testing is angular. A pie is
 * therefore exclusive — one pie series, on its own.
 */
export type ChartSeriesType = 'line' | 'area' | 'bar' | 'scatter' | 'pie';

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
 * A line drawn across the plot at a fixed value — a target, a budget, an SLA,
 * an average.
 *
 * An annotation rather than a series: it has no data of its own, it exists to
 * give the data something to be read against. A number on its own says little;
 * the same number against the line it was supposed to beat says everything.
 */
export interface ChartRule {
  /** Where on the value axis the line sits. */
  y: number;
  /** Shown at the end of the line. Omit for an unlabelled guide. */
  label?: string;
  /** Move colour name. Defaults to a muted axis colour, so it never competes
   *  with the data it is annotating. */
  color?: Color;
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
  /** Reference lines across the plot. Ignored by a pie, which has no value axis. */
  rules: readonly ResolvedChartRule[];
  /**
   * Draw the axes — tick labels and the baseline.
   *
   * Off makes a sparkline: shape with no values, small enough to sit in a table
   * cell or beside a number. The margins collapse with them, so the drawing
   * fills the box instead of leaving a gutter for labels that are not there.
   */
  axes: boolean;
  /**
   * Hole size for a pie, as a fraction of the radius. 0 is a full pie; around
   * 0.6 reads as a donut. Ignored by every other series type.
   */
  innerRadius: number;
  /** Format an x tick label. */
  formatX?: (value: unknown) => string;
  /** Format a y tick label. */
  formatY?: (value: number) => string;
}

/** A rule after the shell has resolved its colour, as with a series. */
export interface ResolvedChartRule {
  y: number;
  label?: string;
  /** Concrete CSS colour value. */
  color: string;
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
  /** The ground the plot sits on — used to separate touching shapes. */
  surface: string;
  /** Font family for all chart text. */
  font: string;
  /** Tick and legend text size, in px. */
  fontSize: number;
  /** Series stroke width, in px. */
  strokeWidth: number;
  /** Data point radius, in px. */
  pointRadius: number;
  /**
   * Breathing room between the drawing and the edge of the plot, in px.
   *
   * Resolved by the shell from `--move-chart-padding` and handed over as a
   * number, because a canvas renderer has no CSS to read. Only layouts without
   * their own gutter need it — an axis chart already insets itself for ticks.
   */
  padding: number;
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
  /**
   * Pixel y per index, where the tooltip should point. Only needed when a row's
   * anchor is not simply "somewhere on the vertical at x" — a pie slice, say.
   */
  y?: number[];
  /**
   * Resolve a pointer position to a row index yourself.
   *
   * The shell's default is to snap to the nearest reported x, which is right
   * for anything laid out along an axis and meaningless for anything radial.
   * A renderer that provides this owns hit-testing entirely, and the shell
   * drops the crosshair — a vertical line through a pie says nothing.
   */
  hitTest?: (localX: number, localY: number) => number | null;
  /**
   * Which way the tooltip should open from each anchor.
   *
   * An axis chart is fine opening upward from a point on a vertical. A radial
   * one is not: an anchor on the lower edge of a ring would open back across
   * the chart it belongs to, which is worst on small pies. Reporting the side
   * lets the renderer push it outward instead.
   */
  side?: ('top' | 'right' | 'bottom' | 'left')[];
}

/**
 * Whether an entrance is coming, and whether to run it now.
 *
 * Most reveals are CSS transforms the shell drives against marked elements, so
 * a renderer never hears about them. Some cannot be: a pie's entrance is a
 * sweep of ANGLE, which means regenerating the geometry per frame rather than
 * transforming a finished shape. A renderer doing that needs to know both that
 * an entrance is expected — so it draws its first frame already at the start
 * state instead of flashing the finished chart — and when the chart is actually
 * on screen, which only the shell knows.
 *
 * `null` means no entrance: draw at rest.
 */
export type ChartEntrance = 'pending' | 'run' | null;

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
   * Entrance state, for renderers that animate their own geometry.
   *
   * Ignore it and your output simply appears — the shell's CSS-driven reveals
   * still apply to anything you mark with `data-bar` / `data-sweep` /
   * `data-dot`.
   */
  entrance?: ChartEntrance;
  /**
   * The row the pointer is over, or null.
   *
   * State flows DOWN; geometry stays in the renderer. The shell knows which row
   * is hovered (it owns hit-testing and the tooltip) but not where the mark for
   * it landed in pixels, so emphasising it is the renderer's job. Ignoring this
   * is fine — you simply get no hover emphasis.
   */
  activeIndex?: number | null;
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
