import { spec } from '@move-specs/forms/PasswordStrength/PasswordStrength.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Requirements from './samples/requirements';
import requirementsCode from './samples/requirements?raw';
import Levels from './samples/levels';
import levelsCode from './samples/levels?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Wired to Password', render: Basic, code: basicCode },
    { id: 'requirements', title: 'Requirements checklist', render: Requirements, code: requirementsCode },
    { id: 'levels', title: 'Levels & scale', render: Levels, code: levelsCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
  ],
};
