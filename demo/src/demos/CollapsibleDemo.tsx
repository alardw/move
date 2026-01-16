import { Collapsible, Button, Icon } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger asChild>
        <Button variant="secondary">
          <Icon name="chevron-down" /> @peduarte starred 3 repositories
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>radix-ui/primitives</div>
          <div>radix-ui/colors</div>
          <div>radix-ui/themes</div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function OpenExample() {
  return (
    <Collapsible.Root defaultOpen>
      <Collapsible.Trigger asChild>
        <Button variant="secondary">
          <Icon name="chevron-down" /> Show details
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <p style={{ padding: '12px 0' }}>
          This content is visible by default. Click to collapse.
        </p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Collapsed by default, click to expand.',
    component: <DefaultExample />,
    code: `<Collapsible.Root>
  <Collapsible.Trigger asChild>
    <Button variant="secondary">
      <Icon name="chevron-down" /> Show repositories
    </Button>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div>radix-ui/primitives</div>
  </Collapsible.Content>
</Collapsible.Root>`,
  },
  {
    id: 'open',
    name: 'Default Open',
    description: 'Starts expanded.',
    component: <OpenExample />,
    code: `<Collapsible.Root defaultOpen>
  <Collapsible.Trigger asChild>
    <Button variant="secondary">Show details</Button>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <p>This content is visible by default.</p>
  </Collapsible.Content>
</Collapsible.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function CollapsibleDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Collapsible"
        description="An interactive component that expands and collapses content."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
