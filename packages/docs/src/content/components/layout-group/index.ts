import { spec } from '@move-specs/layout/LayoutGroup/LayoutGroup.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Filter from './samples/filter';
import filterCode from './samples/filter?raw';
import Reorder from './samples/reorder';
import reorderCode from './samples/reorder?raw';
import AddRemove from './samples/add-remove';
import addRemoveCode from './samples/add-remove?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'filter', title: 'Filter a list', render: Filter, code: filterCode },
    { id: 'reorder', title: 'Reorder', render: Reorder, code: reorderCode },
    { id: 'add-remove', title: 'Add & remove', render: AddRemove, code: addRemoveCode },
  ],
};
