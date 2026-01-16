import { ScrollArea } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

const TAGS = Array.from({ length: 50 }).map((_, i) => `Tag ${i + 1}`);

function DefaultExample() {
  return (
    <ScrollArea.Root className="scrollarea-root">
      <ScrollArea.Viewport className="scrollarea-viewport">
        <div style={{ padding: 16 }}>
          <div style={{ fontWeight: 500, color: '#fff', marginBottom: 12 }}>Tags</div>
          {TAGS.map((tag) => (
            <div
              key={tag}
              style={{
                padding: '8px 0',
                borderBottom: '1px solid #252525',
                color: '#9ca3af',
                fontSize: 14,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="scrollarea-scrollbar" orientation="vertical">
        <ScrollArea.Thumb className="scrollarea-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Scrollable area with custom scrollbar.',
    component: <DefaultExample />,
    code: `<ScrollArea.Root>
  <ScrollArea.Viewport>
    {items.map((item) => (
      <div key={item}>{item}</div>
    ))}
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function ScrollAreaDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="ScrollArea"
        description="A scrollable area with custom styled scrollbars."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
