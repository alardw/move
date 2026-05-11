import { spec } from '@move-specs/core/Align/Align.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import TwoSlot from './samples/two-slot';
import twoSlotCode from './samples/two-slot?raw';
import VerticalAlign from './samples/vertical-align';
import verticalAlignCode from './samples/vertical-align?raw';
import DialogFooter from './samples/dialog-footer';
import dialogFooterCode from './samples/dialog-footer?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic app bar', render: Basic, code: basicCode },
    { id: 'two-slot', title: 'Two-slot toolbar', render: TwoSlot, code: twoSlotCode },
    { id: 'vertical-align', title: 'Vertical alignment', render: VerticalAlign, code: verticalAlignCode },
    { id: 'dialog-footer', title: 'Dialog footer', render: DialogFooter, code: dialogFooterCode },
  ],
};
