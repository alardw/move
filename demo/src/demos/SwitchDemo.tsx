import { useState } from 'react';
import { Switch, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function BasicExample() {
  return (
    <Switch.Root>
      <Switch.Thumb />
    </Switch.Root>
  );
}

function WithLabelExample() {
  const [airplane, setAirplane] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);

  return (
    <Stack direction="column" gap="md">
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--move-spacing-sm)', fontFamily: 'var(--move-font-body)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-base)', cursor: 'pointer' }}>
        <Switch.Root checked={airplane} onCheckedChange={setAirplane}>
          <Switch.Thumb />
        </Switch.Root>
        Airplane Mode
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--move-spacing-sm)', fontFamily: 'var(--move-font-body)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-base)', cursor: 'pointer' }}>
        <Switch.Root checked={wifi} onCheckedChange={setWifi}>
          <Switch.Thumb />
        </Switch.Root>
        Wi-Fi
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--move-spacing-sm)', fontFamily: 'var(--move-font-body)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-base)', cursor: 'pointer' }}>
        <Switch.Root checked={bluetooth} onCheckedChange={setBluetooth}>
          <Switch.Thumb />
        </Switch.Root>
        Bluetooth
      </label>
    </Stack>
  );
}

function DisabledExample() {
  return (
    <Stack direction="row" gap="lg">
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--move-spacing-sm)', fontFamily: 'var(--move-font-body)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
        <Switch.Root disabled>
          <Switch.Thumb />
        </Switch.Root>
        Disabled off
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--move-spacing-sm)', fontFamily: 'var(--move-font-body)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>
        <Switch.Root disabled defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
        Disabled on
      </label>
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      SwitchRoot: { root: { style: { '--move-switch-bg-checked': 'var(--move-success)' } as React.CSSProperties } },
    }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--move-spacing-sm)', fontFamily: 'var(--move-font-body)', fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-base)', cursor: 'pointer' }}>
        <Switch.Root defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
        Success color
      </label>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A basic toggle switch',
    component: <BasicExample />,
    code: `import { Switch } from 'move';

<Switch.Root>
  <Switch.Thumb />
</Switch.Root>`,
  },
  {
    id: 'with-label',
    name: 'With Labels',
    description: 'Controlled switches with labels',
    component: <WithLabelExample />,
    code: `const [airplane, setAirplane] = useState(false);
const [wifi, setWifi] = useState(true);

<label>
  <Switch.Root checked={airplane} onCheckedChange={setAirplane}>
    <Switch.Thumb />
  </Switch.Root>
  Airplane Mode
</label>
<label>
  <Switch.Root checked={wifi} onCheckedChange={setWifi}>
    <Switch.Thumb />
  </Switch.Root>
  Wi-Fi
</label>`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Disabled switches in both states',
    component: <DisabledExample />,
    code: `<Switch.Root disabled>
  <Switch.Thumb />
</Switch.Root>
<Switch.Root disabled defaultChecked>
  <Switch.Thumb />
</Switch.Root>`,
  },
  {
    id: 'custom',
    name: 'Custom Styling',
    description: 'Override the checked color via pass-through',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  SwitchRoot: {
    root: { style: { '--move-switch-bg-checked': 'var(--move-success)' } }
  },
}}>
  <Switch.Root defaultChecked>
    <Switch.Thumb />
  </Switch.Root>
</MoveProvider>`,
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
    </DocPage.Root>
  );
}
