import { Chart } from "move";

const budget = [
  { quarter: "Q1", planned: 120, actual: 108 },
  { quarter: "Q2", planned: 140, actual: 151 },
  { quarter: "Q3", planned: 135, actual: 129 },
  { quarter: "Q4", planned: 160, actual: 172 },
];

/**
 * Every chart carries its own text alternative. The plot is `role="img"` with a
 * generated summary, and a full data table sits beside it — visually hidden,
 * available to a screen reader. Both are built from `data` and `series` by the
 * shell, so they are identical no matter which renderer draws.
 *
 * `dash` gives the second series a non-colour differentiator, so the two stay
 * distinguishable without colour perception.
 */
export default function AccessibleSample() {
  return (
    <Chart
      caption="Budget: planned vs actual"
      data={budget}
      x="quarter"
      series={[
        { key: "planned", type: "line", label: "Planned", dash: true },
        { key: "actual", type: "line", label: "Actual" },
      ]}
      formatY={(v) => `€${v}k`}
    />
  );
}
