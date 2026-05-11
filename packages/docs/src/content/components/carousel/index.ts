import { spec } from '@move-specs/media/Carousel/Carousel.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import MultiView from './samples/multi-view';
import multiViewCode from './samples/multi-view?raw';
import Autoplay from './samples/autoplay';
import autoplayCode from './samples/autoplay?raw';
import Vertical from './samples/vertical';
import verticalCode from './samples/vertical?raw';
import Composed from './samples/composed';
import composedCode from './samples/composed?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'multi-view', title: 'Multiple slides per view', render: MultiView, code: multiViewCode },
    { id: 'autoplay', title: 'Autoplay + loop', render: Autoplay, code: autoplayCode },
    { id: 'vertical', title: 'Vertical orientation', render: Vertical, code: verticalCode },
    { id: 'composed', title: 'Custom controls layout', render: Composed, code: composedCode },
  ],
};
