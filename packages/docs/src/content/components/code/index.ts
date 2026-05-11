import { spec } from '@move-specs/core/Code/Code.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Inline from './samples/inline';
import inlineCode from './samples/inline?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import Block from './samples/block';
import blockCode from './samples/block?raw';
import Highlighter from './samples/highlighter';
import highlighterCode from './samples/highlighter?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'inline', title: 'Inline in prose', render: Inline, code: inlineCode },
    { id: 'variants', title: 'Variants', render: Variants, code: variantsCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'block', title: 'Block (multi-line)', render: Block, code: blockCode },
    { id: 'highlighter', title: 'Pluggable syntax highlighter', render: Highlighter, code: highlighterCode },
  ],
};
