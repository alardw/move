import { Separator } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <div>
      <div style={{ color: '#fff', fontWeight: 500 }}>Radix Primitives</div>
      <p style={{ marginTop: 4 }}>An open-source UI component library.</p>
      <Separator className="separator-root" />
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 20 }}>
        <span style={{ color: '#ccc', fontSize: 14 }}>Blog</span>
        <Separator className="separator-root" orientation="vertical" decorative />
        <span style={{ color: '#ccc', fontSize: 14 }}>Docs</span>
        <Separator className="separator-root" orientation="vertical" decorative />
        <span style={{ color: '#ccc', fontSize: 14 }}>Source</span>
      </div>
    </div>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Horizontal and vertical separators.',
    component: <DefaultExample />,
    code: `<Separator />
<div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
  <span>Blog</span>
  <Separator orientation="vertical" decorative />
  <span>Docs</span>
  <Separator orientation="vertical" decorative />
  <span>Source</span>
</div>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function SeparatorDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Separator"
        description="A visual divider between content sections."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
