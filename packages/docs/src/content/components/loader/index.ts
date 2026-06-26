import { spec } from '@move-specs/feedback/Loader/Loader.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'variants', title: 'Spinner & dots variants', render: Variants, code: variantsCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
  ],
};
