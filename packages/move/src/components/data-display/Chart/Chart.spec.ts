// Chart.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Chart',
  animationPatterns: ['listReveal'],
  componentClass: 'display' as const,
  category: 'data-display',
  choreographies: ['listReveal'],
  description:
    'Token-aware chart shell. Owns the frame, scales, accessible name, data-table alternative, legend, and async status; delegates drawing to a swappable renderer. The built-in renderer is Move-owned React SVG over its own scale and path math, so the package takes on no charting dependency; libraries plug in as optional adapters. v1 covers line, area, and bar, on a category or linear x.',
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
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      advanced: true,
      description:
        'Render the visually hidden data table. Turn off only when an equivalent table is already on the page.',
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
            children: '[data-draw]',
            stagger: { delay: 140, from: 'first' },
            animation: { 'stroke-dashoffset': { from: 1, to: 0 }, ease: 'outQuart', duration: 900 },
          },
          {
            target: 'Plot',
            children: '[data-sweep]',
            stagger: { delay: 140, from: 'first' },
            animation: { scaleX: { from: 0, to: 1 }, ease: 'outQuart', duration: 1200 },
          },
          {
            target: 'Plot',
            children: '[data-dot]',
            stagger: { delay: 25, from: 'first' },
            animation: { scale: [0, 1.7, 1], ease: 'outQuad', duration: 520 },
          },
        ],
      ],
      note: "Bars grow from the baseline, strokes draw on, area fills sweep in behind them and dots pop. Fires when the plot has been measured AND is 80% on screen — not on mount, since a lifecycle enter is one-shot and would otherwise play off-screen. The pre-entrance state lives in CSS under [data-enter='pending'] so nothing paints before the seed lands; the shell clears it on completion, with a timeout bound so a failed entrance can never leave a chart blank. A renderer takes part by marking its output: [data-bar], [data-draw], [data-sweep], [data-dot]. One that marks nothing simply appears. The dot stagger is computed per chart from the real dot count — the selector matches every dot in the plot, so a fixed delay cannot serve both a 12-dot and a 48-dot chart.",
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
      'Defaults to size=md, grid=horizontal, legend=true, aspect=2.',
      'Applies data-size, data-grid, and data-status to the root.',
      'Invokes the built-in renderer when no renderer prop is given.',
      'Invokes a supplied renderer with { spec, theme, width, height } and mounts its output in the plot slot.',
      'Passes resolved token VALUES in ChartTheme — the renderer receives no CSS custom property strings.',
      'Assigns categorical series colors from the theme ramp in series order; a series `color` overrides its slot.',
      'palette overrides the derived ramp.',
      'Uses height when set and falls back to aspect otherwise.',
      'Renders one legend entry per series with its resolved swatch color; legend={false} omits the slot.',
      'Renders the visually hidden data table from data + series; dataTable={false} omits it.',
      'Applies formatX and formatY to tick labels and data table cells.',
      'stacked={true} produces stacked offsets in the ChartSpec handed to the renderer.',
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
    ],
    animation: [
      'Series groups stagger in on mount in declaration order.',
      'Line and area strokes draw on from their measured path length.',
      'animations={false} disables the entrance.',
      'Reduced motion preference skips animations.',
      'A renderer that emits no [data-series] groups renders without error.',
    ],
  },
} satisfies ComponentSpec;
