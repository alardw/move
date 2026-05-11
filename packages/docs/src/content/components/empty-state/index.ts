import { spec } from '@move-specs/loading/EmptyState/EmptyState.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Minimal from './samples/minimal';
import minimalCode from './samples/minimal?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'minimal', title: 'Minimal (no action)', render: Minimal, code: minimalCode },
  ],
};
