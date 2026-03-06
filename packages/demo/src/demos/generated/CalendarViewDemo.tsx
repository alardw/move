// Generated from CalendarView.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React, { useState, useMemo } from 'react';
import { CalendarView } from 'move';
import type { DemoDefinition } from '../types';

const sampleEvents = [
  {
    id: '1',
    title: 'Team Standup',
    start: new Date(2026, 2, 2, 9, 0),
    end: new Date(2026, 2, 2, 9, 30),
    color: '#3b82f6',
  },
  {
    id: '2',
    title: 'Design Review',
    start: new Date(2026, 2, 2, 14, 0),
    end: new Date(2026, 2, 2, 15, 0),
    color: '#8b5cf6',
  },
  {
    id: '3',
    title: 'Sprint Planning',
    start: new Date(2026, 2, 3, 10, 0),
    end: new Date(2026, 2, 3, 11, 30),
    color: '#10b981',
  },
  {
    id: '4',
    title: 'Company All-Hands',
    start: new Date(2026, 2, 4),
    allDay: true,
    color: '#f59e0b',
  },
  {
    id: '5',
    title: 'Lunch & Learn',
    start: new Date(2026, 2, 5, 12, 0),
    end: new Date(2026, 2, 5, 13, 0),
    color: '#ef4444',
  },
  {
    id: '6',
    title: 'Code Freeze',
    start: new Date(2026, 2, 6, 17, 0),
    end: new Date(2026, 2, 6, 17, 30),
    color: '#6366f1',
  },
];

export const demo: DemoDefinition = {
  id: 'calendar:CalendarView',
  name: 'CalendarView',
  category: 'calendar',
  description: 'Full-featured calendar view with month, week, day, and agenda modes, event rendering, and customizable time slots.',
  controls: [
    { name: 'defaultView', kind: 'select', options: ['month', 'week', 'day', 'agenda'], defaultValue: 'month' },
    { name: 'startHour', kind: 'number', defaultValue: 7 },
    { name: 'endHour', kind: 'number', defaultValue: 20 },
    { name: 'showAllDay', kind: 'boolean', defaultValue: true },
  ],
  initialProps: {
    defaultView: 'month',
    startHour: 7,
    endHour: 20,
    showAllDay: true,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Usage',
      render: () => (
        <div style={{ maxWidth: 900 }}>
          <CalendarView.Root
            defaultView="month"
            events={sampleEvents}
            defaultDate={new Date(2026, 2, 1)}
          >
            <CalendarView.Header>
              <CalendarView.Nav />
              <CalendarView.Title />
              <CalendarView.Today />
              <CalendarView.ViewSwitcher />
            </CalendarView.Header>
            <CalendarView.Body />
          </CalendarView.Root>
        </div>
      ),
      code: `<CalendarView.Root defaultView="month" events={events}>
  <CalendarView.Header>
    <CalendarView.Nav />
    <CalendarView.Title />
    <CalendarView.Today />
    <CalendarView.ViewSwitcher />
  </CalendarView.Header>
  <CalendarView.Body />
</CalendarView.Root>`,
    },
    {
      id: 'playground',
      label: 'Playground',
      render: (props) => (
        <div style={{ maxWidth: 900 }}>
          <CalendarView.Root
            defaultView={props.defaultView as 'month' | 'week' | 'day' | 'agenda'}
            events={sampleEvents}
            defaultDate={new Date(2026, 2, 1)}
            startHour={Number(props.startHour) || 7}
            endHour={Number(props.endHour) || 20}
            showAllDay={props.showAllDay as boolean}
          >
            <CalendarView.Header>
              <CalendarView.Nav />
              <CalendarView.Title />
              <CalendarView.Today />
              <CalendarView.ViewSwitcher />
            </CalendarView.Header>
            <CalendarView.Body />
          </CalendarView.Root>
        </div>
      ),
      code: (props) => `<CalendarView.Root
  defaultView="${props.defaultView}"
  events={events}
  startHour={${props.startHour}}
  endHour={${props.endHour}}
  ${props.showAllDay ? 'showAllDay' : 'showAllDay={false}'}
>
  <CalendarView.Header>
    <CalendarView.Nav />
    <CalendarView.Title />
    <CalendarView.Today />
    <CalendarView.ViewSwitcher />
  </CalendarView.Header>
  <CalendarView.Body />
</CalendarView.Root>`,
    },
  ],
  render: (props) => (
    <div style={{ maxWidth: 900 }}>
      <CalendarView.Root
        defaultView={props.defaultView as 'month' | 'week' | 'day' | 'agenda'}
        events={sampleEvents}
        defaultDate={new Date(2026, 2, 1)}
        startHour={Number(props.startHour) || 7}
        endHour={Number(props.endHour) || 20}
        showAllDay={props.showAllDay as boolean}
      >
        <CalendarView.Header>
          <CalendarView.Nav />
          <CalendarView.Title />
          <CalendarView.Today />
          <CalendarView.ViewSwitcher />
        </CalendarView.Header>
        <CalendarView.Body />
      </CalendarView.Root>
    </div>
  ),
};
