import { useState } from 'react';
import { CalendarView, Heading } from 'move';
import type { CalendarEvent, CalendarViewMode } from 'move';
import { DocPage, type Example } from '../components/DocPage';

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const sampleEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Standup', start: new Date(year, month, today.getDate(), 9, 0), end: new Date(year, month, today.getDate(), 9, 30), color: 'primary' },
  { id: '2', title: 'Design Review', start: new Date(year, month, today.getDate(), 10, 0), end: new Date(year, month, today.getDate(), 11, 0), color: 'info' },
  { id: '3', title: 'Lunch Break', start: new Date(year, month, today.getDate(), 12, 0), end: new Date(year, month, today.getDate(), 13, 0), color: 'success' },
  { id: '4', title: 'Sprint Planning', start: new Date(year, month, today.getDate(), 14, 0), end: new Date(year, month, today.getDate(), 15, 30), color: 'warning' },
  { id: '5', title: 'Code Review', start: new Date(year, month, today.getDate(), 10, 30), end: new Date(year, month, today.getDate(), 11, 30), color: 'danger' },
  { id: '6', title: 'Project Deadline', start: new Date(year, month, today.getDate() + 2), allDay: true, color: 'danger' },
  { id: '7', title: 'Workshop', start: new Date(year, month, today.getDate() + 3, 9, 0), end: new Date(year, month, today.getDate() + 3, 17, 0), color: 'info' },
  { id: '8', title: 'One-on-One', start: new Date(year, month, today.getDate() + 1, 11, 0), end: new Date(year, month, today.getDate() + 1, 11, 30), color: 'primary' },
  { id: '9', title: 'Team Outing', start: new Date(year, month, today.getDate() + 5), allDay: true, color: 'success' },
  { id: '10', title: 'Bug Bash', start: new Date(year, month, today.getDate() + 4, 13, 0), end: new Date(year, month, today.getDate() + 4, 17, 0), color: 'warning' },
];

function FullExample() {
  const [view, setView] = useState<CalendarViewMode>('week');
  return (
    <CalendarView.Root
      view={view}
      onViewChange={setView}
      events={sampleEvents}
      onEventClick={(event, e) => alert(`Clicked: ${event.title}`)}
    >
      <CalendarView.Header>
        <CalendarView.Nav />
        <CalendarView.Title />
        <CalendarView.Today />
        <CalendarView.ViewSwitcher />
      </CalendarView.Header>
      <CalendarView.Body />
    </CalendarView.Root>
  );
}

function DayViewExample() {
  return (
    <CalendarView.Root defaultView="day" events={sampleEvents}>
      <CalendarView.Header>
        <CalendarView.Nav />
        <CalendarView.Title />
        <CalendarView.Today />
      </CalendarView.Header>
      <CalendarView.Body />
    </CalendarView.Root>
  );
}

function WeekViewExample() {
  return (
    <CalendarView.Root defaultView="week" events={sampleEvents}>
      <CalendarView.Header>
        <CalendarView.Nav />
        <CalendarView.Title />
        <CalendarView.Today />
      </CalendarView.Header>
      <CalendarView.Body />
    </CalendarView.Root>
  );
}

function HalfHourExample() {
  return (
    <CalendarView.Root defaultView="week" events={sampleEvents} slotInterval={30} startHour={7} endHour={19}>
      <CalendarView.Header>
        <CalendarView.Nav />
        <CalendarView.Title />
        <CalendarView.Today />
      </CalendarView.Header>
      <CalendarView.Body />
    </CalendarView.Root>
  );
}

function AgendaExample() {
  return (
    <CalendarView.Root defaultView="agenda" events={sampleEvents}>
      <CalendarView.Header>
        <CalendarView.Nav />
        <CalendarView.Title />
        <CalendarView.Today />
      </CalendarView.Header>
      <CalendarView.Body />
    </CalendarView.Root>
  );
}

