import { Chart } from "move";

const traffic = [
  { channel: "Organic", sessions: 4820 },
  { channel: "Paid", sessions: 2310 },
  { channel: "Referral", sessions: 1180 },
  { channel: "Social", sessions: 760 },
  { channel: "Email", sessions: 410 },
];

/**
 * `innerRadius` is a fraction of the radius — 0 is a full pie, around 0.6 reads
 * as a donut. The hole is real geometry rather than a disc drawn on top, so
 * whatever is behind the chart shows through and hit-testing correctly misses
 * the middle.
 */
export default function DonutSample() {
  return (
    <Chart
      caption="Sessions by channel"
      data={traffic}
      x="channel"
      aspect={1.6}
      innerRadius={0.6}
      series={[{ key: "sessions", type: "pie", label: "Sessions" }]}
      formatY={(v) => v.toLocaleString()}
    />
  );
}
