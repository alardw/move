import { Label } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Label htmlFor="email">Email address</Label>
      <input id="email" className="demo-input" type="email" placeholder="you@example.com" style={{ width: 300 }} />
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
    description: 'Label paired with an input.',
    component: <DefaultExample />,
    code: `<Label htmlFor="email">Email address</Label>
<input id="email" type="email" placeholder="you@example.com" />`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function LabelDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Label"
        description="An accessible label for form controls."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
