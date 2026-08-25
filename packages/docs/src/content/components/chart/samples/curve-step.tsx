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
 * Each value holds until the next reading. Right when the quantity genuinely is
 * constant between samples — a pricing tier, a headcount, a feature flag —
 * rather than a continuous signal that was sampled.
 */
export default function CurveStepSample() {
  return (
    <Chart
      caption="CPU load"
      data={load}
      x="hour"
      curve="step"
      formatY={(v) => `${v}%`}
      series={[{ key: "cpu", type: "line", label: "CPU", color: "grape" }]}
    />
  );
}
