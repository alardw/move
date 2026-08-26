'use client';
// Chart — built-in SVG renderer adapter
// =============================================================================
// Move's own drawing layer, and the default behind the `renderer` seam. Plain
// React SVG over the pure math in `../scales.ts` — no charting library, no d3.
//
// One adapter per file in this folder. An adapter that wraps a third-party
// library must NOT be imported from here or from `Chart.tsx`: only this
// dependency-free built-in is reachable by default, so `move` never takes on a
// charting dependency for consumers who supply their own renderer.
//
// Margins are FIXED. Sizing the y gutter to the widest tick label requires
// measuring text, and the plot area depends on the gutter, which depends on the
// tick values, which depend on the plot area. That circularity is deferred; a
// generous fixed gutter is correct for the value ranges charts usually carry.
// =============================================================================

import * as React from 'react';
import type { ChartRenderer, ChartRendererProps, ResolvedChartSeries } from '../types';
import {
  arcCentroid,
  arcPath,
  areaPath,
  bandScale,
  labelStride,
  linePath,
  linearScale,
  niceDomain,
  niceTicks,
  pieLayout,
  sliceAt,
} from '../scales';

const MARGIN = { top: 8, right: 8, bottom: 22, left: 46 } as const;
const TICK_COUNT = 5;
const MAX_X_LABELS = 8;

