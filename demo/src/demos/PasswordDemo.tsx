import { Password, FormField, Label, Heading } from 'move';
import { Lock } from 'lucide-react';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <Password placeholder="Enter password" />
      </DemoSample>

      <DemoSample label="With icon">
        <Stack direction="column">
          <Password iconLeft={<Lock size={16} />} placeholder="Password" />
          <Password iconLeft={<Lock size={16} />} placeholder="Confirm password" />
        </Stack>
      </DemoSample>

      <DemoSample label="Variants">
        <Stack direction="column">
          <Password variant="outlined" placeholder="Outlined (default)" />
          <Password variant="filled" placeholder="Filled" />
        </Stack>
      </DemoSample>

      <DemoSample label="Width">
        <Stack direction="column">
          <Password placeholder="Short PIN" width="10rem" />
          <Password placeholder="Medium" width="20rem" iconLeft={<Lock size={16} />} />
          <Password placeholder="Full width (default)" />
        </Stack>
      </DemoSample>

      <DemoSample label="Invalid">
        <Password placeholder="Invalid password" defaultValue="abc" invalid />
      </DemoSample>

      <DemoSample label="Disabled">
        <Password placeholder="Disabled" disabled />
      </DemoSample>
    </Stack>
  );
}

function FormFieldExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label htmlFor="ff-pw">Password</Label></FormField.Label>
          <FormField.Field><Password id="ff-pw" placeholder="Enter password" iconLeft={<Lock size={16} />} /></FormField.Field>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Description">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label htmlFor="ff-pw-desc" required>Password</Label></FormField.Label>
          <FormField.Field><Password id="ff-pw-desc" placeholder="Enter password" iconLeft={<Lock size={16} />} /></FormField.Field>
          <FormField.Description>Must be at least 8 characters.</FormField.Description>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Error">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label htmlFor="ff-pw-err" required>Password</Label></FormField.Label>
          <FormField.Field><Password id="ff-pw-err" defaultValue="abc" invalid iconLeft={<Lock size={16} />} /></FormField.Field>
          <FormField.Description error>Password must be at least 8 characters.</FormField.Description>
        </FormField.Root>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A password field with a built-in show/hide toggle.',
    component: <UsageExample />,
    code: `import { Password } from 'move';
import { Lock } from 'lucide-react';

<Password placeholder="Enter password" />

{/* With icon */}
<Password iconLeft={<Lock size={16} />} placeholder="Password" />

{/* Variants */}
<Password variant="outlined" placeholder="Outlined" />
<Password variant="filled" placeholder="Filled" />

{/* Width */}
<Password placeholder="PIN" width="10rem" />

{/* Invalid */}
<Password invalid defaultValue="abc" />

{/* Disabled */}
<Password disabled />`,
  },
  {
    id: 'formfield',
    name: 'In FormField',
    description: 'Password composed with FormField for labels, descriptions, and error messages.',
    component: <FormFieldExample />,
    code: `import { FormField, Label, Password } from 'move';
import { Lock } from 'lucide-react';

<FormField.Root labelWidth="8rem">
  <FormField.Label><Label htmlFor="pw">Password</Label></FormField.Label>
  <FormField.Field><Password id="pw" placeholder="Enter password" iconLeft={<Lock size={16} />} /></FormField.Field>
</FormField.Root>

{/* With description */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label htmlFor="pw-desc" required>Password</Label></FormField.Label>
  <FormField.Field><Password id="pw-desc" placeholder="Enter password" iconLeft={<Lock size={16} />} /></FormField.Field>
  <FormField.Description>Must be at least 8 characters.</FormField.Description>
</FormField.Root>

{/* With error */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label htmlFor="pw-err" required>Password</Label></FormField.Label>
  <FormField.Field><Password id="pw-err" defaultValue="abc" invalid iconLeft={<Lock size={16} />} /></FormField.Field>
  <FormField.Description error>Password must be at least 8 characters.</FormField.Description>
</FormField.Root>`,
  },
];

export function PasswordDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Password"
        description="A password field with a visibility toggle, variants, sizes, and validation support."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Password"
        properties={[
          { name: 'variant', type: "'outlined' | 'filled'", default: "'outlined'", description: 'Visual style variant.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant.' },
          { name: 'invalid', type: 'boolean', description: 'Whether the input is in an invalid state.' },
          { name: 'iconLeft', type: 'ReactNode', description: 'Icon displayed on the left side of the input.' },
          { name: 'showIcon', type: 'ReactNode', description: 'Custom icon for the show-password toggle button.' },
          { name: 'hideIcon', type: 'ReactNode', description: 'Custom icon for the hide-password toggle button.' },
          { name: 'width', type: 'CSSProperties[\'width\']', description: 'Custom width for the input container.' },
          { name: 'visible', type: 'boolean', description: 'Controlled visibility state of the password.' },
          { name: 'defaultVisible', type: 'boolean', default: 'false', description: 'Default visibility state for uncontrolled usage.' },
          { name: 'onVisibleChange', type: '(visible: boolean) => void', description: 'Called when the visibility state changes.' },
          { name: 'disabled', type: 'boolean', description: 'Whether the input is disabled.' },
          { name: 'readOnly', type: 'boolean', description: 'Whether the input is read-only.' },
          { name: 'placeholder', type: 'string', description: 'Placeholder text displayed when the input is empty.' },
          { name: 'value', type: 'string', description: 'Controlled input value.' },
          { name: 'defaultValue', type: 'string', description: 'Default value for uncontrolled usage.' },
          { name: 'name', type: 'string', description: 'Name for form submission.' },
          { name: 'required', type: 'boolean', description: 'Whether the input is required for form validation.' },
          { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', description: 'Called when the input value changes.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, input, iconLeft, toggle, toggleIcon.' },
        ]}
      />
    </DocPage.Root>
  );
}
