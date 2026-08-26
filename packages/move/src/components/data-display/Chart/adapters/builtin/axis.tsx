'use client';
// Chart — the axis frame
// =============================================================================
// The scaffold line, area and bar all hang off: one horizontal scale (category
// or linear), one linear y, a grid and ticks. It resolves the domain, the
// positions and the stacking, then hands each series to its own type's file to
// draw. Nothing here knows what a line or a bar looks like.
// =============================================================================

import * as React from 'react';
import type { ChartRendererProps } from '../../types';
import { bandScale, labelStride, linearScale, niceDomain, niceTicks } from '../../scales';
import {
  MARGIN,
  MAX_X_LABELS,
  TICK_COUNT,
  stackOffsets,
  valueAt,
  type SeriesFrame,
} from './shared';
import { AreaSeries } from './area';
import { BarSeries } from './bar';
import { LineSeries } from './line';
import { ScatterSeries } from './scatter';

export function AxisPlot({
  spec,
  theme,
  width,
  height,
  onPlotGeometry,
  activeIndex,
}: ChartRendererProps) {
  const { data, x, series, grid, stacked, dots, curve, xScale, rules, axes, formatX, formatY } =
    spec;

  // Namespaced so several charts on one page cannot collide on gradient ids.
  const uid = React.useId().replace(/:/g, '');
  // Without axes there is nothing to leave room FOR, so the drawing fills the
  // box — which is what makes a sparkline read at the size of a line of text.
  const margin = axes ? MARGIN : { top: 2, right: 2, bottom: 2, left: 2 };
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Margins are fixed, so the geometry is known before render. Report it so the
  // shell can hit-test for its tooltip. Band scale: points sit at band centres.
  const pointCount = data.length;
  React.useEffect(() => {
    if (innerWidth <= 0 || pointCount === 0) return;
    const scale = bandScale(pointCount, [margin.left, margin.left + innerWidth], 0.2);
    const values = data.map((row) => Number(row[x]));
    const useLinear = spec.xScale === 'linear' && values.every((v) => Number.isFinite(v));
    const lin = useLinear
      ? linearScale(
          [Math.min(...values), Math.max(...values)],
          [margin.left, margin.left + innerWidth],
        )
      : null;
    onPlotGeometry?.({
      rect: { x: margin.left, y: margin.top, width: innerWidth, height: innerHeight },
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
  // A reference line has to be inside the domain or it simply will not appear —
  // and a target ABOVE everything achieved is exactly the case worth drawing.
  for (const rule of rules) {
    if (!Number.isFinite(rule.y)) continue;
    min = Math.min(min, rule.y);
    max = Math.max(max, rule.y);
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;

  const [d0, d1] = niceDomain(min, max, TICK_COUNT);
  const ticks = niceTicks(d0, d1, TICK_COUNT);
  const toY = (v: number) => margin.top + innerHeight - ((v - d0) / (d1 - d0 || 1)) * innerHeight;

  const band = bandScale(data.length, [margin.left, margin.left + innerWidth], 0.2);

  // A linear x only makes sense if every row actually carries a number; one
  // non-numeric value and even spacing is the honest fallback.
  const xNumbers = data.map((row) => Number(row[x]));
  const linearX = xScale === 'linear' && xNumbers.every((v) => Number.isFinite(v));
  const xLinearScale = linearX
    ? linearScale(
        [Math.min(...xNumbers), Math.max(...xNumbers)],
        [margin.left, margin.left + innerWidth],
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
      {/* Grid + y ticks. Grid lines are independent of `axes` — a sparkline
          turns them off through `grid`, and a chart may want gridlines without
          tick labels. */}
      <g data-chart-part="axis-y">
        {ticks.map((t) => (
          <g key={t}>
            {(grid === 'horizontal' || grid === 'both') && (
              <line
                x1={margin.left}
                x2={margin.left + innerWidth}
                y1={toY(t)}
                y2={toY(t)}
                stroke={theme.grid}
                strokeWidth={1}
              />
            )}
            {axes && (
              <text
                x={margin.left - 8}
                y={toY(t)}
                textAnchor="end"
                dominantBaseline="middle"
                style={textStyle}
              >
                {formatY ? formatY(t) : t}
              </text>
            )}
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
                y1={margin.top}
                y2={margin.top + innerHeight}
                stroke={theme.grid}
                strokeWidth={1}
              />
            )}
            {axes && (
              <text
                x={label.at}
                y={margin.top + innerHeight + 14}
                textAnchor="middle"
                style={textStyle}
              >
                {label.text}
              </text>
            )}
          </g>
        ))}
      </g>

      {/* Baseline. Goes with the axes: without labels there is no scale for it
          to anchor, and it reads as a stray rule under a sparkline. */}
      {axes && (
        <line
          x1={margin.left}
          x2={margin.left + innerWidth}
          y1={zeroY}
          y2={zeroY}
          stroke={theme.axis}
          strokeWidth={1}
        />
      )}

      {/* Reference lines. Drawn UNDER the series: an annotation that obscures the
          data it annotates has the relationship backwards. Dashed, so it never
          reads as a flat series. */}
      <g data-chart-part="rules">
        {rules.map((rule, i) => {
          const y = toY(rule.y);
          if (y < margin.top || y > margin.top + innerHeight) return null;
          return (
            <g key={i}>
              <line
                x1={margin.left}
                x2={margin.left + innerWidth}
                y1={y}
                y2={y}
                stroke={rule.color}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              {rule.label && (
                <text
                  x={margin.left + innerWidth}
                  y={y - 4}
                  textAnchor="end"
                  style={{ ...textStyle, fill: rule.color }}
                >
                  {rule.label}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* Series — draw order follows declaration order */}
      {series.map((s, si) => {
        // Everything a type needs, resolved once here so no series file has to
        // know about scales, stacking or margins.
        const points: [number, number][] = [];
        const baseline: [number, number][] = [];
        data.forEach((row, i) => {
          const v = valueAt(row, s.key);
          if (v === null) return;
          const base = stacked && s.type !== 'line' ? offsets[i][si] : 0;
          points.push([xAt(i), toY(base + v)]);
          baseline.push([xAt(i), toY(base)]);
        });

        const frame: SeriesFrame = {
          series: s,
          index: si,
          theme,
          points,
          baseline,
          uid,
          plot: { x: margin.left, y: margin.top, width: innerWidth, height: innerHeight },
          dots,
          activeIndex,
        };

        if (s.type === 'bar') {
          return (
            <BarSeries
              key={s.key}
              frame={frame}
              data={data}
              offsets={offsets}
              stacked={stacked}
              bandAt={band}
              barWidth={barWidth}
              slot={stacked ? 0 : barSeries.indexOf(s)}
              toY={toY}
            />
          );
        }

        // Points only — the shared dot markers carry emphasis and the entrance.
        if (s.type === 'scatter') {
          return <ScatterSeries key={s.key} frame={{ ...frame, dots: true }} />;
        }

        if (s.type === 'area') {
          return (
            <AreaSeries key={s.key} frame={frame} curve={curve} stacked={stacked} zeroY={zeroY} />
          );
        }

        return <LineSeries key={s.key} frame={frame} curve={curve} />;
      })}
    </svg>
  );
}
