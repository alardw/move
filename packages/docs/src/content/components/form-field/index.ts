import { spec } from '@move-specs/forms/FormField/FormField.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Error from './samples/error';
import errorCode from './samples/error?raw';
import LabelWidth from './samples/label-width';
import labelWidthCode from './samples/label-width?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'error', title: 'Error description', render: Error, code: errorCode },
    { id: 'label-width', title: 'Custom label width', render: LabelWidth, code: labelWidthCode },
  ],
};
