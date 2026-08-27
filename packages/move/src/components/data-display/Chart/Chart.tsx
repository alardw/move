'use client';
import * as React from 'react';
import { useMergedRef, withMoveComponent } from '../../../engine';
import {
  prefersReducedMotion,
  quick,
  resolveAnimationsConfig,
  useAnimations,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { useInView } from '../../../hooks';
import { useTheme } from '../../../infrastructure/Theme';
import { Tooltip } from '../../overlays/Tooltip';
import { Button } from '../../actions/Button';
import { Loader } from '../../feedback/Loader';
import { Text } from '../../typography/Text';
import type { AsyncResource } from '../../../adapters';
import type { Color } from '../../../shared/types';
import {
  clampToContrast,
  hexToLinear,
  hexToOklch,
  luminance,
} from '../../../styles/themes/color-engine';
import { rampOf, SHADES, SOLID_SHADE } from '../../../styles/themes/palette';
import { builtinRenderer } from './adapters/builtin';
import styles from './Chart.module.css';
import {
  CHART_SERIES_COLORS,
  CHART_SWEEP_MS,
  type ChartDatum,
  type ChartGrid,
  type ChartRenderer,
  type ChartSeries,
  type ChartRendererProps,
  type ChartRule,
  type ResolvedChartRule,
  type ChartCurve,
  type ChartEntrance,
  type ChartSpec,
  type ChartXScale,
  type ChartTheme,
  type ChartTooltipSide,
  type PlotGeometry,
  type PlotRect,
  type ResolvedChartSeries,
} from './types';

export type ChartSize = 'sm' | 'md' | 'lg';

/** One series, as the accessible summary describes it. */
export interface ChartSummarySeries {
  label: string;
  /** False when the series carries no numeric values at all. */
  hasValues: boolean;
  /** First and last values, already run through `formatY`. */
  first: string;
  last: string;
  direction: 'up' | 'down' | 'flat';
  /** Present only where the endpoints do not already carry the extreme. */
  peak?: { value: string; at: string };
  low?: { value: string; at: string };
}

/** What the shell worked out about the data, for `labels.summary` to phrase. */
export interface ChartSummaryFacts {
  series: ChartSummarySeries[];
  points: number;
}

export interface ChartLabels {
  /** Caption of the visually hidden data table. */
  dataTable: string;
  /** Header of the data table's category column. */
  categoryColumn: string;
  /** Announced while the resource is loading. */
  loading: string;
  /** Announced when the resource failed. */
  error: string;
  /** Action offered when the resource carries a retry. */
  retry: string;
  /** Announced when the resource succeeded but carries nothing to draw. */
  empty: string;
  /** Shown when the series is past what the built-in renderer will draw. */
  oversized: string;
  /**
   * Builds the plot's accessible name from the facts derived for it.
   *
   * A function rather than a template because the sentence is not a slot-filling
   * exercise: word order, the verb agreeing with the subject, and how a range is
   * phrased all move between languages, and a `{series} {direction} {from}`
   * string cannot follow them.
   */
  summary: (facts: ChartSummaryFacts) => string;
}

export const DEFAULT_LABELS: ChartLabels = {
  dataTable: 'Chart data',
  categoryColumn: 'Category',
  loading: 'Loading chart',
  error: 'Could not load chart data',
  retry: 'Retry',
  empty: 'No data to display',
  oversized: 'Chart too large to display',
  summary: ({ series, points }) => {
    if (series.length === 0) return 'No data.';
    const parts = series.map((s) => {
      if (!s.hasValues) return `${s.label} has no values`;
      const verb = s.direction === 'up' ? 'rises' : s.direction === 'down' ? 'falls' : 'holds';
      let text = `${s.label} ${verb} from ${s.first} to ${s.last}`;
      if (s.peak) text += `, peaking at ${s.peak.value} (${s.peak.at})`;
      if (s.low) text += `, low of ${s.low.value} (${s.low.at})`;
      return text;
    });
    return `${parts.join('; ')}. ${points} points.`;
  },
};

/**
 * Numeric chart values per size.
 *
 * These resolve in JS rather than as CSS custom properties because a canvas
 * renderer has no CSS to read — keeping them here is what lets every renderer
 * honour the same theme. The `--move-chart-*` tokens cover what CSS paints:
 * the caption, the legend, and the gaps between them.
 */
const SIZE_SCALE: Record<
  ChartSize,
  Pick<ChartTheme, 'fontSize' | 'strokeWidth' | 'pointRadius'>
> = {
  sm: { fontSize: 10, strokeWidth: 1.5, pointRadius: 2 },
  md: { fontSize: 11, strokeWidth: 2, pointRadius: 3 },
  lg: { fontSize: 13, strokeWidth: 2.5, pointRadius: 4 },
};

const AREA_OPACITY = 0.18;

/** Used until `--move-chart-padding` has been read off the element. */
const DEFAULT_PADDING = 24;

/**
 * Bars grow from the baseline, one after another.
 *
 * `children` is resolved with `querySelectorAll` on the target's element, so it
 * reaches into the renderer's SVG output — any renderer that marks its series
 * groups takes part, without knowing animation exists. Growing is a `scaleY`
 * against `transform-origin: bottom` (set in CSS, with `transform-box: fill-box`
 * so the origin is the rect's own box rather than the SVG viewport).
 *
 * `staggerAnimate` bails on `prefers-reduced-motion`, so that is handled.
 */

/**
 * Ceiling on how long the pre-entrance state may hide the marks.
 *
 * Comfortably past the slowest entrance (a many-series sweep plus its stagger),
 * so it only ever fires when something has genuinely gone wrong.
 */
const ENTER_TIMEOUT_MS = 4000;

/**
 * Hard deadline on the pre-entrance state, measured from the moment the chart
 * draws rather than from the moment it is allowed to animate. Nothing an
 * observer does can extend it, which is what makes it a guarantee rather than
 * another gate.
 */
const ENTER_BACKSTOP_MS = 30_000;

/**
 * How long the marks may stay hidden once the chart is on screen and the
 * entrance still has not started.
 *
 * An entrance that is going to run starts as soon as its gate opens, so this
 * never cuts one short. What it bounds is a gate that cannot open: the
 * threshold is a fraction of the chart's own box, and inside a clipped or
 * transformed ancestor the observer reports a ratio no arithmetic here can
 * predict. Rather than guess the geometry, give the wait a limit.
 */
const ENTER_ONSCREEN_MS = 1200;
/**
 * Share of the viewport a chart may fill and still be considered fully seen.
 * Below 1 so a chart the exact height of the window still clears its gate
 * despite the observer never reporting a ratio of 1 for it.
 */
const VIEWPORT_FILL = 0.9;

/**
 * The tallest band of this chart that can be on screen at once.
 *
 * The window is only the bound when nothing between the chart and the page
 * clips. An ancestor with its own overflow — a scroll region, a card that crops
 * its contents — is a smaller window, and a chart taller than it can never reach
 * a high visibility ratio no matter where the reader scrolls. Measuring the
 * nearest one keeps `entranceThreshold` a test the chart can actually pass.
 */
function visibleHeightFor(el: HTMLElement | null): number {
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  if (!el || typeof getComputedStyle !== 'function') return windowHeight;
  // A detached or unlaid-out element tells us nothing; fall back to the window.
  if (!el.isConnected) return windowHeight;
  let node = el.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    const { overflow, overflowY } = getComputedStyle(node);
    if (/(hidden|clip|auto|scroll)/.test(`${overflow} ${overflowY}`)) {
      // A clipped ancestor with no height of its own tells us nothing.
      return node.clientHeight > 0 ? Math.min(windowHeight, node.clientHeight) : windowHeight;
    }
    node = node.parentElement;
  }
  return windowHeight;
}

