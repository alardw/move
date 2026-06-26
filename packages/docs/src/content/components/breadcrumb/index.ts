import { spec } from '@move-specs/navigation/Breadcrumb/Breadcrumb.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Separator from './samples/separator';
import separatorCode from './samples/separator?raw';
import WithEllipsis from './samples/with-ellipsis';
import withEllipsisCode from './samples/with-ellipsis?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'separator', title: 'Custom separator', render: Separator, code: separatorCode },
    { id: 'with-ellipsis', title: 'Collapsed with ellipsis', render: WithEllipsis, code: withEllipsisCode },
  ],
};
