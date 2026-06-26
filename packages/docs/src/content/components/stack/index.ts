import { spec } from '@move-specs/layout/Stack/Stack.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import AlignJustify from './samples/align-justify';
import alignJustifyCode from './samples/align-justify?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Direction', render: Basic, code: basicCode },
    { id: 'align-justify', title: 'Align & justify', render: AlignJustify, code: alignJustifyCode },
  ],
};
