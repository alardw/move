import { Select, Icon, Button } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <Select.Root>
      <Select.Trigger asChild>
        <Button variant="secondary" style={{ width: 200, justifyContent: 'space-between' }}>
          <Select.Value placeholder="Select a fruit..." />
          <Icon name="chevron-down" />
        </Button>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="menu-content" sideOffset={5}>
          <Select.Group>
            <Select.Label className="menu-label">Fruits</Select.Label>
            <Select.Item className="menu-item" value="apple">Apple</Select.Item>
            <Select.Item className="menu-item" value="banana">Banana</Select.Item>
            <Select.Item className="menu-item" value="blueberry">Blueberry</Select.Item>
            <Select.Item className="menu-item" value="grapes">Grapes</Select.Item>
            <Select.Item className="menu-item" value="pineapple">Pineapple</Select.Item>
          </Select.Group>
          <Select.Separator className="menu-separator" />
          <Select.Group>
            <Select.Label className="menu-label">Vegetables</Select.Label>
            <Select.Item className="menu-item" value="carrot">Carrot</Select.Item>
            <Select.Item className="menu-item" value="potato">Potato</Select.Item>
            <Select.Item className="menu-item" value="broccoli">Broccoli</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Select with grouped options.',
    component: <DefaultExample />,
    code: `<Select.Root>
  <Select.Trigger asChild>
    <Button variant="secondary">
      <Select.Value placeholder="Select a fruit..." />
      <Icon name="chevron-down" />
    </Button>
  </Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Group>
        <Select.Label>Fruits</Select.Label>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </Select.Group>
    </Select.Content>
  </Select.Portal>
</Select.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function SelectDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Select"
        description="A dropdown for selecting a single option from a list."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
