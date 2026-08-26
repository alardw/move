'use client';
// Chart — built-in renderer: pie and donut
// =============================================================================
// A pie shares NOTHING with the axis renderer — no scales, no grid, no ticks —
// so it lives in its own file rather than as conditionals threaded through code
// that assumes a horizontal axis.
//
// Colours come from `theme.series` PER SLICE rather than per series, which is
// what a pie means: one series, many parts. The shell's legend reads the same
// ramp in the same order, so the two agree without passing colours between them.
// =============================================================================

import * as React from 'react';
import { animate } from 'animejs';
import { CHART_SWEEP_MS, type ChartRendererProps } from '../../types';
import { arcPath, pieLayout, sliceAnchor, sliceAt } from '../../scales';
import { markAttrs, valueAt } from './shared';

/** The pie renderer: slices, labels, and its own angular entrance. */
export function PiePlot({
  spec,
  theme,
  width,
  height,
  onPlotGeometry,
  entrance,
  activeIndex,
}: ChartRendererProps) {
  // 1 is fully drawn. Starts at 0 when an entrance is expected, so the very
  // first painted frame is already the start state — no flash of the finished
  // chart, and none of the seed-after-paint problem the CSS reveals have.
  const [progress, setProgress] = React.useState(entrance ? 0 : 1);

  React.useEffect(() => {
    if (entrance !== 'run' || theme.reducedMotion) {
      if (entrance !== 'pending') setProgress(1);
      return;
    }
    // A clockwise sweep from twelve o'clock — the convention every charting
    // library uses, and the honest one for a pie: the ANGLE is the data, so
    // watching it fill shows each share arriving at its true size. Scaling the
    // ring from the centre would animate radius, which carries no meaning when
    // every slice shares it.
    //
    // It cannot be a CSS transform like the shell's other reveals, because the
    // geometry has to be regenerated as the angle grows — hence the anime.js
    // proxy-and-onRender pattern Loader and Skeleton use, which is what
    // `animationCapabilities: ['valueLoop']` in the spec declares.
    const value = { t: 0 };
    const anim = animate(value, {
      t: 1,
      duration: CHART_SWEEP_MS,
      ease: 'outQuart',
      onRender: () => setProgress(value.t),
    });
    return () => {
      anim.pause();
    };
  }, [entrance, theme.reducedMotion]);

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
    // Anchor just OUTSIDE the ring along each slice's mid-angle, and open away
    // from the chart — a tooltip over the pie hides the thing it describes.
    const GAP = 4;
    const anchors = slices.map((slice) => sliceAnchor(cx, cy, outer, GAP, slice));
    onPlotGeometry?.({
      rect: { x: cx - outer, y: cy - outer, width: outer * 2, height: outer * 2 },
      x: anchors.map((a) => a.x),
      y: anchors.map((a) => a.y),
      side: anchors.map((a) => a.side),
      // Angular, so the shell must not fall back to nearest-x snapping.
      hitTest: (px, py) => sliceAt(slices, cx, cy, inner, outer, px, py),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPlotGeometry, cx, cy, inner, outer, JSON.stringify(values)]);

  if (outer <= 0 || slices.length === 0) return null;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} focusable="false">
      <g data-series={key}>
        {slices.map((slice) => {
          // Reveal by cumulative angle, so the sweep runs continuously across
          // slice boundaries instead of each wedge growing on its own.
          // pieLayout runs clockwise from twelve o'clock.
          const revealed = -Math.PI / 2 + progress * Math.PI * 2;
          const end = Math.min(slice.endAngle, revealed);
          if (end <= slice.startAngle) return null;
          return (
            <path
              key={slice.index}
              data-slice=""
              {...markAttrs(slice.index, activeIndex)}
              d={arcPath(cx, cy, inner, outer, slice.startAngle, end)}
              fill={theme.series[slice.index % theme.series.length]}
              stroke={theme.surface}
              strokeWidth={1}
            />
          );
        })}
      </g>
    </svg>
  );
}
