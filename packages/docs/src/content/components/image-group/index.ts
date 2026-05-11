import { spec } from '@move-specs/media/ImageGroup/ImageGroup.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import AutoFit from './samples/auto-fit';
import autoFitCode from './samples/auto-fit?raw';
import BlurredBackdrop from './samples/blurred-backdrop';
import blurredBackdropCode from './samples/blurred-backdrop?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'auto-fit', title: 'Auto-fit columns', render: AutoFit, code: autoFitCode },
    { id: 'blurred-backdrop', title: 'Mixed sizes (blurred backdrop)', render: BlurredBackdrop, code: blurredBackdropCode },
  ],
};
