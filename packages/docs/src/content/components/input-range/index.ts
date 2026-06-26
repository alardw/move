import { spec } from '@move-specs/forms/InputRange/InputRange.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Step from './samples/step';
import stepCode from './samples/step?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'step', title: 'Min, max & step', render: Step, code: stepCode },
  ],
};
