import { spec } from '@move-specs/forms/ColorInput/ColorInput.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Formats from './samples/formats';
import formatsCode from './samples/formats?raw';
import Swatches from './samples/swatches';
import swatchesCode from './samples/swatches?raw';
import States from './samples/states';
import statesCode from './samples/states?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'sizes', title: 'Sizes & variants', render: Sizes, code: sizesCode },
    { id: 'formats', title: 'Format options', render: Formats, code: formatsCode },
    { id: 'swatches', title: 'Preset swatches', render: Swatches, code: swatchesCode },
    { id: 'states', title: 'States', render: States, code: statesCode },
  ],
};
