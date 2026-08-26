'use client';
import * as React from 'react';
import { useMergedRef, withMoveComponent } from '../../../engine';
import { quick, resolveAnimationsConfig, useAnimations } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { useInView } from '../../../hooks';
import { useTheme } from '../../../infrastructure/Theme';
import { Tooltip } from '../../overlays/Tooltip';
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
  type ChartDatum,
  type ChartGrid,
  type ChartRenderer,
  type ChartSeries,
  type ChartRendererProps,
  type ChartCurve,
  type ChartSpec,
  type ChartXScale,
  type ChartTheme,
  type PlotGeometry,
  type PlotRect,
  type ResolvedChartSeries,
} from './types';

export type ChartSize = 'sm' | 'md' | 'lg';

export interface ChartLabels {
  /** Caption of the visually hidden data table. */
  dataTable: string;
  /** Header of the data table's category column. */
  categoryColumn: string;
}

export const DEFAULT_LABELS: ChartLabels = {
  dataTable: 'Chart data',
  categoryColumn: 'Category',
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
 * The reveal. One clip per series wipes its stroke and its fill open together,
 * so everything in a chart advances at the same rate by construction rather
 * than by matching two durations.
 */
const SWEEP_MS = 1000;

/**
 * Ceiling on how long the pre-entrance state may hide the marks.
 *
 * Comfortably past the slowest entrance (a many-series sweep plus its stagger),
 * so it only ever fires when something has genuinely gone wrong.
 */
const ENTER_TIMEOUT_MS = 4000;

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
  const dotDelay = dotCount > 1 ? Math.max(14, Math.min(90, DOT_SEQUENCE_MS / (dotCount - 1))) : 0;
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
            animation: { scaleX: { from: 0, to: 1 }, ease: 'outQuart', duration: SWEEP_MS },
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
const MARK_CONTRAST = 3;
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
  const isDark = luminance(bg) < 0.18;
  return clampToContrast(L, C, H, [bg], MARK_CONTRAST, isDark).hex;
}

export interface ChartProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
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
  dataTable?: boolean;
  /** Override the built-in user-facing strings. */
  labels?: Partial<ChartLabels> | null;
  /** Override or disable the bar entrance stagger. */
  animations?: AnimationTrigger[] | false;
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

