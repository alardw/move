import { spec } from '@move-specs/data-display/MarkerList/MarkerList.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Nested from './samples/nested';
import nestedCode from './samples/nested?raw';
import Ordered from './samples/ordered';
import orderedCode from './samples/ordered?raw';
import Icons from './samples/icons';
import iconsCode from './samples/icons?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Bullets', render: Basic, code: basicCode },
    { id: 'nested', title: 'Nested (per-level markers)', render: Nested, code: nestedCode },
    { id: 'ordered', title: 'Ordered', render: Ordered, code: orderedCode },
    { id: 'icons', title: 'Icon markers', render: Icons, code: iconsCode },
  ],
};
