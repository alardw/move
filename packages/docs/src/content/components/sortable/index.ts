import { spec } from '@move-specs/data-display/Sortable/Sortable.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Keyboard from './samples/keyboard';
import keyboardCode from './samples/keyboard?raw';
import Pinned from './samples/pinned';
import pinnedCode from './samples/pinned?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Reordering', render: Basic, code: basicCode },
    { id: 'keyboard', title: 'From the keyboard', render: Keyboard, code: keyboardCode },
    { id: 'pinned', title: 'A row that cannot move', render: Pinned, code: pinnedCode },
  ],
};
