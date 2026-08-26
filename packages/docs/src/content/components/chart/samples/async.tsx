import { useEffect, useState } from "react";
import { Chart, asyncResource } from "move";
import type { AsyncResource } from "move";

type Row = { month: string; mrr: number };

const revenue: Row[] = [
  { month: "Jan", mrr: 12 },
  { month: "Feb", mrr: 18 },
  { month: "Mar", mrr: 21 },
  { month: "Apr", mrr: 19 },
  { month: "May", mrr: 28 },
  { month: "Jun", mrr: 34 },
];

/** Stands in for a real request; a consumer would map React Query or SWR here. */
function useFakeSource(): AsyncResource<Row[]> {
  const [state, setState] = useState<AsyncResource<Row[]>>(asyncResource.loading());
  useEffect(() => {
    const timer = setTimeout(() => setState(asyncResource.success(revenue)), 1400);
    return () => clearTimeout(timer);
  }, []);
  return state;
}

/**
 * `resource` drives the loading, error and empty states.
 *
 * They are rendered by the shell rather than by the renderer, so every adapter
 * reports them identically — and the renderer is never invoked with data that
 * is not there. `asyncResource.from()` maps the flat
 * `{ data, error, isLoading, refetch }` shape React Query and SWR return onto
 * this in one line.
 */
export default function AsyncSample() {
  const resource = useFakeSource();

  return (
    <Chart
      caption="Monthly recurring revenue"
      data={resource.status === "success" ? resource.data : []}
      x="month"
      resource={resource}
      formatY={(v) => `$${v}k`}
      series={[{ key: "mrr", type: "area", label: "MRR" }]}
    />
  );
}
