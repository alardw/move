// apod-gallery.test.ts — the bridge's two responsibilities: the field→role MAPPING (each role, each
// transform) and the AsyncResource STATES the composite's Feedback lane consumes. The api is mocked;
// this never hits the network (transport is the api's concern, tested there).

import { describe, it, expect } from 'vitest';
import { apodGalleryAdapter, toGalleryItem } from './apod-gallery';
import type { Apod, NasaApodApi } from '../apis/nasa-apod';
import { apodFixtures } from '../apis/nasa-apod.fixtures';

// A stub api: `apod()` returns whatever we hand it (or throws) — no fetch.
const stubApi = (impl: NasaApodApi['apod']): NasaApodApi => ({ apod: impl });

describe('toGalleryItem — the mapping', () => {
  const [image, copyrighted, video] = apodFixtures;

  it('media: an image uses hdurl (hi-res) over url', () => {
    expect(toGalleryItem(image).media).toBe(image.hdurl);
  });

  it('media: a video uses its thumbnail_url still, not the embed url', () => {
    expect(toGalleryItem(video).media).toBe(video.thumbnail_url);
  });

  it('media: falls back to url when hdurl is absent', () => {
    const noHd: Apod = { ...image, hdurl: undefined };
    expect(toGalleryItem(noHd).media).toBe(noHd.url);
  });

  it('title: direct', () => {
    expect(toGalleryItem(image).title).toBe(image.title);
  });

  it('meta: [date, copyright] when copyright is present', () => {
    expect(toGalleryItem(copyrighted).meta).toEqual([copyrighted.date, copyrighted.copyright]);
  });

  it('meta: drops copyright for public-domain images', () => {
    expect(toGalleryItem(image).meta).toEqual([image.date]);
  });

  it('sortKey: the date', () => {
    expect(toGalleryItem(image).sortKey).toBe(image.date);
  });

  it('filterKey: the media_type facet', () => {
    expect(toGalleryItem(image).filterKey).toBe('image');
    expect(toGalleryItem(video).filterKey).toBe('video');
  });
});

describe('apodGalleryAdapter — the AsyncResource states', () => {
  it('ready: rows → success with the mapped items', async () => {
    const source = apodGalleryAdapter(stubApi(async () => apodFixtures));
    const res = await source.items();
    expect(res.status).toBe('success');
    if (res.status !== 'success') throw new Error('expected success');
    expect(res.data).toHaveLength(apodFixtures.length);
    expect(res.data[0]).toEqual(toGalleryItem(apodFixtures[0]));
  });

  it('empty: an empty result → success with []', async () => {
    const source = apodGalleryAdapter(stubApi(async () => []));
    const res = await source.items();
    expect(res.status).toBe('success');
    if (res.status !== 'success') throw new Error('expected success');
    expect(res.data).toEqual([]);
  });

  it('error: a rejected api call → error, carrying the cause', async () => {
    const boom = new Error('NASA APOD request failed (429): rate limit');
    const source = apodGalleryAdapter(stubApi(async () => { throw boom; }));
    const res = await source.items();
    expect(res.status).toBe('error');
    if (res.status !== 'error') throw new Error('expected error');
    expect(res.error).toBe(boom);
  });

  it('passes the query through to the api endpoint', async () => {
    let seen: unknown;
    const source = apodGalleryAdapter(stubApi(async (q) => { seen = q; return apodFixtures; }));
    await source.items({ start_date: '2024-11-01', end_date: '2024-11-03' });
    expect(seen).toEqual({ start_date: '2024-11-01', end_date: '2024-11-03' });
  });
});
