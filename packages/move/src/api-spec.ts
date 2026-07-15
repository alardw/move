// api-spec.ts — the ApiSpec type: the source-access layer of the pipeline.
//
// An ApiSpec captures how to REACH an external source (transport · auth · endpoints) and its
// NATIVE response shapes — pattern-agnostic (no roles, no normalization; that's the adapter).
// Produced by `api-analyze` from the source's own docs / OpenAPI / a sample (never from repo
// code), and consumed by `api-create` to generate the access code + fixtures + tests.
//
// Exported from `move` so a consumer's `{name}.api.ts` can `satisfies ApiSpec` and tsc enforces it.

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** A value that is either a literal or read from an env var — so it can vary per ENVIRONMENT
 *  (dev / staging / prod) without changing the spec. Same mechanism as `secretFrom`: the spec names
 *  the var, each environment sets it (Vite's `.env.[mode]`, or the deploy env). Use a literal for a
 *  stable public base (NASA); use `{ fromEnv }` when the base URL/prefix differs per environment. */
export type Configurable = string | { fromEnv: string };

/** How to reach the source. `openapi`/`graphql` reference a machine-readable spec; `rest` declares it.
 *  The base (baseUrl / spec URL / schema URL) is `Configurable` so it can be per-environment. */
export type ApiTransport =
  | { kind: 'rest'; baseUrl: Configurable }
  | { kind: 'openapi'; spec: Configurable }
  | { kind: 'graphql'; schema: Configurable };

/** How requests are authorized. NEVER holds a secret — only the scheme + the env var to read it
 *  from (`secretFrom`), so nothing sensitive lands in a committed spec. */
export type ApiAuth =
  | { kind: 'none' }
  | { kind: 'apiKey'; in: 'query' | 'header'; name: string; secretFrom: string }
  | { kind: 'bearer'; secretFrom: string }
  | { kind: 'oauth2'; flow: string; secretFrom: string };

export interface ApiParam {
  name: string;
  type: string; // 'string (YYYY-MM-DD)', 'integer 1-100', 'boolean', …
  required: boolean;
  default?: string;
}

export interface ApiEndpoint {
  name: string; // 'apod'
  method: HttpMethod;
  path: string; // '/apod'
  params: readonly ApiParam[];
  returns: string; // the native shape name this returns ('Apod')
  array?: boolean; // true when the endpoint returns a list (e.g. a date range)
}

/** One field of a native response shape (discovered from the docs/spec/sample). Optional fields
 *  carry a `?` in their `type`. No pattern roles here — mapping is the adapter's job. */
export interface ApiField {
  name: string;
  type: string;
  note?: string;
}

export interface ApiSpec {
  name: string; // 'nasa-apod' — what adapters reference
  source: string; // 'NASA APOD API'
  transport: ApiTransport;
  auth?: ApiAuth;
  headers?: Record<string, string>;
  endpoints: readonly ApiEndpoint[];
  fields: readonly ApiField[]; // the source's native shape(s)
}
