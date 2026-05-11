import { spec } from '@move-specs/panel/Sidebar/Sidebar.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Collapsed from './samples/collapsed';
import collapsedCode from './samples/collapsed?raw';
import WithBadges from './samples/with-badges';
import withBadgesCode from './samples/with-badges?raw';
import RightSide from './samples/right-side';
import rightSideCode from './samples/right-side?raw';
import Links from './samples/links';
import linksCode from './samples/links?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'collapsed', title: 'Collapsed by default', render: Collapsed, code: collapsedCode },
    { id: 'with-badges', title: 'With badges', render: WithBadges, code: withBadgesCode },
    { id: 'right-side', title: 'Right-side', render: RightSide, code: rightSideCode },
    { id: 'links', title: 'As router links', render: Links, code: linksCode },
  ],
};
