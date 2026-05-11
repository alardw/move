import { spec } from '@move-specs/overlay/Dropdown/Dropdown.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Grouped from './samples/grouped';
import groupedCode from './samples/grouped?raw';
import CheckboxRadio from './samples/checkbox-radio';
import checkboxRadioCode from './samples/checkbox-radio?raw';
import SubMenus from './samples/sub-menus';
import subMenusCode from './samples/sub-menus?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'grouped', title: 'Groups & labels', render: Grouped, code: groupedCode },
    { id: 'checkbox-radio', title: 'Checkbox & radio items', render: CheckboxRadio, code: checkboxRadioCode },
    { id: 'sub-menus', title: 'Sub-menus', render: SubMenus, code: subMenusCode },
  ],
};
