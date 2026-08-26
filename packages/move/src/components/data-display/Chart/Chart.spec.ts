// Chart.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Chart',
  animationPatterns: ['listReveal'],
  // The pie sweeps by ANGLE, which means regenerating its geometry per frame
  // rather than transforming a finished shape — an anime.js proxy driven by
  // onRender, the same pattern Loader and Skeleton use. Declared so the
  // imperative path is visible rather than ad hoc.
  animationCapabilities: ['valueLoop'],
  componentClass: 'display' as const,
  category: 'data-display',
  choreographies: ['listReveal'],
  description:
    'Token-aware chart shell. Owns the frame, scales, accessible name, data-table alternative, legend, tooltip, hover emphasis and async status; delegates drawing to a swappable renderer. The built-in renderer is Move-owned React SVG over its own scale and path maths, so the package takes on no charting dependency; libraries plug in as optional adapters. Covers line, area, bar and scatter over a shared axis (category or linear x, three interpolations, stacking, reference lines, and `axes={false}` for a sparkline), plus pie and donut, which share none of that machinery and take their own path.',
  families: {
    behavior: ['display'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'figure',

  slots: [
    {
      name: 'root',
      element: 'figure',
      description:
        'Grouping element carrying component tokens and data-size. Labelled by the caption; groups plot, legend, and the data-table alternative into one figure.',
    },
    {
      name: 'caption',
      element: 'figcaption',
      description:
        'Visible chart title from the `caption` prop; supplies the accessible name via aria-labelledby. Visually hidden (still exposed) when hideCaption is set.',
    },
    {
      name: 'viewport',
      element: 'div',
      description:
        'Measured responsive box. A ResizeObserver reports width/height here; holds the aspect ratio when no explicit height is given.',
    },
    {
      name: 'plot',
      element: 'div',
      description:
        'Mount point the renderer draws into — <svg> for the built-in renderer, whatever the adapter produces otherwise. The shell never inspects its contents.',
    },
    {
      name: 'legend',
      element: 'ul',
      description:
        'Series legend rendered by the shell (not the renderer), so it is identical across adapters. Swatch colors come from the resolved ChartTheme.',
    },
    {
      name: 'description',
      element: 'div',
      description:
        'Visually hidden data table — the long text alternative for the plot, generated from data + series. Referenced by aria-describedby.',
    },
    {
      name: 'status',
      element: 'div',
      description:
        'role="status" region for the loading, error+retry, and empty states driven by `resource`. Replaces the plot; never overlays it.',
    },
  ],

  props: [
    {
      name: 'data',
      type: 'readonly Record<string, unknown>[]',
      moveSpecific: true,
      description: 'Row-oriented source data. One object per x position.',
    },
    {
      name: 'x',
      type: 'string',
      moveSpecific: true,
      description: 'Key in each row holding the x/category value.',
    },
    {
      name: 'series',
      type: 'ChartSeries[]',
      moveSpecific: true,
      description:
        'One entry per drawn series: { key, type, label?, color?, axis?, dash? }. Order fixes draw order and legend order.',
    },
    {
      name: 'caption',
      type: 'string',
      moveSpecific: true,
      description:
        'Chart title. Renders as the figcaption and supplies the accessible name — required, because a chart without one is unusable non-visually. Named `caption` rather than `title` so it cannot collide with the HTML title attribute.',
    },
    {
      name: 'hideCaption',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Visually hide the caption while keeping it in the accessibility tree.',
    },
    {
      name: 'summary',
      type: 'string',
      default: 'null',
      moveSpecific: true,
      description:
        'Optional one-line trend summary announced before the data table. When absent the shell derives one from the series (first/last value and direction).',
    },
    {
      name: 'renderer',
      type: 'ChartRenderer',
      default: 'null',
      moveSpecific: true,
      advanced: true,
      description:
        'Swap the drawing layer for a charting library. Falls back to the built-in SVG renderer when omitted.',
    },
    {
      name: 'resource',
      type: 'AsyncResource<unknown>',
      default: 'null',
      moveSpecific: true,
      description:
        'Async source status. Drives the loading, error, retry, and empty states so they are shell-owned rather than per-renderer.',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Scales tick font size, stroke width, point radius, and tick density.',
    },
    {
      name: 'grid',
      type: "'none' | 'horizontal' | 'vertical' | 'both'",
      default: "'horizontal'",
      moveSpecific: true,
      description: 'Which grid lines the renderer draws.',
    },
    {
      name: 'legend',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Render the series legend below the plot.',
    },
    {
      name: 'tooltip',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description:
        "Show every series' value at the hovered position. Rendered by the shell over the plot, so it looks and behaves the same for any renderer that reports its plot rect.",
    },
    {
      name: 'dots',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Mark each data point on line and area series.',
    },
    {
      name: 'rules',
      type: 'ChartRule[]',
      default: 'null',
      moveSpecific: true,
      description:
        'Reference lines across the plot — a target, a budget, an SLA, an average. Annotations rather than series: they carry no data of their own, they give the data something to be read against. A rule extends the value domain, so a target above everything achieved still appears. Ignored by a pie, which has no value axis.',
    },
    {
      name: 'axes',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description:
        'Draw the tick labels and baseline. Off makes a sparkline: the margins collapse with them, so the drawing fills the box. Pair with grid="none", legend={false} and tooltip={false}.',
    },
    {
      name: 'innerRadius',
      type: 'number',
      default: '0',
      moveSpecific: true,
      description:
        'Hole size for a pie, as a fraction of the radius. 0 is a full pie, around 0.6 reads as a donut. Ignored by every other series type.',
    },
    {
      name: 'xScale',
      type: "'category' | 'linear'",
      default: "'category'",
      moveSpecific: true,
      description:
        'How x positions are derived. `category` spaces rows evenly by index; `linear` places each at its own numeric x, which is what unevenly sampled or time-series data needs — a category axis would draw equal gaps between unequal intervals. Timestamps are numbers: pass epoch milliseconds and a `formatX`. Falls back to `category` if any x value is not finite.',
    },
    {
      name: 'curve',
      type: "'linear' | 'monotone' | 'step'",
      default: "'linear'",
      moveSpecific: true,
      description:
        'How line and area paths travel between points. `monotone` smooths without inventing peaks the data does not contain.',
    },
    {
      name: 'stacked',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Stack bar and area series sharing an axis instead of overlaying them.',
    },
    {
      name: 'aspect',
      type: 'number',
      default: '2',
      moveSpecific: true,
      description: 'Width-to-height ratio for the viewport. Ignored when `height` is set.',
    },
    {
      name: 'height',
      type: 'number | string',
      default: 'null',
      moveSpecific: true,
      description: 'Explicit plot height. Overrides `aspect` when set.',
    },
    {
      name: 'palette',
      type: 'Color[]',
      default: 'null',
      moveSpecific: true,
      advanced: true,
      description:
        'Override the categorical series ramp with Move color names. Defaults to the theme-derived ramp.',
    },
    {
      name: 'formatX',
      type: '(value: unknown) => string',
      default: 'null',
      moveSpecific: true,
      description: 'Format x tick labels and the data-table header column.',
    },
    {
      name: 'formatY',
      type: '(value: number) => string',
      default: 'null',
      moveSpecific: true,
      description: 'Format y tick labels, data-table cells, and the derived summary.',
    },
    {
      name: 'dataTable',
      type: 'boolean | number',
      default: 'true',
      moveSpecific: true,
      advanced: true,
      description:
        'Render the visually hidden data table. A number sets the row count past which the table is dropped and the summary carries the chart alone (200 by default, following Highcharts, which stops exposing individual points at the same count). Turn it off outright only when an equivalent table is already on the page.',
    },
    {
      name: 'labels',
      type: 'Partial<ChartLabels>',
      default: 'null',
      moveSpecific: true,
      description: 'Override the built-in user-facing strings.',
    },
    {
      name: 'animations',
      type: 'AnimationTrigger[] | false',
      default: 'null',
      moveSpecific: true,
      description: 'Override or disable the series entrance animation.',
    },
    {
      name: 'entranceThreshold',
      type: "number | 'always'",
      default: '0.8',
      moveSpecific: true,
      description:
        "How much of the chart must be on screen before the entrance plays, as a fraction of its own height. 'always' drops the visibility gate and plays as soon as the chart can draw. The ask is capped against what the chart can actually reach, since one taller than the viewport can never satisfy a high fraction.",
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-grid', 'data-status'],
    ariaAttributes: ['aria-labelledby'],
    children: [
      { slot: 'caption', dataAttributes: ['data-hidden'] },
      {
        slot: 'viewport',
        children: [{ slot: 'plot', ariaAttributes: ['role', 'aria-label', 'aria-describedby'] }],
      },
      { slot: 'status', ariaAttributes: ['role', 'aria-live'] },
      { slot: 'legend' },
      { slot: 'description' },
    ],
  },

  controlled: null,
  keyboard: 'none' as const,
  focus: 'none' as const,
  formType: null,
  asChild: false,
  dismissBehavior: 'none' as const,

  animations: [
    {
      trigger: 'Plot.enter',
      // One parallel group. Each step carries its own `children` selector, which
      // is also what keeps their cancel refs apart in the engine — steps sharing
      // a target AND a selector cancel one another.
      sequence: [
        [
          {
            target: 'Plot',
            children: '[data-bar]',
            stagger: { delay: 70, from: 'first' },
            animation: { scaleY: { from: 0, to: 1 }, ease: 'quick', duration: 480 },
          },
          {
            target: 'Plot',
            children: '[data-sweep]',
            stagger: { delay: 140, from: 'first' },
            animation: { scaleX: { from: 0, to: 1 }, ease: 'outQuart', duration: 1000 },
          },
          {
            target: 'Plot',
            children: '[data-dot]',
            stagger: { delay: 25, from: 'first' },
            animation: { scale: [0, 1.7, 1], ease: 'outQuad', duration: 520 },
          },
        ],
      ],
      note: "Bars grow from the baseline, strokes and their fills wipe open left to right, and dots pop. Fires when the plot has been measured AND is far enough on screen (`entranceThreshold`, 80% by default) — not on mount, since a lifecycle enter is one-shot and would otherwise play off-screen. The pre-entrance state lives in CSS under [data-enter='pending'] so nothing paints before the seed lands; the shell clears it on completion, with a timeout bound so a failed entrance can never leave a chart blank. Everything that is not a bar is revealed by ONE clip per series, so a stroke and the fill beneath it ride the same animation and cannot drift; stroke-dashoffset was dropped because it advances by path length (up to 1.6x the chart width), cannot reveal a fill at all, and collides with a dashed series' stroke-dasharray. A renderer takes part by marking its output: [data-bar], [data-sweep], [data-dot]. One that marks nothing simply appears. The dot stagger is computed per chart from the real dot count — the selector matches every dot in the plot, so a fixed delay cannot serve both a 12-dot and a 48-dot chart.",
    },
  ],

  renderContracts: [
    {
      id: 'renderer-owns-plot',
      description:
        'The renderer receives { spec, theme, width, height } and returns a node mounted into the plot slot. The shell never reads back from that subtree.',
    },
    {
      id: 'requires-theme-provider',
      description:
        'Chart REQUIRES a ThemeProvider in the tree. It resolves tokens to values in JS rather than leaving them to CSS — which is what lets a canvas renderer honour the theme — so there is nothing to resolve without one. MoveRoot always supplies it; a bare <Chart> throws.',
    },
    {
      id: 'theme-resolved-in-shell',
      description:
        'The shell reads useTheme().theme.tokens once and passes a resolved ChartTheme of plain values. Renderers never read CSS custom properties or call getComputedStyle.',
    },
    {
      id: 'a11y-shell-owned',
      description:
        'Accessible name, summary, and the data-table alternative derive from data + series in the shell, so every renderer inherits the same accessibility contract.',
    },
    {
      id: 'legend-shell-owned',
      description:
        'The legend is DOM rendered by the shell, not by the renderer — it stays keyboard- and screen-reader-reachable even behind a canvas adapter.',
    },
    {
      id: 'scale-limits',
      description:
        'Every mark is a DOM node, and the hidden data table is a row per point — there is no downsampling or virtualisation. Charts of a few hundred points are comfortable; tens of thousands are not, and the honest answer is to aggregate before passing the data in. Axis labels already thin themselves (labelStride), the tick count is fixed, and the dot stagger spreads a fixed total rather than a fixed per-item delay, so none of those degrade with size.',
    },
    {
      id: 'built-in-renderer-declines-past-100k-points',
      description:
        'Rows times series past 100,000 renders the oversized status instead of the plot, with a development-only console warning naming the count and the way out. A guard on the page rather than a tuning knob: the cost of an SVG line is its path string, and at a million points that is a 12.7MB attribute for a drawing where every point already shares a pixel with a hundred others. The cap is the built-in renderer\u2019s alone — a `renderer` prop backed by canvas or WebGL rasterises instead of building a path, so it is never capped.',
    },
    {
      id: 'large-series-summarise-rather-than-thin',
      description:
        'A data table is the COMPLETE data or it is misleading, so past 200 rows it is dropped rather than sampled: a thinned table still reads as authoritative while an outlier between two kept rows has silently gone. The summary takes over, naming each series\u2019 peak and low and where they fall, which cannot lose an outlier the way a sample can. The drawing is untouched either way — every point stays in the path. The built-in renderer does stop drawing DOT MARKERS once consecutive dots would sit closer than their own width, since at that spacing they mark nothing and merely thicken the stroke; a scatter keeps its points, because there the points ARE the mark.',
    },
    {
      id: 'renderer-participation-markers',
      description:
        'A renderer opts into the shell\u2019s behaviour by MARKING its output, and gets nothing if it marks nothing \u2014 which is the graceful default, not a failure. `data-bar` / `data-sweep` / `data-dot` join the entrance; `data-mark` plus `data-active` join the hover emphasis; `onPlotGeometry` enables the tooltip and `hitTest` overrides how it is resolved. The built-in marks all of them; the Recharts adapter marks none, so those charts render correctly and simply appear without an entrance.',
    },
    {
      id: 'hover-emphasis-is-state',
      description:
        'The shell reports the hovered row via `activeIndex`; the renderer MARKS the matching element (`data-mark`, plus `data-active` when it is emphasised) and CSS does the dimming. State flows down, geometry stays in the renderer — the shell owns hit-testing but does not know where a mark landed. Emphasis is deliberately not an animation: a resting state that depends on one completing can be interrupted and stranded, which is not a state. A renderer that marks nothing simply has no hover emphasis. Note `data-active` is present when NOTHING is hovered as well as when this is the hovered one, so "pointer left" and "this one" are one instruction.',
    },
    {
      id: 'radial-tooltip-anchor',
      description:
        'A renderer may report `side` per anchor. An axis chart opens its tooltip BESIDE the crosshair, on whichever side of the midline has more room, and anchors it at the middle of the plot: a tooltip listing several series is taller than the space above a high point, so a vertical placement collides with the plot edge and flips down across the values it is describing. A radial renderer reports `side` itself and must open outward, or an anchor on the lower edge of a ring opens back across the chart it describes — worst on small pies.',
    },
    {
      id: 'status-replaces-plot',
      description:
        'When `resource` is loading, error, or empty, the status slot renders in place of the plot; the renderer is never invoked with absent data.',
    },
  ],

  integrationPoints: [
    {
      id: 'renderer',
      kind: 'library' as const,
      contract: 'ChartRenderer',
      default: 'builtin' as const,
      sample: 'recharts',
      description:
        "The drawing layer. Zero-config it uses Move's built-in SVG renderer; supply one to draw with Recharts, Chart.js, or anything else.",
    },
    {
      id: 'resource',
      kind: 'data' as const,
      contract: 'AsyncResource<unknown>',
      default: 'noop' as const,
      fixture: 'fakeAsyncSource',
      sample: 'async',
      description:
        'Async source for the chart data — drives the loading, error, retry, and empty states.',
    },
  ],

  // Only what CSS paints. The plot's colours and numerics (grid, axis, tick,
  // stroke width, font size, point radius, area opacity) resolve in JS into
  // `ChartTheme` instead — a canvas renderer has no CSS to read, and routing
  // them through custom properties would make it the one renderer that cannot
  // honour the theme.
  tokens: [
    {
      name: '--move-chart-caption',
      value: 'var(--move-fg-base)',
      slot: 'caption',
      description: 'Chart title color.',
    },
    {
      name: '--move-chart-label',
      value: 'var(--move-fg-muted)',
      slot: 'legend',
      description: 'Legend text color.',
    },
    {
      name: '--move-chart-crosshair',
      value: 'var(--move-border-emphasis)',
      slot: 'viewport',
      description: 'Vertical line marking the hovered position.',
    },
    {
      name: '--move-chart-font',
      value: 'var(--move-font-body)',
      slot: 'root',
      description: 'Typeface for all chart text.',
    },
    {
      name: '--move-chart-padding',
      value: 'var(--move-spacing-lg)',
      slot: 'plot',
      description:
        'Breathing room between the drawing and the edge of the plot. Read by the shell and passed to the renderer as a number, since a canvas renderer cannot resolve CSS.',
    },
    {
      name: '--move-chart-gap',
      value: 'var(--move-spacing-sm)',
      slot: 'root',
      description: 'Gap between caption, plot, and legend.',
    },
    {
      name: '--move-chart-legend-gap',
      value: 'var(--move-spacing-md)',
      slot: 'legend',
      description: 'Gap between legend entries.',
    },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'],

  labels: [
    {
      key: 'loading',
      default: 'Loading chart',
      description: 'Status text while resource is loading.',
    },
    {
      key: 'error',
      default: 'Could not load chart data',
      description: 'Status text when resource errors.',
    },
    { key: 'retry', default: 'Retry', description: 'Retry button in the error state.' },
    { key: 'empty', default: 'No data to display', description: 'Status text when data is empty.' },
    {
      key: 'oversized',
      default: 'Chart too large to display',
      description: 'Status text when the series is past what the built-in renderer draws.',
    },
    {
      key: 'dataTable',
      default: 'Chart data',
      description: 'Caption of the visually hidden data table.',
    },
    {
      key: 'seriesColumn',
      default: 'Series',
      description: 'Header of the data table series column.',
    },
  ],

  radixPrimitive: null,
  hasHook: true,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],

  componentDeps: ['Button', 'Text', 'Loader'] as string[],

  testing: {
    behaviors: [
      'Renders a figure containing a figcaption, a measured viewport, and the plot mount point.',
      'Defaults to size=md, grid=horizontal, legend=true, aspect=2, xScale=category, curve=linear, axes=true.',
      'Applies data-size, data-grid, and data-status to the root.',
      'Invokes the built-in renderer when no renderer prop is given.',
      'Invokes a supplied renderer with { spec, theme, width, height, onPlotGeometry, entrance, activeIndex } and mounts its output in the plot slot.',
      'Passes resolved token VALUES in ChartTheme — the renderer receives no CSS custom property strings.',
      'Assigns categorical series colors from the theme ramp in series order; a series `color` overrides its slot.',
      'palette overrides the derived ramp.',
      'Uses height when set and falls back to aspect otherwise.',
      'Renders one legend entry per series with its resolved swatch color; legend={false} omits the slot.',
      'A pie colours and legends per ROW rather than per series, from the same ramp the renderer walks.',
      'A scatter draws points with no connecting stroke.',
      'Renders the visually hidden data table from data + series; dataTable={false} omits it.',
      'Applies formatX and formatY to tick labels and data table cells.',
      'stacked={true} produces stacked offsets, and a stacked area closes along the series below rather than the axis.',
      'xScale="linear" places rows at their own numeric x; a non-finite value falls back to even spacing.',
      'rules draw reference lines and extend the value domain so a target above the data still appears.',
      'axes={false} removes tick labels and the baseline, and collapses the margins.',
      'Renders the status slot instead of the plot for loading, error, and empty resource states.',
      'The renderer is not invoked while resource is loading or errored.',
      'Error state renders the retry action when resource carries retry.',
      'Forwards className, style, and ref.',
    ],
    aria: [
      'The plot carries role="img".',
      'The root is labelled by the caption via aria-labelledby.',
      'The plot is described by the data table via aria-describedby.',
      'hideCaption keeps the caption in the accessibility tree while visually hiding it.',
      'A derived summary is announced when the summary prop is absent.',
      'The status slot is role="status" with aria-live="polite".',
      'Series remain distinguishable without color when dash is set (WCAG 1.4.1).',
      'Series colours clear 3:1 against the page background (WCAG 1.4.11), clamped with hue and chroma preserved.',
      'The tooltip carries its own Tooltip.Provider, so a bare Chart does not throw on hover.',
    ],
    animation: [
      'Entrance fires when the plot is measured AND 80% on screen, not on mount.',
      'Bars grow from the baseline in sequence; the dot stagger spreads a fixed total, so its duration does not grow with the point count.',
      'Strokes and their fills are revealed by ONE clip per series, so they cannot drift apart.',
      'A pie sweeps clockwise from twelve o\u2019clock, regenerating its arcs per frame (valueLoop).',
      'The pre-entrance state lives in CSS under [data-enter="pending"], so nothing paints before the seed lands, and a timeout lifts it if the entrance never reports back.',
      'animations={false} and reduced motion both skip the entrance — and neither disables hover emphasis, which is state rather than animation.',
      'A renderer that marks none of [data-bar]/[data-sweep]/[data-dot] renders without error and simply appears.',
    ],
  },
} satisfies ComponentSpec;
