import { useState } from 'react';
import { FormField, Label, Switch, Checkbox, InputText, Heading } from 'move';
import { Mail, Lock, Euro } from 'lucide-react';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, Text } from '../components';

function UsageExample() {
  const [notifications, setNotifications] = useState(true);

  return (
    <Stack direction="column" gap="xl">
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

      <div>
        <Text variant="muted" size="sm">Form layout</Text>
        <Stack direction="column" gap="lg">
          <FormField.Root labelWidth="8rem">
            <FormField.Label><Label htmlFor="fn" required>First name</Label></FormField.Label>
            <FormField.Field><InputText id="fn" placeholder="Jane" /></FormField.Field>
          </FormField.Root>
          <FormField.Root labelWidth="8rem">
            <FormField.Label><Label htmlFor="ln" required>Last name</Label></FormField.Label>
            <FormField.Field><InputText id="ln" placeholder="Doe" /></FormField.Field>
          </FormField.Root>
          <FormField.Root labelWidth="8rem">
            <FormField.Label><Label htmlFor="ph">Phone</Label></FormField.Label>
            <FormField.Field><InputText id="ph" type="tel" placeholder="+1 (555) 000-0000" /></FormField.Field>
            <FormField.Description>Optional, for account recovery only.</FormField.Description>
          </FormField.Root>
        </Stack>
      </div>

      <div>
        <Text variant="muted" size="sm">Error messages</Text>
        <Stack direction="column" gap="lg">
          <FormField.Root labelWidth="8rem">
            <FormField.Label><Label htmlFor="err-em" required>Email</Label></FormField.Label>
            <FormField.Field>
              <InputText id="err-em" type="email" defaultValue="not-an-email" invalid iconLeft={<Mail size={16} />} />
            </FormField.Field>
            <FormField.Description error>Please enter a valid email address.</FormField.Description>
          </FormField.Root>
          <FormField.Root labelWidth="8rem">
            <FormField.Label><Label htmlFor="err-pw" required>Password</Label></FormField.Label>
            <FormField.Field>
              <InputText id="err-pw" type="password" defaultValue="abc" invalid iconLeft={<Lock size={16} />} />
            </FormField.Field>
            <FormField.Description error>Password must be at least 8 characters.</FormField.Description>
          </FormField.Root>
        </Stack>
      </div>

      <div>
        <Text variant="muted" size="sm">With controls</Text>
        <Stack direction="column" gap="lg">
          <FormField.Root labelWidth="8rem">
            <FormField.Label><Label>Notifications</Label></FormField.Label>
            <FormField.Field>
              <Switch.Root checked={notifications} onCheckedChange={setNotifications} label={notifications ? 'On' : 'Off'}><Switch.Thumb /></Switch.Root>
            </FormField.Field>
            <FormField.Description>Receive email notifications for updates.</FormField.Description>
          </FormField.Root>
          <FormField.Root labelWidth="8rem">
            <FormField.Label><Label required>Terms</Label></FormField.Label>
            <FormField.Field><Checkbox>I agree to the terms</Checkbox></FormField.Field>
          </FormField.Root>
        </Stack>
      </div>

      <div>
        <Text variant="muted" size="sm">Field width</Text>
        <Stack direction="column" gap="lg">
          <FormField.Root labelWidth="8rem">
            <FormField.Label><Label htmlFor="zip">Zip code</Label></FormField.Label>
            <FormField.Field><InputText id="zip" placeholder="10001" width="8rem" /></FormField.Field>
          </FormField.Root>
          <FormField.Root labelWidth="8rem">
            <FormField.Label><Label htmlFor="amt">Amount</Label></FormField.Label>
            <FormField.Field><InputText id="amt" placeholder="0.00" width="12rem" iconLeft={<Euro size={16} />} /></FormField.Field>
          </FormField.Root>
          <FormField.Root labelWidth="8rem">
            <FormField.Label><Label htmlFor="fw">Full width</Label></FormField.Label>
            <FormField.Field><InputText id="fw" placeholder="Takes all available space" /></FormField.Field>
          </FormField.Root>
        </Stack>
      </div>
    </Stack>
  );
}

