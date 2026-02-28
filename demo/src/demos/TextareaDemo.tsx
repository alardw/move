import { Textarea, FormField, Label, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <Textarea placeholder="Write something..." />
      </DemoSample>

      <DemoSample label="Variants">
        <Stack direction="column">
          <Textarea variant="outlined" placeholder="Outlined (default)" />
          <Textarea variant="filled" placeholder="Filled" />
        </Stack>
      </DemoSample>

      <DemoSample label="Auto size">
        <Stack direction="column">
          <Textarea autoSize placeholder="Start typing — I'll grow with you..." />
          <Textarea autoSize minRows={2} maxRows={8} placeholder="Between 2 and 8 rows" />
        </Stack>
      </DemoSample>

      <DemoSample label="Sizes">
        <Stack direction="column">
          <Textarea size="sm" placeholder="Small" rows={2} />
          <Textarea size="md" placeholder="Medium (default)" rows={2} />
          <Textarea size="lg" placeholder="Large" rows={2} />
        </Stack>
      </DemoSample>

      <DemoSample label="Invalid">
        <Textarea invalid placeholder="Something went wrong..." />
      </DemoSample>

      <DemoSample label="Read-only">
        <Textarea readOnly value="This content is read-only." />
      </DemoSample>

      <DemoSample label="Disabled">
        <Textarea disabled placeholder="Can't touch this" />
      </DemoSample>
    </Stack>
  );
}

function FormFieldExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label htmlFor="ff-bio">Bio</Label></FormField.Label>
          <FormField.Field><Textarea id="ff-bio" placeholder="Tell us about yourself..." /></FormField.Field>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Description">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label htmlFor="ff-bio-desc">Bio</Label></FormField.Label>
          <FormField.Field><Textarea id="ff-bio-desc" placeholder="Tell us about yourself..." /></FormField.Field>
          <FormField.Description>Brief description for your profile.</FormField.Description>
        </FormField.Root>
      </DemoSample>

      <DemoSample label="Error">
        <FormField.Root labelWidth="8rem">
          <FormField.Label><Label htmlFor="ff-bio-err" required>Bio</Label></FormField.Label>
          <FormField.Field><Textarea id="ff-bio-err" invalid /></FormField.Field>
          <FormField.Description error>Bio is required.</FormField.Description>
        </FormField.Root>
      </DemoSample>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A multi-line text field that can grow with your content.',
    component: <UsageExample />,
    code: `import { Textarea } from 'move';

<Textarea placeholder="Write something..." />

{/* Variants */}
<Textarea variant="outlined" placeholder="Outlined" />
<Textarea variant="filled" placeholder="Filled" />

{/* Auto size */}
<Textarea autoSize placeholder="Grows with content" />
<Textarea autoSize minRows={2} maxRows={8} />

{/* Sizes */}
<Textarea size="sm" placeholder="Small" />
<Textarea size="lg" placeholder="Large" />

{/* Invalid */}
<Textarea invalid placeholder="Error" />

{/* Read-only */}
<Textarea readOnly value="Read-only content" />

{/* Disabled */}
<Textarea disabled placeholder="Disabled" />`,
  },
  {
    id: 'formfield',
    name: 'In FormField',
    description: 'Textarea composed with FormField for labels, descriptions, and error messages.',
    component: <FormFieldExample />,
    code: `import { FormField, Label, Textarea } from 'move';

<FormField.Root labelWidth="8rem">
  <FormField.Label><Label htmlFor="bio">Bio</Label></FormField.Label>
  <FormField.Field><Textarea id="bio" placeholder="Tell us about yourself..." /></FormField.Field>
</FormField.Root>

{/* With description */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label htmlFor="bio-desc">Bio</Label></FormField.Label>
  <FormField.Field><Textarea id="bio-desc" placeholder="Tell us about yourself..." /></FormField.Field>
  <FormField.Description>Brief description for your profile.</FormField.Description>
</FormField.Root>

{/* With error */}
<FormField.Root labelWidth="8rem">
  <FormField.Label><Label htmlFor="bio-err" required>Bio</Label></FormField.Label>
  <FormField.Field><Textarea id="bio-err" invalid /></FormField.Field>
  <FormField.Description error>Bio is required.</FormField.Description>
</FormField.Root>`,
  },
];

export function TextareaDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Textarea"
        description="A multi-line text field that can grow with your content."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Textarea"
        properties={[
          { name: 'variant', type: "'outlined' | 'filled'", default: "'outlined'", description: 'Visual style variant.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant.' },
          { name: 'invalid', type: 'boolean', description: 'Whether the textarea is in an invalid state.' },
          { name: 'autoSize', type: 'boolean', description: 'Whether the textarea automatically grows with content.' },
          { name: 'minRows', type: 'number', description: 'Minimum number of rows when autoSize is enabled.' },
          { name: 'maxRows', type: 'number', description: 'Maximum number of rows when autoSize is enabled.' },
          { name: 'rows', type: 'number', default: '3', description: 'Number of visible text rows.' },
          { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'How the textarea can be resized by the user.' },
          { name: 'width', type: 'CSSProperties[\'width\']', description: 'Custom width for the textarea container.' },
          { name: 'disabled', type: 'boolean', description: 'Whether the textarea is disabled.' },
          { name: 'readOnly', type: 'boolean', description: 'Whether the textarea is read-only.' },
          { name: 'placeholder', type: 'string', description: 'Placeholder text displayed when the textarea is empty.' },
          { name: 'value', type: 'string', description: 'Controlled textarea value.' },
          { name: 'defaultValue', type: 'string', description: 'Default value for uncontrolled usage.' },
          { name: 'name', type: 'string', description: 'Name for form submission.' },
          { name: 'required', type: 'boolean', description: 'Whether the textarea is required for form validation.' },
          { name: 'onChange', type: 'ChangeEventHandler<HTMLTextAreaElement>', description: 'Called when the textarea value changes.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, textarea.' },
        ]}
      />
    </DocPage.Root>
  );
}
