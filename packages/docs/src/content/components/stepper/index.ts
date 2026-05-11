import { spec } from '@move-specs/navigation/Stepper/Stepper.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Vertical from './samples/vertical';
import verticalCode from './samples/vertical?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Horizontal', render: Basic, code: basicCode },
    { id: 'vertical', title: 'Vertical', render: Vertical, code: verticalCode },
  ],
};
