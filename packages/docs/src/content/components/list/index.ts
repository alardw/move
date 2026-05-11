import { spec } from '@move-specs/data/List/List.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Density from './samples/density';
import densityCode from './samples/density?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'density', title: 'Density', render: Density, code: densityCode },
  ],
};
