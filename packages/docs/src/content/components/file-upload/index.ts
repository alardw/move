import { spec } from '@move-specs/forms/FileUpload/FileUpload.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Constraints from './samples/constraints';
import constraintsCode from './samples/constraints?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'constraints', title: 'Type, size & count limits', render: Constraints, code: constraintsCode },
  ],
};
