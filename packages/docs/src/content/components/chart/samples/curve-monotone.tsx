import { Chart } from "move";

const load = [
  { hour: "00", cpu: 22 },
  { hour: "04", cpu: 31 },
  { hour: "08", cpu: 68 },
  { hour: "12", cpu: 84 },
  { hour: "16", cpu: 46 },
  { hour: "20", cpu: 52 },
];

/**
 * Monotone cubic interpolation. It smooths without inventing peaks: between any
 * two points the curve never rises above the higher or falls below the lower, so
 * it cannot imply a value the data does not contain. A plain spline would
 * overshoot and do exactly that.
 */
export default function CurveMonotoneSample() {
  return (
    <Chart
      caption="CPU load"
      data={load}
      x="hour"
      curve="monotone"
      dots
      formatY={(v) => `${v}%`}
      series={[{ key: "cpu", type: "line", label: "CPU", color: "teal" }]}
    />
  );
}
