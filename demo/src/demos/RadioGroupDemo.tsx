import { RadioGroup, FormField, Label, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <RadioGroup.Root defaultValue="option-1">
          <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
          <RadioGroup.Item value="option-2">Option 2</RadioGroup.Item>
          <RadioGroup.Item value="option-3">Option 3</RadioGroup.Item>
        </RadioGroup.Root>
      </DemoSample>

      <DemoSample label="Horizontal">
        <RadioGroup.Root defaultValue="left" orientation="horizontal">
          <RadioGroup.Item value="left">Left</RadioGroup.Item>
          <RadioGroup.Item value="center">Center</RadioGroup.Item>
          <RadioGroup.Item value="right">Right</RadioGroup.Item>
        </RadioGroup.Root>
      </DemoSample>

      <DemoSample label="Sizes">
        <Stack gap="xl">
          <RadioGroup.Root defaultValue="a" size="sm">
            <RadioGroup.Item value="a">Small</RadioGroup.Item>
            <RadioGroup.Item value="b">Option</RadioGroup.Item>
          </RadioGroup.Root>
          <RadioGroup.Root defaultValue="a">
            <RadioGroup.Item value="a">Medium</RadioGroup.Item>
            <RadioGroup.Item value="b">Option</RadioGroup.Item>
          </RadioGroup.Root>
          <RadioGroup.Root defaultValue="a" size="lg">
            <RadioGroup.Item value="a">Large</RadioGroup.Item>
            <RadioGroup.Item value="b">Option</RadioGroup.Item>
          </RadioGroup.Root>
        </Stack>
      </DemoSample>

      <DemoSample label="Error">
        <RadioGroup.Root invalid>
          <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
          <RadioGroup.Item value="option-2">Option 2</RadioGroup.Item>
          <RadioGroup.Item value="option-3">Option 3</RadioGroup.Item>
        </RadioGroup.Root>
      </DemoSample>

      <DemoSample label="Disabled item">
        <RadioGroup.Root defaultValue="option-1">
          <RadioGroup.Item value="option-1">Selected</RadioGroup.Item>
          <RadioGroup.Item value="option-2" disabled>Disabled</RadioGroup.Item>
          <RadioGroup.Item value="option-3">Available</RadioGroup.Item>
        </RadioGroup.Root>
      </DemoSample>
    </Stack>
  );
}

function FormFieldExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Size</Label></FormField.Label>
          <FormField.Field>
            <RadioGroup.Root defaultValue="medium">
              <RadioGroup.Item value="small">Small</RadioGroup.Item>
              <RadioGroup.Item value="medium">Medium</RadioGroup.Item>
              <RadioGroup.Item value="large">Large</RadioGroup.Item>
            </RadioGroup.Root>
          </FormField.Field>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Description">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Plan</Label></FormField.Label>
          <FormField.Field>
            <RadioGroup.Root defaultValue="free">
              <RadioGroup.Item value="free">Free</RadioGroup.Item>
              <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
              <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
            </RadioGroup.Root>
          </FormField.Field>
          <FormField.Description>Choose the plan that fits your needs.</FormField.Description>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Error">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label required>Size</Label></FormField.Label>
          <FormField.Field>
            <RadioGroup.Root invalid>
              <RadioGroup.Item value="small">Small</RadioGroup.Item>
              <RadioGroup.Item value="medium">Medium</RadioGroup.Item>
              <RadioGroup.Item value="large">Large</RadioGroup.Item>
            </RadioGroup.Root>
          </FormField.Field>
          <FormField.Description error>Please select a size.</FormField.Description>
        </FormField.Root>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A set of radio buttons for selecting a single value from a list.',
    component: <UsageExample />,
    code: `import { RadioGroup } from 'move';

<RadioGroup.Root defaultValue="option-1">
  <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
  <RadioGroup.Item value="option-2">Option 2</RadioGroup.Item>
  <RadioGroup.Item value="option-3">Option 3</RadioGroup.Item>
</RadioGroup.Root>

{/* Horizontal */}
<RadioGroup.Root orientation="horizontal">
  <RadioGroup.Item value="left">Left</RadioGroup.Item>
</RadioGroup.Root>

{/* Sizes */}
<RadioGroup.Root size="sm">
  <RadioGroup.Item value="a">Small</RadioGroup.Item>
</RadioGroup.Root>
<RadioGroup.Root size="lg">
  <RadioGroup.Item value="a">Large</RadioGroup.Item>
</RadioGroup.Root>

{/* Error */}
<RadioGroup.Root invalid>
  <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
</RadioGroup.Root>

{/* Disabled item */}
<RadioGroup.Item value="x" disabled>Disabled</RadioGroup.Item>`,
  },
  {
    id: 'formfield',
    name: 'In FormField',
    description: 'RadioGroup composed with FormField for labels, descriptions, and error messages.',
    component: <FormFieldExample />,
    code: `import { FormField, Label, RadioGroup } from 'move';

<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Size</Label></FormField.Label>
  <FormField.Field>
    <RadioGroup.Root defaultValue="medium">
      <RadioGroup.Item value="small">Small</RadioGroup.Item>
      <RadioGroup.Item value="medium">Medium</RadioGroup.Item>
      <RadioGroup.Item value="large">Large</RadioGroup.Item>
    </RadioGroup.Root>
  </FormField.Field>
</FormField.Root>

{/* With description */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Plan</Label></FormField.Label>
  <FormField.Field>
    <RadioGroup.Root defaultValue="free">
      <RadioGroup.Item value="free">Free</RadioGroup.Item>
      <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
    </RadioGroup.Root>
  </FormField.Field>
  <FormField.Description>Choose the plan that fits your needs.</FormField.Description>
</FormField.Root>

{/* With error */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label required>Size</Label></FormField.Label>
  <FormField.Field>
    <RadioGroup.Root invalid>
      <RadioGroup.Item value="small">Small</RadioGroup.Item>
      <RadioGroup.Item value="medium">Medium</RadioGroup.Item>
      <RadioGroup.Item value="large">Large</RadioGroup.Item>
    </RadioGroup.Root>
  </FormField.Field>
  <FormField.Description error>Please select a size.</FormField.Description>
</FormField.Root>`,
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

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="RadioGroup.Root"
        properties={[
          { name: 'value', type: 'string', description: 'Controlled selected value.' },
          { name: 'defaultValue', type: 'string', description: 'Default selected value for uncontrolled usage.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selected value changes.' },
          { name: 'disabled', type: 'boolean', description: 'Whether the entire radio group is disabled.' },
          { name: 'name', type: 'string', description: 'Name for form submission.' },
          { name: 'required', type: 'boolean', description: 'Whether a selection is required for form validation.' },
          { name: 'invalid', type: 'boolean', description: 'Whether the radio group is in an invalid state.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'vertical'", description: 'Layout orientation of the radio items.' },
          { name: 'loop', type: 'boolean', description: 'Whether keyboard navigation loops from last to first item.' },
        ]}
      />

      <DocPage.ApiSection
        title="RadioGroup.Item"
        properties={[
          { name: 'value', type: 'string', description: 'The unique value of this radio item.' },
          { name: 'disabled', type: 'boolean', description: 'Whether this individual radio item is disabled.' },
        ]}
      />
    </DocPage.Root>
  );
}
