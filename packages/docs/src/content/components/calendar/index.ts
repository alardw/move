import { spec } from '@move-specs/calendar/Calendar/Calendar.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Single from './samples/single';
import singleCode from './samples/single?raw';
import Range from './samples/range';
import rangeCode from './samples/range?raw';
import Multiple from './samples/multiple';
import multipleCode from './samples/multiple?raw';
import WithEvents from './samples/with-events';
import withEventsCode from './samples/with-events?raw';
import LocaleAndConstraints from './samples/locale-and-constraints';
import localeAndConstraintsCode from './samples/locale-and-constraints?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'single', title: 'Single date', render: Single, code: singleCode },
    { id: 'range', title: 'Date range', render: Range, code: rangeCode },
    { id: 'multiple', title: 'Multi-select', render: Multiple, code: multipleCode },
    { id: 'with-events', title: 'With events', render: WithEvents, code: withEventsCode },
    { id: 'locale-and-constraints', title: 'Locale + constraints', render: LocaleAndConstraints, code: localeAndConstraintsCode },
  ],
};
