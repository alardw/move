import { spec } from '@move-specs/data-display/List/List.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Density from './samples/density';
import densityCode from './samples/density?raw';
import ItemReveal from './samples/item-reveal';
import itemRevealCode from './samples/item-reveal?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'density', title: 'Density', render: Density, code: densityCode },
    {
      id: 'item-reveal',
      title: 'Staggered item reveal (opt-in)',
      render: ItemReveal,
      code: itemRevealCode,
    },
  ],
};
