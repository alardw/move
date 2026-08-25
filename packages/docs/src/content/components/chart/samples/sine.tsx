import { Chart } from "move";

/** Two periods, sampled 64 times. */
const wave = Array.from({ length: 64 }, (_, i) => {
  const t = (i / 63) * 4 * Math.PI;
  return { t, sin: Math.sin(t), cos: Math.cos(t) * 0.6 };
});

/**
 * A continuous function, sampled and plotted on a linear x.
 *
 * Three things are worth noticing. Negative values are handled — the domain
 * covers them and the baseline sits at zero, not at the bottom of the plot.
 * `labelStride` thins 64 rows down to a readable handful of x labels. And
 * `curve="monotone"` smooths between samples without inventing peaks, so the
 * drawn wave never rises above a sample it was given.
 */
export default function SineSample() {
  return (
    <Chart
      caption="sin(t) and 0.6·cos(t)"
      data={wave}
      x="t"
      xScale="linear"
      curve="monotone"
      grid="both"
      formatX={(v) => `${(Number(v) / Math.PI).toFixed(1)}π`}
      formatY={(v) => v.toFixed(1)}
      series={[
        { key: "sin", type: "line", label: "sin", color: "violet" },
        { key: "cos", type: "line", label: "0.6·cos", dash: true, color: "lime" },
      ]}
    />
  );
}
