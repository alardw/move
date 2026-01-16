import { RadioGroup, Label } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <RadioGroup.Root defaultValue="comfortable">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <RadioGroup.Item value="default" />
          <span>Default</span>
        </Label>
        <Label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <RadioGroup.Item value="comfortable" />
          <span>Comfortable</span>
        </Label>
        <Label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <RadioGroup.Item value="compact" />
          <span>Compact</span>
        </Label>
      </div>
    </RadioGroup.Root>
  );
}

function HorizontalExample() {
  return (
    <RadioGroup.Root defaultValue="option1">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <RadioGroup.Item value="option1" />
          <span>Option 1</span>
        </Label>
        <Label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <RadioGroup.Item value="option2" />
          <span>Option 2</span>
        </Label>
        <Label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <RadioGroup.Item value="option3" />
          <span>Option 3</span>
        </Label>
      </div>
    </RadioGroup.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Vertical radio group.',
    component: <DefaultExample />,
    code: `<RadioGroup.Root defaultValue="comfortable">
  <Label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <RadioGroup.Item value="default" />
    <span>Default</span>
  </Label>
  <Label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <RadioGroup.Item value="comfortable" />
    <span>Comfortable</span>
  </Label>
</RadioGroup.Root>`,
  },
  {
    id: 'horizontal',
    name: 'Horizontal',
    description: 'Horizontal radio group layout.',
    component: <HorizontalExample />,
    code: `<RadioGroup.Root defaultValue="option1">
  <div style={{ display: 'flex', gap: 16 }}>
    <Label>
      <RadioGroup.Item value="option1" />
      <span>Option 1</span>
    </Label>
  </div>
</RadioGroup.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function RadioGroupDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="RadioGroup"
        description="A set of radio buttons where only one can be selected."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
