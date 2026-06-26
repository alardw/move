import { spec } from '@move-specs/forms/Autocomplete/Autocomplete.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Multiple from './samples/multiple';
import multipleCode from './samples/multiple?raw';
import Grouped from './samples/grouped';
import groupedCode from './samples/grouped?raw';
import CustomFilter from './samples/custom-filter';
import customFilterCode from './samples/custom-filter?raw';
import Async from './samples/async';
import asyncCode from './samples/async?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic (single)', render: Basic, code: basicCode },
    { id: 'multiple', title: 'Multi-select with tags', render: Multiple, code: multipleCode },
    { id: 'grouped', title: 'Grouped options', render: Grouped, code: groupedCode },
    { id: 'custom-filter', title: 'Custom filter (keywords + substring)', render: CustomFilter, code: customFilterCode },
    { id: 'async', title: 'Async search with loading state', render: Async, code: asyncCode },
  ],
};
