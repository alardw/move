// nasa-apod.fixtures.ts — representative NATIVE Apod records, so dev + tests run offline with no
// live API. Typed as the native shape; the adapter maps these through its role mapping for its own
// fixtures. Covers the shapes that matter: a public-domain image, a copyrighted image (copyright
// present, no hdurl), and a video (url = embed, thumbnail_url = still).

import type { Apod } from './nasa-apod';

export const apodFixtures: Apod[] = [
  {
    date: '2024-11-01',
    title: 'The Horsehead Nebula',
    explanation:
      'One of the most identifiable nebulae in the sky, the Horsehead Nebula in Orion is part of a large, dark, molecular cloud silhouetted against the glowing gas behind it.',
    media_type: 'image',
    url: 'https://apod.nasa.gov/apod/image/2411/horsehead_1080.jpg',
    hdurl: 'https://apod.nasa.gov/apod/image/2411/horsehead_4000.jpg',
    service_version: 'v1',
  },
  {
    date: '2024-11-02',
    title: 'Andromeda Rising over the Alps',
    explanation:
      'The Andromeda Galaxy, also known as M31, rises over the Italian Alps in this deep composite exposure taken across a single autumn night.',
    media_type: 'image',
    url: 'https://apod.nasa.gov/apod/image/2411/andromeda_alps_960.jpg',
    copyright: 'Marco Meniero',
    service_version: 'v1',
  },
  {
    date: '2024-11-03',
    title: "A Flight over Pluto's Icy Plains",
    explanation:
      'What would it be like to fly over Pluto? This animated video was constructed from images and elevation data returned by NASA’s New Horizons spacecraft.',
    media_type: 'video',
    url: 'https://www.youtube.com/embed/6Bctnc7twMw',
    thumbnail_url: 'https://img.youtube.com/vi/6Bctnc7twMw/hqdefault.jpg',
    service_version: 'v1',
  },
];

/** A single-day response (the service returns one object, not an array, for a single `date`). */
export const apodSingleFixture: Apod = apodFixtures[0];
