import { Switch, Label } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Label className="switch-label">
        <Switch.Root className="switch-root" defaultChecked>
          <Switch.Thumb className="switch-thumb" />
        </Switch.Root>
        <span>Airplane Mode</span>
      </Label>
      <Label className="switch-label">
        <Switch.Root className="switch-root">
          <Switch.Thumb className="switch-thumb" />
        </Switch.Root>
        <span>Dark Mode</span>
      </Label>
    </div>
  );
}

function DisabledExample() {
  return (
    <Label className="switch-label" style={{ opacity: 0.5 }}>
      <Switch.Root className="switch-root" disabled>
        <Switch.Thumb className="switch-thumb" />
      </Switch.Root>
      <span>Disabled</span>
    </Label>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Toggle switches with labels.',
    component: <DefaultExample />,
    code: `<Label>
  <Switch.Root defaultChecked>
    <Switch.Thumb />
  </Switch.Root>
  <span>Airplane Mode</span>
</Label>`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Switch in disabled state.',
    component: <DisabledExample />,
    code: `<Label>
  <Switch.Root disabled>
    <Switch.Thumb />
  </Switch.Root>
  <span>Disabled</span>
</Label>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function SwitchDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Switch"
        description="A control for toggling between on and off states."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
