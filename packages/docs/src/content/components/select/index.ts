import { spec } from '@move-specs/forms/Select/Select.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';
import Invalid from './samples/invalid';
import invalidCode from './samples/invalid?raw';
import Grouped from './samples/grouped';
import groupedCode from './samples/grouped?raw';
import GroupsWithIcons from './samples/groups-with-icons';
import groupsWithIconsCode from './samples/groups-with-icons?raw';
import Truncation from './samples/truncation';
import truncationCode from './samples/truncation?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'variants', title: 'Variants', render: Variants, code: variantsCode },
    { id: 'invalid', title: 'Invalid state', render: Invalid, code: invalidCode },
    { id: 'grouped', title: 'Grouped', render: Grouped, code: groupedCode },
    {
      id: 'groups-with-icons',
      title: 'Groups with icons',
      render: GroupsWithIcons,
      code: groupsWithIconsCode,
    },
    {
      id: 'truncation',
      title: 'Truncation + scrolling (constrained width, long values, lots of items)',
      render: Truncation,
      code: truncationCode,
    },
  ],
};
