import { Chart } from "move";

const revenue = [
  { month: "Jan", mrr: 12 },
  { month: "Feb", mrr: 18 },
  { month: "Mar", mrr: 21 },
  { month: "Apr", mrr: 19 },
  { month: "May", mrr: 28 },
  { month: "Jun", mrr: 34 },
];

/**
 * The tooltip is on by default and is drawn by the shell, so it looks and
 * behaves the same for every renderer. `tooltip={false}` turns it off — useful
 * for a sparkline or a small chart read at a glance rather than inspected.
 */
export default function NoTooltipSample() {
  return (
    <Chart
      caption="Monthly recurring revenue"
      data={revenue}
      x="month"
      tooltip={false}
      grid="none"
      legend={false}
      series={[{ key: "mrr", type: "area", label: "MRR", color: "pink" }]}
      formatY={(v) => `$${v}k`}
    />
  );
}
