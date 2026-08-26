'use client';
// Chart — area series
// =============================================================================
// A line with the ground beneath it filled in. The fill rides the same reveal
// clip as its stroke, so the two advance as one rather than as two animations
// that have to be kept in step.
// =============================================================================

import type { ChartCurve } from '../../types';
import { areaPath, linePath } from '../../scales';
import { SeriesDots, SeriesStroke, SweepClip, clipId, type SeriesFrame } from './shared';

export function AreaSeries({
  frame,
  curve,
  stacked,
  zeroY,
}: {
  frame: SeriesFrame;
  curve: ChartCurve;
  stacked: boolean;
  zeroY: number;
}) {
  const { series, index, theme, points, baseline, uid, plot, dots, activeIndex } = frame;
  const fillId = `${uid}-fill-${index}`;

  return (
    <g data-series={series.key}>
      <SweepClip uid={uid} index={index} plot={plot} />

      {/* Fades out towards the baseline so the fill reads as a tint under the
          line rather than a block competing with it, and so overlapping areas
          stay legible. Applied as the path's fill, so it follows whatever shape
          `curve` produced — linear, monotone or step alike. */}
      <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={series.color} stopOpacity={theme.areaOpacity} />
        <stop offset="100%" stopColor={series.color} stopOpacity={0} />
      </linearGradient>

      {/* Stacked bands close along the series BELOW them. Closing to zero would
          make every band overlap the ones under it — which still looks like a
          stacked chart while misreporting each band's share. */}
      <path
        data-area=""
        d={areaPath(points, stacked ? baseline : zeroY, curve)}
        fill={`url(#${fillId})`}
        clipPath={`url(#${clipId(uid, index)})`}
      />

      <SeriesStroke
        d={linePath(points, curve)}
        series={series}
        theme={theme}
        uid={uid}
        index={index}
      />
      {dots && (
        <SeriesDots points={points} series={series} theme={theme} activeIndex={activeIndex} />
      )}
    </g>
  );
}
