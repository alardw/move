import { useState } from 'react';
import { NumberInput, Button, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <NumberInput placeholder="Enter a number" style={{ maxWidth: '240px' }} />
      </DemoSample>

      <DemoSample label="With min/max">
        <NumberInput min={0} max={100} defaultValue={50} style={{ maxWidth: '240px' }} />
      </DemoSample>

      <DemoSample label="No controls">
        <NumberInput hideControls placeholder="Type a number" style={{ maxWidth: '240px' }} />
      </DemoSample>
    </Stack>
  );
}

function StepExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="step=5">
        <NumberInput step={5} defaultValue={0} min={0} max={100} style={{ maxWidth: '240px' }} />
      </DemoSample>

      <DemoSample label="step=0.1, shiftStep=1">
        <NumberInput step={0.1} shiftStep={1} defaultValue={0} decimalScale={1} style={{ maxWidth: '240px' }} />
      </DemoSample>
    </Stack>
  );
}

function FormattingExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Prefix ($)">
        <NumberInput prefix="$" min={0} decimalScale={2} defaultValue={9.99} style={{ maxWidth: '240px' }} />
      </DemoSample>

      <DemoSample label="Suffix (kg)">
        <NumberInput suffix=" kg" min={0} step={0.5} decimalScale={1} defaultValue={2.5} style={{ maxWidth: '240px' }} />
      </DemoSample>

      <DemoSample label="Integers only">
        <NumberInput allowDecimal={false} min={0} max={999} placeholder="Whole numbers" style={{ maxWidth: '240px' }} />
      </DemoSample>

      <DemoSample label="Positive only">
        <NumberInput allowNegative={false} placeholder="0+" style={{ maxWidth: '240px' }} />
      </DemoSample>
    </Stack>
  );
}

function VariantsExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Sizes">
        <Stack gap="md">
          <NumberInput size="sm" defaultValue={10} style={{ maxWidth: '200px' }} />
          <NumberInput size="md" defaultValue={20} style={{ maxWidth: '200px' }} />
          <NumberInput size="lg" defaultValue={30} style={{ maxWidth: '200px' }} />
        </Stack>
      </DemoSample>

      <DemoSample label="Variants">
        <Stack gap="md">
          <NumberInput variant="outlined" defaultValue={42} style={{ maxWidth: '200px' }} />
          <NumberInput variant="filled" defaultValue={42} style={{ maxWidth: '200px' }} />
        </Stack>
      </DemoSample>

      <DemoSample label="States">
        <Stack gap="md">
          <NumberInput invalid defaultValue={-1} style={{ maxWidth: '200px' }} />
          <NumberInput disabled defaultValue={99} style={{ maxWidth: '200px' }} />
          <NumberInput readOnly defaultValue={42} style={{ maxWidth: '200px' }} />
        </Stack>
      </DemoSample>
    </Stack>
  );
}