const examples: Example[] = [
  {
    id: 'full',
    name: 'Full Calendar',
    description: 'All views with view switcher',
    component: <FullExample />,
    code: `const [view, setView] = useState<CalendarViewMode>('week');

<CalendarView.Root
  view={view}
  onViewChange={setView}
  events={events}
  onEventClick={(event) => console.log(event)}
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
  {
    id: 'day',
    name: 'Day View',
    description: 'Single day with time grid',
    component: <DayViewExample />,
    code: `<CalendarView.Root defaultView="day" events={events}>
  <CalendarView.Header>
    <CalendarView.Nav />
    <CalendarView.Title />
    <CalendarView.Today />
  </CalendarView.Header>
  <CalendarView.Body />
</CalendarView.Root>`,
  },
  {
    id: 'week',
    name: 'Week View',
    description: 'Seven-day time grid',
    component: <WeekViewExample />,
    code: `<CalendarView.Root defaultView="week" events={events}>
  <CalendarView.Header>
    <CalendarView.Nav />
    <CalendarView.Title />
    <CalendarView.Today />
  </CalendarView.Header>
  <CalendarView.Body />
</CalendarView.Root>`,
  },
  {
    id: 'half-hour',
    name: 'Half-Hour Slots',
    description: 'Week view with 30-minute intervals and constrained hours',
    component: <HalfHourExample />,
    code: `<CalendarView.Root defaultView="week" events={events} slotInterval={30} startHour={7} endHour={19}>
  <CalendarView.Header>
    <CalendarView.Nav />
    <CalendarView.Title />
    <CalendarView.Today />
  </CalendarView.Header>
  <CalendarView.Body />
</CalendarView.Root>`,
  },
  {
    id: 'agenda',
    name: 'Agenda View',
    description: 'Flat chronological event list',
    component: <AgendaExample />,
    code: `<CalendarView.Root defaultView="agenda" events={events}>
  <CalendarView.Header>
    <CalendarView.Nav />
    <CalendarView.Title />
    <CalendarView.Today />
  </CalendarView.Header>
  <CalendarView.Body />
</CalendarView.Root>`,
  },
];

export function CalendarViewDemo() {
  return (
    <DocPage.Root defaultExample="full">
      <DocPage.Header
        title="CalendarView"
        description="A full-page calendar with day, week, month, and agenda views for displaying events."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="CalendarView.Root"
        properties={[
          { name: 'view', type: "'day' | 'week' | 'month' | 'agenda'", description: 'Controlled current view mode.' },
          { name: 'defaultView', type: "'day' | 'week' | 'month' | 'agenda'", default: "'month'", description: 'Uncontrolled initial view mode.' },
          { name: 'onViewChange', type: '(view: CalendarViewMode) => void', description: 'Called when the view mode changes.' },
          { name: 'date', type: 'Date', description: 'Controlled current date.' },
          { name: 'defaultDate', type: 'Date', default: 'new Date()', description: 'Uncontrolled initial date.' },
          { name: 'onDateChange', type: '(date: Date) => void', description: 'Called when the current date changes.' },
          { name: 'events', type: 'CalendarEvent[]', description: 'Events to display in the calendar views.' },
          { name: 'locale', type: 'string', default: "'en-US'", description: 'BCP 47 locale for formatting and layout.' },
          { name: 'weekStartsOn', type: 'number', default: '0', description: 'Day the week starts on (0 = Sunday, 1 = Monday, etc).' },
          { name: 'startHour', type: 'number', default: '0', description: 'First hour shown in day/week time grids.' },
          { name: 'endHour', type: 'number', default: '24', description: 'Last hour shown in day/week time grids.' },
          { name: 'slotInterval', type: '30 | 60', default: '60', description: 'Slot interval in minutes for day/week time grids.' },
          { name: 'maxEventsPerCell', type: 'number', default: '3', description: 'Maximum events shown per cell in month view before overflow.' },
          { name: 'renderEvent', type: '(event, context) => ReactNode', description: 'Custom render function for event items.' },
          { name: 'onEventClick', type: '(event: CalendarEvent, e: React.MouseEvent) => void', description: 'Called when an event is clicked.' },
        ]}
      />

      <DocPage.ApiSection
        title="CalendarView.Header"
        properties={[]}
      />

      <DocPage.ApiSection
        title="CalendarView.Nav"
        properties={[]}
      />

      <DocPage.ApiSection
        title="CalendarView.Title"
        properties={[]}
      />

      <DocPage.ApiSection
        title="CalendarView.Today"
        properties={[]}
      />

      <DocPage.ApiSection
        title="CalendarView.ViewSwitcher"
        properties={[
          { name: 'views', type: "CalendarViewMode[]", default: "['day', 'week', 'month', 'agenda']", description: 'Which view options to show in the switcher.' },
        ]}
      />

      <DocPage.ApiSection
        title="CalendarView.Body"
        properties={[]}
      />
    </DocPage.Root>
  );
}
