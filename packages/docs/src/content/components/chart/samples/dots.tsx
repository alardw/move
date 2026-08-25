import { Chart } from "move";

const load = [
  { hour: "00", cpu: 22, memory: 41 },
  { hour: "04", cpu: 31, memory: 44 },
  { hour: "08", cpu: 68, memory: 59 },
  { hour: "12", cpu: 84, memory: 71 },
  { hour: "16", cpu: 76, memory: 66 },
  { hour: "20", cpu: 45, memory: 52 },
];

/**
 * `dots` marks every data point, which helps when readings are sparse or
 * irregular — it shows where a value was actually measured rather than where
 * the line happens to pass.
 */
export default function DotsSample() {
  return (
    <Chart
      caption="Resource use"
      data={load}
      x="hour"
      dots
      curve="monotone"
      formatY={(v) => `${v}%`}
      series={[
        { key: "cpu", type: "line", label: "CPU" },
        { key: "memory", type: "line", label: "Memory" },
      ]}
    />
  );
}
