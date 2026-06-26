import { spec } from '@move-specs/date-time/DatePicker/DatePicker.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Single from './samples/single';
import singleCode from './samples/single?raw';
import Range from './samples/range';
import rangeCode from './samples/range?raw';
import WithTime from './samples/with-time';
import withTimeCode from './samples/with-time?raw';
import Sizes from './samples/sizes';
import sizesCode from './samples/sizes?raw';
import LocaleAndConstraints from './samples/locale-and-constraints';
import localeAndConstraintsCode from './samples/locale-and-constraints?raw';
import Languages from './samples/languages';
import languagesCode from './samples/languages?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'single', title: 'Single date', render: Single, code: singleCode },
    { id: 'range', title: 'Date range', render: Range, code: rangeCode },
    { id: 'with-time', title: 'With time picker', render: WithTime, code: withTimeCode },
    { id: 'sizes', title: 'Sizes', render: Sizes, code: sizesCode },
    { id: 'languages', title: 'Multiple languages', render: Languages, code: languagesCode },
    { id: 'locale-and-constraints', title: 'Locale + constraints', render: LocaleAndConstraints, code: localeAndConstraintsCode },
  ],
};
