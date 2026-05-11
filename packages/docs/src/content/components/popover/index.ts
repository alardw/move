import { spec } from '@move-specs/overlay/Popover/Popover.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import WithForm from './samples/with-form';
import withFormCode from './samples/with-form?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'with-form', title: 'With a form inside', render: WithForm, code: withFormCode },
  ],
};
