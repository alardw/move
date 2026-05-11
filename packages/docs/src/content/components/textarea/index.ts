import { spec } from '@move-specs/form/Textarea/Textarea.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import AutoResize from './samples/auto-resize';
import autoResizeCode from './samples/auto-resize?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'auto-resize', title: 'Auto-resize', render: AutoResize, code: autoResizeCode },
  ],
};