/** Total time the dot sequence should span, however many dots there are. */
const DOT_SEQUENCE_MS = 700;

/**
 * Built per chart, because the dot stagger has to be budgeted against the
 * ACTUAL dot count. `children` matches every dot in the plot and the stagger
 * index is global, so a fixed per-item delay cannot serve both a 12-dot chart
 * (which then fires them almost together) and a 48-dot one (which then runs for
 * seconds). Spreading a fixed total across the real count fixes both.
 */
function buildChartAnimations(dotCount: number, onComplete: () => void): AnimationTrigger[] {
  // No lower bound. A floor of a few ms looks harmless and silently breaks the
  // budget it exists inside: at 10,000 points a 14ms floor turns 700ms into 140
  // SECONDS. Above a few hundred marks the stagger stops being perceptible
  // anyway, so letting the delay fall to nearly zero is both correct and what
  // keeps the total fixed at every size.
  const dotDelay = dotCount > 1 ? Math.min(90, DOT_SEQUENCE_MS / (dotCount - 1)) : 0;
  return [
    {
      trigger: 'Plot.enter',
      onComplete,
      sequence: [
        [
          {
            target: 'Plot',
            children: '[data-bar]',
            stagger: { delay: 70, from: 'first' },
            animation: { scaleY: { from: 0, to: 1, ease: quick, duration: 480 } },
          },
          {
            // One clip per series, wiping its stroke and fill open together.
            // Same duration, easing and stagger as the stroke draw, so the fill
            // edge tracks the line rather than trailing it.
            target: 'Plot',
            children: '[data-sweep]',
            stagger: { delay: 140, from: 'first' },
            animation: { scaleX: { from: 0, to: 1 }, ease: 'outQuart', duration: CHART_SWEEP_MS },
          },
          {
            // Dots are evenly spaced along x, so a uniform delay lands each pop
            // roughly under the advancing draw edge — no per-element timing.
            // `poppy` (damping 12) is what gives it the bounce.
            // 25ms, not 120. `children` matches EVERY dot in the chart, and the
            // stagger index is global — the palette sample has 6 series x 8 points,
            // so 120ms per dot ran for nearly six seconds. The delay has to be
            // budgeted against the total dot count, not the points per series.
            target: 'Plot',
            children: '[data-dot]',
            stagger: { delay: dotDelay, from: 'first' },
            // KEYFRAMES, not a spring. `poppy` overshoots ~30%, but a dot is 3px
            // at size=md, so 30% is well under a pixel of growth — the bounce was
            // real and invisible. Going explicitly to 2.4x and back makes the
            // travel absolute rather than proportional to a tiny radius.
            animation: { scale: [0, 1.7, 1], duration: 520, ease: 'outQuad' },
          },
        ],
      ],
    },
  ];
}

/** WCAG 1.4.11: a series mark carries information, so it needs 3:1 on its ground. */
/**
 * Most rows the text alternative will tabulate.
 *
 * Past this the table is dropped and the summary carries the chart instead. A
 * table is the COMPLETE data or it is misleading: thinning it leaves an
 * artifact that still reads as authoritative while a spike between two kept
 * rows has silently gone. The summary cannot lose an outlier that way, because
 * it names the extremes rather than hoping a sample lands on them.
 *
 * 200 follows Highcharts, which stops exposing individual points to screen
 * readers at the same count.
 */
const DATA_TABLE_MAX_ROWS = 200;

// Bundlers (Vite, webpack, Next) statically replace `process.env.NODE_ENV`.
declare const process: { env: { NODE_ENV?: string } };

/**
 * Most marks the BUILT-IN renderer will draw, counted as rows times series.
 *
 * Not a performance tuning knob — a guard on the page. The cost of an SVG line
 * is its path string, and that grows with the readings: 100k points is a 1.3MB
 * `d` attribute and renders comfortably, while 1M is 12.7MB and risks taking
 * the tab with it. Past this the chart declines to draw rather than locking the
 * page trying.
 *
 * It is also the point where more points stop being visible: at 100k across a
 * typical plot there are already north of a hundred readings behind every
 * pixel. A chart that genuinely needs more needs a different drawing
 * technology, which is what the `renderer` prop is for — a canvas or WebGL
 * renderer rasterises instead of building a path, so the cap does not apply to
 * one.
 */
const MAX_PLOTTED_POINTS = 100_000;

const MARK_CONTRAST = 3;
/**
 * Relative luminance at or below which a surface counts as dark, deciding which
 * way `clampToContrast` walks lightness to reach the ratio. Above it a mark is
 * darkened against a light ground, below it lightened against a dark one.
 */
const DARK_SURFACE_LUMINANCE = 0.18;
const SOLID_INDEX = SHADES.indexOf(SOLID_SHADE);

/**
 * Resolve a Move colour name to a concrete hex that clears 3:1 against the
 * chart's background.
 *
 * The palette's `solid` role is a FILL colour — tuned so white text sits on it —
 * which leaves the mid-tone hues short of 3:1 on a light page (lime measures
 * 2.00, orange 2.53). Rather than hand-pick a darker shade per palette, the
 * lightness is clamped the same way `defineTheme` clamps `--move-border-interactive`:
 * hue and chroma are preserved, so the series still reads as lime, just legible.
 *
 * A theme may add palettes that have no built-in ramp. Those fall back to the
 * token reference, which resolves in SVG but not on a canvas — so a custom
 * palette is the one case a canvas renderer cannot colour. Documented, narrow,
 * and fixable by giving `defineTheme` a chart-series role later.
 */
