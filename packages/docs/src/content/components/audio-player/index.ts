import { spec } from '@move-specs/media/AudioPlayer/AudioPlayer.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Radius from './samples/radius';
import radiusCode from './samples/radius?raw';
import Minimal from './samples/minimal';
import minimalCode from './samples/minimal?raw';
import Controlled from './samples/controlled';
import controlledCode from './samples/controlled?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'radius', title: 'Radius', render: Radius, code: radiusCode },
    { id: 'minimal', title: 'Minimal controls', render: Minimal, code: minimalCode },
    { id: 'controlled', title: 'Controlled state', render: Controlled, code: controlledCode },
  ],
};
