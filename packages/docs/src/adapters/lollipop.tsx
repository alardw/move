// Lollipop adapter for Move's Chart
// =============================================================================
// A chart style Move does not ship, in about forty lines — the smallest honest
// demonstration that `ChartRenderer` is writable by hand, with no library
// behind it.
// =============================================================================

import type { ChartRenderer } from 'move';

export interface LollipopOptions {
  /** Print each value above its dot. */
  showValues?: boolean;
}

/**
 * Build a lollipop renderer. Call at module scope or inside `useMemo` — calling
 * it inline in JSX returns a new function identity every render.
 */
export function lollipopRenderer(options: LollipopOptions = {}): ChartRenderer {
  const { showValues = true } = options;

  return function LollipopPlot({ spec, theme, width, height }) {
    const series = spec.series[0];
    if (!series) return null;

    const values = spec.data.map((row) => Number(row[series.key]) || 0);
    const max = Math.max(...values, 1);
    const step = width / Math.max(1, values.length);
    const baseline = height - 4;
    // Reserve headroom for the value label above the tallest dot, or the tallest
    // one is drawn flush to the top edge and its label is clipped away.
    const headroom = showValues ? theme.fontSize + 14 : theme.pointRadius * 2 + 2;
    const y = (v: number) => baseline - (v / max) * (baseline - headroom);

    return (
      // A renderer DRAWS. Every element below is chart geometry, and there is no
      // Move component for a circle at a coordinate — the whole point of the
      // `renderer` seam is that this layer emits shapes. The built-in renderer
      // does the same, and escapes the scan only by living in the library
      // package rather than here.
      // dogfood-ignore: the plot surface
      <svg width={width} height={height}>
        {/* dogfood-ignore: the baseline */}
        <line x1={0} x2={width} y1={baseline} y2={baseline} stroke={theme.axis} strokeWidth={1} />
        {values.map((v, i) => {
          const cx = step * i + step / 2;
          return (
            // dogfood-ignore: one lollipop — stem, head, and its value
            <g key={i} data-series={series.key}>
              {/* dogfood-ignore: the stem */}
              <line
                x1={cx}
                x2={cx}
                y1={baseline}
                y2={y(v)}
                stroke={series.color}
                strokeWidth={theme.strokeWidth}
              />
              {/* dogfood-ignore: the head */}
              <circle cx={cx} cy={y(v)} r={theme.pointRadius * 2} fill={series.color} />
              {showValues && (
                // dogfood-ignore: the value above the head
                <text
                  x={cx}
                  y={y(v) - 10}
                  textAnchor="middle"
                  fill={theme.tick}
                  fontFamily={theme.font}
                  fontSize={theme.fontSize}
                >
                  {v}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };
}
