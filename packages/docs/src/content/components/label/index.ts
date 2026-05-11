import { spec } from '@move-specs/form/Label/Label.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Required from './samples/required';
import requiredCode from './samples/required?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'required', title: 'Required indicator', render: Required, code: requiredCode },
  ],
};
