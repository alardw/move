// Demo-only fakes — NEVER shipped in the `move` bundle.
//
// A fixture stands in for a real data layer (fetch / React Query / SWR / an S3
// client) so docs samples run with no backend. It implements the *shape* a real
// service has — async, abortable, can fail — so a sample exercises the same
// loading / error / abort paths production code would. In your app you delete the
// fake and feed your real async state to `asyncResource.from(...)`; the Move
// wiring around it doesn't change.

export interface FakeAsyncSourceOptions<T> {
  /** The rows the fake "server" holds. */
  data: T[];
  /** Artificial latency (ms) so the loading state is visible. */
  delayMs?: number;
  /** Probability [0–1] a request rejects, so the error + retry path is demoable. */
  failRate?: number;
  /** Server-side filter; omit to always return everything. */
  filter?: (row: T, query: string) => boolean;
}

/**
 * Build a fake async "search service": `(query, signal?) => Promise<T[]>`.
 * Abortable so stale requests can be cancelled, and able to fail so error/retry
 * is demoable — exactly the surface a real fetch would have.
 */
export function fakeAsyncSource<T>(opts: FakeAsyncSourceOptions<T>) {
  const { data, delayMs = 450, failRate = 0, filter } = opts;
  return (query: string, signal?: AbortSignal): Promise<T[]> =>
    new Promise<T[]>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (Math.random() < failRate) {
          reject(new Error('Simulated network error'));
        } else {
          resolve(query && filter ? data.filter((row) => filter(row, query)) : data);
        }
      }, delayMs);
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
}
