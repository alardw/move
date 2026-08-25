import { Chart } from "move";

const traffic = [
  { month: "Jan", organic: 210, paid: 120, referral: 60 },
  { month: "Feb", organic: 250, paid: 140, referral: 72 },
  { month: "Mar", organic: 240, paid: 190, referral: 65 },
  { month: "Apr", organic: 300, paid: 160, referral: 90 },
  { month: "May", organic: 340, paid: 210, referral: 104 },
  { month: "Jun", organic: 380, paid: 180, referral: 118 },
];

/**
 * Stacked areas sit on each other, so the top edge reads as the total while
 * each band shows its own share.
 *
 * Each band closes along the series beneath it rather than down to the axis —
 * the difference only shows once bands overlap, which is exactly when a chart
 * that closes to zero starts quietly misreporting.
 */
export default function StackedAreaSample() {
  return (
    <Chart
      caption="Sessions by channel"
      data={traffic}
      x="month"
      stacked
      curve="monotone"
      formatY={(v) => `${v}k`}
      series={[
        { key: "organic", type: "area", label: "Organic" },
        { key: "paid", type: "area", label: "Paid" },
        { key: "referral", type: "area", label: "Referral" },
      ]}
    />
  );
}
