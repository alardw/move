import { spec } from '@move-specs/layout/Surface/Surface.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import AsChild from './samples/as-child';
import asChildCode from './samples/as-child?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Alternating grounds', render: Basic, code: basicCode },
    {
      id: 'as-child',
      title: 'asChild — paint an element you already have',
      render: AsChild,
      code: asChildCode,
    },
  ],
};
