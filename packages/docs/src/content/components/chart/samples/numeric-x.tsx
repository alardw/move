import { Chart } from "move";

/**
 * Deploys, at the times they actually happened — clustered in the morning,
 * then a long quiet stretch over lunch.
 */
const deploys = [
  { at: 9.0, duration: 4 },
  { at: 9.5, duration: 6 },
  { at: 10.0, duration: 5 },
  { at: 10.25, duration: 9 },
  { at: 10.5, duration: 7 },
  { at: 15.0, duration: 12 },
  { at: 16.0, duration: 8 },
];

const clock = (v: unknown) => {
  const h = Math.floor(Number(v));
  const m = Math.round((Number(v) - h) * 60);
  return `${h}:${String(m).padStart(2, "0")}`;
};

/**
 * `xScale="linear"` places each row at its own numeric x instead of spacing
 * rows evenly by index.
 *
 * It matters whenever samples are not evenly spaced. On the default category
 * axis these seven rows would sit at equal intervals, making the four-and-a-half
 * hour gap after 10:30 look exactly like the fifteen-minute gap before it — a
 * shape the data does not have. Here the cadence is real: a cluster of morning
 * deploys, then a long quiet stretch.
 *
 * Timestamps need no special support: they are numbers. Pass epoch
 * milliseconds and a `formatX` that renders them.
 */
export default function NumericXSample() {
  return (
    <Chart
      caption="Deploy duration by time of day"
      data={deploys}
      x="at"
      xScale="linear"
      dots
      grid="both"
      formatX={clock}
      formatY={(v) => `${v}m`}
      series={[{ key: "duration", type: "line", label: "Duration", color: "blue" }]}
    />
  );
}
