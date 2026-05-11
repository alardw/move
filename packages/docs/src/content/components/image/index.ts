import { spec } from '@move-specs/media/Image/Image.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import ObjectFit from './samples/object-fit';
import objectFitCode from './samples/object-fit?raw';
import Fallback from './samples/fallback';
import fallbackCode from './samples/fallback?raw';
import Overlay from './samples/overlay';
import overlayCode from './samples/overlay?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'object-fit', title: 'Object fit', render: ObjectFit, code: objectFitCode },
    { id: 'fallback', title: 'Fallback on error', render: Fallback, code: fallbackCode },
    { id: 'overlay', title: 'Action overlay (hover)', render: Overlay, code: overlayCode },
  ],
};
