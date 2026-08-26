import { Chart } from "move";

/**
 * Synthetic, and deliberately so — nothing here is drawn, so the shape of the
 * data is beside the point. Only how much of it there is matters.
 */
const readings = Array.from({ length: 150_000 }, (_, i) => ({
  reading: i,
  value: Math.sin(i / 4000) * 30 + 50,
}));

/**
 * Past a hundred thousand marks — rows times series — the built-in renderer
 * declines to draw and says so.
 *
 * It is a guard on the page rather than a tuning knob. What an SVG line costs
 * is its path string: a hundred thousand points is a 1.3MB `d` attribute and
 * renders comfortably, a million is 12.7MB and risks taking the tab with it.
 * It is also well past the point where more points can be seen at all — at this
 * count a hundred readings already share every pixel.
 *
 * The panel tells the reader the chart is too large. What to do about it is a
 * decision for whoever built the page, so that goes to the console instead, once,
 * in development: aggregate the data, or pass a `renderer`. The cap belongs to
 * the built-in renderer alone — a canvas or WebGL renderer rasterises rather
 * than building a path, so it is never capped.
 *
 * The array itself is the caller's cost and is already spent by the time Chart
 * sees it. What the guard saves is everything that would have come after.
 */
export default function OversizedSample() {
  return (
    <Chart
      caption="More points than the built-in renderer will draw"
      data={readings}
      x="reading"
      xScale="linear"
      series={[{ key: "value", type: "line", label: "Value" }]}
    />
  );
}
