import { spec } from '@move-specs/navigation/Link/Link.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'variants', title: 'Underline variants', render: Variants, code: variantsCode },
  ],
};
