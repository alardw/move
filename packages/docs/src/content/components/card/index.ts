import { spec } from '@move-specs/layout/Card/Card.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import FooterSplit from './samples/footer-split';
import footerSplitCode from './samples/footer-split?raw';
import Grid from './samples/grid';
import gridCode from './samples/grid?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'variants', title: 'Variants', render: Variants, code: variantsCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'footer-split', title: 'Footer split (Start + End)', render: FooterSplit, code: footerSplitCode },
    { id: 'grid', title: 'Card grid', render: Grid, code: gridCode },
  ],
};
