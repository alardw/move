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
 * The default. Straight segments state exactly what was measured and nothing
 * between — the most honest reading of discrete samples.
 */
export default function CurveLinearSample() {
  return (
    <Chart
      caption="CPU load"
      data={load}
      x="hour"
      curve="linear"
      dots
      formatY={(v) => `${v}%`}
      series={[{ key: "cpu", type: "line", label: "CPU", color: "violet" }]}
    />
  );
}
