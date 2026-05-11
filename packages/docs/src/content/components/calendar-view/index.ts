import { spec } from '@move-specs/calendar/CalendarView/CalendarView.spec';

import type { ComponentContent } from '../types';
import { meta } from './meta';

import Month from './samples/month';
import monthCode from './samples/month?raw';
import Week from './samples/week';
import weekCode from './samples/week?raw';
import Day from './samples/day';
import dayCode from './samples/day?raw';
import Agenda from './samples/agenda';
import agendaCode from './samples/agenda?raw';
import Controlled from './samples/controlled';
import controlledCode from './samples/controlled?raw';

export const content: ComponentContent = {
  meta,
  spec,
  samples: [
    { id: 'month', title: 'Month view', render: Month, code: monthCode },
    { id: 'week', title: 'Week view', render: Week, code: weekCode },
    { id: 'day', title: 'Day view', render: Day, code: dayCode },
    { id: 'agenda', title: 'Agenda view', render: Agenda, code: agendaCode },
    { id: 'controlled', title: 'Controlled view + date', render: Controlled, code: controlledCode },
  ],
};
