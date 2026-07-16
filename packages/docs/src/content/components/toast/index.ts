import { spec } from '@move-specs/feedback/Toast/Toast.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import AutoDismiss from './samples/auto-dismiss';
import autoDismissCode from './samples/auto-dismiss?raw';
import Preview from './preview';

export const content: ComponentContent = {
  meta,
  spec,
  preview: Preview,
  samples: [
    { id: 'basic', title: 'Variants', render: Basic, code: basicCode },
    { id: 'auto-dismiss', title: 'Opt-in auto-dismiss', render: AutoDismiss, code: autoDismissCode },
  ],
};
