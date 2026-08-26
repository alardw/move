import type { ComponentDocument } from "../types";
import type { HighlightItem } from "../../../components/HighlightList";
import type { RelatedItem } from "../../../components/RelatedComponents";

const highlights: HighlightItem[] = [
  {
    icon: "palette",
    text: "Reads your theme, not a chart palette — grid, axis, ticks and series colours all resolve from Move tokens, so a chart matches the app it sits in and follows a theme change with it.",
  },
  {
    icon: "plug",
    text: "One `renderer` prop is the whole drawing seam. Move ships an SVG renderer built in; swap in Recharts, Chart.js, or your own and everything around the plot stays exactly the same.",
  },
  {
    icon: "accessibility",
    text: "A text alternative for every chart — a generated summary on the plot plus a full data table for screen readers, built from your data rather than from the drawing, so it holds for any renderer.",
  },
  {
    icon: "layers",
    text: "Line, area, and bar over one axis machine, in any combination, stacked or overlaid.",
  },
];

const related: RelatedItem[] = [
  {
    to: "/components/table",
    name: "Table",
    reason:
      "The same numbers, read exactly. Chart shows the shape; Table shows the values.",
  },
  {
    to: "/components/stat",
    name: "Badge",
    reason:
      "For a single figure that needs no axis — a delta or status next to the headline number.",
  },
];

export const meta: ComponentDocument = {
  slug: "chart",
  synonyms: ["graph", "plot", "line chart", "bar chart", "area chart", "data viz", "visualization"],
  preview: { width: "full" },
  name: "Chart",
  tagline:
    "Line, area, bar and pie built in, with no charting dependency — or swap the drawing layer for Recharts, Highcharts or Chart.js. Your theme, tooltip and accessible alternative come from Move either way.",
  categories: ["data-display"],
  badges: [],
  highlights,
  related,
  importCode: `import { Chart } from 'move';`,
  keyboard: [
    {
      key: "—",
      action:
        "The plot is a static image. Its data is reachable as a table for screen readers; point-by-point keyboard navigation is not yet available.",
    },
  ],
  accessibilityLede:
    'The plot is `role="img"` with a generated summary as its accessible name, described by a visually hidden data table carrying every value. The `caption` prop names the chart and is required. Give a series `dash` when colour alone would be the only thing telling two series apart.',
};
