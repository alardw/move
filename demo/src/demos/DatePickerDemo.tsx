import { useState } from 'react';
import { DatePicker, Calendar, Heading } from 'move';
import type { DateRange } from 'move';
import { DocPage, type Example } from '../components/DocPage';

function BasicExample() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div>
      <DatePicker.Root value={date} onValueChange={setDate}>
        <DatePicker.Trigger>
          <DatePicker.Input placeholder="Pick a date" />
        </DatePicker.Trigger>
        <DatePicker.Portal>
          <DatePicker.Content>
            <Calendar.Nav />
            <Calendar.Grid />
          </DatePicker.Content>
        </DatePicker.Portal>
      </DatePicker.Root>
    </div>
  );
}

function RangeExample() {
  const [range, setRange] = useState<DateRange | null>(null);
  return (
    <div>
      <DatePicker.Root mode="range" value={range} onValueChange={setRange}>
        <DatePicker.Trigger>
          <DatePicker.Input />
        </DatePicker.Trigger>
        <DatePicker.Portal>
          <DatePicker.Content>
            <Calendar.Nav />
            <Calendar.Grid />
          </DatePicker.Content>
        </DatePicker.Portal>
      </DatePicker.Root>
    </div>
  );
}

function ConstraintsExample() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div>
      <DatePicker.Root
        value={date}
        onValueChange={setDate}
        constraints={{ min: new Date(), disabledDaysOfWeek: [0, 6] }}
      >
        <DatePicker.Trigger>
          <DatePicker.Input placeholder="Weekdays only" />
        </DatePicker.Trigger>
        <DatePicker.Portal>
          <DatePicker.Content>
            <Calendar.Nav />
            <Calendar.Grid />
          </DatePicker.Content>
        </DatePicker.Portal>
      </DatePicker.Root>
      <p style={{ marginTop: '0.5rem', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
        Future weekdays only
      </p>
    </div>
  );
}

function WithTimeExample() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-lg)' }}>
      <div>
        <DatePicker.Root value={date} onValueChange={setDate} showTime>
          <DatePicker.Trigger>
            <DatePicker.Input placeholder="Pick date & time" />
          </DatePicker.Trigger>
          <DatePicker.Portal>
            <DatePicker.Content>
              <Calendar.Nav />
              <Calendar.Grid />
            </DatePicker.Content>
          </DatePicker.Portal>
        </DatePicker.Root>
        {date && (
          <p style={{ marginTop: '0.5rem', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
            {date.toLocaleString()}
          </p>
        )}
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>In popup</p>
        <DatePicker.Root showTime={{ placement: 'popup' }}>
          <DatePicker.Trigger>
            <DatePicker.Input placeholder="Pick date & time" />
          </DatePicker.Trigger>
          <DatePicker.Portal>
            <DatePicker.Content>
              <Calendar.Nav />
              <Calendar.Grid />
            </DatePicker.Content>
          </DatePicker.Portal>
        </DatePicker.Root>
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>12-hour inline</p>
        <DatePicker.Root showTime={{ hourCycle: 12 }}>
          <DatePicker.Trigger>
            <DatePicker.Input placeholder="Pick date & time" />
          </DatePicker.Trigger>
          <DatePicker.Portal>
            <DatePicker.Content>
              <Calendar.Nav />
              <Calendar.Grid />
            </DatePicker.Content>
          </DatePicker.Portal>
        </DatePicker.Root>
      </div>
    </div>
  );
}

function LocaleExample() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div>
      <DatePicker.Root
        value={date}
        onValueChange={setDate}
        locale="de-DE"
        weekStartsOn={1}
      >
        <DatePicker.Trigger>
          <DatePicker.Input placeholder="Datum wählen" />
        </DatePicker.Trigger>
        <DatePicker.Portal>
          <DatePicker.Content>
            <Calendar.Nav />
            <Calendar.Grid />
          </DatePicker.Content>
        </DatePicker.Portal>
      </DatePicker.Root>
    </div>
  );
}

const examples: Example[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Simple date picker with popup calendar',
    component: <BasicExample />,
    code: `const [date, setDate] = useState<Date | null>(null);

<DatePicker.Root value={date} onValueChange={setDate}>
  <DatePicker.Trigger>
    <DatePicker.Input placeholder="Pick a date" />
  </DatePicker.Trigger>
  <DatePicker.Portal>
    <DatePicker.Content>
      <Calendar.Nav />
      <Calendar.Grid />
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>`,
  },
  {
    id: 'range',
    name: 'Range',
    description: 'Select a date range in the popup',
    component: <RangeExample />,
    code: `const [range, setRange] = useState<DateRange | null>(null);

<DatePicker.Root mode="range" value={range} onValueChange={setRange}>
  <DatePicker.Trigger>
    <DatePicker.Input />
  </DatePicker.Trigger>
  <DatePicker.Portal>
    <DatePicker.Content>
      <Calendar.Nav />
      <Calendar.Grid />
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>`,
  },
  {
    id: 'with-time',
    name: 'With Time',
    description: 'Date picker with integrated time selection via the showTime prop',
    component: <WithTimeExample />,
    code: `{/* Inline (default) */}
<DatePicker.Root value={date} onValueChange={setDate} showTime>
  ...
</DatePicker.Root>

{/* Inside popup */}
<DatePicker.Root showTime={{ placement: 'popup' }}>
  ...
</DatePicker.Root>

{/* 12-hour inline */}
<DatePicker.Root showTime={{ hourCycle: 12 }}>
  ...
</DatePicker.Root>`,
  },
  {
    id: 'constraints',
    name: 'Constraints',
    description: 'Disable weekends and past dates',
    component: <ConstraintsExample />,
    code: `<DatePicker.Root
  value={date}
  onValueChange={setDate}
  constraints={{ min: new Date(), disabledDaysOfWeek: [0, 6] }}
>
  <DatePicker.Trigger>
    <DatePicker.Input placeholder="Weekdays only" />
  </DatePicker.Trigger>
  <DatePicker.Portal>
    <DatePicker.Content>
      <Calendar.Nav />
      <Calendar.Grid />
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>`,
  },
  {
    id: 'locale',
    name: 'Locale',
    description: 'German locale with Monday start',
    component: <LocaleExample />,
    code: `<DatePicker.Root locale="de-DE" weekStartsOn={1} value={date} onValueChange={setDate}>
  <DatePicker.Trigger>
    <DatePicker.Input placeholder="Datum wählen" />
  </DatePicker.Trigger>
  <DatePicker.Portal>
    <DatePicker.Content>
      <Calendar.Nav />
      <Calendar.Grid />
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>`,
  },
];

