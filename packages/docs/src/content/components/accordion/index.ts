import { spec } from '@move-specs/panel/Accordion/Accordion.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Multiple from './samples/multiple';
import multipleCode from './samples/multiple?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import CustomIcon from './samples/custom-icon';
import customIconCode from './samples/custom-icon?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic (single, collapsible)', render: Basic, code: basicCode },
    { id: 'multiple', title: 'Multiple open at once', render: Multiple, code: multipleCode },
    { id: 'variants', title: 'Variants', render: Variants, code: variantsCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'custom-icon', title: 'Custom trigger icon', render: CustomIcon, code: customIconCode },
  ],
};