function ControlledExample() {
  const [value, setValue] = useState<number | undefined>(25);

  return (
    <Stack direction="column" gap="md">
      <DemoSample label="Controlled">
        <Stack gap="md" align="center">
          <NumberInput
            value={value ?? ''}
            onValueChange={(v: number | undefined) => setValue(v)}
            min={0}
            max={100}
            style={{ maxWidth: '200px' }}
          />
          <span style={{ fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
            Value: {value === undefined ? 'empty' : value}
          </span>
          <Button size="sm" variant="secondary" onClick={() => setValue(50)}>Reset to 50</Button>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Numeric input with increment/decrement controls.',
    component: <UsageExample />,
    code: `import { NumberInput } from 'move';

<NumberInput placeholder="Enter a number" />

{/* With min/max */}
<NumberInput min={0} max={100} defaultValue={50} />

{/* No controls */}
<NumberInput hideControls placeholder="Type a number" />`,
  },
  {
    id: 'step',
    name: 'Step & Shift',
    description: 'Customize the increment step. Hold Shift for larger jumps.',
    component: <StepExample />,
    code: `{/* Step by 5 */}
<NumberInput step={5} defaultValue={0} min={0} max={100} />

{/* Decimal step, Shift increments by 1 */}
<NumberInput step={0.1} shiftStep={1} defaultValue={0} decimalScale={1} />`,
  },
  {
    id: 'formatting',
    name: 'Formatting',
    description: 'Add prefixes, suffixes, and control decimal/negative behavior.',
    component: <FormattingExample />,
    code: `{/* Currency prefix */}
<NumberInput prefix="$" min={0} decimalScale={2} defaultValue={9.99} />

{/* Unit suffix */}
<NumberInput suffix=" kg" min={0} step={0.5} decimalScale={1} defaultValue={2.5} />

{/* Integers only */}
<NumberInput allowDecimal={false} min={0} max={999} />

{/* Positive only */}
<NumberInput allowNegative={false} />`,
  },
  {
    id: 'variants',
    name: 'Variants & Sizes',
    description: 'Visual variants, sizes, and input states.',
    component: <VariantsExample />,
    code: `{/* Sizes */}
<NumberInput size="sm" defaultValue={10} />
<NumberInput size="md" defaultValue={20} />
<NumberInput size="lg" defaultValue={30} />

{/* Variants */}
<NumberInput variant="outlined" defaultValue={42} />
<NumberInput variant="filled" defaultValue={42} />

{/* States */}
<NumberInput invalid defaultValue={-1} />
<NumberInput disabled defaultValue={99} />
<NumberInput readOnly defaultValue={42} />`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Manage the value externally with state.',
    component: <ControlledExample />,
    code: `import { useState } from 'react';
import { NumberInput, Button } from 'move';

const [value, setValue] = useState<number | undefined>(25);

<NumberInput
  value={value ?? ''}
  onValueChange={(v) => setValue(v)}
  min={0}
  max={100}
/>
<span>Value: {value === undefined ? 'empty' : value}</span>
<Button onClick={() => setValue(50)}>Reset to 50</Button>`,
  },
];

export function NumberInputDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="NumberInput"
        description="Numeric input with increment/decrement controls, clamping, step, and formatting."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="NumberInput"
        properties={[
          { name: 'variant', type: "'outlined' | 'filled'", default: "'outlined'", description: 'Visual style variant.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size.' },
          { name: 'value', type: 'number | string', description: 'Controlled value.' },
          { name: 'defaultValue', type: 'number | string', description: 'Initial value for uncontrolled mode.' },
          { name: 'onValueChange', type: '(value: number | undefined, displayValue: string) => void', description: 'Called when the value changes.' },
          { name: 'min', type: 'number', description: 'Minimum allowed value.' },
          { name: 'max', type: 'number', description: 'Maximum allowed value.' },
          { name: 'step', type: 'number', default: '1', description: 'Increment/decrement step size.' },
          { name: 'shiftStep', type: 'number', description: 'Step size when Shift is held. Defaults to step × 10.' },
          { name: 'clampBehavior', type: "'blur' | 'strict' | 'none'", default: "'blur'", description: "When to clamp the value: on blur, on every change, or never." },
          { name: 'allowDecimal', type: 'boolean', default: 'true', description: 'Allow decimal numbers.' },
          { name: 'decimalScale', type: 'number', description: 'Maximum number of decimal places.' },
          { name: 'allowNegative', type: 'boolean', default: 'true', description: 'Allow negative numbers.' },
          { name: 'hideControls', type: 'boolean', default: 'false', description: 'Hide the increment/decrement buttons.' },
          { name: 'invalid', type: 'boolean', description: 'Show error styling.' },
          { name: 'width', type: 'CSSProperties["width"]', description: 'Override the input width.' },
          { name: 'iconLeft', type: 'ReactNode', description: 'Icon displayed on the left side.' },
          { name: 'prefix', type: 'string', description: 'Text prefix shown before the value (e.g. "$").' },
          { name: 'suffix', type: 'string', description: 'Text suffix shown after the value (e.g. " kg").' },
          { name: 'incrementLabel', type: 'string', description: 'Accessible label for the increment button.' },
          { name: 'decrementLabel', type: 'string', description: 'Accessible label for the decrement button.' },
          { name: 'formatValue', type: '(v: number) => string', description: 'Custom formatter for display.' },
          { name: 'parseValue', type: '(s: string) => number | undefined', description: 'Custom parser for input.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, input, iconLeft, controls, increment, decrement.' },
        ]}
      />

      <DocPage.ApiSection
        title="useNumberInput"
        properties={[
          { name: 'value', type: 'number | string', description: 'Controlled value.' },
          { name: 'defaultValue', type: 'number | string', description: 'Initial value.' },
          { name: 'onValueChange', type: '(value: number | undefined, displayValue: string) => void', description: 'Change callback.' },
          { name: 'min / max', type: 'number', description: 'Value boundaries.' },
          { name: 'step', type: 'number', default: '1', description: 'Step size.' },
          { name: 'shiftStep', type: 'number', description: 'Step size with Shift held.' },
          { name: 'clampBehavior', type: "'blur' | 'strict' | 'none'", default: "'blur'", description: 'When to enforce min/max.' },
        ]}
      />
    </DocPage.Root>
  );
}
