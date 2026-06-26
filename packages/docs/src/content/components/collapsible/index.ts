import { spec } from '@move-specs/disclosure/Collapsible/Collapsible.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import ShowMore from './samples/show-more';
import showMoreCode from './samples/show-more?raw';
import AsChild from './samples/as-child';
import asChildCode from './samples/as-child?raw';
import CustomIcon from './samples/custom-icon';
import customIconCode from './samples/custom-icon?raw';
import Controlled from './samples/controlled';
import controlledCode from './samples/controlled?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'show-more', title: 'Show more / read on', render: ShowMore, code: showMoreCode },
    { id: 'as-child', title: 'asChild Trigger (Card header)', render: AsChild, code: asChildCode },
    { id: 'custom-icon', title: 'Custom icon', render: CustomIcon, code: customIconCode },
    { id: 'controlled', title: 'Controlled open', render: Controlled, code: controlledCode },
  ],
};
