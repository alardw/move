// Recharts adapter for Move's Chart
// =============================================================================
// A contract test as much as a feature: if `ChartRenderer` can carry Recharts
// without widening, the seam is real. If it cannot, better to learn it here
// than after the API is public.
//
// Lives in docs, not in `move`, so the library takes on no charting dependency.
// Promote it to `move` behind a subpath export (`move/adapters/recharts`) with
// recharts as an OPTIONAL peer if it ever ships.
// =============================================================================

import { useEffect } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartRenderer } from "move";

export interface RechartsOptions {
  /**
   * Bridge gaps where a series has no value, instead of breaking the line.
   *
   * Recharts-only: Move models a missing point as a break, and the built-in
   * renderer has no way to express this. Keeping it here rather than on `Chart`
   * means the dependence on Recharts is visible in your code, instead of a prop
   * that silently does nothing after a renderer swap.
   *
   * (`curve` used to live here. Once the built-in renderer learned monotone and
   * step interpolation it became portable, and moved to `<Chart curve>`.)
   */
  connectNulls?: boolean;
}

// Recharts' own axis sizing. The left gutter is the YAxis `width` we set; the
// bottom is XAxis' default height. Kept together so the reported plot rect and
// the chart margin cannot drift apart.
const Y_AXIS_WIDTH = 48;
const X_AXIS_HEIGHT = 30;
const MARGIN = { top: 8, right: 8, bottom: 0, left: 0 } as const;

/**
 * Build a renderer. Options are captured in the closure and typed here, so
 * `ChartProps` never grows an untyped passthrough bag.
 *
 * Call this at module scope or inside `useMemo` — calling it inline in JSX
 * returns a new function identity every render and remounts the plot.
 */
export function rechartsRenderer(options: RechartsOptions = {}): ChartRenderer {
  const { connectNulls = false } = options;

  return function RechartsPlot({ spec, theme, width, height, onPlotGeometry }) {
    const curve = spec.curve;
    // Recharts' animation is switched OFF, always. Two reasons, both real:
    //
    //  1. It restarts on every re-render, and the shell re-renders this on
    //     hover to drive the tooltip — so the draw-on never completed and the
    //     lines stayed invisible.
    //  2. It animates by interpolating `stroke-dasharray`, the same attribute a
    //     `dash` series uses for its pattern. The two overwrite each other.
    //
    // Move owns animation for every renderer; an adapter that brings its own
    // ends up with two motion systems in one component.

    const plotWidth = Math.max(0, width - Y_AXIS_WIDTH - MARGIN.right);
    const plotHeight = Math.max(0, height - MARGIN.top - X_AXIS_HEIGHT);
    const count = spec.data.length;
    // Recharts picks its category scale by content: a band scale once any bar
    // series exists, a point scale otherwise (first point on the left edge,
    // last on the right). Mirror that choice, or the shell's crosshair drifts
    // further from the drawn points at every step.
    const banded = spec.series.some((s) => s.type === "bar");

    // Report where we drew so Move's shell can hit-test for its own tooltip.
    // Recharts' <Tooltip> is deliberately not used: the shell's version is
    // Move-styled, consistent across renderers, and meets WCAG 1.4.13.
    useEffect(() => {
      if (plotWidth <= 0 || count === 0) return;
      const x = banded
        ? Array.from({ length: count }, (_, i) => Y_AXIS_WIDTH + ((i + 0.5) * plotWidth) / count)
        : Array.from({ length: count }, (_, i) =>
            count === 1 ? Y_AXIS_WIDTH + plotWidth / 2 : Y_AXIS_WIDTH + (i * plotWidth) / (count - 1),
          );
      onPlotGeometry?.({
        rect: { x: Y_AXIS_WIDTH, y: MARGIN.top, width: plotWidth, height: plotHeight },
        x,
      });
    }, [onPlotGeometry, plotWidth, plotHeight, count, banded]);

    const tick = {
      fill: theme.tick,
      fontSize: theme.fontSize,
      fontFamily: theme.font,
    };
    // Recharts mutates/sorts its data prop; spec.data is readonly.
    const data = [...spec.data];

    return (
      <ComposedChart
        width={width}
        height={height}
        data={data}
        margin={MARGIN}
      >
        {spec.grid !== "none" && (
          <CartesianGrid
            stroke={theme.grid}
            horizontal={spec.grid === "horizontal" || spec.grid === "both"}
            vertical={spec.grid === "vertical" || spec.grid === "both"}
          />
        )}
        <XAxis
          dataKey={spec.x}
          stroke={theme.axis}
          tick={tick}
          tickFormatter={spec.formatX ? (v) => spec.formatX!(v) : undefined}
        />
        <YAxis
          stroke={theme.axis}
          tick={tick}
          width={Y_AXIS_WIDTH}
          tickFormatter={spec.formatY ? (v) => spec.formatY!(Number(v)) : undefined}
        />
        {spec.series.map((s) => {
          const stackId = spec.stacked ? "stack" : undefined;
          if (s.type === "bar") {
            return (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color}
                stackId={stackId}
                isAnimationActive={false}
              />
            );
          }
          if (s.type === "area") {
            return (
              <Area
                key={s.key}
                type={curve}
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={theme.strokeWidth}
                strokeDasharray={s.dash ? "6 4" : undefined}
                fill={s.color}
                fillOpacity={theme.areaOpacity}
                stackId={stackId}
                dot={spec.dots ? { r: theme.pointRadius } : false}
                connectNulls={connectNulls}
                isAnimationActive={false}
              />
            );
          }
          return (
            <Line
              key={s.key}
              type={curve}
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={theme.strokeWidth}
              strokeDasharray={s.dash ? "6 4" : undefined}
              dot={spec.dots ? { r: theme.pointRadius } : false}
              connectNulls={connectNulls}
              isAnimationActive={false}
            />
          );
        })}
        {/* Move's shell renders its own legend above this one. */}
        <Legend content={() => null} />
      </ComposedChart>
    );
  };
}
