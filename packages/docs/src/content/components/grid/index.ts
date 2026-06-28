import { spec } from '@move-specs/layout/Grid/Grid.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import EqualCols from './samples/equal-cols';
import equalColsCode from './samples/equal-cols?raw';
import AutoFit from './samples/auto-fit';
import autoFitCode from './samples/auto-fit?raw';
import CellSpans from './samples/cell-spans';
import cellSpansCode from './samples/cell-spans?raw';
import ImageGallery from './samples/image-gallery';
import imageGalleryCode from './samples/image-gallery?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'equal-cols', title: 'Equal columns', render: EqualCols, code: equalColsCode },
    { id: 'auto-fit', title: 'Auto-fit (responsive)', render: AutoFit, code: autoFitCode },
    { id: 'cell-spans', title: 'Cell spans', render: CellSpans, code: cellSpansCode },
    { id: 'image-gallery', title: 'Image gallery (stagger + backdrop)', render: ImageGallery, code: imageGalleryCode },
  ],
};
