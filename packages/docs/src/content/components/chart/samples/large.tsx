import { Chart } from "move";
import { AMSTERDAM_HOURLY_C, SERIES_START } from "./amsterdam-temperature";

const readings = AMSTERDAM_HOURLY_C.map((celsius, hour) => ({ hour, celsius }));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const asMonth = (hour: unknown) => {
  const at = new Date(SERIES_START.getTime() + Number(hour) * 3_600_000);
  return `${MONTHS[at.getUTCMonth()]} ${String(at.getUTCFullYear()).slice(2)}`;
};

/**
 * Fourteen months of hourly air temperature — ten thousand real readings, drawn
 * whole.
 *
 * A chart holding ten thousand points costs about what one holding ten costs,
 * because the drawing never scaled with the readings: a line is a single path
 * however many points it passes through. Every reading is in that path, so the
 * cold snap and the summer peak are drawn at their true height rather than
 * being averaged away.
 *
 * What does change is what a person can take in. Dot markers stop drawing once
 * consecutive dots would sit closer together than their own width — at that
 * spacing they mark nothing and only thicken the stroke. And the hidden data
 * table gives way to the summary, because a table is the complete data or it
 * misleads: rather than thinning ten thousand rows to a readable length it
 * steps aside for a sentence naming each series' high and low and when they
 * fell. That sentence is what a screen reader announces here.
 *
 * The daily swing between night and afternoon is real, and at roughly a dozen
 * readings per pixel it is what gives the line its thickness — the band is the
 * data, not a heavier stroke.
 */
export default function LargeSample() {
  return (
    <Chart
      caption="Amsterdam air temperature, hourly for fourteen months"
      data={readings}
      x="hour"
      xScale="linear"
      formatX={asMonth}
      formatY={(v) => `${v}°C`}
      series={[{ key: "celsius", type: "line", label: "Temperature", color: "cyan" }]}
    />
  );
}
