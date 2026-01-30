import { Label, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function BasicExample() {
  return (
    <Label>Email address</Label>
  );
}

function RequiredExample() {
  return (
    <Stack direction="column" gap="md">
      <Label required>Full name</Label>
      <Label required>Email address</Label>
      <Label>Phone number</Label>
    </Stack>
  );
}

function DisabledExample() {
  return (
    <Stack direction="column" gap="md">
      <Label disabled>Disabled label</Label>
      <Label disabled required>Disabled required label</Label>
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      Label: { root: { style: { '--move-label-font-size': 'var(--move-size-lg)' } as React.CSSProperties } },
    }}>
      <Label required>Large label</Label>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A basic label',
    component: <BasicExample />,
    code: `import { Label } from 'move';

<Label>Email address</Label>`,
  },
  {
    id: 'required',
    name: 'Required',
    description: 'Labels with a mandatory asterisk',
    component: <RequiredExample />,
    code: `<Label required>Full name</Label>
<Label required>Email address</Label>
<Label>Phone number</Label>`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Disabled labels appear muted',
    component: <DisabledExample />,
    code: `<Label disabled>Disabled label</Label>
<Label disabled required>Disabled required label</Label>`,
  },
  {
    id: 'custom',
    name: 'Custom Styling',
    description: 'Override label tokens via pass-through',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  Label: {
    root: { style: { '--move-label-font-size': 'var(--move-size-lg)' } }
  },
}}>
  <Label required>Large label</Label>
</MoveProvider>`,
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
    </DocPage.Root>
  );
}
