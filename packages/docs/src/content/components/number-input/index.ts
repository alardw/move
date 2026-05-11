import { spec } from '@move-specs/form/NumberInput/NumberInput.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Format from './samples/format';
import formatCode from './samples/format?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'format', title: 'Format & parse (currency, %)', render: Format, code: formatCode },
  ],
};
