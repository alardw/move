import { spec } from '@move-specs/media/Illustration/Illustration.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Widths from './samples/widths';
import widthsCode from './samples/widths?raw';
import Surfaces from './samples/surfaces';
import surfacesCode from './samples/surfaces?raw';
import Caption from './samples/caption';
import captionCode from './samples/caption?raw';
import Animated from './samples/animated';
import animatedCode from './samples/animated?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'widths', title: 'Width strategies', render: Widths, code: widthsCode },
    { id: 'caption', title: 'Caption and description', render: Caption, code: captionCode },
    { id: 'surfaces', title: 'On any surface', render: Surfaces, code: surfacesCode },
    { id: 'animated', title: 'Animated', render: Animated, code: animatedCode },
  ],
};
