import { spec } from '@move-specs/overlays/Dialog/Dialog.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Form from './samples/form';
import formCode from './samples/form?raw';
import Destructive from './samples/destructive';
import destructiveCode from './samples/destructive?raw';
import Controlled from './samples/controlled';
import controlledCode from './samples/controlled?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'form', title: 'With a form', render: Form, code: formCode },
    { id: 'destructive', title: 'Destructive confirm', render: Destructive, code: destructiveCode },
    { id: 'controlled', title: 'Controlled open', render: Controlled, code: controlledCode },
  ],
};