function resolveMarkColor(name: string, background: string, fallback: string): string {
  const ramp = rampOf(name);
  if (!ramp || !background.startsWith('#')) return fallback;
  const base = ramp[SOLID_INDEX] as string;
  const bg = hexToLinear(background);
  const { L, C, H } = hexToOklch(base);
  const isDark = luminance(bg) < DARK_SURFACE_LUMINANCE;
  return clampToContrast(L, C, H, [bg], MARK_CONTRAST, isDark).hex;
}

export interface ChartProps
  // `resource` is also an HTML (RDFa) attribute, so it must be omitted or the
  // typed prop collides with the string one — and, left in the passthrough, it
  // renders as `resource="[object Object]"` on the figure.
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'resource'> {
  /** Row-oriented source data, one object per x position. */
  data: readonly ChartDatum[];
  /** Key in each row holding the x/category value. */
  x: string;
  /** Series to draw, in declaration order (also draw and legend order). */
  series: readonly ChartSeries[];
  /**
   * Chart title. Renders as the figcaption and supplies the accessible name.
   * Named `caption` rather than `title` so it cannot collide with the HTML
   * `title` attribute (which would render a browser tooltip).
   */
  caption: string;
  /** Visually hide the caption while keeping it in the accessibility tree. */
  hideCaption?: boolean;
  /** One-line trend summary announced with the plot. Derived when omitted. */
  summary?: string | null;
  /** Swap the drawing layer. Falls back to Move's built-in SVG renderer. */
  renderer?: ChartRenderer | null;
  /** Scales tick text, stroke width, and point radius. */
  size?: ChartSize;
  /** Which grid lines to draw. */
  grid?: ChartGrid;
  /** Render the series legend below the plot. */
  legend?: boolean;
  /** Show a tooltip with every series' value at the hovered position. */
  tooltip?: boolean;
  /** Mark each data point on line and area series. */
  dots?: boolean;
  /**
   * How line and area paths travel between points. `monotone` smooths without
   * inventing peaks the data does not contain.
   */
  curve?: ChartCurve;
  /**
   * How x positions are derived. `category` spaces rows evenly by index;
   * `linear` places each at its own numeric x, which is what unevenly sampled
   * or time-series data needs — pass epoch milliseconds and a `formatX`.
   */
  xScale?: ChartXScale;
  /**
   * Draw the axes — tick labels and the baseline. Off makes a sparkline: shape
   * without values, for a table cell or beside a KPI. Pair with `grid="none"`,
   * `legend={false}` and `tooltip={false}`.
   */
  axes?: boolean;
  /**
   * Reference lines across the plot — a target, a budget, an SLA, an average.
   * Annotations rather than series: they give the data something to be read
   * against. Ignored by a pie, which has no value axis.
   */
  rules?: readonly ChartRule[] | null;
  /**
   * Hole size for a pie, as a fraction of the radius. 0 is a full pie, around
   * 0.6 reads as a donut. Ignored by every other series type.
   */
  innerRadius?: number;
  /** Stack bar and area series instead of overlaying them. */
  stacked?: boolean;
  /** Width-to-height ratio for the plot. Ignored when `height` is set. */
  aspect?: number;
  /** Explicit plot height in px. Overrides `aspect`. */
  height?: number | null;
  /** Override the categorical ramp with Move color names. */
  palette?: readonly Color[] | null;
  /** Format an x tick label and the data table's category column. */
  formatX?: ((value: unknown) => string) | null;
  /** Format a y tick label and data table cells. */
  formatY?: ((value: number) => string) | null;
  /** Render the visually hidden data table. */
  /**
   * Render the visually hidden data table that carries the chart's values.
   *
   * A number sets how many rows it may hold before it samples evenly across the
   * range instead of tabulating every one.
   */
  dataTable?: boolean | number;
  /**
   * Async source status.
   *
   * Drives the loading, error, retry and empty states in the shell rather than
   * in each renderer, so every adapter gets them identically — and so a
   * renderer is never handed data that is not there.
   */
  resource?: AsyncResource<unknown> | null;
  /** Override the built-in user-facing strings. */
  labels?: Partial<ChartLabels> | null;
  /** Override or disable the bar entrance stagger. */
  animations?: AnimationTrigger[] | false;
  /**
   * How much of the chart must be on screen before the entrance plays, as a
   * fraction of the chart's own height (`0.8` = four fifths visible).
   *
   * `'always'` drops the visibility gate entirely and plays as soon as the
   * chart can draw — right for a chart that is above the fold anyway, or one
   * inside a scroller the observer cannot see into.
   */
  entranceThreshold?: number | 'always';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Track the rendered size of an element. Returns zeroes until first measurement.
 *
 * Both dimensions come from the observer, and the element's height is set in CSS
 * (aspect-ratio), never from this value. Deriving the height in JS from the
 * measured width and applying it back to the same element makes the observer
 * re-fire on its own output — the plot then converges slowly and visibly renders
 * at the wrong size on the way.
 */
function useMeasuredSize(ref: React.RefObject<HTMLElement | null>): {
  width: number;
  height: number;
} {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const apply = (width: number, height: number) => {
      setSize((prev) =>
        Math.abs(prev.width - width) < 0.5 && Math.abs(prev.height - height) < 0.5
          ? prev
          : { width, height },
      );
    };
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) apply(box.width, box.height);
    });
    observer.observe(el);
    const rect = el.getBoundingClientRect();
    apply(rect.width, rect.height);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

