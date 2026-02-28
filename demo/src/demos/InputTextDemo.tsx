import { InputText, FormField, Label, Heading } from 'move';
import { Search, Euro, Eye } from 'lucide-react';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <InputText placeholder="Enter your name" />
      </DemoSample>

      <DemoSample label="Variants">
        <Stack direction="column">
          <InputText variant="outlined" placeholder="Outlined (default)" />
          <InputText variant="filled" placeholder="Filled" />
        </Stack>
      </DemoSample>

      <DemoSample label="Sizes">
        <Stack direction="column">
          <InputText size="sm" placeholder="Small" />
          <InputText size="md" placeholder="Medium (default)" />
          <InputText size="lg" placeholder="Large" />
        </Stack>
      </DemoSample>

      <DemoSample label="Icons">
        <Stack direction="column">
          <InputText iconLeft={<Search size={16} />} placeholder="Search..." />
          <InputText iconLeft={<Euro size={16} />} placeholder="0.00" type="number" />
          <InputText iconRight={<Eye size={16} />} placeholder="Password" type="password" />
          <InputText iconLeft={<Euro size={16} />} iconRight={<Search size={16} />} placeholder="Both sides" />
        </Stack>
      </DemoSample>

      <DemoSample label="Width">
        <Stack direction="column">
          <InputText placeholder="10001" width="8rem" />
          <InputText placeholder="0.00" width="12rem" iconLeft={<Euro size={16} />} />
          <InputText placeholder="Full width (default)" />
        </Stack>
      </DemoSample>

      <DemoSample label="Invalid">
        <InputText placeholder="Email address" defaultValue="not-an-email" invalid />
      </DemoSample>

      <DemoSample label="Read-only">
        <InputText value="Selectable but not editable" readOnly />
      </DemoSample>

      <DemoSample label="Disabled">
        <Stack direction="column">
          <InputText placeholder="Can't touch this" disabled />
          <InputText value="Greyed out and locked" disabled />
        </Stack>
      </DemoSample>
    </Stack>
  );
}

function FormFieldExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label htmlFor="ff-name">Name</Label></FormField.Label>
          <FormField.Field><InputText id="ff-name" placeholder="Enter your name" /></FormField.Field>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Description">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label htmlFor="ff-email" required>Email</Label></FormField.Label>
          <FormField.Field><InputText id="ff-email" type="email" placeholder="you@example.com" /></FormField.Field>
          <FormField.Description>We'll never share your email with anyone.</FormField.Description>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Error">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label htmlFor="ff-email-err" required>Email</Label></FormField.Label>
          <FormField.Field><InputText id="ff-email-err" type="email" defaultValue="not-an-email" invalid /></FormField.Field>
          <FormField.Description error>Please enter a valid email address.</FormField.Description>
        </FormField.Root>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A single-line text field with variants, sizes, and validation support.',
    component: <UsageExample />,
    code: `import { InputText } from 'move';
import { Search, Euro } from 'lucide-react';

<InputText placeholder="Enter your name" />

{/* Variants */}
<InputText variant="outlined" placeholder="Outlined" />
<InputText variant="filled" placeholder="Filled" />

{/* Sizes */}
<InputText size="sm" placeholder="Small" />
<InputText size="lg" placeholder="Large" />

{/* Icons */}
<InputText iconLeft={<Search size={16} />} placeholder="Search..." />

{/* Width */}
<InputText placeholder="10001" width="8rem" />

{/* Invalid */}
<InputText invalid placeholder="Error" />

{/* Read-only */}
<InputText value="Read-only" readOnly />

{/* Disabled */}
<InputText disabled placeholder="Disabled" />`,
  },
  {
    id: 'formfield',
    name: 'In FormField',
    description: 'InputText composed with FormField for labels, descriptions, and error messages.',
    component: <FormFieldExample />,
    code: `import { FormField, Label, InputText } from 'move';

<FormField.Root labelWidth="8rem">
  <FormField.Label><Label htmlFor="name">Name</Label></FormField.Label>
  <FormField.Field><InputText id="name" placeholder="Enter your name" /></FormField.Field>
</FormField.Root>

{/* With description */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label htmlFor="email" required>Email</Label></FormField.Label>
  <FormField.Field><InputText id="email" placeholder="you@example.com" /></FormField.Field>
  <FormField.Description>We'll never share your email.</FormField.Description>
</FormField.Root>

{/* With error */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label htmlFor="email" required>Email</Label></FormField.Label>
  <FormField.Field><InputText id="email" defaultValue="not-an-email" invalid /></FormField.Field>
  <FormField.Description error>Please enter a valid email address.</FormField.Description>
</FormField.Root>`,
  },
];

export function InputTextDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="InputText"
        description="A single-line text field with variants, sizes, and validation support."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="InputText"
        properties={[
          { name: 'variant', type: "'outlined' | 'filled'", default: "'outlined'", description: 'Visual style variant.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant.' },
          { name: 'invalid', type: 'boolean', description: 'Whether the input is in an invalid state.' },
          { name: 'iconLeft', type: 'ReactNode', description: 'Icon displayed on the left side of the input.' },
          { name: 'iconRight', type: 'ReactNode', description: 'Icon displayed on the right side of the input.' },
          { name: 'width', type: 'CSSProperties[\'width\']', description: 'Custom width for the input container.' },
          { name: 'disabled', type: 'boolean', description: 'Whether the input is disabled.' },
          { name: 'readOnly', type: 'boolean', description: 'Whether the input is read-only.' },
          { name: 'placeholder', type: 'string', description: 'Placeholder text displayed when the input is empty.' },
          { name: 'value', type: 'string', description: 'Controlled input value.' },
          { name: 'defaultValue', type: 'string', description: 'Default value for uncontrolled usage.' },
          { name: 'type', type: 'string', default: "'text'", description: 'HTML input type attribute.' },
          { name: 'name', type: 'string', description: 'Name for form submission.' },
          { name: 'required', type: 'boolean', description: 'Whether the input is required for form validation.' },
          { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', description: 'Called when the input value changes.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, input, iconLeft, iconRight.' },
        ]}
      />
    </DocPage.Root>
  );
}
