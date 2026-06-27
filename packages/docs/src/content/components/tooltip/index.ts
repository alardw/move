import { spec } from '@move-specs/overlays/Tooltip/Tooltip.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Preview from './preview';

export const content: ComponentContent = {
  meta,
  spec,
  preview: Preview,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
  ],
};
