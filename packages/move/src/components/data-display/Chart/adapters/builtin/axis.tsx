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

export function AxisPlot({
  spec,
  theme,
  width,
  height,
  onPlotGeometry,
  activeIndex,
}: ChartRendererProps) {
  const { data, x, series, grid, stacked, dots, curve, xScale, formatX, formatY } = spec;

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
          plot: { x: MARGIN.left, y: MARGIN.top, width: innerWidth, height: innerHeight },
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
