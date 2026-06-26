import { spec } from '@move-specs/actions/ToggleGroup/ToggleGroup.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Single & multi select', render: Basic, code: basicCode },
  ],
};
