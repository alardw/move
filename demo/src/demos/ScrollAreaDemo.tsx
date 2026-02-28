import { ScrollArea, Button, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// ============================================================================
// Usage
// ============================================================================

function UsageExample() {
  return (
    <ScrollArea.Root style={{ height: 200, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)' }}>
      <ScrollArea.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-sm)' }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: 'var(--move-spacing-sm)',
                background: 'var(--move-bg-subtle)',
                borderRadius: 'var(--move-rounded-md)',
                fontSize: 'var(--move-size-sm)',
              }}
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea.Content>
    </ScrollArea.Root>
  );
}

// ============================================================================
// With Header
// ============================================================================

function WithHeaderExample() {
  return (
    <ScrollArea.Root style={{ height: 250, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)' }}>
      <ScrollArea.Header>
        <h4 style={{ margin: 0, fontSize: 'var(--move-size-base)', fontWeight: 'var(--move-weight-semibold)' }}>
          Notifications
        </h4>
      </ScrollArea.Header>
      <ScrollArea.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-sm)' }}>
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: 'var(--move-spacing-sm)',
                background: 'var(--move-bg-subtle)',
                borderRadius: 'var(--move-rounded-md)',
                fontSize: 'var(--move-size-sm)',
              }}
            >
              Notification {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea.Content>
    </ScrollArea.Root>
  );
}

// ============================================================================
// With Footer
// ============================================================================

function WithFooterExample() {
  return (
    <ScrollArea.Root style={{ height: 250, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)' }}>
      <ScrollArea.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-sm)' }}>
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: 'var(--move-spacing-sm)',
                background: 'var(--move-bg-subtle)',
                borderRadius: 'var(--move-rounded-md)',
                fontSize: 'var(--move-size-sm)',
              }}
            >
              Message {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea.Content>
      <ScrollArea.Footer>
        <Button size="sm" style={{ width: '100%' }}>Load More</Button>
      </ScrollArea.Footer>
    </ScrollArea.Root>
  );
}

// ============================================================================
// With Header and Footer
// ============================================================================

function WithHeaderAndFooterExample() {
  return (
    <ScrollArea.Root style={{ height: 300, border: '1px solid var(--move-border-base)', borderRadius: 'var(--move-rounded-lg)' }}>
      <ScrollArea.Header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ margin: 0, fontSize: 'var(--move-size-base)', fontWeight: 'var(--move-weight-semibold)' }}>
            Tasks
          </h4>
          <span style={{ fontSize: 'var(--move-size-sm)', color: 'var(--move-fg-muted)' }}>12 items</span>
        </div>
      </ScrollArea.Header>
      <ScrollArea.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--move-spacing-sm)' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: 'var(--move-spacing-sm) var(--move-spacing-md)',
                background: 'var(--move-bg-subtle)',
                borderRadius: 'var(--move-rounded-md)',
                fontSize: 'var(--move-size-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--move-spacing-sm)',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: i < 3 ? 'var(--move-success)' : 'var(--move-fg-muted)' }} />
              Task {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea.Content>
      <ScrollArea.Footer>
        <div style={{ display: 'flex', gap: 'var(--move-spacing-sm)' }}>
          <Button variant="ghost" size="sm" style={{ flex: 1 }}>Clear All</Button>
          <Button size="sm" style={{ flex: 1 }}>Add Task</Button>
        </div>
      </ScrollArea.Footer>
    </ScrollArea.Root>
  );
}

// ============================================================================
// Examples
// ============================================================================

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A container with scrollable content',
    component: <UsageExample />,
    code: `import { ScrollArea } from 'move';

<ScrollArea.Root style={{ height: 200 }}>
  <ScrollArea.Content>
    {items.map((item, i) => (
      <div key={i}>Item {i + 1}</div>
    ))}
  </ScrollArea.Content>
</ScrollArea.Root>`,
  },
  {
    id: 'with-header',
    name: 'With Header',
    description: 'A sticky header that stays visible while scrolling',
    component: <WithHeaderExample />,
    code: `<ScrollArea.Root style={{ height: 250 }}>
  <ScrollArea.Header>
    <h4>Notifications</h4>
  </ScrollArea.Header>
  <ScrollArea.Content>
    {notifications.map((item, i) => (
      <div key={i}>Notification {i + 1}</div>
    ))}
  </ScrollArea.Content>
</ScrollArea.Root>`,
  },
  {
    id: 'with-footer',
    name: 'With Footer',
    description: 'A sticky footer with actions',
    component: <WithFooterExample />,
    code: `<ScrollArea.Root style={{ height: 250 }}>
  <ScrollArea.Content>
    {messages.map((item, i) => (
      <div key={i}>Message {i + 1}</div>
    ))}
  </ScrollArea.Content>
  <ScrollArea.Footer>
    <Button size="sm" style={{ width: '100%' }}>Load More</Button>
  </ScrollArea.Footer>
</ScrollArea.Root>`,
  },
  {
    id: 'with-header-and-footer',
    name: 'With Header and Footer',
    description: 'Both sticky header and footer for complete layouts',
    component: <WithHeaderAndFooterExample />,
    code: `<ScrollArea.Root style={{ height: 300 }}>
  <ScrollArea.Header>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <h4>Tasks</h4>
      <span>12 items</span>
    </div>
  </ScrollArea.Header>
  <ScrollArea.Content>
    {tasks.map((task, i) => (
      <div key={i}>Task {i + 1}</div>
    ))}
  </ScrollArea.Content>
  <ScrollArea.Footer>
    <Button variant="ghost" size="sm">Clear All</Button>
    <Button size="sm">Add Task</Button>
  </ScrollArea.Footer>
</ScrollArea.Root>`,
  },
];

export function ScrollAreaDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="ScrollArea"
        description="Scrollable container with optional sticky header and footer."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="ScrollArea.Header"
        properties={[
          { name: 'padded', type: 'boolean', default: 'true', description: 'Whether to apply default padding.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the header element.' },
        ]}
      />

      <DocPage.ApiSection
        title="ScrollArea.Content"
        properties={[
          { name: 'padded', type: 'boolean', default: 'false', description: 'Whether to apply default padding.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the content element.' },
        ]}
      />

      <DocPage.ApiSection
        title="ScrollArea.Footer"
        properties={[
          { name: 'padded', type: 'boolean', default: 'true', description: 'Whether to apply default padding.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props to override the footer element.' },
        ]}
      />
    </DocPage.Root>
  );
}
