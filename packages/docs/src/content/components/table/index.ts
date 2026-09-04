import { spec } from '@move-specs/data-display/Table/Table.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Basic from './samples/basic';
import basicCode from './samples/basic?raw';
import Sortable from './samples/sortable';
import sortableCode from './samples/sortable?raw';
import Variants from './samples/variants';
import variantsCode from './samples/variants?raw';
import ZebraOnly from './samples/zebra-only';
import zebraOnlyCode from './samples/zebra-only?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import InteractiveRows from './samples/interactive-rows';
import interactiveRowsCode from './samples/interactive-rows?raw';
import Aligned from './samples/aligned';
import alignedCode from './samples/aligned?raw';
import TwoLineCells from './samples/two-line-cells';
import twoLineCellsCode from './samples/two-line-cells?raw';
import Selectable from './samples/selectable';
import selectableCode from './samples/selectable?raw';
import Grouped from './samples/grouped';
import groupedCode from './samples/grouped?raw';
import WithCaption from './samples/with-caption-and-footer';
import withCaptionCode from './samples/with-caption-and-footer?raw';
import WideResponsive from './samples/wide-responsive';
import wideResponsiveCode from './samples/wide-responsive?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'basic', title: 'Basic', render: Basic, code: basicCode },
    { id: 'sortable', title: 'Sortable columns', render: Sortable, code: sortableCode },
    { id: 'variants', title: 'Variants', render: Variants, code: variantsCode },
    { id: 'zebra-only', title: 'Zebra only (ghost + striped)', render: ZebraOnly, code: zebraOnlyCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'interactive-rows', title: 'Interactive rows (whole-row click)', render: InteractiveRows, code: interactiveRowsCode },
    { id: 'aligned', title: 'Column alignment', render: Aligned, code: alignedCode },
    { id: 'two-line-cells', title: 'Two-line cells (primary + description)', render: TwoLineCells, code: twoLineCellsCode },
    { id: 'selectable', title: 'Row selection', render: Selectable, code: selectableCode },
    { id: 'grouped', title: 'Collapsible row groups', render: Grouped, code: groupedCode },
    {
      id: 'with-caption-and-footer',
      title: 'Caption + footer',
      render: WithCaption,
      code: withCaptionCode,
    },
    {
      id: 'wide-responsive',
      title: 'Responsive stack (resize the window to trigger)',
      render: WideResponsive,
      code: wideResponsiveCode,
    },
  ],
};
