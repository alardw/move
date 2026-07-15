// apod-gallery.test.tsx — the composite's async spine + resolved decisions, driven by a STUBBED
// GallerySource (no api, no network). Asserts the pattern's Feedback lane (loading → ready / error /
// empty), the order=time sort, the filter=inline-chips facet, and pagination=see-more append.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MoveRoot, lightTheme, asyncResource } from 'move';
import { iconResolver } from '../../icons';
import { ApodGallery } from './ApodGallery';
import type { GallerySource } from '../../adapters/apod-gallery';
import { apodGalleryFixtures } from '../../adapters/apod-gallery.fixtures';

const wrap = (source: GallerySource) =>
  render(
    <MoveRoot theme={lightTheme} iconResolver={iconResolver}>
      <ApodGallery source={source} />
    </MoveRoot>,
  );

const ready = (data = apodGalleryFixtures): GallerySource => ({ items: async () => asyncResource.success(data) });

describe('ApodGallery — Feedback lane', () => {
  it('ready: renders a tile per item', async () => {
    wrap(ready());
    expect(await screen.findByText('The Horsehead Nebula')).toBeInTheDocument();
    expect(screen.getByText('Andromeda Rising over the Alps')).toBeInTheDocument();
    expect(screen.getByText("A Flight over Pluto's Icy Plains")).toBeInTheDocument();
  });

  it('empty: an empty result shows the EmptyState', async () => {
    wrap(ready([]));
    expect(await screen.findByText('No pictures to show')).toBeInTheDocument();
  });

  it('error: a rejected fetch shows the Alert + retry, surfacing the cause', async () => {
    const source: GallerySource = { items: async () => asyncResource.error(new Error('rate limited')) };
    wrap(source);
    expect(await screen.findByText('Couldn’t load the gallery')).toBeInTheDocument();
    expect(screen.getByText('rate limited')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});

describe('ApodGallery — resolved decisions', () => {
  it('order=time: sorts newest first (2024-11-03 → -01)', async () => {
    wrap(ready());
    const headings = await screen.findAllByRole('heading', { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual([
      "A Flight over Pluto's Icy Plains", // 2024-11-03
      'Andromeda Rising over the Alps', // 2024-11-02
      'The Horsehead Nebula', // 2024-11-01
    ]);
  });

  it('filter=inline-chips: the Videos facet keeps only media_type=video', async () => {
    wrap(ready());
    await screen.findByText('The Horsehead Nebula');
    fireEvent.click(screen.getByRole('radio', { name: 'Videos' }));
    await waitFor(() => expect(screen.queryByText('The Horsehead Nebula')).not.toBeInTheDocument());
    expect(screen.getByText("A Flight over Pluto's Icy Plains")).toBeInTheDocument();
  });

  it('pagination=see-more: the button fetches and appends the next batch', async () => {
    const items = vi.fn(async () => asyncResource.success(apodGalleryFixtures));
    wrap({ items });
    await screen.findByText('The Horsehead Nebula');
    expect(items).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'See more' }));
    await waitFor(() => expect(items).toHaveBeenCalledTimes(2));
  });
});
