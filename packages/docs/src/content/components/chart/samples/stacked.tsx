import { Chart } from "move";

const channels = [
  { month: "Jan", organic: 210, paid: 120, referral: 60 },
  { month: "Feb", organic: 250, paid: 140, referral: 72 },
  { month: "Mar", organic: 240, paid: 190, referral: 65 },
  { month: "Apr", organic: 300, paid: 160, referral: 90 },
  { month: "May", organic: 340, paid: 210, referral: 104 },
  { month: "Jun", organic: 380, paid: 180, referral: 118 },
];

/** `stacked` sits bar and area series on top of each other rather than overlaying. */
export default function StackedSample() {
  return (
    <Chart
      caption="Signups by channel"
      data={channels}
      x="month"
      stacked
      series={[
        { key: "organic", type: "bar", label: "Organic" },
        { key: "paid", type: "bar", label: "Paid" },
        { key: "referral", type: "bar", label: "Referral" },
      ]}
    />
  );
}
