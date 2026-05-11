import { spec } from '@move-specs/overlay/Drawer/Drawer.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Positions from './samples/positions';
import positionsCode from './samples/positions?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Details from './samples/details';
import detailsCode from './samples/details?raw';
import NonModal from './samples/non-modal';
import nonModalCode from './samples/non-modal?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'positions', title: 'Positions (left, right, top, bottom)', render: Positions, code: positionsCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'details', title: 'Detail panel pattern', render: Details, code: detailsCode },
    { id: 'non-modal', title: 'Non-modal inspector', render: NonModal, code: nonModalCode },
  ],
};
