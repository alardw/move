import { useMemo } from "react";
import { Badge, Chart, Stack, Text } from "move";
import { rechartsRenderer } from "../../../../adapters/recharts";

const revenue = [
  { month: "Jan", mrr: 12, costs: 9 },
  { month: "Feb", mrr: 18, costs: 11 },
  { month: "Mar", mrr: 21, costs: 12 },
  { month: "Apr", mrr: 19, costs: 13 },
  { month: "May", mrr: 28, costs: 15 },
  { month: "Jun", mrr: 34, costs: 16 },
  { month: "Jul", mrr: 41, costs: 19 },
  { month: "Aug", mrr: 48, costs: 21 },
];

/**
 * The same shell, drawn by Recharts instead of Move's built-in renderer.
 *
 * Everything outside the plot is unchanged — caption, legend, sizing, the
 * accessible summary, and the hidden data table all still come from the shell,
 * so the accessibility contract holds for a renderer that knows nothing about it.
 * The tooltip is Move's, not Recharts' — the shell hit-tests and draws it, so it
 * is identical here and on the built-in renderer. `curve` and `dots` are Chart
 * props because every renderer can honour them; only genuinely Recharts-only
 * settings go to the adapter's own factory.
 */
const renderer = rechartsRenderer();

export default function RechartsSample() {
  const memoised = useMemo(() => renderer, []);

  return (
    <Stack gap="sm">
      <Stack direction="row" gap="sm" align="center">
        <Text weight="medium">Revenue vs costs</Text>
        <Badge size="sm" variant="soft" color="indigo">
          Recharts
        </Badge>
      </Stack>
      <Chart
        caption="Revenue vs costs"
        hideCaption
        data={revenue}
        x="month"
        series={[
          { key: "mrr", type: "area", label: "MRR" },
          { key: "costs", type: "line", label: "Costs", dash: true },
        ]}
        renderer={memoised}
        curve="monotone"
        dots
        formatY={(v) => `$${v}k`}
      />
    </Stack>
  );
}