function ResponsiveExample() {
  return (
    <Stack direction="column" gap="xl">
      <Stack gap="xl">
        <div style={{ width: '20rem' }}>
          <Text variant="muted" size="sm">Narrow (20rem)</Text>
          <Stack direction="column" gap="lg">
            <FormField.Root labelWidth="8rem">
              <FormField.Label><Label htmlFor="r-name" required>Name</Label></FormField.Label>
              <FormField.Field><InputText id="r-name" placeholder="Jane Doe" /></FormField.Field>
            </FormField.Root>
            <FormField.Root labelWidth="8rem">
              <FormField.Label><Label htmlFor="r-email" required>Email</Label></FormField.Label>
              <FormField.Field><InputText id="r-email" type="email" placeholder="you@example.com" iconLeft={<Mail size={16} />} /></FormField.Field>
              <FormField.Description>We'll never share your email.</FormField.Description>
            </FormField.Root>
          </Stack>
        </div>
        <div style={{ width: '32rem' }}>
          <Text variant="muted" size="sm">Wide (32rem)</Text>
          <Stack direction="column" gap="lg">
            <FormField.Root labelWidth="8rem">
              <FormField.Label><Label htmlFor="r-name2" required>Name</Label></FormField.Label>
              <FormField.Field><InputText id="r-name2" placeholder="Jane Doe" /></FormField.Field>
            </FormField.Root>
            <FormField.Root labelWidth="8rem">
              <FormField.Label><Label htmlFor="r-email2" required>Email</Label></FormField.Label>
              <FormField.Field><InputText id="r-email2" type="email" placeholder="you@example.com" iconLeft={<Mail size={16} />} /></FormField.Field>
              <FormField.Description>We'll never share your email.</FormField.Description>
            </FormField.Root>
          </Stack>
        </div>
      </Stack>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A responsive form row that places the label beside or above the field based on available space.',
    component: <UsageExample />,
    code: `import { FormField, Label, InputText, Switch, Checkbox } from 'move';

<FormField.Root labelWidth="8rem">
  <FormField.Label>
    <Label htmlFor="email" required>Email</Label>
  </FormField.Label>
  <FormField.Field>
    <InputText id="email" placeholder="you@example.com" />
  </FormField.Field>
  <FormField.Description>Helpful hint.</FormField.Description>
</FormField.Root>

{/* Error */}
<FormField.Description error>Invalid email.</FormField.Description>

{/* With Switch */}
<FormField.Field>
  <Switch.Root><Switch.Thumb /></Switch.Root>
</FormField.Field>

{/* Field width */}
<InputText placeholder="10001" width="8rem" />`,
  },
  {
    id: 'responsive',
    name: 'Responsive',
    description: 'FormField uses a container query at 24rem. Below that width, labels stack above fields.',
    component: <ResponsiveExample />,
    code: `{/* Narrow container — labels stack above fields */}
<div style={{ width: '20rem' }}>
  <FormField.Root labelWidth="8rem">
    <FormField.Label><Label htmlFor="name" required>Name</Label></FormField.Label>
    <FormField.Field><InputText id="name" placeholder="Jane Doe" /></FormField.Field>
  </FormField.Root>
</div>

{/* Wide container — labels beside fields */}
<div style={{ width: '32rem' }}>
  <FormField.Root labelWidth="8rem">
    <FormField.Label><Label htmlFor="name" required>Name</Label></FormField.Label>
    <FormField.Field><InputText id="name" placeholder="Jane Doe" /></FormField.Field>
  </FormField.Root>
</div>`,
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

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="FormField.Root"
        properties={[
          { name: 'labelWidth', type: 'string', description: 'Width of the label column (e.g. "8rem").' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the root element.' },
        ]}
      />

      <DocPage.ApiSection
        title="FormField.Description"
        properties={[
          { name: 'error', type: 'boolean', description: 'Whether the description displays as an error message.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the description element.' },
        ]}
      />
    </DocPage.Root>
  );
}
