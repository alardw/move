import { spec } from '@move-specs/data/Timeline/Timeline.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Steps from './samples/steps';
import stepsCode from './samples/steps?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'steps', title: 'In-progress steps', render: Steps, code: stepsCode },
  ],
};
