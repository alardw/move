import { useState } from 'react';
import { FormField, Label, Switch, Checkbox, InputText, MoveProvider } from 'move';
import { Mail, User, Phone, Lock, AtSign, Euro } from 'lucide-react';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return (
    <FormField.Root labelWidth="8rem">
      <FormField.Label>
        <Label htmlFor="email" required>Email address</Label>
      </FormField.Label>
      <FormField.Field>
        <InputText id="email" type="email" placeholder="you@example.com" iconLeft={<Mail size={16} />} />
      </FormField.Field>
      <FormField.Description>
        We'll never share your email with anyone.
      </FormField.Description>
    </FormField.Root>
  );
}

function MultipleFieldsExample() {
  return (
    <Stack direction="column" gap="lg">
      <FormField.Root labelWidth="8rem">
        <FormField.Label>
          <Label htmlFor="first-name" required>First name</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="first-name" placeholder="Jane" />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root labelWidth="8rem">
        <FormField.Label>
          <Label htmlFor="last-name" required>Last name</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="last-name" placeholder="Doe" />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root labelWidth="8rem">
        <FormField.Label>
          <Label htmlFor="phone">Phone</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="phone" type="tel" placeholder="+1 (555) 000-0000" />
        </FormField.Field>
        <FormField.Description>
          Optional, for account recovery only.
        </FormField.Description>
      </FormField.Root>
    </Stack>
  );
}

function ErrorExample() {
  return (
    <Stack direction="column" gap="lg">
      <FormField.Root labelWidth="8rem">
        <FormField.Label>
          <Label htmlFor="err-email" required>Email</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="err-email" type="email" defaultValue="not-an-email" invalid iconLeft={<Mail size={16} />} />
        </FormField.Field>
        <FormField.Description error>
          Please enter a valid email address.
        </FormField.Description>
      </FormField.Root>
      <FormField.Root labelWidth="8rem">
        <FormField.Label>
          <Label htmlFor="err-pass" required>Password</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="err-pass" type="password" defaultValue="abc" invalid iconLeft={<Lock size={16} />} />
        </FormField.Field>
        <FormField.Description error>
          Password must be at least 8 characters.
        </FormField.Description>
      </FormField.Root>
    </Stack>
  );
}

function WithToggleExample() {
  const [notifications, setNotifications] = useState(true);

  return (
    <Stack direction="column" gap="lg">
      <FormField.Root labelWidth="8rem">
        <FormField.Label>
          <Label>Notifications</Label>
        </FormField.Label>
        <FormField.Field>
          <Switch.Root checked={notifications} onCheckedChange={setNotifications}>
            <Switch.Thumb />
          </Switch.Root>
        </FormField.Field>
        <FormField.Description>
          Receive email notifications for updates.
        </FormField.Description>
      </FormField.Root>
      <FormField.Root labelWidth="8rem">
        <FormField.Label>
          <Label required>Terms</Label>
        </FormField.Label>
        <FormField.Field>
          <Checkbox>I agree to the terms</Checkbox>
        </FormField.Field>
      </FormField.Root>
    </Stack>
  );
}

