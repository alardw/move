import { spec } from '@move-specs/overlays/Popover/Popover.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import WithForm from './samples/with-form';
import withFormCode from './samples/with-form?raw';
import Preview from './preview';

export const content: ComponentContent = {
  meta,
  spec,
  preview: Preview,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'with-form', title: 'With a form inside', render: WithForm, code: withFormCode },
  ],
};
