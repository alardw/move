import { Toggle, Icon } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Toggle className="toggle-root" aria-label="Toggle italic">
        <Icon name="italic" /> Italic
      </Toggle>
      <Toggle className="toggle-root" aria-label="Toggle bold" defaultPressed>
        <Icon name="bold" /> Bold
      </Toggle>
      <Toggle className="toggle-root" aria-label="Toggle underline">
        <Icon name="underline" /> Underline
      </Toggle>
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
    description: 'Toggle buttons with icons.',
    component: <DefaultExample />,
    code: `<Toggle aria-label="Toggle bold" defaultPressed>
  <Icon name="bold" /> Bold
</Toggle>
<Toggle aria-label="Toggle italic">
  <Icon name="italic" /> Italic
</Toggle>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function ToggleDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Toggle"
        description="A two-state button that can be on or off."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
