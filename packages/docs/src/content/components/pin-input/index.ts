import { spec } from '@move-specs/forms/PinInput/PinInput.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Masked from './samples/masked';
import maskedCode from './samples/masked?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic OTP', render: Basic, code: basicCode },
    { id: 'masked', title: 'Masked & alphanumeric', render: Masked, code: maskedCode },
  ],
};
