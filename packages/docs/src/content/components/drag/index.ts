import { spec } from '@move-specs/data-display/Drag/Drag.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Slots from './samples/slots';
import slotsCode from './samples/slots?raw';
import Accepts from './samples/accepts';
import acceptsCode from './samples/accepts?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'slots', title: 'Positions that stay', render: Slots, code: slotsCode },
    { id: 'accepts', title: 'Refusing a payload', render: Accepts, code: acceptsCode },
  ],
};
