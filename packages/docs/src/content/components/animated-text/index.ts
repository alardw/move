import { spec } from '@move-specs/typography/AnimatedText/AnimatedText.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Preview from './preview';
import Effects from './samples/effects';
import effectsCode from './samples/effects?raw';
import Granularity from './samples/granularity';
import granularityCode from './samples/granularity?raw';
import Timing from './samples/timing';
import timingCode from './samples/timing?raw';

export const content: ComponentContent = {
  meta,
  spec,
  preview: Preview,
  samples: [
    { id: 'effects', title: 'Effects', render: Effects, code: effectsCode },
    { id: 'granularity', title: 'Granularity', render: Granularity, code: granularityCode },
    { id: 'timing', title: 'Timing', render: Timing, code: timingCode },
  ],
};
