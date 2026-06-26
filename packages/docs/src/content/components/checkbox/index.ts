import { spec } from '@move-specs/forms/Checkbox/Checkbox.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Indeterminate from './samples/indeterminate';
import indeterminateCode from './samples/indeterminate?raw';
import Group from './samples/group';
import groupCode from './samples/group?raw';
import States from './samples/states';
import statesCode from './samples/states?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'indeterminate', title: 'Indeterminate (select-all)', render: Indeterminate, code: indeterminateCode },
    { id: 'group', title: 'In a FormField group', render: Group, code: groupCode },
    { id: 'states', title: 'State matrix', render: States, code: statesCode },
  ],
};
