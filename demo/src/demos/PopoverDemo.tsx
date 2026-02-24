import { Popover, Button, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';

function UsageExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary">Open Popover</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong>Popover Title</strong>
            <p style={{ margin: 0, color: 'var(--move-fg-muted)' }}>
              This is a popover with some content inside it.
            </p>
          </div>
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PlacementExample() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover.Root key={side}>
          <Popover.Trigger asChild>
            <Button variant="secondary" size="sm">{side}</Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content side={side} sideOffset={8}>
              <p style={{ margin: 0 }}>Content on the {side}</p>
              <Popover.Arrow />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      ))}
    </div>
  );
}

function CloseExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary">With Close</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={8}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <strong>Notifications</strong>
              <p style={{ margin: 0, color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>
                You have 3 unread messages.
              </p>
            </div>
            <Popover.Close />
          </div>
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function FormExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Edit Settings</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={8} style={{ width: '18rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <strong>Dimensions</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: 'var(--move-size-xs)', color: 'var(--move-fg-muted)' }}>
                Width
                <input
                  type="number"
                  defaultValue={320}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--move-rounded-md)',
                    border: '1px solid var(--move-border-base)',
                    background: 'var(--move-bg-base)',
                    color: 'var(--move-fg-base)',
                    fontSize: 'var(--move-size-sm)',
                  }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: 'var(--move-size-xs)', color: 'var(--move-fg-muted)' }}>
                Height
                <input
                  type="number"
                  defaultValue={240}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--move-rounded-md)',
                    border: '1px solid var(--move-border-base)',
                    background: 'var(--move-bg-base)',
                    color: 'var(--move-fg-base)',
                    fontSize: 'var(--move-size-sm)',
                  }}
                />
              </label>
            </div>
          </div>
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Click the trigger to open a floating panel',
    component: <UsageExample />,
    code: `import { Popover, Button } from 'move';

<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="secondary">Open Popover</Button>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content sideOffset={8}>
      <strong>Popover Title</strong>
      <p>This is a popover with some content inside it.</p>
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>`,
  },
  {
    id: 'placement',
    name: 'Placement',
    description: 'Position the panel on any side of the trigger',
    component: <PlacementExample />,
    code: `<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="secondary" size="sm">bottom</Button>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content side="bottom" sideOffset={8}>
      <p>Content on the bottom</p>
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>`,
  },
  {
    id: 'close-button',
    name: 'Close Button',
    description: 'Let users dismiss the panel with a button',
    component: <CloseExample />,
    code: `<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="secondary">With Close</Button>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content sideOffset={8}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <strong>Notifications</strong>
          <p>You have 3 unread messages.</p>
        </div>
        <Popover.Close />
      </div>
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>`,
  },
  {
    id: 'form',
    name: 'Form Content',
    description: 'Interactive controls like inputs work inside the panel',
    component: <FormExample />,
    code: `<Popover.Root>
  <Popover.Trigger asChild>
    <Button>Edit Settings</Button>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content sideOffset={8} style={{ width: '18rem' }}>
      <strong>Dimensions</strong>
      <label>
        Width
        <input type="number" defaultValue={320} />
      </label>
      <label>
        Height
        <input type="number" defaultValue={240} />
      </label>
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>`,
  },
];

export function PopoverDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Popover"
        description="A floating panel anchored to a trigger element for additional content or controls."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Popover.Root"
        properties={[
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
          { name: 'animate', type: 'PopupAnimate | false', description: 'Animation configuration, or false to disable.' },
          { name: 'modal', type: 'boolean', description: 'Whether the popover should block interaction with the rest of the page.' },
        ]}
      />

      <DocPage.ApiSection
        title="Popover.Content"
        properties={[
          { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'bottom'", description: 'Preferred side relative to the trigger.' },
          { name: 'sideOffset', type: 'number', default: '0', description: 'Distance in pixels from the trigger.' },
          { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Alignment along the trigger edge.' },
          { name: 'alignOffset', type: 'number', default: '0', description: 'Offset along the alignment axis.' },
          { name: 'pt', type: 'PassThrough', description: 'Style overrides for the content slot.' },
        ]}
      />

      <DocPage.ApiSection
        title="Popover.Trigger"
        properties={[
          { name: 'asChild', type: 'boolean', description: 'Merge props onto the child element instead of rendering a button.' },
        ]}
      />

      <DocPage.ApiSection
        title="Popover.Close"
        properties={[
          { name: 'asChild', type: 'boolean', description: 'Merge close behavior onto the child element.' },
          { name: 'children', type: 'ReactNode', description: 'Custom close button content. Defaults to an X icon.' },
        ]}
      />
    </DocPage.Root>
  );
}
