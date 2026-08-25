import { Chart } from "move";
import { lollipopRenderer } from "../../../../adapters/lollipop";

const load = [
  { hour: "00:00", cpu: 22 },
  { hour: "04:00", cpu: 31 },
  { hour: "08:00", cpu: 68 },
  { hour: "12:00", cpu: 84 },
  { hour: "16:00", cpu: 76 },
  { hour: "20:00", cpu: 45 },
];

/**
 * A renderer receives the normalised spec plus Move's tokens already resolved
 * to concrete values, and returns whatever draws them. Roughly forty lines buys
 * a chart style the library does not ship — see `src/adapters/lollipop.tsx`.
 *
 * It reads no CSS variables: the shell resolved them, which is what lets a
 * canvas renderer theme correctly too.
 */
const renderer = lollipopRenderer();

export default function RendererSample() {
  return (
    <Chart
      caption="CPU load — drawn by a custom lollipop renderer"
      data={load}
      x="hour"
      series={[{ key: "cpu", type: "line", label: "CPU %" }]}
      renderer={renderer}
      legend={false}
      aspect={3}
    />
  );
}
