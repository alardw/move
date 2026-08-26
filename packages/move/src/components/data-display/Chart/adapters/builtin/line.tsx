'use client';
// Chart — line series
// =============================================================================
// The simplest mark: a stroke through the points, optionally marked at each
// reading. Everything structural comes from `shared.tsx`; only the geometry is
// this file's own.
// =============================================================================

import type { ChartCurve } from '../../types';
import { linePath } from '../../scales';
import { SeriesDots, SeriesStroke, SweepClip, type SeriesFrame } from './shared';

export function LineSeries({ frame, curve }: { frame: SeriesFrame; curve: ChartCurve }) {
  const { series, index, theme, points, uid, plot, dots, activeIndex } = frame;
  return (
    <g data-series={series.key}>
      <SweepClip uid={uid} index={index} plot={plot} />
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
