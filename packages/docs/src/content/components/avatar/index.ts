import { spec } from '@move-specs/core/Avatar/Avatar.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Colors from './samples/colors';
import colorsCode from './samples/colors?raw';
import Group from './samples/group';
import groupCode from './samples/group?raw';
import WithStatus from './samples/with-status';
import withStatusCode from './samples/with-status?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'colors', title: 'Tinted fallback colours', render: Colors, code: colorsCode },
    { id: 'group', title: 'Stacked group', render: Group, code: groupCode },
    { id: 'with-status', title: 'With a status dot', render: WithStatus, code: withStatusCode },
  ],
};
