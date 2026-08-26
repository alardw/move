import { Chart } from "move";

/** Response time against payload size, one point per request sampled. */
/**
 * Response time against payload size — 44 sampled requests.
 *
 * Deliberately uneven on both axes: requests do not arrive at tidy intervals,
 * and the scatter in the y values is the relationship worth seeing. A tidy grid
 * of points would be a line chart wearing a disguise.
 */
const requests = (() => {
  // A small deterministic PRNG, so the sample looks sampled without being
  // random on every render.
  let seed = 20260826;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  return Array.from({ length: 44 }, () => {
    const kb = Math.round(6 + rand() * rand() * 180);
    const noise = (rand() - 0.5) * 90;
    const ms = Math.max(38, Math.round(58 + kb * 1.7 + noise));
    return { kb, ms };
  }).sort((a, b) => a.kb - b.kb);
})();

/**
 * Points, with nothing joining them.
 *
 * That absence is the point: a line asserts that the values between two
 * readings lie on it, which is exactly what a scatter declines to claim. Use it
 * when the rows are independent samples rather than a signal over time.
 *
 * It almost always wants `xScale="linear"`, since the x value is a measurement
 * rather than a category — spacing these evenly would hide the relationship
 * the chart exists to show.
 */
export default function ScatterSample() {
  return (
    <Chart
      caption="Response time by payload size"
      data={requests}
      x="kb"
      xScale="linear"
      grid="both"
      formatX={(v) => `${v}kB`}
      formatY={(v) => `${v}ms`}
      series={[{ key: "ms", type: "scatter", label: "Response", color: "grape" }]}
    />
  );
}
