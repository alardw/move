import { useState } from 'react';
import { TimeField, DatePicker, Calendar, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <TimeField defaultValue="09:30" />
      </DemoSample>
    </Stack>
  );
}

function GranularityExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Hour">
        <TimeField granularity="hour" defaultValue="14" />
      </DemoSample>
      <DemoSample label="Minute">
        <TimeField granularity="minute" defaultValue="14:30" />
      </DemoSample>
      <DemoSample label="Second">
        <TimeField granularity="second" defaultValue="14:30:45" />
      </DemoSample>
    </Stack>
  );
}

function HourCycleExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="24-hour">
        <TimeField hourCycle={24} defaultValue="14:30" />
      </DemoSample>
      <DemoSample label="12-hour">
        <TimeField hourCycle={12} defaultValue="14:30" />
      </DemoSample>
    </Stack>
  );
}

function WithDropdownExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Dropdown">
        <TimeField withDropdown defaultValue="10:15" />
      </DemoSample>
      <DemoSample label="12h + dropdown">
        <TimeField withDropdown hourCycle={12} defaultValue="14:30" />
      </DemoSample>
      <DemoSample label="Seconds + dropdown">
        <TimeField withDropdown granularity="second" defaultValue="10:15:30" />
      </DemoSample>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Small">
        <TimeField size="sm" defaultValue="09:30" />
      </DemoSample>
      <DemoSample label="Medium">
        <TimeField size="md" defaultValue="09:30" />
      </DemoSample>
      <DemoSample label="Large">
        <TimeField size="lg" defaultValue="09:30" />
      </DemoSample>
    </Stack>
  );
}

function ControlledExample() {
  const [time, setTime] = useState('14:30');
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Controlled">
        <Stack gap="lg" align="center">
          <TimeField value={time} onValueChange={setTime} />
          <span style={{ fontFamily: 'var(--move-font-code)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
            {time}
          </span>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

function DatePickerTimeExample() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Inline (default)">
        <Stack gap="lg" align="center">
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
            <span style={{ fontFamily: 'var(--move-font-code)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
              {date.toLocaleString()}
            </span>
          )}
        </Stack>
      </DemoSample>
      <DemoSample label="In popup">
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
      </DemoSample>
      <DemoSample label="Inline 12h">
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
      </DemoSample>
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Slot props">
        <TimeField defaultValue="10:30" />
      </DemoSample>
      <DemoSample label="Invalid">
        <TimeField defaultValue="10:30" invalid />
      </DemoSample>
      <DemoSample label="Disabled">
        <TimeField defaultValue="10:30" disabled />
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A segmented time input with individually focusable hour and minute fields.',
    component: <UsageExample />,
    code: `import { TimeField } from 'move';

<TimeField defaultValue="09:30" />`,
  },
  {
    id: 'granularity',
    name: 'Granularity',
    description: 'Control which time segments are shown: hour only, hour + minute, or hour + minute + second.',
    component: <GranularityExample />,
    code: `<TimeField granularity="hour" defaultValue="14" />
<TimeField granularity="minute" defaultValue="14:30" />
<TimeField granularity="second" defaultValue="14:30:45" />`,
  },
  {
    id: 'hour-cycle',
    name: 'Hour Cycle',
    description: '24-hour vs 12-hour display with AM/PM toggle.',
    component: <HourCycleExample />,
    code: `<TimeField hourCycle={24} defaultValue="14:30" />
<TimeField hourCycle={12} defaultValue="14:30" />`,
  },
  {
    id: 'with-dropdown',
    name: 'With Dropdown',
    description: 'Scroll column picker for visual time selection.',
    component: <WithDropdownExample />,
    code: `<TimeField withDropdown defaultValue="10:15" />
<TimeField withDropdown hourCycle={12} defaultValue="14:30" />
<TimeField withDropdown granularity="second" defaultValue="10:15:30" />`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Small, medium, and large sizes matching other form inputs.',
    component: <SizesExample />,
    code: `<TimeField size="sm" defaultValue="09:30" />
<TimeField size="md" defaultValue="09:30" />
<TimeField size="lg" defaultValue="09:30" />`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Fully controlled time field with external state display.',
    component: <ControlledExample />,
    code: `const [time, setTime] = useState('14:30');

<TimeField value={time} onValueChange={setTime} />
<span>{time}</span>`,
  },
  {
    id: 'with-datepicker',
    name: 'With DatePicker',
    description: 'Integrated time selection within DatePicker via the showTime prop.',
    component: <DatePickerTimeExample />,
    code: `{/* Inline (default) */}
<DatePicker.Root value={date} onValueChange={setDate} showTime>
  ...
</DatePicker.Root>

{/* Inside popup */}
<DatePicker.Root showTime={{ placement: 'popup' }}>
  ...
</DatePicker.Root>

{/* Inline 12h */}
<DatePicker.Root showTime={{ hourCycle: 12 }}>
  ...
</DatePicker.Root>`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Slot props, invalid state, and disabled state.',
    component: <CustomStylingExample />,
    code: `{/* Slot props */}
<TimeField defaultValue="10:30" sp={{ root: { style: { borderColor: 'var(--move-primary)' } } }} />

{/* Invalid */}
<TimeField defaultValue="10:30" invalid />

{/* Disabled */}
<TimeField defaultValue="10:30" disabled />`,
  },
];

export function TimeFieldDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="TimeField"
        description="A segmented time input with individually focusable segments, optional scroll dropdown, and DatePicker integration."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="TimeField"
        properties={[
          { name: 'value', type: 'string', description: 'Controlled value in 24h format ("HH:mm" or "HH:mm:ss").' },
          { name: 'defaultValue', type: 'string', description: 'Default value for uncontrolled mode.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the value changes.' },
          { name: 'granularity', type: "'hour' | 'minute' | 'second'", default: "'minute'", description: 'Which time segments to display.' },
          { name: 'hourCycle', type: '12 | 24', default: '24', description: 'Whether to use 12-hour or 24-hour format.' },
          { name: 'withDropdown', type: 'boolean', default: 'false', description: 'Show a scroll column picker dropdown.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the input.' },
          { name: 'disabled', type: 'boolean', description: 'Disable the entire field.' },
          { name: 'invalid', type: 'boolean', description: 'Show invalid/error styling.' },
          { name: 'min', type: 'string', description: 'Minimum time constraint (24h format).' },
          { name: 'max', type: 'string', description: 'Maximum time constraint (24h format).' },
          { name: 'step', type: 'number', default: '1', description: 'Arrow key increment in seconds.' },
        ]}
      />

      <DocPage.ApiSection
        title="TimeField.Segment"
        properties={[
          { name: 'segment', type: "'hour' | 'minute' | 'second'", description: 'Which segment this renders.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the segment element.' },
        ]}
      />

      <DocPage.ApiSection
        title="TimeField.DropdownColumn"
        properties={[
          { name: 'segment', type: "'hour' | 'minute' | 'second' | 'period'", description: 'Which column this controls.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the dropdownColumn element.' },
        ]}
      />
    </DocPage.Root>
  );
}
