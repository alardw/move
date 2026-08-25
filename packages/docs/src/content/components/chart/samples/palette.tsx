import { Chart } from "move";

const regions = ["emea", "amer", "apac", "latam", "anz", "mena"] as const;

const usage = Array.from({ length: 8 }, (_, i) => {
  const row: Record<string, unknown> = { week: `W${i + 1}` };
  regions.forEach((r, j) => {
    row[r] = Math.round(40 + j * 14 + Math.sin(i * 0.9 + j) * 12 + i * (2 + j * 0.6));
  });
  return row;
});

/**
 * Series take colours from the categorical ramp in order. The order is chosen so
 * consecutive series sit far apart in hue — every neighbouring pair is at least
 * 113° apart — because the series a reader compares are usually the ones next to
 * each other in the legend.
 *
 * Each colour is also clamped to 3:1 against the page (WCAG 1.4.11) with its hue
 * and chroma preserved, so the ramp holds up in light and dark alike.
 */
export default function PaletteSample() {
  return (
    <Chart
      caption="Weekly active users by region"
      data={usage}
      x="week"
      curve="monotone"
      dots
      formatY={(v) => `${v}k`}
      series={regions.map((r) => ({
        key: r,
        type: "line" as const,
        label: r.toUpperCase(),
      }))}
    />
  );
}