export function DatePickerDemo() {
  return (
    <DocPage.Root defaultExample="basic">
      <DocPage.Header
        title="DatePicker"
        description="A form input with a popup calendar for selecting dates."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="DatePicker.Root"
        properties={[
          { name: 'mode', type: "'single' | 'range' | 'multiple'", default: "'single'", description: 'Selection mode.' },
          { name: 'value', type: 'Date | DateRange | Date[] | null', description: 'Controlled selected value.' },
          { name: 'defaultValue', type: 'Date | DateRange | Date[] | null', description: 'Uncontrolled initial value.' },
          { name: 'onValueChange', type: '(value: any) => void', description: 'Called when the selected value changes.' },
          { name: 'open', type: 'boolean', description: 'Controlled open state of the popover.' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the popover is open by default.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the popover open state changes.' },
          { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Close the popover after a date is selected.' },
          { name: 'locale', type: 'string', default: "'en-US'", description: <><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument" target="_blank" rel="noopener noreferrer">BCP 47</a> locale for formatting and parsing (e.g. "en-US", "de-DE", "ja-JP").</> },
          { name: 'weekStartsOn', type: 'number', default: '0', description: 'Day the week starts on (0 = Sunday, 1 = Monday, etc).' },
          { name: 'constraints', type: 'CalendarConstraints', description: 'Min/max dates, disabled dates, and disabled days of week.' },
          { name: 'numberOfMonths', type: 'number', default: '1', description: 'Number of months to display simultaneously.' },
          { name: 'showWeekNumbers', type: 'boolean', default: 'false', description: 'Show ISO week numbers.' },
          { name: 'yearRange', type: 'number', default: '10', description: 'Number of years before/after the current year in the year picker.' },
          { name: 'fixedWeeks', type: 'boolean', default: 'false', description: 'Always render 6 rows per month to prevent layout shifts.' },
          { name: 'events', type: 'CalendarEvent[]', description: 'Events to display as dots on calendar days.' },
          { name: 'renderDayCell', type: '(date, data) => ReactNode', description: 'Custom render function for day cells.' },
          { name: 'renderEvent', type: '(event, context) => ReactNode', description: 'Custom render function for event indicators.' },
          { name: 'rangeLabels', type: '{ from: string; to: string }', default: "'Select start/end date'", description: 'Instructional labels shown in the popover during range selection.' },
          { name: 'className', type: 'string', description: 'Additional CSS class for the root wrapper.' },
          { name: 'style', type: 'CSSProperties', description: 'Inline styles for the root wrapper.' },
          { name: 'showTime', type: "boolean | { hourCycle?: 12 | 24; placement?: 'inline' | 'popup' }", default: 'false', description: "Show a time picker. Defaults to 'inline' (next to the date input). Use placement: 'popup' to render inside the calendar popover." },
          { name: 'animate', type: 'PopupAnimate | false', description: 'Animates DatePicker.Content (popup enter/exit) and calendar day cells (staggered entrance).' },
        ]}
      />

      <DocPage.ApiSection
        title="DatePicker.Input"
        properties={[
          { name: 'placeholder', type: 'string', default: "'Select date'", description: 'Placeholder text. In single mode, defaults to locale date pattern.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size.' },
          { name: 'className', type: 'string', description: 'Additional CSS class.' },
          { name: 'style', type: 'CSSProperties', description: 'Inline styles.' },
        ]}
      />

      <DocPage.ApiSection
        title="DatePicker.Content"
        properties={[
          { name: 'sideOffset', type: 'number', default: '4', description: 'Distance in pixels from the trigger.' },
          { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Horizontal alignment relative to the trigger.' },
          { name: 'className', type: 'string', description: 'Additional CSS class.' },
          { name: 'style', type: 'CSSProperties', description: 'Inline styles.' },
        ]}
      />

      <DocPage.ApiSection
        title="CalendarConstraints"
        properties={[
          { name: 'min', type: 'Date', description: 'Earliest selectable date.' },
          { name: 'max', type: 'Date', description: 'Latest selectable date.' },
          { name: 'disabledDates', type: 'Date[]', description: 'Specific dates that cannot be selected.' },
          { name: 'disabledDaysOfWeek', type: 'number[]', description: 'Days of the week to disable (0 = Sunday, 6 = Saturday).' },
        ]}
      />

      <DocPage.ApiSection
        title="Calendar.Nav"
        properties={[
          { name: 'sp', type: '{ prevButton, nextButton }', description: 'Slot props for the prev/next buttons. Use children to replace the icons.' },
          { name: 'className', type: 'string', description: 'Additional CSS class.' },
        ]}
      />
    </DocPage.Root>
  );
}
