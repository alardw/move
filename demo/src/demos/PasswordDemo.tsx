import { useState } from 'react';
import { Password, MoveProvider } from 'move';
import { Lock } from 'lucide-react';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return <Password placeholder="Enter password" />;
}

function WithIconExample() {
  return (
    <Stack direction="column">
      <Password iconLeft={<Lock size={16} />} placeholder="Password" />
      <Password iconLeft={<Lock size={16} />} placeholder="Confirm password" />
    </Stack>
  );
}

function ControlledExample() {
  const [visible, setVisible] = useState(false);

  return (
    <Stack direction="column">
      <Password
        placeholder="Controlled visibility"
        visible={visible}
        onVisibleChange={setVisible}
        iconLeft={<Lock size={16} />}
      />
      <p style={{ color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)', margin: 0 }}>
        Password is {visible ? 'visible' : 'hidden'}
      </p>
    </Stack>
  );
}

function VariantsExample() {
  return (
    <Stack direction="column">
      <Password variant="outlined" placeholder="Outlined (default)" />
      <Password variant="filled" placeholder="Filled" />
    </Stack>
  );
}

function WidthExample() {
  return (
    <Stack direction="column">
      <Password placeholder="Short PIN" width="10rem" />
      <Password placeholder="Medium" width="20rem" iconLeft={<Lock size={16} />} />
      <Password placeholder="Full width (default)" />
    </Stack>
  );
}

function StatesExample() {
  return (
    <Stack direction="column">
      <Password placeholder="Invalid password" defaultValue="abc" invalid />
      <Password placeholder="Disabled" disabled />
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      Password: { root: { style: { borderColor: 'var(--move-primary)', background: 'transparent' } } },
    }}>
      <Stack direction="column">
        <Password placeholder="Global style applied" />
        <Password
          placeholder="Pill shape"
          pt={{ root: { style: { borderRadius: 'var(--move-rounded-full)' } } }}
        />
      </Stack>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A password field with a built-in show/hide toggle.',
    component: <UsageExample />,
    code: `import { Password } from 'move';

<Password placeholder="Enter password" />`,
  },
  {
    id: 'icon',
    name: 'With Icon',
    description: 'Add a leading icon for context.',
    component: <WithIconExample />,
    code: `import { Lock } from 'lucide-react';

<Password iconLeft={<Lock size={16} />} placeholder="Password" />
<Password iconLeft={<Lock size={16} />} placeholder="Confirm password" />`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Control visibility from the outside.',
    component: <ControlledExample />,
    code: `const [visible, setVisible] = useState(false);

<Password
  placeholder="Controlled visibility"
  visible={visible}
  onVisibleChange={setVisible}
  iconLeft={<Lock size={16} />}
/>`,
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Outlined for clarity, filled for emphasis.',
    component: <VariantsExample />,
    code: `<Password variant="outlined" placeholder="Outlined (default)" />
<Password variant="filled" placeholder="Filled" />`,
  },
  {
    id: 'width',
    name: 'Width',
    description: 'Size the field to match its content.',
    component: <WidthExample />,
    code: `<Password placeholder="Short PIN" width="10rem" />
<Password placeholder="Medium" width="20rem" iconLeft={<Lock size={16} />} />
<Password placeholder="Full width (default)" />`,
  },
  {
    id: 'states',
    name: 'States',
    description: 'Invalid highlights errors, disabled locks the field.',
    component: <StatesExample />,
    code: `<Password placeholder="Invalid password" defaultValue="abc" invalid />
<Password placeholder="Disabled" disabled />`,
  },
  {
    id: 'custom',
    name: 'Custom Styling',
    description: 'Tweak styles globally or per instance.',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  Password: { root: { style: { borderColor: 'var(--move-primary)', background: 'transparent' } } },
}}>
  <Password placeholder="Global style applied" />
  <Password
    placeholder="Pill shape"
    pt={{ root: { style: { borderRadius: 'var(--move-rounded-full)' } } }}
  />
</MoveProvider>`,
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
    </DocPage.Root>
  );
}
