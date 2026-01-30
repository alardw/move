import { useState } from 'react';
import { Checkbox, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoLabel, DemoButton } from '../components';

function BasicExample() {
  return (
    <Stack gap="lg" align="center">
      <DemoLabel>
        <Checkbox />
        Accept terms
      </DemoLabel>
      <DemoLabel>
        <Checkbox defaultChecked />
        Newsletter
      </DemoLabel>
    </Stack>
  );
}

function GroupExample() {
  return (
    <Checkbox.Group>
      <DemoLabel>
        <Checkbox /> React
      </DemoLabel>
      <DemoLabel>
        <Checkbox defaultChecked /> TypeScript
      </DemoLabel>
      <DemoLabel>
        <Checkbox /> Tailwind
      </DemoLabel>
    </Checkbox.Group>
  );
}

function ControlledExample() {
  const [checked, setChecked] = useState(false);
  return (
    <Stack direction="column" gap="md">
      <DemoLabel>
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        Controlled: {checked ? 'checked' : 'unchecked'}
      </DemoLabel>
      <DemoButton onClick={() => setChecked(!checked)}>
        Toggle externally
      </DemoButton>
    </Stack>
  );
}

function DisabledExample() {
  return (
    <Stack gap="lg" align="center">
      <DemoLabel disabled>
        <Checkbox disabled />
        Disabled
      </DemoLabel>
      <DemoLabel disabled>
        <Checkbox disabled defaultChecked />
        Disabled checked
      </DemoLabel>
    </Stack>
  );
}

function PassThroughExample() {
  return (
    <MoveProvider pt={{ Checkbox: { indicator: { style: { color: 'lime' } } } }}>
      <Stack gap="lg" align="center">
        <DemoLabel>
          <Checkbox defaultChecked />
          Global style on indicator
        </DemoLabel>
        <DemoLabel>
          <Checkbox defaultChecked pt={{ root: { style: { borderRadius: '50%' } } }} />
          Instance style on root
        </DemoLabel>
      </Stack>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <BasicExample />,
    code: `import { Checkbox } from 'move';\n\n<Checkbox />\n<Checkbox defaultChecked />`,
  },
  {
    id: 'group',
    name: 'Group',
    description: 'Multiple choices, neatly grouped',
    component: <GroupExample />,
    code: `<Checkbox.Group>
  <Checkbox /> React
  <Checkbox defaultChecked /> TypeScript
  <Checkbox /> Tailwind
</Checkbox.Group>`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'You drive the state',
    component: <ControlledExample />,
    code: `const [checked, setChecked] = useState(false);

<label>
  <Checkbox checked={checked} onCheckedChange={setChecked} />
  Controlled: {checked ? 'checked' : 'unchecked'}
</label>
<button onClick={() => setChecked(!checked)}>
  Toggle externally
</button>`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Locked and greyed out',
    component: <DisabledExample />,
    code: `<Checkbox disabled />
<Checkbox disabled defaultChecked />`,
  },
  {
    id: 'passthrough',
    name: 'Custom Styling',
    description: 'Customize the check and the box',
    component: <PassThroughExample />,
    code: `<MoveProvider pt={{ Checkbox: { indicator: { style: { color: 'lime' } } } }}>
  <Checkbox defaultChecked />
</MoveProvider>
<Checkbox pt={{ root: { style: { borderRadius: '50%' } } }} />`,
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
    </DocPage.Root>
  );
}
