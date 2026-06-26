import { spec } from '@move-specs/forms/Password/Password.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
  ],
};
