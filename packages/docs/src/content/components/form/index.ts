import { spec } from '@move-specs/forms/Form/Form.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Errors from './samples/errors';
import errorsCode from './samples/errors?raw';
import Pending from './samples/pending';
import pendingCode from './samples/pending?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'errors', title: 'Errors from a server', render: Errors, code: errorsCode },
    { id: 'pending', title: 'While submitting', render: Pending, code: pendingCode },
  ],
};
