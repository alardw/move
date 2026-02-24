import { InputRange, FormField, Label, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <InputRange />
      </DemoSample>

      <DemoSample label="Min / Max / Step">
        <InputRange min={0} max={10} step={1} defaultValue={5} />
      </DemoSample>

      <DemoSample label="Range (two thumbs)">
        <InputRange defaultValue={[25, 75]} />
      </DemoSample>

      <DemoSample label="Range with step">
        <InputRange min={0} max={1000} step={50} defaultValue={[200, 800]} />
      </DemoSample>

      <DemoSample label="Show value">
        <InputRange defaultValue={50} showValue />
      </DemoSample>

      <DemoSample label="Show value (range)">
        <InputRange defaultValue={[20, 80]} showValue />
      </DemoSample>

      <DemoSample label="Format value">
        <InputRange defaultValue={50} showValue formatValue={(v: number) => `${v}%`} />
      </DemoSample>

      <DemoSample label="Sizes">
        <Stack direction="column" gap="lg">
          <InputRange size="sm" defaultValue={30} />
          <InputRange size="md" defaultValue={50} />
          <InputRange size="lg" defaultValue={70} />
        </Stack>
      </DemoSample>

      <DemoSample label="Width">
        <Stack direction="column" gap="lg">
          <InputRange width="10rem" defaultValue={40} />
          <InputRange width="20rem" defaultValue={60} />
          <InputRange defaultValue={80} />
        </Stack>
      </DemoSample>

      <DemoSample label="Invalid">
        <InputRange defaultValue={90} invalid />
      </DemoSample>

      <DemoSample label="Disabled">
        <InputRange defaultValue={40} disabled />
      </DemoSample>

      <DemoSample label="Vertical">
        <div style={{ height: '10rem' }}>
          <InputRange orientation="vertical" defaultValue={60} />
        </div>
      </DemoSample>
    </Stack>
  );
}

function FormFieldExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Volume</Label></FormField.Label>
          <FormField.Field>
            <InputRange defaultValue={75} showValue />
          </FormField.Field>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Range">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Price range</Label></FormField.Label>
          <FormField.Field>
            <InputRange min={0} max={500} step={10} defaultValue={[100, 350]} showValue formatValue={(v: number) => `$${v}`} />
          </FormField.Field>
          <FormField.Description>Select a minimum and maximum price.</FormField.Description>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Error">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label required>Quality</Label></FormField.Label>
          <FormField.Field>
            <InputRange defaultValue={10} invalid />
          </FormField.Field>
          <FormField.Description error>Quality must be at least 50%.</FormField.Description>
        </FormField.Root>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A slider input for selecting a single value or a range.',
    component: <UsageExample />,
    code: `import { InputRange } from 'move';

{/* Basic */}
<InputRange />

{/* Min / Max / Step */}
<InputRange min={0} max={10} step={1} defaultValue={5} />

{/* Range (two thumbs) */}
<InputRange defaultValue={[25, 75]} />

{/* Range with step */}
<InputRange min={0} max={1000} step={50} defaultValue={[200, 800]} />

{/* Show value */}
<InputRange defaultValue={50} showValue />

{/* Show value (range) */}
<InputRange defaultValue={[20, 80]} showValue />

{/* Format value */}
<InputRange defaultValue={50} showValue formatValue={(v) => \`\${v}%\`} />

{/* Sizes */}
<InputRange size="sm" defaultValue={30} />
<InputRange size="md" defaultValue={50} />
<InputRange size="lg" defaultValue={70} />

{/* Width */}
<InputRange width="10rem" defaultValue={40} />

{/* Invalid */}
<InputRange defaultValue={90} invalid />

{/* Disabled */}
<InputRange defaultValue={40} disabled />

{/* Vertical */}
<InputRange orientation="vertical" defaultValue={60} />`,
  },
  {
    id: 'formfield',
    name: 'In FormField',
    description: 'InputRange composed with FormField for labels, descriptions, and error messages.',
    component: <FormFieldExample />,
    code: `import { FormField, Label, InputRange } from 'move';

<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Volume</Label></FormField.Label>
  <FormField.Field>
    <InputRange defaultValue={75} showValue />
  </FormField.Field>
</FormField.Root>

{/* Range */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Price range</Label></FormField.Label>
  <FormField.Field>
    <InputRange min={0} max={500} step={10} defaultValue={[100, 350]} showValue formatValue={(v) => \`$\${v}\`} />
  </FormField.Field>
  <FormField.Description>Select a minimum and maximum price.</FormField.Description>
</FormField.Root>

{/* With error */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label required>Quality</Label></FormField.Label>
  <FormField.Field><InputRange defaultValue={10} invalid /></FormField.Field>
  <FormField.Description error>Quality must be at least 50%.</FormField.Description>
</FormField.Root>`,
  },
];

export function InputRangeDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="InputRange"
        description="A slider input for selecting a single value or a range."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="InputRange"
        properties={[
          { name: 'min', type: 'number', default: '0', description: 'Minimum allowed value.' },
          { name: 'max', type: 'number', default: '100', description: 'Maximum allowed value.' },
          { name: 'step', type: 'number', default: '1', description: 'Step increment between values.' },
          { name: 'value', type: 'number | number[]', description: 'Controlled value (single number or array for range).' },
          { name: 'defaultValue', type: 'number | number[]', description: 'Default value for uncontrolled usage.' },
          { name: 'onValueChange', type: '(value: number[]) => void', description: 'Called when the value changes.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant.' },
          { name: 'disabled', type: 'boolean', description: 'Whether the slider is disabled.' },
          { name: 'invalid', type: 'boolean', description: 'Whether the slider is in an invalid state.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout orientation of the slider.' },
          { name: 'width', type: 'CSSProperties[\'width\']', description: 'Custom width for the slider.' },
          { name: 'name', type: 'string', description: 'Name for form submission.' },
          { name: 'showValue', type: 'boolean', description: 'Whether to display the current value beside the slider.' },
          { name: 'formatValue', type: '(value: number) => string', description: 'Custom formatter for the displayed value.' },
          { name: 'animate', type: 'ElementAnimate | false', description: 'Animates InputRange thumb (hover scale, press scale).' },
        ]}
      />
    </DocPage.Root>
  );
}