/** "MRR rises from 12 to 48 over 6 points." — the fallback accessible summary. */
function deriveSummary(
  data: readonly ChartDatum[],
  series: readonly ResolvedChartSeries[],
  formatY: ((v: number) => string) | null | undefined,
): string {
  if (data.length === 0 || series.length === 0) return 'No data.';
  const fmt = (v: number) => (formatY ? formatY(v) : String(v));
  const parts = series.map((s) => {
    const values = data.map((row) => numeric(row, s.key)).filter((v): v is number => v !== null);
    if (values.length === 0) return `${s.label} has no values`;
    const first = values[0];
    const last = values[values.length - 1];
    const direction = last > first ? 'rises' : last < first ? 'falls' : 'holds';
    return `${s.label} ${direction} from ${fmt(first)} to ${fmt(last)}`;
  });
  return `${parts.join('; ')}. ${data.length} points.`;
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
          {s.label}
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
  crosshair,
  rect,
  row,
  xKey,
  series,
  formatX,
  formatY,
}: {
  x: number;
  y: number | null;
  crosshair: boolean;
  rect: PlotRect;
  row: ChartDatum;
  xKey: string;
  series: readonly ResolvedChartSeries[];
  formatX?: (value: unknown) => string;
  formatY?: (value: number) => string;
}) {
  return (
    <>
      {crosshair && (
        <span className={styles.crosshair} style={{ left: x, top: rect.y, height: rect.height }} />
      )}
      <Tooltip.Root open delayDuration={0}>
        <Tooltip.Trigger asChild>
          <span
            className={styles.anchor}
            style={{ left: x, top: y ?? rect.y }}
            aria-hidden="true"
          />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" sideOffset={8}>
          <span className={styles.tipHeading}>
            {formatX ? formatX(row[xKey]) : String(row[xKey] ?? '')}
          </span>
          {series.map((s) => {
            const v = numeric(row, s.key);
            return (
              <span key={s.key} className={styles.tipRow}>
                <span className={styles.swatch} style={{ background: s.color }} />
                {s.label}
                <span className={styles.tipValue}>
                  {v === null ? '—' : formatY ? formatY(v) : String(v)}
                </span>
              </span>
            );
          })}
        </Tooltip.Content>
      </Tooltip.Root>
    </>
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
    stacked: false,
    aspect: 2,
    height: null,
    hideCaption: false,
    dataTable: true,
    palette: null,
    formatX: null,
    formatY: null,
    labels: null,
    summary: null,
    renderer: null,
  },
  moveProps: ['data', 'x', 'series', 'caption', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const plotRef = React.useRef<HTMLDivElement>(null);
    // Hold the entrance until the chart is actually on screen. A chart far down
    // the page would otherwise play its stagger unseen and, being one-shot, have
    // nothing left to show by the time the reader arrives.
    // 0.8, not a delay. A delay decouples the animation from what the reader is
    // actually looking at — scroll fast and it still plays off-screen. Waiting
    // until most of the plot is on screen means the entrance starts when the
    // chart is genuinely being looked at.
    const { ref: inViewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.8 });
    // Tracks whether the entrance has played, so the pre-entrance CSS can be
    // dropped afterwards.
    const [entered, setEntered] = React.useState(false);
    const measuredRef = useMergedRef(viewportRef, inViewRef);
    const { width, height } = useMeasuredSize(viewportRef);
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
    const plotReady = width > 0 && height > 0 && inView;
    // Fail-open bound. `data-enter="pending"` hides the marks until the entrance
    // reports completion, so a callback that never arrives — an interrupted or
    // failed animation — would leave the chart blank. Lift the pre-entrance
    // state unconditionally once the longest possible entrance has had time to
    // run. A chart must never be able to hide its own data.
    React.useEffect(() => {
      if (!plotReady || entered) return;
      const timer = setTimeout(() => setEntered(true), ENTER_TIMEOUT_MS);
      return () => clearTimeout(timer);
    }, [plotReady, entered]);

    // Only line and area series render dots, so that is what the stagger spans.
    const dotCount = props.dots
      ? props.data.length * props.series.filter((x) => x.type !== 'bar').length
      : 0;
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

        const size = props.size as ChartSize;
        const labels = { ...DEFAULT_LABELS, ...(props.labels ?? {}) };
        const tokens = theme.tokens as unknown as Record<string, string>;
        const token = (name: string) => tokens[name] ?? '';

        const reducedMotion =
          typeof window !== 'undefined' &&
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Hide the marks before the entrance ONLY when an entrance is really
        // coming. Reduced motion makes `staggerAnimate` bail, and
        // `animations={false}` removes the trigger — in either case the CSS must
        // not apply, or the chart would render permanently blank.
        const willAnimate = props.animations !== false && !reducedMotion && !entered;

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

        const hoveredRow = hovered !== null ? props.data[hovered] : null;
        const anchorLeft = geometry && hovered !== null ? geometry.x[hovered] : 0;
        const anchorTop = geometry && hovered !== null && geometry.y ? geometry.y[hovered] : null;
        const summary = props.summary ?? deriveSummary(props.data, resolved, formatY);
        const showTable = props.dataTable !== false;

        return (
          <figure
            {...attrs}
            {...spRest}
            ref={ref as React.Ref<HTMLElement>}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...(props.style as React.CSSProperties), ...(spStyle as React.CSSProperties) }}
            data-size={size}
            data-grid={props.grid as string}
            aria-labelledby={captionId}
          >
            <figcaption
              id={captionId}
              className={styles.caption}
              data-hidden={props.hideCaption ? '' : undefined}
            >
              {props.caption}
            </figcaption>

            <div ref={measuredRef} className={styles.viewport} style={sizing}>
              <div
                ref={plotRef}
                className={styles.plot}
                data-enter={willAnimate ? 'pending' : undefined}
                onPointerMove={onPointerMove}
                onPointerLeave={() => setHovered(null)}
                role="img"
                aria-label={summary}
                aria-describedby={showTable ? tableId : undefined}
              >
                {width > 0 && height > 0 ? (
                  <Renderer
                    spec={chartSpec}
                    theme={chartTheme}
                    width={width}
                    height={height}
                    onPlotGeometry={handleGeometry}
                  />
                ) : null}

                {canHover && hoveredRow && geometry && (
                  <HoverOverlay
                    x={anchorLeft}
                    y={anchorTop}
                    // A vertical line through a pie says nothing; a renderer that
                    // owns hit-testing is not laid out along an axis.
                    crosshair={!geometry.hitTest}
                    rect={geometry.rect}
                    row={hoveredRow}
                    xKey={props.x}
                    series={resolved}
                    formatX={formatX}
                    formatY={formatY}
                  />
                )}
              </div>
            </div>

            {props.legend !== false &&
              (isPie ? (
                <Legend series={sliceLegend(props.data, props.x, chartTheme.series)} />
              ) : (
                <Legend series={resolved} />
              ))}

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
