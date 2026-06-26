import { spec } from '@move-specs/date-time/TimeField/TimeField.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Cycles from './samples/cycles';
import cyclesCode from './samples/cycles?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'cycles', title: '12 / 24 hour & seconds', render: Cycles, code: cyclesCode },
  ],
};
