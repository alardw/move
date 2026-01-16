import { Checkbox, Label } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <Checkbox.Root defaultChecked />
        <span>Accept terms and conditions</span>
      </Label>
      <Label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <Checkbox.Root />
        <span>Subscribe to newsletter</span>
      </Label>
    </div>
  );
}

function DisabledExample() {
  return (
    <Label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'not-allowed', opacity: 0.5 }}>
      <Checkbox.Root disabled />
      <span>Disabled option</span>
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
    description: 'Basic checkbox with label.',
    component: <DefaultExample />,
    code: `<Label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
  <Checkbox.Root defaultChecked />
  <span>Accept terms and conditions</span>
</Label>`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Checkbox in disabled state.',
    component: <DisabledExample />,
    code: `<Label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
  <Checkbox.Root disabled />
  <span>Disabled option</span>
</Label>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function CheckboxDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Checkbox"
        description="A control that allows the user to toggle between checked and unchecked."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
