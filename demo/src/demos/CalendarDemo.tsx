import { useState } from 'react';
import { Calendar, Heading } from 'move';
import type { DateRange, CalendarEvent } from 'move';
import { DocPage, type Example } from '../components/DocPage';

const sampleEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Meeting', start: new Date(2026, 1, 16, 10, 0), color: 'primary' },
  { id: '2', title: 'Lunch', start: new Date(2026, 1, 16, 12, 0), color: 'success' },
  { id: '3', title: 'Deadline', start: new Date(2026, 1, 20), allDay: true, color: 'danger' },
  { id: '4', title: 'Workshop', start: new Date(2026, 1, 25, 14, 0), color: 'info' },
];

function SingleExample() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div>
      <Calendar.Root value={date} onValueChange={setDate}>
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      <p style={{ marginTop: '0.5rem', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
        Selected: {date ? date.toLocaleDateString() : 'None'}
      </p>
    </div>
  );
}

function RangeExample() {
  const [range, setRange] = useState<DateRange | null>(null);
  return (
    <div>
      <Calendar.Root mode="range" value={range} onValueChange={setRange}>
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      <p style={{ marginTop: '0.5rem', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
        Range: {range?.from ? `${range.from.toLocaleDateString()} — ${range.to?.toLocaleDateString() ?? '...'}` : 'None'}
      </p>
    </div>
  );
}

function MultipleExample() {
  const [dates, setDates] = useState<Date[]>([]);
  return (
    <div>
      <Calendar.Root mode="multiple" value={dates} onValueChange={setDates}>
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      <p style={{ marginTop: '0.5rem', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
        Selected: {dates.length > 0 ? dates.map(d => d.toLocaleDateString()).join(', ') : 'None'}
      </p>
    </div>
  );
}

function WithEventsExample() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <Calendar.Root value={date} onValueChange={setDate} events={sampleEvents}>
      <Calendar.Nav />
      <Calendar.Grid />
    </Calendar.Root>
  );
}

function ConstraintsExample() {
  const [date, setDate] = useState<Date | null>(null);
  const today = new Date();
  return (
    <div>
      <Calendar.Root
        value={date}
        onValueChange={setDate}
        constraints={{
          min: today,
          disabledDaysOfWeek: [0, 6],
        }}
      >
        <Calendar.Nav />
        <Calendar.Grid />
      </Calendar.Root>
      <p style={{ marginTop: '0.5rem', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
        Future weekdays only. Selected: {date ? date.toLocaleDateString() : 'None'}
      </p>
    </div>
  );
}

function MultiMonthExample() {
  const [range, setRange] = useState<DateRange | null>(null);
  return (
    <Calendar.Root mode="range" numberOfMonths={2} value={range} onValueChange={setRange}>
      <Calendar.Nav />
      <Calendar.Grid />
    </Calendar.Root>
  );
}

function LocaleExample() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <Calendar.Root locale="de-DE" weekStartsOn={1} value={date} onValueChange={setDate}>
      <Calendar.Nav />
      <Calendar.Grid />
    </Calendar.Root>
  );
}

const examples: Example[] = [
  {
    id: 'single',
    name: 'Single',
    description: 'Pick a single date',
    component: <SingleExample />,
    code: `const [date, setDate] = useState<Date | null>(null);

<Calendar.Root value={date} onValueChange={setDate}>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>`,
  },
  {
    id: 'range',
    name: 'Range',
    description: 'Select a date range',
    component: <RangeExample />,
    code: `const [range, setRange] = useState<DateRange | null>(null);

<Calendar.Root mode="range" value={range} onValueChange={setRange}>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>`,
  },
  {
    id: 'multiple',
    name: 'Multiple',
    description: 'Toggle multiple dates on/off',
    component: <MultipleExample />,
    code: `const [dates, setDates] = useState<Date[]>([]);

<Calendar.Root mode="multiple" value={dates} onValueChange={setDates}>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>`,
  },
  {
    id: 'events',
    name: 'Events',
    description: 'Display event dots on dates',
    component: <WithEventsExample />,
    code: `<Calendar.Root events={events} value={date} onValueChange={setDate}>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>`,
  },
  {
    id: 'constraints',
    name: 'Constraints',
    description: 'Disable weekends and past dates',
    component: <ConstraintsExample />,
    code: `<Calendar.Root
  constraints={{ min: new Date(), disabledDaysOfWeek: [0, 6] }}
  value={date}
  onValueChange={setDate}
>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>`,
  },
  {
    id: 'multi-month',
    name: 'Multi-Month Range',
    description: 'Two months side by side with range selection',
    component: <MultiMonthExample />,
    code: `<Calendar.Root mode="range" numberOfMonths={2} value={range} onValueChange={setRange}>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>`,
  },
  {
    id: 'locale',
    name: 'Locale',
    description: 'German locale with Monday start',
    component: <LocaleExample />,
    code: `<Calendar.Root locale="de-DE" weekStartsOn={1} value={date} onValueChange={setDate}>
  <Calendar.Nav />
  <Calendar.Grid />
</Calendar.Root>`,
  },
];

export function CalendarDemo() {
  return (
    <DocPage.Root defaultExample="single">
      <DocPage.Header
        title="Calendar"
        description="An inline calendar for date selection with support for single, range, and multiple selection modes."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Calendar.Root"
        properties={[
          { name: 'mode', type: "'single' | 'range' | 'multiple'", default: "'single'", description: 'Selection mode.' },
          { name: 'value', type: 'Date | DateRange | Date[] | null', description: 'Controlled selected value.' },
          { name: 'defaultValue', type: 'Date | DateRange | Date[] | null', description: 'Uncontrolled initial value.' },
          { name: 'onValueChange', type: '(value: any) => void', description: 'Called when the selected value changes.' },
          { name: 'events', type: 'CalendarEvent[]', description: 'Events to display as dots on calendar days.' },
          { name: 'locale', type: 'string', default: "'en-US'", description: 'BCP 47 locale for formatting and layout.' },
          { name: 'weekStartsOn', type: 'number', default: '0', description: 'Day the week starts on (0 = Sunday, 1 = Monday, etc).' },
          { name: 'constraints', type: 'CalendarConstraints', description: 'Min/max dates, disabled dates, and disabled days of week.' },
          { name: 'numberOfMonths', type: 'number', default: '1', description: 'Number of months to display simultaneously.' },
          { name: 'showWeekNumbers', type: 'boolean', default: 'false', description: 'Show ISO week numbers.' },
          { name: 'yearRange', type: 'number', default: '12', description: 'Number of years before/after the current year in the year picker.' },
          { name: 'fixedWeeks', type: 'boolean', default: 'false', description: 'Always render 6 rows per month to prevent layout shifts.' },
          { name: 'renderDayCell', type: '(date, data) => ReactNode', description: 'Custom render function for day cells.' },
          { name: 'renderEvent', type: '(event, context) => ReactNode', description: 'Custom render function for event indicators.' },
        ]}
      />

      <DocPage.ApiSection
        title="Calendar.Nav"
        properties={[
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: prevButton, nextButton.' },
        ]}
      />

    </DocPage.Root>
  );
}
