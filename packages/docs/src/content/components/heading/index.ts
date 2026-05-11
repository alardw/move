import { spec } from '@move-specs/core/Heading/Heading.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Levels from './samples/levels';
import levelsCode from './samples/levels?raw';
import DecoupledSize from './samples/decoupled-size';
import decoupledSizeCode from './samples/decoupled-size?raw';
import Truncate from './samples/truncate';
import truncateCode from './samples/truncate?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'levels', title: 'Levels', render: Levels, code: levelsCode },
    { id: 'decoupled-size', title: 'Level vs visual size', render: DecoupledSize, code: decoupledSizeCode },
    { id: 'truncate', title: 'Truncate', render: Truncate, code: truncateCode },
  ],
};