function FieldWidthExample() {
  return (
    <Stack direction="column" gap="lg">
      <FormField.Root labelWidth="8rem">
        <FormField.Label>
          <Label htmlFor="zip">Zip code</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="zip" placeholder="10001" width="8rem" />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root labelWidth="8rem">
        <FormField.Label>
          <Label htmlFor="currency">Amount</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="currency" placeholder="0.00" width="12rem" iconLeft={<Euro size={16} />} />
        </FormField.Field>
      </FormField.Root>
      <FormField.Root labelWidth="8rem">
        <FormField.Label>
          <Label htmlFor="full">Full width</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="full" placeholder="Takes all available space" />
        </FormField.Field>
      </FormField.Root>
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <Stack direction="column" gap="lg">
      <FormField.Root labelWidth="12rem">
        <FormField.Label>
          <Label htmlFor="custom-email" required>Email address</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="custom-email" type="email" placeholder="you@example.com" iconLeft={<Mail size={16} />} />
        </FormField.Field>
        <FormField.Description>
          Your primary contact email.
        </FormField.Description>
      </FormField.Root>
      <FormField.Root labelWidth="12rem">
        <FormField.Label>
          <Label htmlFor="custom-name">Display name</Label>
        </FormField.Label>
        <FormField.Field>
          <InputText id="custom-name" placeholder="jane_doe" iconLeft={<AtSign size={16} />} />
        </FormField.Field>
      </FormField.Root>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A label beside its field with a helpful hint',
    component: <UsageExample />,
    code: `import { FormField, Label, InputText } from 'move';
import { Mail } from 'lucide-react';

<FormField.Root labelWidth="8rem">
  <FormField.Label>
    <Label htmlFor="email" required>Email address</Label>
  </FormField.Label>
  <FormField.Field>
    <InputText id="email" type="email" placeholder="you@example.com" iconLeft={<Mail size={16} />} />
  </FormField.Field>
  <FormField.Description>
    We'll never share your email with anyone.
  </FormField.Description>
</FormField.Root>`,
  },
  {
    id: 'form',
    name: 'Form Layout',
    description: 'Multiple fields in a clean form',
    component: <MultipleFieldsExample />,
    code: `<Stack direction="column" gap="lg">
  <FormField.Root labelWidth="8rem">
    <FormField.Label>
      <Label htmlFor="first-name" required>First name</Label>
    </FormField.Label>
    <FormField.Field>
      <InputText id="first-name" placeholder="Jane" />
    </FormField.Field>
  </FormField.Root>
  <FormField.Root labelWidth="8rem">
    <FormField.Label>
      <Label htmlFor="phone">Phone</Label>
    </FormField.Label>
    <FormField.Field>
      <InputText id="phone" type="tel" placeholder="+1 (555) 000-0000" />
    </FormField.Field>
    <FormField.Description>
      Optional, for account recovery only.
    </FormField.Description>
  </FormField.Root>
</Stack>`,
  },
  {
    id: 'errors',
    name: 'Error Messages',
    description: 'Validation feedback in red',
    component: <ErrorExample />,
    code: `<FormField.Root labelWidth="8rem">
  <FormField.Label>
    <Label htmlFor="email" required>Email</Label>
  </FormField.Label>
  <FormField.Field>
    <InputText id="email" type="email" defaultValue="not-an-email" invalid iconLeft={<Mail size={16} />} />
  </FormField.Field>
  <FormField.Description error>
    Please enter a valid email address.
  </FormField.Description>
</FormField.Root>`,
  },
  {
    id: 'controls',
    name: 'With Controls',
    description: 'Works with any form control',
    component: <WithToggleExample />,
    code: `<FormField.Root labelWidth="8rem">
  <FormField.Label>
    <Label>Notifications</Label>
  </FormField.Label>
  <FormField.Field>
    <Switch.Root checked={notifications} onCheckedChange={setNotifications}>
      <Switch.Thumb />
    </Switch.Root>
  </FormField.Field>
  <FormField.Description>
    Receive email notifications for updates.
  </FormField.Description>
</FormField.Root>
<FormField.Root labelWidth="8rem">
  <FormField.Label>
    <Label required>Terms</Label>
  </FormField.Label>
  <FormField.Field>
    <Checkbox>I agree to the terms</Checkbox>
  </FormField.Field>
</FormField.Root>`,
  },
  {
    id: 'field-width',
    name: 'Field Width',
    description: 'Size inputs to match their content.',
    component: <FieldWidthExample />,
    code: `<FormField.Root labelWidth="8rem">
  <FormField.Label>
    <Label htmlFor="zip">Zip code</Label>
  </FormField.Label>
  <FormField.Field>
    <InputText id="zip" placeholder="10001" width="8rem" />
  </FormField.Field>
</FormField.Root>
<FormField.Root labelWidth="8rem">
  <FormField.Label>
    <Label htmlFor="currency">Amount</Label>
  </FormField.Label>
  <FormField.Field>
    <InputText id="currency" placeholder="0.00" width="12rem" iconLeft={<Euro size={16} />} />
  </FormField.Field>
</FormField.Root>`,
  },
  {
    id: 'custom',
    name: 'Custom Styling',
    description: 'Adjust the label column width',
    component: <CustomStylingExample />,
    code: `<FormField.Root labelWidth="12rem">
  <FormField.Label>
    <Label htmlFor="email" required>Email address</Label>
  </FormField.Label>
  <FormField.Field>
    <InputText id="email" type="email" placeholder="you@example.com" iconLeft={<Mail size={16} />} />
  </FormField.Field>
  <FormField.Description>
    Your primary contact email.
  </FormField.Description>
</FormField.Root>`,
  },
];

export function FormFieldDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="FormField"
        description="A responsive form row that places the label beside or above the field based on available space."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
