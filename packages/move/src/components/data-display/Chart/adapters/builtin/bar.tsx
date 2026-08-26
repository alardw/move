'use client';
// Chart — bar series
// =============================================================================
// Rectangles from a baseline. The only axis type that does not use the reveal
// clip: bars grow from their own baseline instead, which is why they carry
// `data-bar` for the shell's stagger.
// =============================================================================

import type { ChartDatum } from '../../types';
import { emphasis, valueAt, type SeriesFrame } from './shared';

export function BarSeries({
  frame,
  data,
  offsets,
  stacked,
  bandAt,
  barWidth,
  slot,
  toY,
}: {
  frame: SeriesFrame;
  data: readonly ChartDatum[];
  offsets: number[][];
  stacked: boolean;
  /** Left edge of the band for row `i`. */
  bandAt: (i: number) => number;
  barWidth: number;
  /** Which lane this series takes when several bar series sit side by side. */
  slot: number;
  toY: (value: number) => number;
}) {
  const { series, index, theme, activeIndex } = frame;
  return (
    <g data-series={series.key}>
      {data.map((row, i) => {
        const v = valueAt(row, series.key);
        if (v === null) return null;
        const base = stacked ? offsets[i][index] : 0;
        const top = toY(base + v);
        const bottom = toY(base);
        return (
          <rect
            key={i}
            data-bar=""
            x={bandAt(i) + slot * barWidth}
            y={Math.min(top, bottom)}
            width={Math.max(0, barWidth - 1)}
            height={Math.max(0, Math.abs(bottom - top))}
            fill={series.color}
            opacity={emphasis(i, activeIndex)}
            stroke={theme.surface}
            strokeWidth={0}
          />
        );
      })}
    </g>
  );
}
