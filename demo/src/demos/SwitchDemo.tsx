import { useState } from 'react';
import { Switch, FormField, Label, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <Stack direction="row" gap="lg">
          <Switch.Root label="Off"><Switch.Thumb /></Switch.Root>
          <Switch.Root defaultChecked label="On"><Switch.Thumb /></Switch.Root>
        </Stack>
      </DemoSample>

      <DemoSample label="Error">
        <Switch.Root invalid label="Enable notifications"><Switch.Thumb /></Switch.Root>
      </DemoSample>

      <DemoSample label="Disabled">
        <Stack direction="row" gap="lg">
          <Switch.Root disabled label="Disabled off"><Switch.Thumb /></Switch.Root>
          <Switch.Root disabled defaultChecked label="Disabled on"><Switch.Thumb /></Switch.Root>
        </Stack>
      </DemoSample>
    </Stack>
  );
}

function FormFieldExample() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Notifications</Label></FormField.Label>
          <FormField.Field>
            <Switch.Root checked={notifications} onCheckedChange={setNotifications} label={notifications ? 'On' : 'Off'}><Switch.Thumb /></Switch.Root>
          </FormField.Field>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Description">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Dark mode</Label></FormField.Label>
          <FormField.Field>
            <Switch.Root checked={darkMode} onCheckedChange={setDarkMode} label={darkMode ? 'On' : 'Off'}><Switch.Thumb /></Switch.Root>
          </FormField.Field>
          <FormField.Description>Switch between light and dark themes.</FormField.Description>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Error">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label required>Notifications</Label></FormField.Label>
          <FormField.Field><Switch.Root invalid label="Off"><Switch.Thumb /></Switch.Root></FormField.Field>
          <FormField.Description error>You must enable notifications to continue.</FormField.Description>
        </FormField.Root>
      </DemoSample>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack gap="lg" align="center">
      <Switch.Root size="sm" label="Small"><Switch.Thumb /></Switch.Root>
      <Switch.Root size="md" label="Medium"><Switch.Thumb /></Switch.Root>
      <Switch.Root size="lg" label="Large"><Switch.Thumb /></Switch.Root>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A toggle switch for binary on/off choices with an animated thumb.',
    component: <UsageExample />,
    code: `import { Switch } from 'move';

<Switch.Root label="Off">
  <Switch.Thumb />
</Switch.Root>

<Switch.Root defaultChecked label="On">
  <Switch.Thumb />
</Switch.Root>

{/* Error */}
<Switch.Root invalid label="Enable notifications">
  <Switch.Thumb />
</Switch.Root>

{/* Disabled */}
<Switch.Root disabled label="Disabled off">
  <Switch.Thumb />
</Switch.Root>`,
  },
  {
    id: 'formfield',
    name: 'In FormField',
    description: 'Switch composed with FormField for labels, descriptions, and error messages.',
    component: <FormFieldExample />,
    code: `import { FormField, Label, Switch } from 'move';

<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Notifications</Label></FormField.Label>
  <FormField.Field><Switch.Root><Switch.Thumb /></Switch.Root></FormField.Field>
</FormField.Root>

{/* With description */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Dark mode</Label></FormField.Label>
  <FormField.Field><Switch.Root><Switch.Thumb /></Switch.Root></FormField.Field>
  <FormField.Description>Switch between light and dark themes.</FormField.Description>
</FormField.Root>

{/* With error */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label required>Notifications</Label></FormField.Label>
  <FormField.Field><Switch.Root invalid><Switch.Thumb /></Switch.Root></FormField.Field>
  <FormField.Description error>You must enable notifications to continue.</FormField.Description>
</FormField.Root>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Small, medium, or large switch',
    component: <SizesExample />,
    code: `<Switch.Root size="sm" label="Small"><Switch.Thumb /></Switch.Root>
<Switch.Root size="md" label="Medium"><Switch.Thumb /></Switch.Root>
<Switch.Root size="lg" label="Large"><Switch.Thumb /></Switch.Root>`,
  },
];

export function SwitchDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Switch"
        description="A toggle switch for binary on/off choices with an animated thumb."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Switch.Root"
        properties={[
          { name: 'checked', type: 'boolean', description: 'Controlled checked state.' },
          { name: 'defaultChecked', type: 'boolean', description: 'Default checked state for uncontrolled usage.' },
          { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the checked state changes.' },
          { name: 'disabled', type: 'boolean', description: 'Whether the switch is disabled.' },
          { name: 'invalid', type: 'boolean', description: 'Whether the switch is in an invalid state.' },
          { name: 'label', type: 'ReactNode', description: 'Optional label displayed beside the switch.' },
          { name: 'required', type: 'boolean', description: 'Whether the switch is required for form validation.' },
          { name: 'name', type: 'string', description: 'Name for form submission.' },
          { name: 'value', type: 'string', description: 'Value for form submission.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the switch track and thumb.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the root element.' },
        ]}
      />

      <DocPage.ApiSection
        title="Switch.Thumb"
        properties={[
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the thumb element.' },
        ]}
      />
    </DocPage.Root>
  );
}
