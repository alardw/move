import { spec } from '@move-specs/core/Badge/Badge.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Palette from './samples/palette';
import paletteCode from './samples/palette?raw';
import InContext from './samples/in-context';
import inContextCode from './samples/in-context?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'variants', title: 'Variants', render: Variants, code: variantsCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'palette', title: 'Full colour palette', render: Palette, code: paletteCode },
    { id: 'in-context', title: 'In context', render: InContext, code: inContextCode },
  ],
};
