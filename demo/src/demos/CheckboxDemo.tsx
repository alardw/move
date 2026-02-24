import { Checkbox, FormField, Label, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoLabel, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <Stack gap="lg" align="center">
          <DemoLabel><Checkbox /> Unchecked</DemoLabel>
          <DemoLabel><Checkbox defaultChecked /> Checked</DemoLabel>
        </Stack>
      </DemoSample>

      <DemoSample label="Sizes">
        <Stack gap="lg" align="center">
          <DemoLabel><Checkbox size="sm" defaultChecked /> Small</DemoLabel>
          <DemoLabel><Checkbox defaultChecked /> Medium</DemoLabel>
          <DemoLabel><Checkbox size="lg" defaultChecked /> Large</DemoLabel>
        </Stack>
      </DemoSample>

      <DemoSample label="Error">
        <DemoLabel>
          <Checkbox invalid />
          I agree to the terms
        </DemoLabel>
      </DemoSample>

      <DemoSample label="Disabled">
        <Stack gap="lg" align="center">
          <DemoLabel disabled><Checkbox disabled /> Disabled</DemoLabel>
          <DemoLabel disabled><Checkbox disabled defaultChecked /> Disabled checked</DemoLabel>
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
          <FormField.Label><Label>Terms</Label></FormField.Label>
          <FormField.Field><Checkbox>I agree to the terms</Checkbox></FormField.Field>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Description">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label>Newsletter</Label></FormField.Label>
          <FormField.Field><Checkbox>Subscribe to updates</Checkbox></FormField.Field>
          <FormField.Description>We send at most one email per week.</FormField.Description>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Error">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label required>Terms</Label></FormField.Label>
          <FormField.Field><Checkbox invalid>I agree to the terms</Checkbox></FormField.Field>
          <FormField.Description error>You must accept the terms to continue.</FormField.Description>
        </FormField.Root>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A toggle with a satisfying check animation.',
    component: <UsageExample />,
    code: `import { Checkbox } from 'move';

<Checkbox />
<Checkbox defaultChecked />

{/* Sizes */}
<Checkbox size="sm" />
<Checkbox size="lg" />

{/* Error */}
<Checkbox invalid />

{/* Disabled */}
<Checkbox disabled />
<Checkbox disabled defaultChecked />`,
  },
  {
    id: 'formfield',
    name: 'In FormField',
    description: 'Checkbox composed with FormField for labels, descriptions, and error messages.',
    component: <FormFieldExample />,
    code: `import { FormField, Label, Checkbox } from 'move';

<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Terms</Label></FormField.Label>
  <FormField.Field><Checkbox>I agree to the terms</Checkbox></FormField.Field>
</FormField.Root>

{/* With description */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label>Newsletter</Label></FormField.Label>
  <FormField.Field><Checkbox>Subscribe to updates</Checkbox></FormField.Field>
  <FormField.Description>We send at most one email per week.</FormField.Description>
</FormField.Root>

{/* With error */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label required>Terms</Label></FormField.Label>
  <FormField.Field><Checkbox invalid>I agree to the terms</Checkbox></FormField.Field>
  <FormField.Description error>You must accept the terms to continue.</FormField.Description>
</FormField.Root>`,
  },
];

export function CheckboxDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Checkbox"
        description="A toggle with a satisfying check animation."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Checkbox"
        properties={[
          { name: 'checked', type: 'boolean', description: 'Controlled checked state.' },
          { name: 'defaultChecked', type: 'boolean', description: 'Default checked state for uncontrolled usage.' },
          { name: 'indeterminate', type: 'boolean', description: 'Whether the checkbox displays an indeterminate state.' },
          { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the checked state changes.' },
          { name: 'icon', type: 'string', default: "'check'", description: 'Icon name for the check indicator (requires IconProvider).' },
          { name: 'animate', type: 'IndicatorAnimate | false', description: 'Animates Checkbox indicator (scale + opacity on check/uncheck, press scale).' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the checkbox is disabled.' },
          { name: 'invalid', type: 'boolean', description: 'Whether the checkbox is in an invalid state.' },
          { name: 'name', type: 'string', description: 'Name for form submission.' },
          { name: 'value', type: 'string', description: 'Value for form submission.' },
          { name: 'required', type: 'boolean', description: 'Whether the checkbox is required for form validation.' },
        ]}
      />
    </DocPage.Root>
  );
}
