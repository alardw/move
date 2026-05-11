import { spec } from '@move-specs/form/ColorPicker/ColorPicker.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Swatches from './samples/swatches';
import swatchesCode from './samples/swatches?raw';
import SwatchOnly from './samples/swatch-only';
import swatchOnlyCode from './samples/swatch-only?raw';
import Formats from './samples/formats';
import formatsCode from './samples/formats?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'swatches', title: 'With preset swatches', render: Swatches, code: swatchesCode },
    { id: 'swatch-only', title: 'Swatch-only (no picker)', render: SwatchOnly, code: swatchOnlyCode },
    { id: 'formats', title: 'Format options', render: Formats, code: formatsCode },
  ],
};
