import { spec } from '@move-specs/typography/Quote/Quote.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Pull from './samples/pull';
import pullCode from './samples/pull?raw';
import Bare from './samples/bare';
import bareCode from './samples/bare?raw';
import NoIcon from './samples/no-icon';
import noIconCode from './samples/no-icon?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Block quote with attribution', render: Basic, code: basicCode },
    { id: 'pull', title: 'Pull-quote', render: Pull, code: pullCode },
    { id: 'bare', title: 'Without attribution', render: Bare, code: bareCode },
    { id: 'no-icon', title: 'Without the quote-mark', render: NoIcon, code: noIconCode },
  ],
};
