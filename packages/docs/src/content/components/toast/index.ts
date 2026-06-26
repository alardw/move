import { spec } from '@move-specs/feedback/Toast/Toast.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Variants', render: Basic, code: basicCode },
  ],
};
