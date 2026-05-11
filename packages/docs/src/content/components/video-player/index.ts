import { spec } from '@move-specs/media/VideoPlayer/VideoPlayer.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Subtitles from './samples/subtitles';
import subtitlesCode from './samples/subtitles?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'subtitles', title: 'With subtitles', render: Subtitles, code: subtitlesCode },
  ],
};
