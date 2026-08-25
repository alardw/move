import { Chart } from "move";

const revenue = [
  { month: "Jan", mrr: 12 },
  { month: "Feb", mrr: 18 },
  { month: "Mar", mrr: 21 },
  { month: "Apr", mrr: 19 },
  { month: "May", mrr: 28 },
  { month: "Jun", mrr: 34 },
  { month: "Jul", mrr: 41 },
  { month: "Aug", mrr: 48 },
];

export default function BasicSample() {
  return (
    <Chart
      caption="Monthly recurring revenue"
      data={revenue}
      x="month"
      series={[{ key: "mrr", type: "area", label: "MRR" }]}
      formatY={(v) => `$${v}k`}
    />
  );
}
