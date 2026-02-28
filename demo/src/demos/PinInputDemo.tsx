import { useState } from 'react';
import { PinInput, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <DemoSample label="Basic">
      <PinInput length={4} />
    </DemoSample>
  );
}

function SizesExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Small">
        <PinInput size="sm" length={4} />
      </DemoSample>
      <DemoSample label="Medium">
        <PinInput size="md" length={4} />
      </DemoSample>
      <DemoSample label="Large">
        <PinInput size="lg" length={4} />
      </DemoSample>
    </Stack>
  );
}

function GroupingExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="3 + 3">
        <PinInput length={6} grouping={[3, 3]} />
      </DemoSample>
      <DemoSample label="2 + 2 + 2">
        <PinInput length={6} grouping={[2, 2, 2]} />
      </DemoSample>
      <DemoSample label="4 + 2">
        <PinInput length={6} grouping={[4, 2]} />
      </DemoSample>
    </Stack>
  );
}

function MaskExample() {
  return (
    <DemoSample label="Masked">
      <PinInput length={4} mask />
    </DemoSample>
  );
}

function TypesExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Numbers only">
        <PinInput length={4} type="number" />
      </DemoSample>
      <DemoSample label="Alphanumeric">
        <PinInput length={4} type="alphanumeric" />
      </DemoSample>
    </Stack>
  );
}

function InvalidExample() {
  return (
    <DemoSample label="Invalid">
      <PinInput length={4} invalid defaultValue="12" />
    </DemoSample>
  );
}

function ControlledExample() {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');

  return (
    <DemoSample label="Controlled">
      <Stack direction="column" gap="md">
        <PinInput
          length={6}
          grouping={[3, 3]}
          value={value}
          onChange={setValue}
          onComplete={(code) => setStatus(`Code entered: ${code}`)}
        />
        {status && (
          <span style={{ fontFamily: 'var(--move-font-body)', fontSize: 'var(--move-size-sm)', color: 'var(--move-success)' }}>
            {status}
          </span>
        )}
      </Stack>
    </DemoSample>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A simple 4-digit code entry.',
    component: <UsageExample />,
    code: `import { PinInput } from 'move';

<PinInput length={4} />`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From compact to spacious.',
    component: <SizesExample />,
    code: `<PinInput size="sm" length={4} />
<PinInput size="md" length={4} />
<PinInput size="lg" length={4} />`,
  },
  {
    id: 'grouping',
    name: 'Grouping',
    description: 'Split digits into visual groups for easier reading.',
    component: <GroupingExample />,
    code: `<PinInput length={6} grouping={[3, 3]} />
<PinInput length={6} grouping={[2, 2, 2]} />
<PinInput length={6} grouping={[4, 2]} />`,
  },
  {
    id: 'mask',
    name: 'Mask',
    description: 'Hide the entered code for extra privacy.',
    component: <MaskExample />,
    code: `<PinInput length={4} mask />`,
  },
  {
    id: 'types',
    name: 'Input Types',
    description: 'Accept only numbers or any alphanumeric character.',
    component: <TypesExample />,
    code: `<PinInput length={4} type="number" />
<PinInput length={4} type="alphanumeric" />`,
  },
  {
    id: 'invalid',
    name: 'Invalid',
    description: 'Show an error state when the code is wrong.',
    component: <InvalidExample />,
    code: `<PinInput length={4} invalid />`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Take full control of the value and react when the code is complete.',
    component: <ControlledExample />,
    code: `import { useState } from 'react';
import { PinInput } from 'move';

const [value, setValue] = useState('');

<PinInput
  length={6}
  grouping={[3, 3]}
  value={value}
  onChange={setValue}
  onComplete={(code) => console.log('Complete:', code)}
/>`,
  },
];

export function PinInputDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="PinInput"
        description="One-time code entry with individual digit slots."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="PinInput"
        properties={[
          { name: 'length', type: 'number', default: '4', description: 'Number of input slots.' },
          { name: 'value', type: 'string', description: 'Controlled value.' },
          { name: 'defaultValue', type: 'string', description: 'Initial value for uncontrolled mode.' },
          { name: 'onChange', type: '(value: string) => void', description: 'Called when the value changes.' },
          { name: 'onComplete', type: '(value: string) => void', description: 'Called when all slots are filled.' },
          { name: 'type', type: "'number' | 'alphanumeric' | RegExp", default: "'number'", description: 'Accepted characters.' },
          { name: 'mask', type: 'boolean', default: 'false', description: 'Hide entered characters.' },
          { name: 'placeholder', type: 'string', description: 'Placeholder character per slot.' },
          { name: 'oneTimeCode', type: 'boolean', default: 'true', description: 'Enable SMS autofill.' },
          { name: 'grouping', type: 'number[]', description: 'Visual grouping pattern, e.g. [3, 3].' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Slot size.' },
          { name: 'invalid', type: 'boolean', default: 'false', description: 'Error state.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input.' },
          { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Focus on mount.' },
          { name: 'ariaLabel', type: 'string', default: "'PIN input'", description: 'Accessible label for the hidden input.' },
          { name: 'name', type: 'string', description: 'Hidden input name for form submission.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for: root, slot.' },
        ]}
      />
    </DocPage.Root>
  );
}