function numeric(row: ChartDatum, key: string): number | null {
  const raw = row[key];
  const n = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Work out what there is to say about the data. The WORDS live in
 * `labels.summary`, so this reports facts and phrases nothing.
 */
function summaryFacts(
  data: readonly ChartDatum[],
  x: string,
  series: readonly ResolvedChartSeries[],
  formatX: ((value: unknown) => string) | null | undefined,
  formatY: ((v: number) => string) | null | undefined,
): ChartSummaryFacts {
  const fy = (v: number) => (formatY ? formatY(v) : String(v));
  const fx = (i: number) => (formatX ? formatX(data[i][x]) : String(data[i][x] ?? ''));
  if (data.length === 0) return { series: [], points: 0 };

  return {
    points: data.length,
    series: series.map((s) => {
      const values: { v: number; i: number }[] = [];
      data.forEach((row, i) => {
        const v = numeric(row, s.key);
        if (v !== null) values.push({ v, i });
      });
      if (values.length === 0) {
        return { label: s.label, hasValues: false, first: '', last: '', direction: 'flat' };
      }
      const first = values[0].v;
      const last = values[values.length - 1].v;
      // Name the extremes, and name WHERE they are: it is the one thing a
      // sighted reader takes from the shape instantly and a serial reader
      // cannot recover from a list of values — and past the table threshold it
      // is the only place an outlier is reported at all.
      //
      // Only where the endpoints do not already carry them. A peak equal to the
      // final value is not news, and a series that only climbs should read as
      // one clause rather than three saying the same thing.
      const peak = values.reduce((a, b) => (b.v > a.v ? b : a));
      const trough = values.reduce((a, b) => (b.v < a.v ? b : a));
      return {
        label: s.label,
        hasValues: true,
        first: fy(first),
        last: fy(last),
        direction: last > first ? 'up' : last < first ? 'down' : 'flat',
        ...(peak.v > Math.max(first, last)
          ? { peak: { value: fy(peak.v), at: fx(peak.i) } }
          : null),
        ...(trough.v < Math.min(first, last)
          ? { low: { value: fy(trough.v), at: fx(trough.i) } }
          : null),
      } satisfies ChartSummarySeries;
    }),
  };
}

/** CSS owns the box: an explicit height, or an aspect ratio. */
function sizingStyle(height: number | string | null | undefined, aspect: number | undefined) {
  return height != null
    ? ({ height: Number(height) } as React.CSSProperties)
    : ({ aspectRatio: String(aspect || 2) } as React.CSSProperties);
}

/** Normalise the nullable formatter props to plain optionals. */
function formatters(
  formatX: ((value: unknown) => string) | null | undefined,
  formatY: ((value: number) => string) | null | undefined,
) {
  return { formatX: formatX ?? undefined, formatY: formatY ?? undefined };
}

/**
 * Hover is only possible once the renderer has reported a position per row —
 * a renderer that never calls `onPlotGeometry` simply has no tooltip.
 */
function hoverable(
  tooltip: boolean | undefined,
  geometry: PlotGeometry | null,
  rowCount: number,
): boolean {
  return tooltip !== false && geometry !== null && geometry.x.length === rowCount;
}

/**
 * Index of the reported position closest to `localX`.
 *
 * Snapping to what the renderer actually reported means no assumption about how
 * it distributed points — band, point, or uneven.
 */
function nearestIndex(positions: readonly number[], localX: number): number {
  let best = 0;
  let bestDistance = Infinity;
  positions.forEach((px, i) => {
    const distance = Math.abs(px - localX);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  });
  return best;
}

/** The chart's title, and the accessible name the plot is labelled by. */
function Caption({
  id,
  hidden,
  children,
}: {
  id: string;
  hidden: boolean;
  children: React.ReactNode;
}) {
  return (
    <figcaption id={id} className={styles.caption} data-hidden={hidden ? '' : undefined}>
      {children}
    </figcaption>
  );
}

/** The retry an errored resource carries, if it carries one. */
function resourceRetry(resource: AsyncResource<unknown> | null) {
  return resource?.status === 'error' ? resource.retry : undefined;
}

/**
 * The drawing area: the renderer's output, plus the shell's own overlay.
 *
 * `role="img"` with a generated name sits HERE rather than on the viewport, so
 * it describes the drawing and nothing else — and so the hover overlay shares
 * one coordinate space with the geometry the renderer reports.
 */
function Plot({
  plotRef,
  pending,
  summary,
  describedBy,
  renderer: Renderer,
  spec,
  theme,
  width,
  height,
  onGeometry,
  entrance,
  activeIndex,
  overlay,
  onPointerMove,
  onPointerLeave,
}: {
  plotRef: React.Ref<HTMLDivElement>;
  pending: boolean;
  summary: string;
  describedBy: string | undefined;
  renderer: React.ComponentType<ChartRendererProps>;
  spec: ChartSpec;
  theme: ChartTheme;
  width: number;
  height: number;
  onGeometry: (geometry: PlotGeometry) => void;
  entrance: ChartEntrance;
  activeIndex: number | null;
  overlay: React.ReactNode;
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
}) {
  const drawable = width > 0 && height > 0;
  return (
    <div
      ref={plotRef}
      className={styles.plot}
      data-enter={pending ? 'pending' : undefined}
      role="img"
      aria-label={summary}
      aria-describedby={describedBy}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {drawable && (
        <Renderer
          spec={spec}
          theme={theme}
          width={width}
          height={height}
          onPlotGeometry={onGeometry}
          entrance={entrance}
          activeIndex={activeIndex}
        />
      )}
      {overlay}
    </div>
  );
}

/** Which of the three non-drawing states applies, if any. */
/** What the shell shows in place of the plot, or null to draw it. */
type ChartStatus = 'loading' | 'error' | 'empty' | 'oversized' | null;

function deriveStatus(
  resource: AsyncResource<unknown> | null,
  rowCount: number,
  oversized: boolean,
): ChartStatus {
  if (resource?.status === 'loading') return 'loading';
  if (resource?.status === 'error') return 'error';
  if (rowCount === 0) return 'empty';
  return oversized ? 'oversized' : null;
}

/**
 * Whether an entrance is wanted, and whether it still has to be hidden for.
 *
 * `motionAllowed` is about intent and survives the animation; `willAnimate`
 * also asks whether it has already played, because the pre-entrance CSS must
 * lift the moment it has. Reduced motion makes the stagger bail and
 * `animations={false}` removes the trigger, so in either case the CSS must not
 * apply or the chart would sit permanently blank.
 */
function resolveMotion(
  animations: unknown,
  entered: boolean,
): { reducedMotion: boolean; motionAllowed: boolean; willAnimate: boolean } {
  const reducedMotion = prefersReducedMotion();
  const motionAllowed = animations !== false && !reducedMotion;
  return { reducedMotion, motionAllowed, willAnimate: motionAllowed && !entered };
}

/** Where the tooltip attaches, and the row it describes. */
function resolveHover(
  geometry: PlotGeometry | null,
  hovered: number | null,
  data: readonly ChartDatum[],
): { row: ChartDatum | null; x: number; y: number | null } {
  if (!geometry || hovered === null) return { row: null, x: 0, y: null };
  return {
    row: data[hovered] ?? null,
    x: geometry.x[hovered],
    y: geometry.y?.[hovered] ?? null,
  };
}

/**
 * The text alternative: the sentence the plot is named by, and whether a table
 * stands behind it.
 */
function resolveAlternative(input: {
  summary: string | null | undefined;
  dataTable: boolean | number | undefined;
  data: readonly ChartDatum[];
  x: string;
  series: readonly ResolvedChartSeries[];
  labels: ChartLabels;
  plotVisible: boolean;
  formatX?: (value: unknown) => string;
  formatY?: (value: number) => string;
}): { summary: string; showTable: boolean } {
  const { summary, dataTable, data, x, series, labels, plotVisible, formatX, formatY } = input;
  // The number is the point at which the table stops being the alternative and
  // the summary takes over — not a budget the table is thinned to fit.
  const limit = typeof dataTable === 'number' ? dataTable : DATA_TABLE_MAX_ROWS;
  return {
    // The summary NAMES the plot, so with no plot on the page there is nothing
    // for it to name. Deriving it walks every row, which would spend the one
    // cost that scales with the data at the exact moment the chart has decided
    // the data is too large to touch.
    summary: plotVisible
      ? (summary ?? labels.summary(summaryFacts(data, x, series, formatX, formatY)))
      : '',
    showTable: dataTable !== false && data.length <= limit,
  };
}

/** What to tell a renderer that animates its own geometry. */
function entranceOf(motionAllowed: boolean, plotReady: boolean): ChartEntrance {
  if (!motionAllowed) return null;
  return plotReady ? 'run' : 'pending';
}

/** Which way the tooltip opens — the renderer decides when it knows better. */
function sideOf(geometry: PlotGeometry, hovered: number | null): ChartTooltipSide {
  if (hovered === null) return 'top';
  if (geometry.side) return geometry.side[hovered] ?? 'top';
  // An axis chart opens BESIDE the crosshair, never above or below it. A tooltip
  // listing several series is taller than the room above a high point, so a
  // vertical placement collides with the plot edge and flips down across the
  // very values it is describing. Sideways it always clears the hovered column.
  // The side follows which half the crosshair is in, so it opens into the wider
  // space rather than relying on a collision flip to rescue it.
  const midX = geometry.rect.x + geometry.rect.width / 2;
  return geometry.x[hovered] > midX ? 'left' : 'right';
}

/**
 * A pie's tooltip names the SLICE, so it takes the slice's colour from the same
 * ramp the legend and the renderer walk — otherwise every wedge would report
 * the one series colour.
 */
function tooltipSeries(
  resolved: readonly ResolvedChartSeries[],
  isPie: boolean,
  hovered: number | null,
  ramp: readonly string[],
): readonly ResolvedChartSeries[] {
  if (!isPie || hovered === null) return resolved;
  return resolved.map((entry) => ({ ...entry, color: ramp[hovered % ramp.length] }));
}

/**
 * Resolve each rule's colour, as with a series.
 *
 * Defaults to the axis colour rather than a palette hue: a reference line is
 * scenery for the data, and one drawn in a series colour reads as another
 * series.
 */
function resolveRules(
  rules: readonly ChartRule[] | null | undefined,
  token: (name: string) => string,
  theme: ChartTheme,
): ResolvedChartRule[] {
  if (!rules) return [];
  const background = token('--move-bg-base');
  return rules.map((rule) => ({
    y: rule.y,
    label: rule.label,
    color: rule.color
      ? resolveMarkColor(rule.color as string, background, token(`--move-${rule.color}-solid`))
      : theme.axis,
  }));
}

/** Legend entries for a pie: one per row, coloured from the same ramp. */
function sliceLegend(
  data: readonly ChartDatum[],
  xKey: string,
  ramp: readonly string[],
): ResolvedChartSeries[] {
  return data.map((row, i) => ({
    key: `${i}`,
    type: 'pie' as const,
    label: String(row[xKey] ?? ''),
    color: ramp[i % ramp.length],
    dash: false,
  }));
}

/**
 * Loading, error and empty, rendered INSTEAD of the plot.
 *
 * Shell-owned rather than per-renderer, so every adapter reports these states
 * identically — and so a renderer is never invoked with data that is not there.
 * `role="status"` announces the change without stealing focus.
 */
function StatusPanel({
  state,
  labels,
  retry,
}: {
  state: Exclude<ChartStatus, null>;
  labels: ChartLabels;
  retry?: (() => void) | undefined;
}) {
  return (
    <div className={styles.status} role="status" aria-live="polite" data-state={state}>
      {state === 'loading' && <Loader size="sm" />}
      <Text size="sm">{labels[state]}</Text>
      {state === 'error' && retry && (
        <Button size="sm" variant="secondary" onClick={retry}>
          {labels.retry}
        </Button>
      )}
    </div>
  );
}

/** Series key, rendered as DOM so it stays reachable behind a canvas renderer. */
function Legend({ series }: { series: readonly ResolvedChartSeries[] }) {
  if (series.length === 0) return null;
  return (
    <ul className={styles.legend}>
      {series.map((s) => (
        <li key={s.key} className={styles.legendItem}>
          <span
            className={styles.swatch}
            style={{ background: s.color }}
            data-dash={s.dash ? '' : undefined}
          />
          {/* Series names are consumer data and can be arbitrarily long. Through
              the shared truncation utility, so a chart legend clips the same way
              every other Move text does. */}
          <span className={styles.legendLabel} data-truncate="end">
            {s.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Move's tokens, resolved to the concrete values a renderer can draw with. */
function resolveChartTheme(
  token: (name: string) => string,
  size: ChartSize,
  palette: readonly Color[] | null | undefined,
  reducedMotion: boolean,
  padding: number,
): ChartTheme {
  const background = token('--move-bg-base');
  const ramp = palette ?? CHART_SERIES_COLORS;
  return {
    series: ramp.map((c) => resolveMarkColor(c as string, background, token(`--move-${c}-solid`))),
    grid: token('--move-border-muted'),
    axis: token('--move-border-base'),
    tick: token('--move-fg-subtle'),
    label: token('--move-fg-muted'),
    surface: token('--move-bg-base'),
    font: token('--move-font-body'),
    areaOpacity: AREA_OPACITY,
    reducedMotion,
    padding,
    ...SIZE_SCALE[size],
  };
}

/** Default the label and turn the colour NAME into a value, once, up front. */
function resolveSeries(
  series: readonly ChartSeries[],
  ramp: readonly string[],
  token: (name: string) => string,
): ResolvedChartSeries[] {
  const background = token('--move-bg-base');
  return series.map((s, i) => ({
    key: s.key,
    type: s.type,
    label: s.label ?? s.key,
    color: s.color
      ? resolveMarkColor(s.color as string, background, token(`--move-${s.color}-solid`))
      : ramp[i % ramp.length],
    dash: s.dash ?? false,
  }));
}

type RowFormat = {
  row: ChartDatum;
  xKey: string;
  formatX?: (value: unknown) => string;
  formatY?: (value: number) => string;
};

const readX = ({ row, xKey, formatX }: RowFormat) =>
  formatX ? formatX(row[xKey]) : String(row[xKey] ?? '');

const readY = (row: ChartDatum, key: string, formatY?: (value: number) => string) => {
  const v = numeric(row, key);
  return v === null ? '—' : formatY ? formatY(v) : String(v);
};

/** Several series: name the row once, then list each series beneath it. */
function MultiSeriesRows({
  series,
  ...rest
}: RowFormat & { series: readonly ResolvedChartSeries[] }) {
  return (
    <>
      <span className={styles.tipHeading}>{readX(rest)}</span>
      {series.map((s) => (
        <span key={s.key} className={styles.tipRow}>
          <span className={styles.swatch} style={{ background: s.color }} />
          {s.label}
          <span className={styles.tipValue}>{readY(rest.row, s.key, rest.formatY)}</span>
        </span>
      ))}
    </>
  );
}

/**
 * One series: colour, name and value read as a single fact, so stacking them
 * over two lines only adds height.
 */
function SingleSeriesRow({
  series,
  ...rest
}: RowFormat & { series: ResolvedChartSeries | undefined }) {
  if (!series) return null;
  return (
    <span className={styles.tipRow}>
      <span className={styles.swatch} style={{ background: series.color }} />
      {readX(rest)}
      <span className={styles.tipValue}>{readY(rest.row, series.key, rest.formatY)}</span>
    </span>
  );
}

/**
 * Crosshair + tooltip over the plot.
 *
 * Shell-owned rather than renderer-owned, so it looks and behaves identically
 * behind any adapter — including a canvas one, where there is no DOM to hover.
 * The tooltip attaches to a zero-size anchor that moves to the hovered band,
 * which is what lets Move's Tooltip do the positioning and gives it WCAG 1.4.13
 * behaviour for free.
 */
function HoverOverlay({
  x,
  y,
  side,
  crosshair,
  showSeriesLabel,
  rect,
  row,
  xKey,
  series,
  formatX,
  formatY,
}: {
  x: number;
  y: number | null;
  side: ChartTooltipSide;
  crosshair: boolean;
  /**
   * Naming the series is only worth the space when there is more than one to
   * tell apart. With a single series the caption and legend have already said
   * it, and the heading names the row — so the tooltip needs just the colour
   * and the value.
   */
  showSeriesLabel: boolean;
  rect: PlotRect;
  row: ChartDatum;
  xKey: string;
  series: readonly ResolvedChartSeries[];
  formatX?: (value: unknown) => string;
  formatY?: (value: number) => string;
}) {
  return (
    // Its OWN provider, as TooltipSimple carries one for standalone use. MoveRoot
    // supplies one, but a bare <Chart> would otherwise throw the moment a
    // pointer entered the plot — a hover is not the place to discover a missing
    // ancestor. Nested providers are harmless.
    <Tooltip.Provider delayDuration={0}>
      {crosshair && (
        <span className={styles.crosshair} style={{ left: x, top: rect.y, height: rect.height }} />
      )}
      <Tooltip.Root open delayDuration={0}>
        <Tooltip.Trigger asChild>
          <span
            className={styles.anchor}
            style={{ left: x, top: y ?? rect.y + rect.height / 2 }}
            aria-hidden="true"
          />
        </Tooltip.Trigger>
        <Tooltip.Content side={side} sideOffset={8}>
          {showSeriesLabel ? (
            <MultiSeriesRows
              row={row}
              xKey={xKey}
              series={series}
              formatX={formatX}
              formatY={formatY}
            />
          ) : (
            <SingleSeriesRow
              row={row}
              xKey={xKey}
              series={series[0]}
              formatX={formatX}
              formatY={formatY}
            />
          )}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

/**
 * The visually hidden data table — the plot's long text alternative.
 *
 * Built from `data` + `series` rather than from anything the renderer drew, so
 * every renderer inherits the same table. Lives here rather than inline in
 * `render()` purely to keep that function's complexity in range.
 */
function DataTable({
  id,
  data,
  x,
  series,
  labels,
  formatX,
  formatY,
}: {
  id: string;
  data: readonly ChartDatum[];
  x: string;
  series: readonly ResolvedChartSeries[];
  labels: ChartLabels;
  formatX?: (value: unknown) => string;
  formatY?: (value: number) => string;
}) {
  return (
    <div id={id} className={styles.description}>
      <table>
        <caption>{labels.dataTable}</caption>
        <thead>
          <tr>
            <th scope="col">{labels.categoryColumn}</th>
            {series.map((s) => (
              <th key={s.key} scope="col">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <th scope="row">{formatX ? formatX(row[x]) : String(row[x] ?? '')}</th>
              {series.map((s) => {
                const v = numeric(row, s.key);
                return <td key={s.key}>{v === null ? '' : formatY ? formatY(v) : String(v)}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Chart = withMoveComponent<'root', ChartProps, HTMLElement>({
  name: 'Chart',
  styles,
  slots: ['root'] as const,
  defaults: {
    size: 'md' as ChartSize,
    grid: 'horizontal' as ChartGrid,
    legend: true,
    tooltip: true,
    dots: false,
    curve: 'linear' as ChartCurve,
    xScale: 'category' as ChartXScale,
    innerRadius: 0,
    rules: null,
    axes: true,
    stacked: false,
    aspect: 2,
    height: null,
    hideCaption: false,
    dataTable: true,
    palette: null,
    formatX: null,
    formatY: null,
    labels: null,
    resource: null,
    summary: null,
    renderer: null,
    entranceThreshold: 0.8 as number | 'always',
  },
  moveProps: ['data', 'x', 'series', 'caption', 'animations', 'resource'],

  setup({ props, ref, cx, sp, attrs }) {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const plotRef = React.useRef<HTMLDivElement>(null);
    // Hold the entrance until the chart is actually on screen. A chart far down
    // the page would otherwise play its stagger unseen and, being one-shot, have
    // nothing left to show by the time the reader arrives.
    // A fraction, not a delay. A delay decouples the animation from what the
    // reader is actually looking at — scroll fast and it still plays off-screen.
    // Waiting until most of the plot is on screen means the entrance starts when
    // the chart is genuinely being looked at. `entranceThreshold` tunes it.
    const { width, height } = useMeasuredSize(viewportRef);
    const gateOff = props.entranceThreshold === 'always';
    // The observer measures visibility as a fraction of the ELEMENT, so a chart
    // taller than the viewport can never reach a high ratio: a 900px chart in an
    // 800px window peaks at 0.89, and one at 1200px peaks at 0.67 — under the
    // default, so it would never animate at all. Cap the ask at what this chart
    // can actually achieve here, where its measured height is known.
    // Measured in an effect, not read off the ref mid-render: the ref is null on
    // the first pass, so reading it there produced a window-sized answer that
    // only corrected if something happened to re-render — the chart animated or
    // not depending on timing.
    const [clipHeight, setClipHeight] = React.useState(0);
    React.useLayoutEffect(() => {
      setClipHeight(visibleHeightFor(viewportRef.current));
    }, [width, height]);
    const reachable =
      height > 0 && clipHeight > 0
        ? // A chart that does not fit its clip cannot be judged by how much of
          // it shows: the observer measures the box AFTER transforms, so a
          // cropped, scaled or rotated chart reads lower than its layout size
          // suggests, and any fraction near the limit becomes a coin flip.
          // Where the whole chart can never be on screen at once, being on
          // screen at all is the most the gate can honestly ask.
          clipHeight < height
          ? 0
          : Math.min(1, (clipHeight * VIEWPORT_FILL) / height)
        : 1;
    // A non-number can only be 'always' here, since `defaults` guarantees a
    // value — and both that and any bad input fall open to 0, which plays the
    // entrance rather than gating it behind a test nothing can satisfy.
    const threshold =
      gateOff || typeof props.entranceThreshold !== 'number'
        ? 0
        : Math.min(props.entranceThreshold, reachable);
    const { ref: inViewRef, inView } = useInView<HTMLDivElement>({ threshold });
    // Any part of the chart on screen at all. A zero threshold is the one
    // question about visibility that survives a transform and a clip, which is
    // why the deadline below hangs off it rather than off the entrance gate.
    const { ref: onScreenRef, inView: onScreen } = useInView<HTMLDivElement>({ threshold: 0 });
    // Tracks whether the entrance has played, so the pre-entrance CSS can be
    // dropped afterwards.
    const [entered, setEntered] = React.useState(false);
    const measuredRef = useMergedRef(viewportRef, inViewRef, onScreenRef);
    const [geometry, setGeometry] = React.useState<PlotGeometry | null>(null);
    const [hovered, setHovered] = React.useState<number | null>(null);
    // Stable identity: a renderer stores this in a deps array. Bail out on an
    // equal report so a renderer re-reporting each render cannot loop.
    const handleGeometry = React.useCallback((next: PlotGeometry) => {
      setGeometry((prev) => {
        if (
          prev &&
          prev.rect.x === next.rect.x &&
          prev.rect.y === next.rect.y &&
          prev.rect.width === next.rect.width &&
          prev.rect.height === next.rect.height &&
          prev.x.length === next.x.length &&
          prev.x.every((v, i) => v === next.x[i])
        ) {
          return prev;
        }
        return next;
      });
    }, []);
    const { theme } = useTheme();

    // `--move-chart-padding` is a real CSS token so a consumer can override it,
    // but a renderer may be drawing to a canvas and cannot resolve CSS — so the
    // SHELL reads it here and passes a number across. Reading our own element's
    // computed style is the only way to let a token drive geometry.
    const [padding, setPadding] = React.useState(DEFAULT_PADDING);
    React.useLayoutEffect(() => {
      const el = plotRef.current;
      if (!el) return;
      const raw = getComputedStyle(el).getPropertyValue('--move-chart-padding').trim();
      const value = Number.parseFloat(raw);
      if (!Number.isFinite(value) || value < 0) return;
      // rem against the ACTUAL root size, not an assumed 16 — a consumer may
      // scale the root for accessibility, and the padding should scale with it.
      const rootPx = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      const scale = Number.isFinite(rootPx) && rootPx > 0 ? rootPx : 16;
      setPadding(raw.endsWith('rem') ? value * scale : value);
    }, [theme]);
    // The plot subtree mounts LATE — the renderer only runs once the viewport has
    // been measured, and the bars only exist once it has drawn. A lifecycle enter
    // is one-shot and locks on the first non-null config, so firing it on the
    // shell's own mount would stagger zero rects and never run again. `geometry`
    // is reported BY the renderer after it draws, which makes it an exact
    // "bars exist now" signal — no polling needed.
    // Gate on a BOOLEAN, not the geometry object. The renderer reports geometry
    // more than once while the width settles, and a new config identity re-runs
    // the animation effect — whose cleanup pauses the stagger mid-flight, which
    // leaves every bar frozen near scaleY(0). The same flag also waits for the
    // chart to scroll into view.
    // Gate on the MEASUREMENT, not on `geometry`.
    //
    // Both mean "the renderer has drawn", but width/height land one commit
    // EARLIER — in the same render that first includes the renderer. The
    // lifecycle enter runs in `useLayoutEffect`, which fires after that commit
    // but before paint, so the `from` state is seeded and the line is hidden
    // before anything reaches the screen.
    //
    // `geometry` arrives from a passive effect, i.e. a render later, so the
    // finished plot painted once first — that was the "line is there, then it
    // animates in" flash.
    // A status panel REPLACES the plot, but the measured viewport wraps both —
    // so width and height arrive while loading and would call the plot ready
    // before it exists. The lifecycle enter is one-shot per mount: it would fire
    // against a null ref, lock, and never run again once the real plot arrived.
    // That is why an async chart appeared with no entrance at all.
    // Rows times series: what the renderer would actually have to put on the
    // page, which is the number the path string grows with — not the row count.
    const plotted = props.data.length * props.series.length;
    const oversized = props.renderer == null && plotted > MAX_PLOTTED_POINTS;
    const status = deriveStatus(props.resource ?? null, props.data.length, oversized);

    // The panel tells the reader the chart is too large; it cannot tell them
    // what to do about it, because that is a decision for whoever built the
    // page. So the way out goes to the console, once.
    const warnedOversized = React.useRef(false);
    React.useEffect(() => {
      if (process.env.NODE_ENV !== 'development') return;
      if (!oversized || warnedOversized.current) return;
      warnedOversized.current = true;
      console.warn(
        `[move] Chart: ${plotted.toLocaleString('en-US')} points to plot, past the ` +
          `${MAX_PLOTTED_POINTS.toLocaleString('en-US')} the built-in renderer draws. It has ` +
          'declined to draw rather than risk the page: an SVG path this long is megabytes of ' +
          'attribute, and at this density every point is already sharing a pixel with a ' +
          'hundred others. Aggregate the data, or pass a `renderer` backed by canvas or WebGL — ' +
          'the cap does not apply to one.',
      );
    }, [oversized, plotted]);
    const plotReady = status === null && width > 0 && height > 0 && (gateOff || inView);
    // Fail-open bound. `data-enter="pending"` hides the marks until the entrance
    // reports completion, so a callback that never arrives — an interrupted or
    // failed animation — would leave the chart blank. Lift the pre-entrance
    // state once the longest possible entrance has had time to run.
    React.useEffect(() => {
      if (!plotReady || entered) return;
      const timer = setTimeout(() => setEntered(true), ENTER_TIMEOUT_MS);
      return () => clearTimeout(timer);
    }, [plotReady, entered]);

    // Backstop, and the reason it is separate: the timer above waits on
    // `plotReady`, which includes the visibility gate — so it protects against
    // an entrance that starts and never finishes, and not at all against one
    // that never starts. A chart whose gate never opens kept its marks hidden
    // for good. This one waits on nothing observational: once the chart has
    // drawn, the pre-entrance state has a deadline no observer can extend. It
    // is long enough that a reader scrolling down a page still meets the
    // entrance, and short enough that nobody sits in front of an empty chart.
    React.useEffect(() => {
      if (entered || status !== null || width <= 0 || height <= 0) return;
      const drawn = onScreen ? ENTER_ONSCREEN_MS : ENTER_BACKSTOP_MS;
      const timer = setTimeout(() => setEntered(true), drawn);
      return () => clearTimeout(timer);
    }, [entered, status, width, height, onScreen]);

    // Which series actually put points on the page. A scatter always does —
    // points ARE the mark — while a line or area only does when `dots` is on.
    // Deriving this from the prop alone left a scatter with a dot count of 0,
    // so every point took a delay of 0 and they all appeared together.
    const dotCount =
      props.data.length *
      props.series.filter(
        (x) =>
          x.type === 'scatter' || (props.dots === true && (x.type === 'line' || x.type === 'area')),
      ).length;
    const animConfig = React.useMemo(
      () =>
        plotReady
          ? resolveAnimationsConfig(
              buildChartAnimations(dotCount, () => setEntered(true)),
              props.animations,
            )
          : null,
      [plotReady, dotCount, props.animations],
    );
    // Three names, ONE element. `useAnimations` keys its cancel-ref as
    // `${target}-${fn}`, and `staggerAnimate` pauses whatever that ref holds
    // before it starts — so two stagger steps sharing a target cancel each
    // other, and only the last one in a parallel group survives. Distinct names
    // give each step its own cancel ref while animating the same node.
    //
    // Memoised because the refs object is also an effect dependency whose
    // cleanup cancels in-flight animations; a new identity each render tears
    // the stagger down mid-flight.
    // Memoised: the refs object is an effect dependency in `useAnimations`, and
    // that effect's cleanup cancels in-flight animations — a fresh identity each
    // render tears the stagger down mid-flight.
    const animRefs = React.useMemo(() => ({ Plot: plotRef }), []);
    useAnimations(animConfig, animRefs);

    const captionId = React.useId();
    const tableId = React.useId();

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        const retry = resourceRetry(props.resource ?? null);

        const size = props.size as ChartSize;
        const labels = { ...DEFAULT_LABELS, ...(props.labels ?? {}) };
        const tokens = theme.tokens as unknown as Record<string, string>;
        const token = (name: string) => tokens[name] ?? '';

        const { reducedMotion, motionAllowed, willAnimate } = resolveMotion(
          props.animations,
          entered,
        );

        const chartTheme = resolveChartTheme(token, size, props.palette, reducedMotion, padding);
        const resolved = resolveSeries(props.series, chartTheme.series, token);
        // A pie is one series of many PARTS, so its colours and legend run per
        // row. The renderer walks the same ramp in the same order, so the two
        // agree without colours being passed between them.
        const isPie = resolved.some((s) => s.type === 'pie');

        const { formatX, formatY } = formatters(props.formatX, props.formatY);

        const chartSpec: ChartSpec = {
          data: props.data,
          x: props.x,
          series: resolved,
          grid: props.grid as ChartGrid,
          stacked: props.stacked as boolean,
          dots: props.dots as boolean,
          curve: props.curve as ChartCurve,
          xScale: props.xScale as ChartXScale,
          innerRadius: props.innerRadius as number,
          rules: resolveRules(props.rules, token, chartTheme),
          axes: props.axes !== false,
          formatX,
          formatY,
        };

        const sizing = sizingStyle(props.height, props.aspect);
        // Rendered as a component, never called as a function: a renderer may
        // use hooks, and the plot mounts and unmounts cleanly.
        const Renderer = (props.renderer ??
          builtinRenderer) as React.ComponentType<ChartRendererProps>;

        // Snap to the nearest position the renderer actually reported. No
        // assumption about band vs point scaling, and it works the same over an
        // SVG renderer, a canvas one, or anything else.
        const canHover = hoverable(props.tooltip, geometry, props.data.length);

        const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
          if (!canHover || !geometry) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const localX = event.clientX - bounds.left;
          const localY = event.clientY - bounds.top;
          // A renderer that supplied hitTest owns the question entirely —
          // snapping to the nearest x is meaningless for anything radial.
          setHovered(
            geometry.hitTest ? geometry.hitTest(localX, localY) : nearestIndex(geometry.x, localX),
          );
        };

        const hover = resolveHover(geometry, hovered, props.data);
        const { summary, showTable } = resolveAlternative({
          summary: props.summary as string | null | undefined,
          dataTable: props.dataTable as boolean | number | undefined,
          data: props.data,
          x: props.x,
          series: resolved,
          labels,
          plotVisible: status === null,
          formatX,
          formatY,
        });
        const legendSeries = isPie ? sliceLegend(props.data, props.x, chartTheme.series) : resolved;

        return (
          <figure
            aria-labelledby={captionId}
            {...attrs}
            {...spRest}
            ref={ref as React.Ref<HTMLElement>}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-size={size}
            data-grid={props.grid as string}
            data-status={status ?? undefined}
          >
            <Caption id={captionId} hidden={props.hideCaption === true}>
              {props.caption}
            </Caption>

            <div ref={measuredRef} className={styles.viewport} style={sizing}>
              {/* Status REPLACES the plot rather than sitting inside it. Left in
                  place, the plot keeps role="img" and an accessible summary
                  describing a chart that is not there. */}
              {status ? (
                <StatusPanel state={status} labels={labels} retry={retry} />
              ) : (
                <Plot
                  plotRef={plotRef}
                  pending={willAnimate}
                  summary={summary}
                  describedBy={showTable ? tableId : undefined}
                  renderer={Renderer}
                  spec={chartSpec}
                  theme={chartTheme}
                  width={width}
                  height={height}
                  onGeometry={handleGeometry}
                  entrance={entranceOf(motionAllowed, plotReady)}
                  activeIndex={hovered}
                  overlay={
                    canHover && hover.row && geometry ? (
                      <HoverOverlay
                        x={hover.x}
                        y={hover.y}
                        showSeriesLabel={resolved.length > 1}
                        side={sideOf(geometry, hovered)}
                        crosshair={!geometry.hitTest}
                        rect={geometry.rect}
                        row={hover.row}
                        xKey={props.x}
                        series={tooltipSeries(resolved, isPie, hovered, chartTheme.series)}
                        formatX={formatX}
                        formatY={formatY}
                      />
                    ) : null
                  }
                  onPointerMove={onPointerMove}
                  onPointerLeave={() => setHovered(null)}
                />
              )}
            </div>

            {props.legend !== false && <Legend series={legendSeries} />}

            {showTable && (
              <DataTable
                id={tableId}
                data={props.data}
                x={props.x}
                series={resolved}
                labels={labels}
                formatX={formatX}
                formatY={formatY}
              />
            )}
          </figure>
        );
      },
    };
  },
});
