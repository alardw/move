// nasa-apod.ts — the source-access RUNTIME for NASA's Astronomy Picture of the Day.
//
// Generated from ./nasa-apod.api.ts (the ApiSpec). This is the pattern-agnostic api layer:
// it fetches, authenticates from env, serializes params, and normalizes errors — returning the
// source's NATIVE shape (`Apod`), never a pattern's roles. Mapping native → roles is the adapter's
// job (src/adapters). No Move imports, no AsyncResource here — this file is reusable across adapters.

// ── The native response shape ────────────────────────────────────────────────
// One `Apod`. A date range (start_date/end_date) or a count returns an ARRAY of these; a single
// date (or no params → today) returns one object. Optional fields (`?`) are omitted by the service.
export interface Apod {
  date: string; // YYYY-MM-DD
  title: string;
  explanation: string;
  media_type: 'image' | 'video';
  url: string; // image URL, or the video embed URL when media_type === 'video'
  hdurl?: string; // high-res image; omitted for videos / when unavailable
  copyright?: string; // present only when the image is not public domain
  thumbnail_url?: string; // video still; only when media_type === 'video' and thumbs=true
  service_version: string; // e.g. 'v1'
}

// ── Endpoint params (from the ApiSpec) ───────────────────────────────────────
// `date` is mutually exclusive with `start_date`/`end_date` and with `count`; the service
// enforces that — this layer just serializes whatever it's handed.
export interface ApodParams {
  date?: string; // YYYY-MM-DD — a single day (defaults to today when omitted)
  start_date?: string; // YYYY-MM-DD — range start
  end_date?: string; // YYYY-MM-DD — range end (defaults to today)
  count?: number; // N random pictures (1–100)
  thumbs?: boolean; // include thumbnail_url for videos
}

// ── The api surface the adapter binds to ─────────────────────────────────────
// `apod()` always resolves to an `Apod[]`: the service returns a single object for a single date
// and an array for a range/count — a single date is just a one-element window, so we normalize to
// an array so the adapter can `rows.map(...)` uniformly. Field shapes stay fully native.
export interface NasaApodApi {
  apod(params?: ApodParams): Promise<Apod[]>;
}

// ── Config / secrets ─────────────────────────────────────────────────────────
export interface NasaApodConfig {
  /** api.nasa.gov key. Defaults to `import.meta.env.VITE_NASA_API_KEY`, then NASA's DEMO_KEY. */
  apiKey?: string;
  /** Override the base URL (tests). Defaults to the ApiSpec's transport baseUrl. */
  baseUrl?: string;
  /** Inject a fetch (tests). Defaults to global `fetch`. */
  fetch?: typeof fetch;
}

const BASE_URL = 'https://api.nasa.gov/planetary';

// Secret from env only — never inlined. DEMO_KEY is NASA's documented rate-limited dev fallback.
function resolveApiKey(explicit?: string): string {
  if (explicit) return explicit;
  const fromEnv = import.meta.env?.VITE_NASA_API_KEY;
  return fromEnv && fromEnv.length > 0 ? fromEnv : 'DEMO_KEY';
}

/** Thrown on a non-2xx response so the adapter's AsyncResource can resolve to the error state. */
export class NasaApodError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'NasaApodError';
  }
}

function buildQuery(apiKey: string, params: ApodParams): string {
  const q = new URLSearchParams({ api_key: apiKey });
  if (params.date) q.set('date', params.date);
  if (params.start_date) q.set('start_date', params.start_date);
  if (params.end_date) q.set('end_date', params.end_date);
  if (params.count != null) q.set('count', String(params.count));
  if (params.thumbs != null) q.set('thumbs', String(params.thumbs));
  return q.toString();
}

// ── The factory ──────────────────────────────────────────────────────────────
export function createNasaApodApi(config: NasaApodConfig = {}): NasaApodApi {
  const apiKey = resolveApiKey(config.apiKey);
  const baseUrl = config.baseUrl ?? BASE_URL;
  const doFetch = config.fetch ?? fetch;

  return {
    async apod(params = {}) {
      const res = await doFetch(`${baseUrl}/apod?${buildQuery(apiKey, params)}`);
      if (!res.ok) {
        // NASA returns a JSON `{ error: { code, message } }` (or `{ msg }`) on failure.
        let detail = res.statusText;
        try {
          const body = await res.json();
          detail = body?.error?.message ?? body?.msg ?? detail;
        } catch {
          // non-JSON error body — keep statusText
        }
        throw new NasaApodError(res.status, `NASA APOD request failed (${res.status}): ${detail}`);
      }
      const data = (await res.json()) as Apod | Apod[];
      return Array.isArray(data) ? data : [data];
    },
  };
}

/** A ready-to-use instance backed by env config (the app's default). */
export const nasaApodApi = createNasaApodApi();
