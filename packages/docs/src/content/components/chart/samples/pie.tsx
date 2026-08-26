import { Chart } from "move";

const traffic = [
  { channel: "Organic", sessions: 4820 },
  { channel: "Paid", sessions: 2310 },
  { channel: "Referral", sessions: 1180 },
  { channel: "Social", sessions: 760 },
  { channel: "Email", sessions: 410 },
];

/**
 * A pie is one series of parts, so its colours and legend run per ROW rather
 * than per series — each slice takes the next colour from the ramp, and the
 * legend names the rows.
 *
 * Hovering hit-tests by angle rather than snapping to a horizontal position,
 * and there is no crosshair: a vertical line through a pie says nothing.
 */
export default function PieSample() {
  return (
    <Chart
      caption="Sessions by channel"
      data={traffic}
      x="channel"
      aspect={1.6}
      series={[{ key: "sessions", type: "pie", label: "Sessions" }]}
      formatY={(v) => v.toLocaleString()}
    />
  );
}
