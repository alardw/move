import { spec } from '@move-specs/actions/Button/Button.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import WithIcon from './samples/with-icon';
import withIconCode from './samples/with-icon?raw';
import Group from './samples/group';
import groupCode from './samples/group?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'variants', title: 'Variants', render: Variants, code: variantsCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'with-icon', title: 'With icon', render: WithIcon, code: withIconCode },
    { id: 'group', title: 'Button.Group', render: Group, code: groupCode },
  ],
};
