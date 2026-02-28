import { Label, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Basic">
        <Label>Email address</Label>
      </DemoSample>

      <DemoSample label="Required">
        <Label required>Full name</Label>
      </DemoSample>

      <DemoSample label="Disabled">
        <Label disabled>Disabled label</Label>
      </DemoSample>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack gap="md">
      <Label size="sm">Small label</Label>
      <Label size="md">Medium label</Label>
      <Label size="lg">Large label</Label>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'An accessible label for form controls, with optional required indicator.',
    component: <UsageExample />,
    code: `import { Label } from 'move';

<Label>Email address</Label>

{/* Required */}
<Label required>Full name</Label>

{/* Disabled */}
<Label disabled>Disabled label</Label>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Match the label size to your form fields',
    component: <SizesExample />,
    code: `<Label size="sm">Small label</Label>
<Label size="md">Medium label</Label>
<Label size="lg">Large label</Label>`,
  },
];

export function LabelDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Label"
        description="An accessible label for form controls, with optional required indicator."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Label"
        properties={[
          { name: 'htmlFor', type: 'string', description: 'The id of the form element this label is associated with.' },
          { name: 'required', type: 'boolean', description: 'Whether to show a required asterisk indicator.' },
          { name: 'disabled', type: 'boolean', description: 'Whether the label appears in a disabled state.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Font size of the label.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, asterisk.' },
        ]}
      />
    </DocPage.Root>
  );
}
