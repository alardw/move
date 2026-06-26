import { spec } from '@move-specs/layout/Divider/Divider.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Labelled from './samples/labelled';
import labelledCode from './samples/labelled?raw';
import Styles from './samples/styles';
import stylesCode from './samples/styles?raw';
import Vertical from './samples/vertical';
import verticalCode from './samples/vertical?raw';
import Gap from './samples/gap';
import gapCode from './samples/gap?raw';
import InCard from './samples/in-card';
import inCardCode from './samples/in-card?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'labelled', title: 'Labelled separator', render: Labelled, code: labelledCode },
    { id: 'styles', title: 'Line styles & sizes', render: Styles, code: stylesCode },
    { id: 'vertical', title: 'Vertical orientation', render: Vertical, code: verticalCode },
    { id: 'gap', title: 'Gap (outer spacing)', render: Gap, code: gapCode },
    { id: 'in-card', title: 'Between list rows', render: InCard, code: inCardCode },
  ],
};
