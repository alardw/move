import { spec } from '@move-specs/core/ChatBubble/ChatBubble.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';
import Thread from './samples/thread';
import threadCode from './samples/thread?raw';
import Colors from './samples/colors';
import colorsCode from './samples/colors?raw';
import NoTail from './samples/no-tail';
import noTailCode from './samples/no-tail?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic exchange', render: Basic, code: basicCode },
    { id: 'variants', title: 'Variants', render: Variants, code: variantsCode },
    { id: 'thread', title: 'Threaded conversation', render: Thread, code: threadCode },
    { id: 'colors', title: 'Per-persona colours', render: Colors, code: colorsCode },
    { id: 'no-tail', title: 'No tail (system messages)', render: NoTail, code: noTailCode },
  ],
};
