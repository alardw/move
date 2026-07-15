// apod-gallery.fixtures.ts — the native Apod fixtures mapped through the adapter's role mapping →
// GalleryItem[]. Derived, never hand-authored: the SAME `toGalleryItem` the adapter uses, so the
// fixtures can't drift from the mapping. Lets composites/tests render the gallery offline.

import { toGalleryItem, type GalleryItem } from './apod-gallery';
import { apodFixtures } from '../apis/nasa-apod.fixtures';

export const apodGalleryFixtures: GalleryItem[] = apodFixtures.map(toGalleryItem);