/** Read a series value out of a row, coercing to a finite number or null. */
function valueAt(row: Record<string, unknown>, key: string): number | null {
  const raw = row[key];
  const n = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Running totals per row, so stacked series sit on top of each other. */
function stackOffsets(
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
function PiePlot({ spec, theme, width, height, onPlotGeometry }: ChartRendererProps) {
  const { data, series, innerRadius } = spec;
  const key = series[0]?.key ?? '';

  const cx = width / 2;
  const cy = height / 2;
  const outer = Math.max(0, Math.min(width, height) / 2 - theme.padding);
  const inner = Math.max(0, Math.min(0.95, innerRadius)) * outer;

  const values = data.map((row) => valueAt(row, key) ?? 0);
  const slices = pieLayout(values);

  React.useEffect(() => {
    if (outer <= 0 || slices.length === 0) return;
    const centres = slices.map((s) => arcCentroid(cx, cy, inner, outer, s));
    onPlotGeometry?.({
      rect: { x: cx - outer, y: cy - outer, width: outer * 2, height: outer * 2 },
      x: centres.map(([px]) => px),
      y: centres.map(([, py]) => py),
      // Angular, so the shell must not fall back to nearest-x snapping.
      hitTest: (px, py) => sliceAt(slices, cx, cy, inner, outer, px, py),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPlotGeometry, cx, cy, inner, outer, JSON.stringify(values)]);

  if (outer <= 0 || slices.length === 0) return null;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} focusable="false">
      <g data-series={key}>
        {slices.map((slice) => (
          <path
            key={slice.index}
            data-slice=""
            d={arcPath(cx, cy, inner, outer, slice.startAngle, slice.endAngle)}
            fill={theme.series[slice.index % theme.series.length]}
            stroke={theme.surface}
            strokeWidth={1}
          />
        ))}
      </g>
    </svg>
  );
}

export const builtinRenderer: ChartRenderer = ({ spec, theme, width, height, onPlotGeometry }) => {
  const { data, x, series, grid, stacked, dots, curve, xScale, formatX, formatY } = spec;

  // Dispatched BEFORE any hook in this function. A pie shares none of the axis
  // machinery, and PiePlot is a separate component with its own hook scope — so
  // switching a series between pie and line cannot change the hook count here,
  // which it would if this sat below the useId.
  if (series.some((s) => s.type === 'pie')) {
    return (
      <PiePlot
        spec={spec}
        theme={theme}
        width={width}
        height={height}
        onPlotGeometry={onPlotGeometry}
      />
    );
  }

  // Namespaced so several charts on one page cannot collide on gradient ids.
  const uid = React.useId().replace(/:/g, '');
  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  // Margins are fixed, so the geometry is known before render. Report it so the
  // shell can hit-test for its tooltip. Band scale: points sit at band centres.
  const pointCount = data.length;
  React.useEffect(() => {
    if (innerWidth <= 0 || pointCount === 0) return;
    const scale = bandScale(pointCount, [MARGIN.left, MARGIN.left + innerWidth], 0.2);
    const values = data.map((row) => Number(row[x]));
    const useLinear = spec.xScale === 'linear' && values.every((v) => Number.isFinite(v));
    const lin = useLinear
      ? linearScale(
          [Math.min(...values), Math.max(...values)],
          [MARGIN.left, MARGIN.left + innerWidth],
        )
      : null;
    onPlotGeometry?.({
      rect: { x: MARGIN.left, y: MARGIN.top, width: innerWidth, height: innerHeight },
      x: Array.from({ length: pointCount }, (_, i) => (lin ? lin(values[i]) : scale.center(i))),
    });
  }, [onPlotGeometry, innerWidth, innerHeight, pointCount, data, x, spec.xScale]);

  if (innerWidth <= 0 || innerHeight <= 0 || data.length === 0 || series.length === 0) return null;

  const offsets = stackOffsets(data, series, stacked);

  // Bars and areas are read against a baseline, so their domain always includes zero.
  const anchored = series.some((s) => s.type !== 'line');
  let min = anchored ? 0 : Infinity;
  let max = anchored ? 0 : -Infinity;
  data.forEach((row, i) => {
    series.forEach((s, si) => {
      const v = valueAt(row, s.key);
      if (v === null) return;
      const base = stacked && s.type !== 'line' ? offsets[i][si] : 0;
      const top = base + v;
      min = Math.min(min, top, base);
      max = Math.max(max, top, base);
    });
  });
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;

  const [d0, d1] = niceDomain(min, max, TICK_COUNT);
  const ticks = niceTicks(d0, d1, TICK_COUNT);
  const toY = (v: number) => MARGIN.top + innerHeight - ((v - d0) / (d1 - d0 || 1)) * innerHeight;

  const band = bandScale(data.length, [MARGIN.left, MARGIN.left + innerWidth], 0.2);

  // A linear x only makes sense if every row actually carries a number; one
  // non-numeric value and even spacing is the honest fallback.
  const xNumbers = data.map((row) => Number(row[x]));
  const linearX = xScale === 'linear' && xNumbers.every((v) => Number.isFinite(v));
  const xLinearScale = linearX
    ? linearScale(
        [Math.min(...xNumbers), Math.max(...xNumbers)],
        [MARGIN.left, MARGIN.left + innerWidth],
      )
    : null;
  /** Where row `i` sits horizontally, whichever scale is in play. */
  const xAt = (i: number) => (xLinearScale ? xLinearScale(xNumbers[i]) : band.center(i));
  const barSeries = series.filter((s) => s.type === 'bar');
  const groupCount = stacked ? 1 : Math.max(1, barSeries.length);
  const barWidth = band.bandwidth / groupCount;

  const stride = labelStride(data.length, MAX_X_LABELS);
  const zeroY = toY(Math.max(d0, Math.min(0, d1)));

  const textStyle: React.CSSProperties = {
    fontFamily: theme.font,
    fontSize: theme.fontSize,
    fill: theme.tick,
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} focusable="false">
      {/* Grid + y ticks */}
      <g data-chart-part="axis-y">
        {ticks.map((t) => (
          <g key={t}>
            {(grid === 'horizontal' || grid === 'both') && (
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + innerWidth}
                y1={toY(t)}
                y2={toY(t)}
                stroke={theme.grid}
                strokeWidth={1}
              />
            )}
            <text
              x={MARGIN.left - 8}
              y={toY(t)}
              textAnchor="end"
              dominantBaseline="middle"
              style={textStyle}
            >
              {formatY ? formatY(t) : t}
            </text>
          </g>
        ))}
      </g>

      {/* x labels + optional vertical grid.
          A linear x labels TICK VALUES at their own positions; a category x
          labels rows, thinned by stride so a dense axis stays readable. */}
      <g data-chart-part="axis-x">
        {(linearX
          ? niceTicks(Math.min(...xNumbers), Math.max(...xNumbers), MAX_X_LABELS - 2).map((t) => ({
              key: `t${t}`,
              at: xLinearScale!(t),
              text: formatX ? formatX(t) : String(t),
            }))
          : data
              .map((row, i) =>
                i % stride === 0
                  ? {
                      key: `c${i}`,
                      at: xAt(i),
                      text: formatX ? formatX(row[x]) : String(row[x] ?? ''),
                    }
                  : null,
              )
              .filter((v): v is { key: string; at: number; text: string } => v !== null)
        ).map((label) => (
          <g key={label.key}>
            {(grid === 'vertical' || grid === 'both') && (
              <line
                x1={label.at}
                x2={label.at}
                y1={MARGIN.top}
                y2={MARGIN.top + innerHeight}
                stroke={theme.grid}
                strokeWidth={1}
              />
            )}
            <text
              x={label.at}
              y={MARGIN.top + innerHeight + 14}
              textAnchor="middle"
              style={textStyle}
            >
              {label.text}
            </text>
          </g>
        ))}
      </g>

      {/* Baseline */}
      <line
        x1={MARGIN.left}
        x2={MARGIN.left + innerWidth}
        y1={zeroY}
        y2={zeroY}
        stroke={theme.axis}
        strokeWidth={1}
      />

      {/* Series — draw order follows declaration order */}
      {series.map((s, si) => {
        const points: [number, number][] = [];
        // Where this series' band SITS. For a stacked area that is the running
        // total beneath it, not the axis — closing to zero would overlap every
        // band below.
        const baseline: [number, number][] = [];
        data.forEach((row, i) => {
          const v = valueAt(row, s.key);
          if (v === null) return;
          const base = stacked && s.type !== 'line' ? offsets[i][si] : 0;
          points.push([xAt(i), toY(base + v)]);
          baseline.push([xAt(i), toY(base)]);
        });

        if (s.type === 'bar') {
          const slot = stacked ? 0 : barSeries.indexOf(s);
          return (
            <g key={s.key} data-series={s.key}>
              {data.map((row, i) => {
                const v = valueAt(row, s.key);
                if (v === null) return null;
                const base = stacked ? offsets[i][si] : 0;
                const top = toY(base + v);
                const bottom = toY(base);
                return (
                  <rect
                    key={i}
                    data-bar=""
                    x={band(i) + slot * barWidth}
                    y={Math.min(top, bottom)}
                    width={Math.max(0, barWidth - 1)}
                    height={Math.max(0, Math.abs(bottom - top))}
                    fill={s.color}
                  />
                );
              })}
            </g>
          );
        }

        return (
          <g key={s.key} data-series={s.key}>
            {/* ONE reveal for everything drawn in this series: the stroke, and the
                fill beneath it if there is one. Both ride the same clip, so
                there is nothing to keep in sync — only one thing is moving.

                Everything advances by x. A stroke-dashoffset draw-on advances
                by PATH LENGTH instead, which is up to 1.6x longer than the
                chart is wide, so a line animated that way falls behind anything
                animated by x. It also cannot touch a fill, and collides with a
                dashed series' stroke-dasharray.

                The clip sits on each PATH, never on the series group; clipping
                the group would take the bars with it. */}
            <clipPath id={`${uid}-sweep-${si}`}>
              <rect
                data-sweep=""
                x={MARGIN.left}
                y={MARGIN.top}
                width={innerWidth}
                height={innerHeight}
              />
            </clipPath>
            {s.type === 'area' && (
              <>
                {/* Fades out towards the baseline so the fill reads as a tint
                    under the line rather than a block competing with it, and so
                    overlapping areas stay legible. Applied as the path's fill,
                    so it follows whatever shape `curve` produced — linear,
                    monotone or step alike. */}
                <linearGradient id={`${uid}-fill-${si}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={theme.areaOpacity} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
                <path
                  data-area=""
                  d={areaPath(points, stacked ? baseline : zeroY, curve)}
                  fill={`url(#${uid}-fill-${si})`}
                  clipPath={`url(#${uid}-sweep-${si})`}
                />
              </>
            )}
            <path
              data-series-line=""
              clipPath={`url(#${uid}-sweep-${si})`}
              d={linePath(points, curve)}
              fill="none"
              stroke={s.color}
              strokeWidth={theme.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={s.dash ? '6 4' : undefined}
            />
            {dots &&
              points.map(([px, py], i) => (
                <circle key={i} data-dot="" cx={px} cy={py} r={theme.pointRadius} fill={s.color} />
              ))}
          </g>
        );
      })}
    </svg>
  );
};
