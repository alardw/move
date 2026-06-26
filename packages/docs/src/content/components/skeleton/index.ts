import { spec } from '@move-specs/feedback/Skeleton/Skeleton.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Animations from './samples/animations';
import animationsCode from './samples/animations?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'animations', title: 'Animation modes', render: Animations, code: animationsCode },
  ],
};
