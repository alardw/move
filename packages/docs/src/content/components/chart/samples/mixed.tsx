import { Chart } from "move";

const traffic = [
  { day: "Mon", visits: 320, signups: 40 },
  { day: "Tue", visits: 410, signups: 62 },
  { day: "Wed", visits: 380, signups: 51 },
  { day: "Thu", visits: 460, signups: 78 },
  { day: "Fri", visits: 520, signups: 91 },
  { day: "Sat", visits: 290, signups: 33 },
  { day: "Sun", visits: 240, signups: 28 },
];

/** Line, area, and bar share one axis machine, so they combine freely. */
export default function MixedSample() {
  return (
    <Chart
      caption="Visits and signups"
      data={traffic}
      x="day"
      series={[
        { key: "visits", type: "bar", label: "Visits" },
        { key: "signups", type: "line", label: "Signups" },
      ]}
    />
  );
}
