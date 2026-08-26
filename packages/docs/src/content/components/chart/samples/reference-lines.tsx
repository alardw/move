import { Chart } from "move";

const revenue = [
  { month: "Jan", mrr: 62 },
  { month: "Feb", mrr: 71 },
  { month: "Mar", mrr: 68 },
  { month: "Apr", mrr: 84 },
  { month: "May", mrr: 92 },
  { month: "Jun", mrr: 105 },
];

/**
 * `rules` draws lines across the plot at fixed values.
 *
 * They are annotations, not series — they carry no data of their own. A number
 * on its own says little; the same number against the line it was meant to beat
 * says everything.
 *
 * A rule extends the value domain, so a target above everything achieved still
 * appears rather than falling off the top. They draw under the data and default
 * to a muted axis colour, because an annotation that competes with the thing it
 * annotates has the relationship backwards.
 */
export default function ReferenceLinesSample() {
  return (
    <Chart
      caption="Monthly recurring revenue against target"
      data={revenue}
      x="month"
      curve="monotone"
      dots
      formatY={(v) => `$${v}k`}
      rules={[
        { y: 120, label: "Target" },
        { y: 80, label: "Break-even", color: "orange" },
      ]}
      series={[{ key: "mrr", type: "area", label: "MRR" }]}
    />
  );
}
