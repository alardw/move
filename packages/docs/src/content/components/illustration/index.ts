import { spec } from '@move-specs/media/Illustration/Illustration.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import SizeAuto from './samples/size-auto';
import sizeAutoCode from './samples/size-auto?raw';
import SizeCapped from './samples/size-capped';
import sizeCappedCode from './samples/size-capped?raw';
import SizeFull from './samples/size-full';
import sizeFullCode from './samples/size-full?raw';
import Surfaces from './samples/surfaces';
import surfacesCode from './samples/surfaces?raw';
import Caption from './samples/caption';
import captionCode from './samples/caption?raw';
import Logo from './samples/logo';
import logoCode from './samples/logo?raw';
import Animated from './samples/animated';
import animatedCode from './samples/animated?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'size-auto', title: 'Size: auto', render: SizeAuto, code: sizeAutoCode },
    { id: 'size-capped', title: 'Size: capped', render: SizeCapped, code: sizeCappedCode },
    { id: 'size-full', title: 'Size: full', render: SizeFull, code: sizeFullCode },
    { id: 'caption', title: 'Caption and description', render: Caption, code: captionCode },
    { id: 'surfaces', title: 'On any surface', render: Surfaces, code: surfacesCode },
    { id: 'animated', title: 'Animated', render: Animated, code: animatedCode },
    { id: 'logo', title: 'Animated wordmark', render: Logo, code: logoCode },
  ],
};
