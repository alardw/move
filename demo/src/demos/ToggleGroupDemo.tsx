import { ToggleGroup, Icon } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function SingleExample() {
  return (
    <ToggleGroup.Root className="toggle-group-root" type="single" defaultValue="center">
      <ToggleGroup.Item className="toggle-group-item" value="left" aria-label="Left aligned">
        <Icon name="align-left" />
      </ToggleGroup.Item>
      <ToggleGroup.Item className="toggle-group-item" value="center" aria-label="Center aligned">
        <Icon name="align-center" />
      </ToggleGroup.Item>
      <ToggleGroup.Item className="toggle-group-item" value="right" aria-label="Right aligned">
        <Icon name="align-right" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

function MultipleExample() {
  return (
    <ToggleGroup.Root className="toggle-group-root" type="multiple" defaultValue={['bold']}>
      <ToggleGroup.Item className="toggle-group-item" value="bold" aria-label="Bold">
        <Icon name="bold" />
      </ToggleGroup.Item>
      <ToggleGroup.Item className="toggle-group-item" value="italic" aria-label="Italic">
        <Icon name="italic" />
      </ToggleGroup.Item>
      <ToggleGroup.Item className="toggle-group-item" value="underline" aria-label="Underline">
        <Icon name="underline" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'single',
    name: 'Single',
    description: 'Only one item can be selected.',
    component: <SingleExample />,
    code: `<ToggleGroup.Root type="single" defaultValue="center">
  <ToggleGroup.Item value="left">
    <Icon name="align-left" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="center">
    <Icon name="align-center" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="right">
    <Icon name="align-right" />
  </ToggleGroup.Item>
</ToggleGroup.Root>`,
  },
  {
    id: 'multiple',
    name: 'Multiple',
    description: 'Multiple items can be selected.',
    component: <MultipleExample />,
    code: `<ToggleGroup.Root type="multiple" defaultValue={['bold']}>
  <ToggleGroup.Item value="bold">
    <Icon name="bold" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic">
    <Icon name="italic" />
  </ToggleGroup.Item>
</ToggleGroup.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function ToggleGroupDemo() {
  return (
    <DocPage.Root defaultExample="single">
      <DocPage.Header
        title="ToggleGroup"
        description="A group of toggle buttons where one or more can be selected."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
