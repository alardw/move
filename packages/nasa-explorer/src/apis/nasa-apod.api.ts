// nasa-apod.api.ts — the source-access layer for NASA's Astronomy Picture of the Day.
//
// Derived from the APOD docs (https://api.nasa.gov/#apod) + a live sample response — NOT from repo
// code. Pattern-agnostic: native shapes only; role mapping is the adapter's job.

import type { ApiSpec } from 'move';

export const spec = {
  name: 'nasa-apod',
  source: 'NASA APOD API',
  transport: { kind: 'rest', baseUrl: 'https://api.nasa.gov/planetary' },
  // api.nasa.gov key, passed as the `api_key` query param. Falls back to DEMO_KEY (rate-limited)
  // when the env var is empty. Secret stays in env — never in the spec.
  auth: { kind: 'apiKey', in: 'query', name: 'api_key', secretFrom: 'VITE_NASA_API_KEY' },
  endpoints: [
    {
      name: 'apod',
      method: 'GET',
      path: '/apod',
      returns: 'Apod',
      // A date range (start_date/end_date) OR count returns an ARRAY of Apod; a single date (or
      // no params → today) returns one Apod object.
      array: false,
      params: [
        { name: 'date', type: 'string (YYYY-MM-DD)', required: false, default: 'today' },
        { name: 'start_date', type: 'string (YYYY-MM-DD)', required: false, default: 'none' },
        { name: 'end_date', type: 'string (YYYY-MM-DD)', required: false, default: 'today' },
        { name: 'count', type: 'integer', required: false, default: 'none' },
        { name: 'thumbs', type: 'boolean', required: false, default: 'false' },
      ],
    },
  ],
  // The native Apod shape. start_date/end_date or count returns an ARRAY of these.
  fields: [
    { name: 'date', type: 'string', note: 'YYYY-MM-DD' },
    { name: 'title', type: 'string' },
    { name: 'explanation', type: 'string' },
    { name: 'media_type', type: "'image' | 'video'" },
    { name: 'url', type: 'string', note: 'image URL, or the video embed URL when media_type=video' },
    { name: 'hdurl', type: 'string?', note: 'high-res image; omitted for videos / when unavailable' },
    { name: 'copyright', type: 'string?', note: 'present only when the image is not public domain' },
    { name: 'thumbnail_url', type: 'string?', note: 'video still; only when media_type=video and thumbs=true' },
    { name: 'service_version', type: 'string', note: "e.g. 'v1'" },
  ],
} as const satisfies ApiSpec;
