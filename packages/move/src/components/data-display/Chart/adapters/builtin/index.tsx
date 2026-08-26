'use client';
// Chart — built-in SVG renderer adapter
// =============================================================================
// Move's own drawing layer, and the default behind the `renderer` seam. Plain
// React SVG over the pure maths in `../../scales.ts` — no charting library, no
// d3, so `move` takes on no charting dependency.
//
// Split by DRAWING FAMILY rather than by chart type. Line, area and bar share
// one axis, scale and grid machine and live together in `axis.tsx`; a pie
// shares none of it and lives in `pie.tsx`. Anything both need is in
// `shared.ts`.
//
// An adapter that wraps a third-party library must NOT be imported from here or
// from `Chart.tsx` — only this dependency-free built-in is reachable by default.
// =============================================================================

import type { ChartRenderer } from '../../types';
import { AxisPlot } from './axis';
import { PiePlot } from './pie';

export const builtinRenderer: ChartRenderer = (props) => {
  // Dispatched before either family runs a hook: each is its own component with
  // its own hook scope, so switching a series between pie and line cannot
  // change the hook count here.
  if (props.spec.series.some((s) => s.type === 'pie')) return <PiePlot {...props} />;
  return <AxisPlot {...props} />;
};
