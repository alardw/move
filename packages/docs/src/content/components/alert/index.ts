import { spec } from '@move-specs/feedback/Alert/Alert.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Dismissible from './samples/dismissible';
import dismissibleCode from './samples/dismissible?raw';
import CustomIcon from './samples/custom-icon';
import customIconCode from './samples/custom-icon?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'variants', title: 'Variants', render: Variants, code: variantsCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'dismissible', title: 'Dismissible', render: Dismissible, code: dismissibleCode },
    { id: 'custom-icon', title: 'Custom icon', render: CustomIcon, code: customIconCode },
  ],
};
