import { Popover, Button, Icon } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary">Open Popover</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="popover-content" sideOffset={5}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0, fontWeight: 500, color: '#fff' }}>Dimensions</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ width: 60, fontSize: 13 }}>Width</label>
              <input className="demo-input" defaultValue="100%" style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ width: 60, fontSize: 13 }}>Height</label>
              <input className="demo-input" defaultValue="25px" style={{ flex: 1 }} />
            </div>
          </div>
          <Popover.Close className="popover-close">
            <Icon name="x" />
          </Popover.Close>
          <Popover.Arrow className="popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Popover with form inputs and close button.',
    component: <DefaultExample />,
    code: `<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="secondary">Open Popover</Button>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content sideOffset={5}>
      <p>Dimensions</p>
      <input defaultValue="100%" />
      <Popover.Close>
        <Icon name="x" />
      </Popover.Close>
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function PopoverDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Popover"
        description="A floating panel anchored to a trigger element."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
