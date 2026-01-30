import { useState } from 'react';
import { RadioGroup, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function BasicExample() {
  return (
    <RadioGroup.Root defaultValue="option-1">
      <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
      <RadioGroup.Item value="option-2">Option 2</RadioGroup.Item>
      <RadioGroup.Item value="option-3">Option 3</RadioGroup.Item>
    </RadioGroup.Root>
  );
}

function ControlledExample() {
  const [value, setValue] = useState('comfortable');

  return (
    <Stack direction="column" gap="md">
      <span style={{ fontFamily: 'var(--move-font-body)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
        Selected: {value}
      </span>
      <RadioGroup.Root value={value} onValueChange={setValue}>
        <RadioGroup.Item value="default">Default</RadioGroup.Item>
        <RadioGroup.Item value="comfortable">Comfortable</RadioGroup.Item>
        <RadioGroup.Item value="compact">Compact</RadioGroup.Item>
      </RadioGroup.Root>
    </Stack>
  );
}

function HorizontalExample() {
  return (
    <RadioGroup.Root defaultValue="left" orientation="horizontal" style={{ flexDirection: 'row' }}>
      <RadioGroup.Item value="left">Left</RadioGroup.Item>
      <RadioGroup.Item value="center">Center</RadioGroup.Item>
      <RadioGroup.Item value="right">Right</RadioGroup.Item>
    </RadioGroup.Root>
  );
}

function DisabledExample() {
  return (
    <RadioGroup.Root defaultValue="option-1">
      <RadioGroup.Item value="option-1">Selected</RadioGroup.Item>
      <RadioGroup.Item value="option-2" disabled>Disabled</RadioGroup.Item>
      <RadioGroup.Item value="option-3">Available</RadioGroup.Item>
    </RadioGroup.Root>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      RadioGroupItem: { item: { style: { '--move-radio-bg-checked': 'var(--move-success)' } as React.CSSProperties } },
    }}>
      <RadioGroup.Root defaultValue="yes">
        <RadioGroup.Item value="yes">Yes</RadioGroup.Item>
        <RadioGroup.Item value="no">No</RadioGroup.Item>
        <RadioGroup.Item value="maybe">Maybe</RadioGroup.Item>
      </RadioGroup.Root>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A basic radio group with three options',
    component: <BasicExample />,
    code: `import { RadioGroup } from 'move';

<RadioGroup.Root defaultValue="option-1">
  <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
  <RadioGroup.Item value="option-2">Option 2</RadioGroup.Item>
  <RadioGroup.Item value="option-3">Option 3</RadioGroup.Item>
</RadioGroup.Root>`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Controlled value with state management',
    component: <ControlledExample />,
    code: `const [value, setValue] = useState('comfortable');

<RadioGroup.Root value={value} onValueChange={setValue}>
  <RadioGroup.Item value="default">Default</RadioGroup.Item>
  <RadioGroup.Item value="comfortable">Comfortable</RadioGroup.Item>
  <RadioGroup.Item value="compact">Compact</RadioGroup.Item>
</RadioGroup.Root>`,
  },
  {
    id: 'horizontal',
    name: 'Horizontal',
    description: 'Horizontal layout with flex-direction override',
    component: <HorizontalExample />,
    code: `<RadioGroup.Root defaultValue="left" orientation="horizontal" style={{ flexDirection: 'row' }}>
  <RadioGroup.Item value="left">Left</RadioGroup.Item>
  <RadioGroup.Item value="center">Center</RadioGroup.Item>
  <RadioGroup.Item value="right">Right</RadioGroup.Item>
</RadioGroup.Root>`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Individual items can be disabled',
    component: <DisabledExample />,
    code: `<RadioGroup.Root defaultValue="option-1">
  <RadioGroup.Item value="option-1">Selected</RadioGroup.Item>
  <RadioGroup.Item value="option-2" disabled>Disabled</RadioGroup.Item>
  <RadioGroup.Item value="option-3">Available</RadioGroup.Item>
</RadioGroup.Root>`,
  },
  {
    id: 'custom',
    name: 'Custom Styling',
    description: 'Override the checked color via pass-through',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  RadioGroupItem: {
    item: { style: { '--move-radio-bg-checked': 'var(--move-success)' } }
  },
}}>
  <RadioGroup.Root defaultValue="yes">
    <RadioGroup.Item value="yes">Yes</RadioGroup.Item>
    <RadioGroup.Item value="no">No</RadioGroup.Item>
  </RadioGroup.Root>
</MoveProvider>`,
  },
];

export function RadioGroupDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="RadioGroup"
        description="A set of radio buttons for selecting a single value from a list, with spring-animated indicators."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
