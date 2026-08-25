import { Chart } from "move";

const traffic = [
  { day: "Mon", visits: 320 },
  { day: "Tue", visits: 410 },
  { day: "Wed", visits: 380 },
  { day: "Thu", visits: 460 },
  { day: "Fri", visits: 520 },
  { day: "Sat", visits: 290 },
  { day: "Sun", visits: 240 },
];

export default function LineSample() {
  return (
    <Chart
      caption="Visits this week"
      data={traffic}
      x="day"
      series={[{ key: "visits", type: "line", label: "Visits", color: "cyan" }]}
    />
  );
}
