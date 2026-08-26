'use client';
// Chart — scatter series
// =============================================================================
// Points, and nothing joining them.
//
// The absence of a stroke is the statement: a line asserts that the values
// between two readings lie on it, which is exactly what a scatter declines to
// claim. So this is not "a line with the stroke turned off" — it is the mark
// that means the readings are independent samples.
//
// It reuses the shared point markers, which is what gives it hover emphasis and
// the entrance pop for free.
// =============================================================================

import { SeriesDots, type SeriesFrame } from './shared';

export function ScatterSeries({ frame }: { frame: SeriesFrame }) {
  const { series, theme, points, activeIndex } = frame;
  return (
    <g data-series={series.key}>
      <SeriesDots points={points} series={series} theme={theme} activeIndex={activeIndex} />
    </g>
  );
}
